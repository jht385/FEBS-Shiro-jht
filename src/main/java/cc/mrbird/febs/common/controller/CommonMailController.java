package cc.mrbird.febs.common.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cc.mrbird.febs.common.configure.FebsConfig;
import cc.mrbird.febs.common.entity.FebsResponse;
import cc.mrbird.febs.common.service.CommonService;
import cc.mrbird.febs.common.util.MailUtils;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("commonMail")
public class CommonMailController {

	private final CommonService commonService;
	private final FebsConfig febsConfig;

	/*
	febs.post(ctx + 'commonMail/byEMail', {
		email: 'xxx@qq.com',
		subject: 'zhuti',
		text: 'nmsl'
	}, function (data) {
		console.log(data);
	});
	*/
	@PostMapping("byEMail")
	public FebsResponse byEMail(@RequestParam Map<String, Object> map) {
		String subject = (String) map.get("subject");
		String text = (String) map.get("text");
		String email = (String) map.get("email");
		if ("dev".equals(febsConfig.getActive())) {
			email = febsConfig.getDevMailTo(); // 接收者，测试环境固定到测试邮箱
		}
		MailUtils.SimpleEmail(febsConfig.getMailFrom(), email, subject,
				text + ",请登录 http://" + febsConfig.getAppServer() + "/ 查看");
		return new FebsResponse().success().data("成功");
	}

	/*
	febs.post(ctx + 'commonMail/byUserIds', {
		userIds: '9,10,11',
		subject: 'zhuti',
		text: 'nmsl'
	}, function (data) {
		console.log(data);
	});
	 */
	@PostMapping("byUserIds")
	public FebsResponse byUserIds(@RequestParam Map<String, Object> map) {
		String subject = (String) map.get("subject");
		String text = (String) map.get("text");
		String email = "";
		String userIds = (String) map.get("userIds");

		map.clear();
		map.put("columns", "EMAIL email");
		map.put("table", "t_user");
		map.put("whereStr", "and EMAIL is not null and EMAIL != '' and USER_ID in (" + userIds + ")");
		List<Map<String, Object>> emailListMap = commonService.list(map);
		StringBuilder sb = new StringBuilder();
		emailListMap.forEach(m -> {
			sb.append(m.get("email") + ";");
		});
		email = sb.toString();

		if ("dev".equals(febsConfig.getActive())) {
			email = febsConfig.getDevMailTo(); // 接收者，测试环境固定到测试邮箱
		}
		MailUtils.SimpleEmail(febsConfig.getMailFrom(), email, subject,
				text + ",请登录 http://" + febsConfig.getAppServer() + "/ 查看");
		return new FebsResponse().success().data("成功");
	}
}
