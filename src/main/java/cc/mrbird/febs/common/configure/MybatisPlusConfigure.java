package cc.mrbird.febs.common.configure;

import java.util.ArrayList;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import com.baomidou.mybatisplus.core.parser.ISqlParser;
import com.baomidou.mybatisplus.extension.parsers.BlockAttackSqlParser;
import com.baomidou.mybatisplus.extension.plugins.PaginationInterceptor;

import cc.mrbird.febs.common.interceptor.DataPermissionInterceptor;

/**
 * @author MrBird
 */
@Configuration
public class MybatisPlusConfigure {
	/**
	 * 分页插件
	 */
	@Bean
	@Order(-1)
	public DataPermissionInterceptor dataPermissionInterceptor() {
		return new DataPermissionInterceptor();
	}

	/**
	 * 注册分页插件
	 */
	@Bean
	@Order(-2)
	public PaginationInterceptor paginationInterceptor() {
		PaginationInterceptor paginationInterceptor = new PaginationInterceptor();
		List<ISqlParser> sqlParserList = new ArrayList<>();
		sqlParserList.add(new BlockAttackSqlParser());
		paginationInterceptor.setSqlParserList(sqlParserList);
		return paginationInterceptor;
	}
}
