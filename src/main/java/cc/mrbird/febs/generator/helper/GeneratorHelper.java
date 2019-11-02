package cc.mrbird.febs.generator.helper;

import static cc.mrbird.febs.generator.entity.GeneratorConstant.ADD_JS_TEMPLATE;
import static cc.mrbird.febs.generator.entity.GeneratorConstant.ADD_TEMPLATE;
import static cc.mrbird.febs.generator.entity.GeneratorConstant.CONTROLLER_FILE_SUFFIX;
import static cc.mrbird.febs.generator.entity.GeneratorConstant.CONTROLLER_TEMPLATE;
import static cc.mrbird.febs.generator.entity.GeneratorConstant.CSS_FILE_SUFFIX;
import static cc.mrbird.febs.generator.entity.GeneratorConstant.ENTITY_TEMPLATE;
import static cc.mrbird.febs.generator.entity.GeneratorConstant.HTML_FILE_SUFFIX;
import static cc.mrbird.febs.generator.entity.GeneratorConstant.JAVA_FILE_SUFFIX;
import static cc.mrbird.febs.generator.entity.GeneratorConstant.JS_FILE_SUFFIX;
import static cc.mrbird.febs.generator.entity.GeneratorConstant.LIST_CSS_TEMPLATE;
import static cc.mrbird.febs.generator.entity.GeneratorConstant.LIST_JS_TEMPLATE;
import static cc.mrbird.febs.generator.entity.GeneratorConstant.LIST_TEMPLATE;
import static cc.mrbird.febs.generator.entity.GeneratorConstant.MAPPERXML_FILE_SUFFIX;
import static cc.mrbird.febs.generator.entity.GeneratorConstant.MAPPERXML_TEMPLATE;
import static cc.mrbird.febs.generator.entity.GeneratorConstant.MAPPER_FILE_SUFFIX;
import static cc.mrbird.febs.generator.entity.GeneratorConstant.MAPPER_TEMPLATE;
import static cc.mrbird.febs.generator.entity.GeneratorConstant.SERVICEIMPL_FILE_SUFFIX;
import static cc.mrbird.febs.generator.entity.GeneratorConstant.SERVICEIMPL_TEMPLATE;
import static cc.mrbird.febs.generator.entity.GeneratorConstant.SERVICE_FILE_SUFFIX;
import static cc.mrbird.febs.generator.entity.GeneratorConstant.SERVICE_TEMPLATE;
import static cc.mrbird.febs.generator.entity.GeneratorConstant.TEMP_PATH;
import static cc.mrbird.febs.generator.entity.GeneratorConstant.UPDATE_CSS_TEMPLATE;
import static cc.mrbird.febs.generator.entity.GeneratorConstant.UPDATE_JS_TEMPLATE;
import static cc.mrbird.febs.generator.entity.GeneratorConstant.UPDATE_TEMPLATE;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Objects;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.fastjson.JSONObject;
import com.google.common.io.Files;

import cc.mrbird.febs.common.annotation.Helper;
import cc.mrbird.febs.common.utils.AddressUtil;
import cc.mrbird.febs.generator.entity.Column;
import cc.mrbird.febs.generator.entity.GeneratorConfig;
import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateExceptionHandler;
import lombok.extern.slf4j.Slf4j;

/**
 * @author MrBird
 */
@Slf4j
@Helper
public class GeneratorHelper {

