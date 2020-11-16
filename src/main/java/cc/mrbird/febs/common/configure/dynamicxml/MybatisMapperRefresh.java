package cc.mrbird.febs.common.configure.dynamicxml;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.ibatis.binding.MapperRegistry;
import org.apache.ibatis.builder.xml.XMLMapperBuilder;
import org.apache.ibatis.builder.xml.XMLMapperEntityResolver;
import org.apache.ibatis.executor.ErrorContext;
import org.apache.ibatis.executor.keygen.SelectKeyGenerator;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.parsing.XNode;
import org.apache.ibatis.parsing.XPathParser;
import org.apache.ibatis.session.Configuration;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.util.ResourceUtils;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class MybatisMapperRefresh implements Runnable {
	private static final Map<String, List<Resource>> JAR_MAPPER = new HashMap<>(); // 记录jar包存在的mapper
	private final SqlSessionFactory sqlSessionFactory;
	private final Resource[] mapperLocations;
	private final boolean enabled; // 是否开启刷新mapper
	private Long beforeTime = 0L;
	private Configuration configuration;
	private Set<String> fileSet; // xml文件目录
	private int delaySeconds = 10; // 延迟加载时间
	private int sleepSeconds = 20; // 刷新间隔时间

	public MybatisMapperRefresh(Resource[] mapperLocations, SqlSessionFactory sqlSessionFactory, int delaySeconds,
			int sleepSeconds, boolean enabled) {
		this.mapperLocations = mapperLocations.clone();
		this.sqlSessionFactory = sqlSessionFactory;
		this.delaySeconds = delaySeconds;
		this.enabled = enabled;
		this.sleepSeconds = sleepSeconds;
		this.configuration = sqlSessionFactory.getConfiguration();
		this.run();
	}

	public MybatisMapperRefresh(Resource[] mapperLocations, SqlSessionFactory sqlSessionFactory, boolean enabled) {
		this.mapperLocations = mapperLocations.clone();
		this.sqlSessionFactory = sqlSessionFactory;
		this.enabled = enabled;
		this.configuration = sqlSessionFactory.getConfiguration();
		this.run();
	}

	@Override
	public void run() {
		if (enabled) {
			beforeTime = SystemClock.now();
			final MybatisMapperRefresh runnable = this;
			new Thread(() -> {
				if (fileSet == null) {
					fileSet = new HashSet<>();
					if (mapperLocations != null) {
						for (Resource mapperLocation : mapperLocations) {
							try {
								if (ResourceUtils.isJarURL(mapperLocation.getURL())) {
									String key = new UrlResource(
											ResourceUtils.extractJarFileURL(mapperLocation.getURL())).getFile()
													.getPath();
									fileSet.add(key);
									if (JAR_MAPPER.get(key) != null) {
										JAR_MAPPER.get(key).add(mapperLocation);
									} else {
										List<Resource> resourcesList = new ArrayList<>();
										resourcesList.add(mapperLocation);
										JAR_MAPPER.put(key, resourcesList);
									}
								} else {
									fileSet.add(mapperLocation.getFile().getPath());
								}
							} catch (IOException ioException) {
								ioException.printStackTrace();
							}
						}
					}
				}
				try {
					Thread.sleep(delaySeconds * 1000);
				} catch (InterruptedException interruptedException) {
					interruptedException.printStackTrace();
				}
				do {
					try {
						for (String filePath : fileSet) {
							File file = new File(filePath);
							if (file.isFile() && file.lastModified() > beforeTime) {
								List<Resource> removeList = JAR_MAPPER.get(filePath);
								if (removeList != null && !removeList.isEmpty()) {
									for (Resource resource : removeList) {
										runnable.refreshEx(resource);
									}
								} else {
									runnable.refreshEx(new FileSystemResource(file));
								}
							}
						}
						beforeTime = SystemClock.now();
					} catch (Exception exception) {
						exception.printStackTrace();
					}
					try {
						Thread.sleep(sleepSeconds * 1000);
					} catch (InterruptedException interruptedException) {
						interruptedException.printStackTrace();
					}

				} while (true);
			}, "mybatis-plus MapperRefresh").start();
		}
	}

	// 修改版，增加了一下清理操作
	@SuppressWarnings("rawtypes")
	private void refreshEx(Resource resource) throws Exception {
		this.configuration = sqlSessionFactory.getConfiguration();
		boolean isSupper = configuration.getClass().getSuperclass() == Configuration.class;
		try {
			Class clz = isSupper ? configuration.getClass().getSuperclass() : configuration.getClass();

			Field loadedResourcesField = clz.getDeclaredField("loadedResources");
			loadedResourcesField.setAccessible(true);
			Set loadedResourcesSet = ((Set) loadedResourcesField.get(configuration));

			XPathParser xPathParser = new XPathParser(resource.getInputStream(), true, configuration.getVariables(),
					new XMLMapperEntityResolver());
			XNode context = xPathParser.evalNode("/mapper");
			String namespace = context.getStringAttribute("namespace");
			Field field = MapperRegistry.class.getDeclaredField("knownMappers");
			field.setAccessible(true);
			Map mapConfig = (Map) field.get(configuration.getMapperRegistry());
			mapConfig.remove(Resources.classForName(namespace));
			loadedResourcesSet.remove(resource.toString());
			configuration.getCacheNames().remove(namespace);
			cleanParameterMap(context.evalNodes("/mapper/parameterMap"), namespace);
			cleanResultMap(context.evalNodes("/mapper/resultMap"), namespace);
			cleanKeyGenerators(context.evalNodes("insert|delete|select|update"), namespace);
			cleanSqlElement(context.evalNodes("/mapper/sql"), namespace);

			// 增加部分
			List<XNode> list = context.evalNodes("insert|delete|select|update|resultMap|parameterMap|sql"); // 这里需要写上xml所有出现的节点
			Arrays.asList("mappedStatements", "caches", "resultMaps", "parameterMaps", "keyGenerators", "sqlFragments")
					.forEach(f -> {
						try {
							Field temp = clz.getDeclaredField(f);
							temp.setAccessible(true);
							Map m = (Map) temp.get(configuration);

							if (m.size() != 0) {
								for (XNode parameterMapNode : list) {
									String id = parameterMapNode.getStringAttribute("id");
									m.remove(namespace + "." + id);
								}
							}
						} catch (Exception e) {
							e.printStackTrace();
						}
					});
			//

			XMLMapperBuilder xmlMapperBuilder = new XMLMapperBuilder(resource.getInputStream(),
					sqlSessionFactory.getConfiguration(), resource.toString(),
					sqlSessionFactory.getConfiguration().getSqlFragments());
			xmlMapperBuilder.parse();
			log.info("refresh: '" + resource + "', success!");
		} catch (IOException e) {
			log.error("Refresh IOException :" + e.getMessage());
		} finally {
			ErrorContext.instance().reset();
		}
	}

	// 原版会报错
	@SuppressWarnings("rawtypes")
	private void refresh(Resource resource)
			throws ClassNotFoundException, NoSuchFieldException, IllegalAccessException {
		this.configuration = sqlSessionFactory.getConfiguration();
		boolean isSupper = configuration.getClass().getSuperclass() == Configuration.class;
		try {
			Field loadedResourcesField = isSupper
					? configuration.getClass().getSuperclass().getDeclaredField("loadedResources")
					: configuration.getClass().getDeclaredField("loadedResources");
			loadedResourcesField.setAccessible(true);
			Set loadedResourcesSet = ((Set) loadedResourcesField.get(configuration));
			XPathParser xPathParser = new XPathParser(resource.getInputStream(), true, configuration.getVariables(),
					new XMLMapperEntityResolver());
			XNode context = xPathParser.evalNode("/mapper");
			String namespace = context.getStringAttribute("namespace");
			Field field = MapperRegistry.class.getDeclaredField("knownMappers");
			field.setAccessible(true);
			Map mapConfig = (Map) field.get(configuration.getMapperRegistry());
			mapConfig.remove(Resources.classForName(namespace));
			loadedResourcesSet.remove(resource.toString());
			configuration.getCacheNames().remove(namespace);
			cleanParameterMap(context.evalNodes("/mapper/parameterMap"), namespace);
			cleanResultMap(context.evalNodes("/mapper/resultMap"), namespace);
			cleanKeyGenerators(context.evalNodes("insert|delete|select|update"), namespace);
			cleanSqlElement(context.evalNodes("/mapper/sql"), namespace);
			XMLMapperBuilder xmlMapperBuilder = new XMLMapperBuilder(resource.getInputStream(),
					sqlSessionFactory.getConfiguration(), resource.toString(),
					sqlSessionFactory.getConfiguration().getSqlFragments());
			xmlMapperBuilder.parse();
			log.info("refresh: '" + resource + "', success!");
		} catch (IOException e) {
			log.error("Refresh IOException :" + e.getMessage());
		} finally {
			ErrorContext.instance().reset();
		}
	}

	@SuppressWarnings("unlikely-arg-type")
	private void cleanParameterMap(List<XNode> list, String namespace) {
		for (XNode parameterMapNode : list) {
			String id = parameterMapNode.getStringAttribute("id");
			configuration.getParameterMaps().remove(namespace + "." + id);
		}
	}

	private void cleanResultMap(List<XNode> list, String namespace) {
		for (XNode resultMapNode : list) {
			String id = resultMapNode.getStringAttribute("id", resultMapNode.getValueBasedIdentifier());
			configuration.getResultMapNames().remove(id);
			configuration.getResultMapNames().remove(namespace + "." + id);
			clearResultMap(resultMapNode, namespace);
		}
	}

	private void clearResultMap(XNode xNode, String namespace) {
		for (XNode resultChild : xNode.getChildren()) {
			if ("association".equals(resultChild.getName()) || "collection".equals(resultChild.getName())
					|| "case".equals(resultChild.getName())) {
				if (resultChild.getStringAttribute("select") == null) {
					configuration.getResultMapNames()
							.remove(resultChild.getStringAttribute("id", resultChild.getValueBasedIdentifier()));
					configuration.getResultMapNames().remove(namespace + "."
							+ resultChild.getStringAttribute("id", resultChild.getValueBasedIdentifier()));
					if (resultChild.getChildren() != null && !resultChild.getChildren().isEmpty()) {
						clearResultMap(resultChild, namespace);
					}
				}
			}
		}
	}

	private void cleanKeyGenerators(List<XNode> list, String namespace) {
		for (XNode context : list) {
			String id = context.getStringAttribute("id");
			configuration.getKeyGeneratorNames().remove(id + SelectKeyGenerator.SELECT_KEY_SUFFIX);
			configuration.getKeyGeneratorNames().remove(namespace + "." + id + SelectKeyGenerator.SELECT_KEY_SUFFIX);
		}
	}

	private void cleanSqlElement(List<XNode> list, String namespace) {
		for (XNode context : list) {
			String id = context.getStringAttribute("id");
			configuration.getSqlFragments().remove(id);
			configuration.getSqlFragments().remove(namespace + "." + id);
		}
	}
}
