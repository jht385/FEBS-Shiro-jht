package ${basePackage}.${module}.${servicePackage};

import ${basePackage}.${module}.${entityPackage}.${className};

import cc.mrbird.febs.common.entity.QueryRequest;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

public interface I${className}Service extends IService<${className}> {
	IPage<${className}> find${className}s(QueryRequest request, ${className} ${className?uncap_first});

	List<${className}> find${className}s(${className} ${className?uncap_first});

	void create${className}(${className} ${className?uncap_first});

	void update${className}(${className} ${className?uncap_first});

	void delete${className}(${className} ${className?uncap_first});

	void delete${className}s(String[] ids);

	${className} findBy${columns[0].classField?cap_first}(String ${columns[0].classField?uncap_first});
}