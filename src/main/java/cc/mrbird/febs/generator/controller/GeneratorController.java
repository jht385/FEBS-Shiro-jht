package cc.mrbird.febs.generator.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;
import javax.validation.constraints.NotBlank;

import org.apache.commons.lang3.RegExUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.baomidou.dynamic.datasource.spring.boot.autoconfigure.DataSourceProperty;
import com.baomidou.dynamic.datasource.spring.boot.autoconfigure.DynamicDataSourceProperties;

import cc.mrbird.febs.common.annotation.ControllerEndpoint;
import cc.mrbird.febs.common.controller.BaseController;
import cc.mrbird.febs.common.entity.FebsResponse;
import cc.mrbird.febs.common.entity.QueryRequest;
import cc.mrbird.febs.common.exception.FebsException;
import cc.mrbird.febs.common.utils.FebsUtil;
import cc.mrbird.febs.common.utils.FileUtil;
import cc.mrbird.febs.generator.entity.Column;
import cc.mrbird.febs.generator.entity.GeneratorConfig;
import cc.mrbird.febs.generator.entity.GeneratorConstant;
import cc.mrbird.febs.generator.helper.GeneratorHelper;
import cc.mrbird.febs.generator.service.IGeneratorConfigService;
import cc.mrbird.febs.generator.service.IGeneratorService;
import lombok.RequiredArgsConstructor;

/**
 * @author MrBird
 */
@RestController
@RequestMapping("generator")
@RequiredArgsConstructor
public class GeneratorController extends BaseController {

	private static final String SUFFIX = "_code.zip";

	private final IGeneratorService generatorService;
	private final IGeneratorConfigService generatorConfigService;
	private final GeneratorHelper generatorHelper;
	private final DynamicDataSourceProperties properties;

	@GetMapping("datasource")
	@RequiresPermissions("generator:view")
	public FebsResponse datasource() {
		Map<String, DataSourceProperty> datasources = properties.getDatasource();
		List<String> datasourcesName = new ArrayList<>();
		datasources.forEach((k, v) -> {
			String datasourceName = StringUtils.substringBefore(StringUtils.substringAfterLast(v.getUrl(), "/"), "?");
			if (!datasourcesName.contains(datasourceName)) {
				datasourcesName.add(datasourceName);
			}
		});
		return new FebsResponse().success().data(datasourcesName);
	}

	@GetMapping("tables/info")
	@RequiresPermissions("generator:view")
	public FebsResponse tablesInfo(String tableName, String datasource, QueryRequest request) {
		Map<String, Object> dataTable = getDataTable(
				generatorService.getTables(tableName, request, GeneratorConstant.DATABASE_TYPE, datasource));
		return new FebsResponse().success().data(dataTable);
	}

	@GetMapping
	@RequiresPermissions("generator:generate")
	@ControllerEndpoint(exceptionMessage = "代码生成失败")
	public void generate(@NotBlank(message = "{required}") String name, String remark, String datasource,
			HttpServletResponse response) throws Exception {
		GeneratorConfig generatorConfig = generatorConfigService.findGeneratorConfig();
		if (generatorConfig == null) {
			throw new FebsException("代码生成配置为空");
		}

		generatorConfig.setTableName(name);
		generatorConfig.setTableComment(remark);
		String className = name; // 表名
		if (GeneratorConfig.TRIM_YES.equals(generatorConfig.getIsTrim())) { // 是否去掉前缀
			className = RegExUtils.replaceFirst(name, generatorConfig.getTrimValue(), StringUtils.EMPTY);
		}

		generatorConfig.setTableName(name); // 设置表名
		generatorConfig.setClassName(FebsUtil.underscoreToCamel(className)); // 下划线转驼峰设为类名
		generatorConfig.setTableComment(remark);
		// 生成代码到临时目录
		List<Column> columns = generatorService.getColumns(GeneratorConstant.DATABASE_TYPE, datasource, name);
		generatorHelper.generate(columns, generatorConfig);
		// 打包
		String zipFile = System.currentTimeMillis() + SUFFIX;
		FileUtil.compress(GeneratorConstant.TEMP_PATH + "src", zipFile);
		FileUtil.download(zipFile, name + SUFFIX, true, response);// 下载
		FileUtil.delete(GeneratorConstant.TEMP_PATH);// 删除临时目录
	}
}
