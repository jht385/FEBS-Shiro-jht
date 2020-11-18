package cc.mrbird.febs.common.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cc.mrbird.febs.common.entity.FebsResponse;
import cc.mrbird.febs.common.service.CommonService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("common")
public class CommonController {

	private final CommonService commonService;

	@GetMapping("listUser")
	public FebsResponse listUser(@RequestParam Map<String, Object> map) {
		map.put("columns", "USER_ID 'userId', USERNAME 'userName'");
		map.put("table", "t_user");
		return new FebsResponse().success().data(commonService.list(map));
	}

}
