package cc.mrbird.febs.common.configure.dynamicxml;

import java.io.IOException;

import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;

@Configuration
// 开发环境生效，且默认不配置
@ConditionalOnProperty(prefix = "spring.profiles", name = "active", havingValue = "dev", matchIfMissing = false)
public class DynamicXmlConfig {
	@Autowired
	private SqlSessionFactory sqlSessionFactory;
	@Value("${mybatis-plus.mapper-locations}")
	private String mapperLocations;
	@Value("${mybatis.refreshMapper:false}")
	private boolean refreshMapper;
	private ResourcePatternResolver resourceResolver = new PathMatchingResourcePatternResolver();

//	@Bean // 全清目前比较稳，暂时留着
//	public MybatisMapperRefreshAllKill xMLMapperLoader() {
//		Resource[] resources = new Resource[0];
//		try {
//			resources = resourceResolver.getResources(mapperLocations);
//		} catch (IOException e) {
//			e.printStackTrace();
//		}
//		return new MybatisMapperRefreshAllKill(resources, sqlSessionFactory, 10, 5, refreshMapper);
//	}

	@Bean // mp原版修改，之后升级可能又需要改
	public MybatisMapperRefresh mybatisMapperRefresh() {
		Resource[] resources = new Resource[0];
		try {
			resources = resourceResolver.getResources(mapperLocations);
		} catch (IOException e) {
			e.printStackTrace();
		}
		MybatisMapperRefresh mybatisMapperRefresh = new MybatisMapperRefresh(resources, sqlSessionFactory, 10, 5,
				refreshMapper);
		return mybatisMapperRefresh;

	}
}
