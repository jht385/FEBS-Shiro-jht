package cc.mrbird.febs;

import org.springframework.boot.WebApplicationType;
import org.springframework.boot.builder.SpringApplicationBuilder;

import cc.mrbird.febs.common.annotation.FEBS权限系统;

/**
 * @author MrBird
 */
@FEBS权限系统
public class FebsShiroApplication {

	public static void main(String[] args) {
		new SpringApplicationBuilder(FebsShiroApplication.class).web(WebApplicationType.SERVLET).run(args);
	}

}