	public void generate(List<Column> columns, GeneratorConfig configure) throws Exception {
		String javaPath = TEMP_PATH + configure.getJavaPath();
		String resourcesPath = TEMP_PATH + configure.getResourcesPath();
		String appPackage = packageConvertPath(configure.getBasePackage());
		String bizName = StringUtils.uncapitalize(configure.getClassName()); // 首字母小写类名
		generateFile(columns, javaPath, appPackage, configure.getModule(), configure.getEntityPackage(),
				configure.getClassName(), JAVA_FILE_SUFFIX, ENTITY_TEMPLATE, configure);
		generateFile(columns, javaPath, appPackage, configure.getModule(), configure.getMapperPackage(),
				configure.getClassName(), MAPPER_FILE_SUFFIX, MAPPER_TEMPLATE, configure);
		generateFile(columns, javaPath, appPackage, configure.getModule(), configure.getServicePackage(),
				"I" + configure.getClassName(), SERVICE_FILE_SUFFIX, SERVICE_TEMPLATE, configure);
		generateFile(columns, javaPath, appPackage, configure.getModule(),
				packageConvertPath(configure.getServiceImplPackage()), configure.getClassName(),
				SERVICEIMPL_FILE_SUFFIX, SERVICEIMPL_TEMPLATE, configure);
		generateFile(columns, javaPath, appPackage, configure.getModule(), configure.getControllerPackage(),
				configure.getClassName(), CONTROLLER_FILE_SUFFIX, CONTROLLER_TEMPLATE, configure);
		generateFile(columns, resourcesPath, configure.getMapperXmlPackage(), configure.getModule(), "/",
				configure.getClassName(), MAPPERXML_FILE_SUFFIX, MAPPERXML_TEMPLATE, configure);
		generateFile(columns, resourcesPath, configure.getHtmlRoot(), configure.getModule(), bizName, bizName,
				HTML_FILE_SUFFIX, LIST_TEMPLATE, configure);
		generateFile(columns, resourcesPath, configure.getJsRoot(), configure.getModule(), bizName, bizName,
				JS_FILE_SUFFIX, LIST_JS_TEMPLATE, configure);
		generateFile(columns, resourcesPath, configure.getCssRoot(), configure.getModule(), bizName, bizName,
				CSS_FILE_SUFFIX, LIST_CSS_TEMPLATE, configure);
		generateFile(columns, resourcesPath, configure.getHtmlRoot(), configure.getModule(), bizName, bizName + "Add",
				HTML_FILE_SUFFIX, ADD_TEMPLATE, configure);
		generateFile(columns, resourcesPath, configure.getJsRoot(), configure.getModule(), bizName, bizName + "Add",
				JS_FILE_SUFFIX, ADD_JS_TEMPLATE, configure);
		generateFile(columns, resourcesPath, configure.getCssRoot(), configure.getModule(), bizName, bizName + "Add",
				CSS_FILE_SUFFIX, ADD_JS_TEMPLATE, configure);
		generateFile(columns, resourcesPath, configure.getHtmlRoot(), configure.getModule(), bizName,
				bizName + "Update", HTML_FILE_SUFFIX, UPDATE_TEMPLATE, configure);
		generateFile(columns, resourcesPath, configure.getJsRoot(), configure.getModule(), bizName, bizName + "Update",
				JS_FILE_SUFFIX, UPDATE_JS_TEMPLATE, configure);
		generateFile(columns, resourcesPath, configure.getCssRoot(), configure.getModule(), bizName, bizName + "Update",
				CSS_FILE_SUFFIX, UPDATE_CSS_TEMPLATE, configure);
		generateFile(columns, resourcesPath, "/sql", configure.getModule(), "", bizName, ".sql", "sql.ftl",
				configure);
	}

	/**
	 * @param columns 表的各个字段
	 * @param root 生成文件的根
	 * @param appPackage 跟下应用包名
	 * @param module 模块
	 * @param bizName 业务
	 * @param fileName 生成文件名
	 * @param suffix 生成文件的后缀
	 * @param templateName 模板文件
	 * @param configure
	 */
	private void generateFile(List<Column> columns, String root, String appPackage, String module, String bizName,
			String fileName, String suffix, String templateName, GeneratorConfig configure) throws Exception {
		String filePath = root + "/" + appPackage + "/" + module + "/" + bizName + "/" + fileName + suffix;
		File entityFile = new File(filePath);
		JSONObject data = JSONObject.parseObject(JSONObject.toJSON(configure).toString());
		data.put("module", module);
		data.put("columns", columns);
		generateFileByTemplate(templateName, entityFile, data);
	}

	@SuppressWarnings("UnstableApiUsage")
	private void generateFileByTemplate(String templateName, File file, Object data) throws Exception {
		Template template = getTemplate(templateName);
		Files.createParentDirs(file);
		FileOutputStream fileOutputStream = new FileOutputStream(file);
		try (Writer out = new BufferedWriter(new OutputStreamWriter(fileOutputStream, StandardCharsets.UTF_8), 10240)) {
			template.process(data, out);
		} catch (Exception e) {
			String message = "代码生成异常";
			log.error(message, e);
			throw new Exception(message);
		}
	}

	private static String packageConvertPath(String packageName) {
		return String.format("/%s/", packageName.contains(".") ? packageName.replaceAll("\\.", "/") : packageName);
	}

	private Template getTemplate(String templateName) throws Exception {
		Configuration configuration = new freemarker.template.Configuration(Configuration.VERSION_2_3_23);
		String templatePath = GeneratorHelper.class.getResource("/generator/templates/").getPath();
		File file = new File(templatePath);
		if (!file.exists()) {
			templatePath = System.getProperties().getProperty("java.io.tmpdir");
			file = new File(templatePath + "/" + templateName);
			FileUtils.copyInputStreamToFile(Objects.requireNonNull(AddressUtil.class.getClassLoader()
					.getResourceAsStream("classpath:generator/templates/" + templateName)), file);
		}
		configuration.setDirectoryForTemplateLoading(new File(templatePath));
		configuration.setDefaultEncoding("UTF-8");
		configuration.setTemplateExceptionHandler(TemplateExceptionHandler.IGNORE_HANDLER);
		return configuration.getTemplate(templateName);
	}

}
