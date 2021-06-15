package ${basePackage}.${module}.${controllerPackage};

import cc.mrbird.febs.common.annotation.ControllerEndpoint;
import cc.mrbird.febs.common.utils.FebsUtil;
import cc.mrbird.febs.common.entity.FebsConstant;
import cc.mrbird.febs.common.controller.BaseController;
import cc.mrbird.febs.common.entity.FebsResponse;
import cc.mrbird.febs.common.entity.QueryRequest;
import ${basePackage}.${module}.${entityPackage}.${className};
import ${basePackage}.${module}.${servicePackage}.I${className}Service;
import lombok.RequiredArgsConstructor;
import com.baomidou.mybatisplus.core.toolkit.StringPool;
import com.wuwenze.poi.ExcelKit;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.util.List;
import java.util.Map;

@Validated
@Controller
@RequiredArgsConstructor
public class ${className}Controller extends BaseController {

	private final I${className}Service ${className?uncap_first}Service;

	@GetMapping(FebsConstant.VIEW_PREFIX + "${module}/${className?uncap_first}")
	public String ${className?uncap_first}(){
		return FebsUtil.view("${module}/${className?uncap_first}/${className?uncap_first}");
	}
	
	@GetMapping(FebsConstant.VIEW_PREFIX + "${module}/${className?uncap_first}/detail/{${columns[0].classField?uncap_first}}")
	public String ${className?uncap_first}Detail(@PathVariable String ${columns[0].classField?uncap_first}, Model model){
		${className} ${className?uncap_first} = ${className?uncap_first}Service.findBy${columns[0].classField?cap_first}(${columns[0].classField?uncap_first});
		model.addAttribute("${className?uncap_first}", ${className?uncap_first});
		model.addAttribute("ac", "view");
		return FebsUtil.view("${module}/${className?uncap_first}/${className?uncap_first}Update");
	}
	
	@GetMapping(FebsConstant.VIEW_PREFIX + "${module}/${className?uncap_first}/add")
	public String ${className?uncap_first}Add(){
		return FebsUtil.view("${module}/${className?uncap_first}/${className?uncap_first}Add");
	}
	
	@GetMapping(FebsConstant.VIEW_PREFIX + "${module}/${className?uncap_first}/update/{${columns[0].classField?uncap_first}}")
	public String ${className?uncap_first}Update(@PathVariable String ${columns[0].classField?uncap_first}, Model model){
		${className} ${className?uncap_first} = ${className?uncap_first}Service.findBy${columns[0].classField?cap_first}(${columns[0].classField?uncap_first});
		model.addAttribute("${className?uncap_first}", ${className?uncap_first});
		model.addAttribute("ac", "edit");
		return FebsUtil.view("${module}/${className?uncap_first}/${className?uncap_first}Update");
	}

	@GetMapping("${module}/${className?uncap_first}")
	@ResponseBody
	@RequiresPermissions("${className?uncap_first}:view")
	public FebsResponse getAll${className}s(${className} ${className?uncap_first}) {
		return new FebsResponse().success().data(${className?uncap_first}Service.find${className}s(${className?uncap_first}));
	}

	@GetMapping("${module}/${className?uncap_first}/list")
	@ResponseBody
	@RequiresPermissions("${className?uncap_first}:view")
	public FebsResponse ${className?uncap_first}List(QueryRequest request, ${className} ${className?uncap_first}) {
		Map<String, Object> dataTable = getDataTable(${className?uncap_first}Service.find${className}s(request, ${className?uncap_first}));
		return new FebsResponse().success().data(dataTable);
	}

	@ControllerEndpoint(operation = "新增${className}", exceptionMessage = "新增${className}失败")
	@PostMapping("${module}/${className?uncap_first}")
	@ResponseBody
	@RequiresPermissions("${className?uncap_first}:add")
	public FebsResponse add${className}(@Valid ${className} ${className?uncap_first}) {
		${className?uncap_first}Service.create${className}(${className?uncap_first});
		return new FebsResponse().success();
	}

	@ControllerEndpoint(operation = "删除${className}", exceptionMessage = "删除${className}失败")
	@GetMapping("${module}/${className?uncap_first}/delete/{ids}")
	@ResponseBody
	@RequiresPermissions("${className?uncap_first}:delete")
	public FebsResponse delete${className}(@PathVariable String ids) {
		String[] idArr = ids.split(StringPool.COMMA);
		${className?uncap_first}Service.delete${className}s(idArr);
		return new FebsResponse().success();
	}

	@ControllerEndpoint(operation = "修改${className}", exceptionMessage = "修改${className}失败")
	@PostMapping("${module}/${className?uncap_first}/update")
	@ResponseBody
	@RequiresPermissions("${className?uncap_first}:update")
	public FebsResponse update${className}(${className} ${className?uncap_first}) {
		${className?uncap_first}Service.update${className}(${className?uncap_first});
		return new FebsResponse().success();
	}

	@ControllerEndpoint(operation = "导出${className}", exceptionMessage = "导出Excel失败")
	@PostMapping("${module}/${className?uncap_first}/excel")
	@ResponseBody
	@RequiresPermissions("${className?uncap_first}:export")
	public void export(QueryRequest queryRequest, ${className} ${className?uncap_first}, HttpServletResponse response) {
		List<${className}> ${className?uncap_first}s = ${className?uncap_first}Service.find${className}s(queryRequest, ${className?uncap_first}).getRecords();
		ExcelKit.$Export(${className}.class, response).downXlsx(${className?uncap_first}s, false);
	}
}