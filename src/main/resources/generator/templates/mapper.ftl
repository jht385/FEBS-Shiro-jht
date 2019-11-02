package ${basePackage}.${module}.${mapperPackage};

import ${basePackage}.${module}.${entityPackage}.${className};
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

public interface ${className}Mapper extends BaseMapper<${className}> {
	IPage<${className}> find${className}Page(Page<${className}> page, ${className} ${className?uncap_first});
}