package cc.mrbird.febs.system.controller;

import cc.mrbird.febs.common.annotation.ControllerEndpoint;
import cc.mrbird.febs.common.utils.FebsUtil;
import cc.mrbird.febs.common.entity.FebsConstant;
import cc.mrbird.febs.common.controller.BaseController;
import cc.mrbird.febs.common.entity.FebsResponse;
import cc.mrbird.febs.common.entity.QueryRequest;
import cc.mrbird.febs.system.entity.Dict;
import cc.mrbird.febs.system.service.IDictService;
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
public class DictController extends BaseController {

	private final IDictService dictService;

	@GetMapping(FebsConstant.VIEW_PREFIX + "system/dict")
	public String dict(){
		return FebsUtil.view("system/dict/dict");
	}
	
	@GetMapping(FebsConstant.VIEW_PREFIX + "system/dict/detail/{id}")
	public String dictDetail(@PathVariable String id, Model model){
		Dict dict = dictService.findById(id);
		model.addAttribute("dict", dict);
		model.addAttribute("ac", "view");
		return FebsUtil.view("system/dict/dictUpdate");
	}
	
	@GetMapping(FebsConstant.VIEW_PREFIX + "system/dict/add")
	public String dictAdd(){
		return FebsUtil.view("system/dict/dictAdd");
	}
	
	@GetMapping(FebsConstant.VIEW_PREFIX + "system/dict/update/{id}")
	public String dictUpdate(@PathVariable String id, Model model){
		Dict dict = dictService.findById(id);
		model.addAttribute("dict", dict);
		model.addAttribute("ac", "edit");
		return FebsUtil.view("system/dict/dictUpdate");
	}

	@GetMapping("system/dict")
	@ResponseBody
	@RequiresPermissions("dict:view")
	public FebsResponse getAllDicts(Dict dict) {
		return new FebsResponse().success().data(dictService.findDicts(dict));
	}

	@GetMapping("system/dict/list")
	@ResponseBody
	@RequiresPermissions("dict:view")
	public FebsResponse dictList(QueryRequest request, Dict dict) {
		Map<String, Object> dataTable = getDataTable(dictService.findDicts(request, dict));
		return new FebsResponse().success().data(dataTable);
	}

	@ControllerEndpoint(operation = "新增Dict", exceptionMessage = "新增Dict失败")
	@PostMapping("system/dict")
	@ResponseBody
	@RequiresPermissions("dict:add")
	public FebsResponse addDict(@Valid Dict dict) {
		dictService.createDict(dict);
		return new FebsResponse().success();
	}

	@ControllerEndpoint(operation = "删除Dict", exceptionMessage = "删除Dict失败")
	@GetMapping("system/dict/delete/{ids}")
	@ResponseBody
	@RequiresPermissions("dict:delete")
	public FebsResponse deleteDict(@PathVariable String ids) {
		String[] idArr = ids.split(StringPool.COMMA);
		dictService.deleteDicts(idArr);
		return new FebsResponse().success();
	}

	@ControllerEndpoint(operation = "修改Dict", exceptionMessage = "修改Dict失败")
	@PostMapping("system/dict/update")
	@ResponseBody
	@RequiresPermissions("dict:update")
	public FebsResponse updateDict(Dict dict) {
		dictService.updateDict(dict);
		return new FebsResponse().success();
	}

	@ControllerEndpoint(operation = "导出Dict", exceptionMessage = "导出Excel失败")
	@PostMapping("system/dict/excel")
	@ResponseBody
	@RequiresPermissions("dict:export")
	public void export(QueryRequest queryRequest, Dict dict, HttpServletResponse response) {
		List<Dict> dicts = dictService.findDicts(queryRequest, dict).getRecords();
		ExcelKit.$Export(Dict.class, response).downXlsx(dicts, false);
	}
}