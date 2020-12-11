package cc.mrbird.febs.common.configure;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

@Component
@ConfigurationProperties(prefix="febs")
@Data
public class FebsConfig {
	private String active;
	private String appServer;
	private String uploadPath;
	private String mailFrom;
	private String devMailTo;
}
