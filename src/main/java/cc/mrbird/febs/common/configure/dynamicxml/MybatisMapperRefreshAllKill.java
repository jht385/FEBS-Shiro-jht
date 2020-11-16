package cc.mrbird.febs.common.configure.dynamicxml;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.ibatis.builder.xml.XMLMapperBuilder;
import org.apache.ibatis.session.Configuration;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.core.io.Resource;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class MybatisMapperRefreshAllKill implements Runnable {
	private static final Map<String, List<Resource>> JAR_MAPPER = new HashMap<>(); // 记录jar包存在的mapper
	private final SqlSessionFactory sqlSessionFactory;
	private final Resource[] mapperLocations;
	private final boolean enabled; // 是否开启刷新mapper
	private Long beforeTime = 0L;
	private Configuration configuration;
	private Set<String> fileSet; // xml文件目录
	private int delaySeconds = 10; // 延迟加载时间
	private int sleepSeconds = 20; // 刷新间隔时间

	public MybatisMapperRefreshAllKill(Resource[] resources, SqlSessionFactory sqlSessionFactory, int delaySeconds,
			int sleepSeconds, boolean enabled) {
		this.mapperLocations = resources.clone();
		this.sqlSessionFactory = sqlSessionFactory;
		this.delaySeconds = delaySeconds;
		this.enabled = enabled;
		this.sleepSeconds = sleepSeconds;
		this.configuration = sqlSessionFactory.getConfiguration();
		this.run();
	}

	@Override
	public void run() {
		if (enabled) {
			beforeTime = SystemClock.now();
			new Thread(() -> {
				if (fileSet == null) {
					fileSet = new HashSet<>();
					if (mapperLocations != null) {
						for (Resource mapperLocation : mapperLocations) {
							try {
								fileSet.add(mapperLocation.getFile().getPath());
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
						boolean isChange = false;
						for (String filePath : fileSet) {
							File file = new File(filePath);
							if (file.isFile() && file.lastModified() > beforeTime) {
								isChange = true;
								break;
							}
						}
						if (isChange) {
							removeConfig(configuration);
							for (Resource resource : mapperLocations) {
								try {
									XMLMapperBuilder xmlMapperBuilder = new XMLMapperBuilder(resource.getInputStream(),
											configuration, resource.toString(), configuration.getSqlFragments());
									xmlMapperBuilder.parse();
									log.info("mapper文件[" + resource.getFilename() + "]缓存加载成功");
								} catch (IOException e) {
									log.debug("mapper文件[" + resource.getFilename() + "]不存在或内容格式不对");
									continue;
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

	private void removeConfig(Configuration configuration) throws Exception {
		boolean isSupper = configuration.getClass().getSuperclass() == Configuration.class;
		Class clz = isSupper ? configuration.getClass().getSuperclass() : configuration.getClass();
		Arrays.asList("mappedStatements", "caches", "resultMaps", "parameterMaps", "keyGenerators", "sqlFragments")
				.forEach(f -> {
					Field field;
					try {
						field = clz.getDeclaredField(f);
						field.setAccessible(true);
						Map mapConfig = (Map) field.get(configuration);
						mapConfig.clear();
					} catch (Exception e) {
						e.printStackTrace();
					}
				});
		Field field = clz.getDeclaredField("loadedResources");
		field.setAccessible(true);
		Set setConfig = (Set) field.get(configuration);
		setConfig.clear();
	}

}
