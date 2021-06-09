package cc.mrbird.febs.common.configure;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import cc.mrbird.febs.common.utils.IdWorker;

@Configuration
public class BeanConfig {
	@Bean
	public IdWorker IdWorker() {
		IdWorker worker = new IdWorker(1, 1, 1); // 这里暂时创建一个写死的
		return worker;
	}

}
