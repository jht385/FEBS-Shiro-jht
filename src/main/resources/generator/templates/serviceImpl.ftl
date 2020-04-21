package ${basePackage}.${module}.${serviceImplPackage};

import cc.mrbird.febs.common.entity.FebsConstant;
import cc.mrbird.febs.common.entity.QueryRequest;
import cc.mrbird.febs.common.utils.SortUtil;
import ${basePackage}.${module}.${entityPackage}.${className};
import ${basePackage}.${module}.${mapperPackage}.${className}Mapper;
import ${basePackage}.${module}.${servicePackage}.I${className}Service;
import lombok.RequiredArgsConstructor;
import java.util.Arrays;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Propagation;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

@Service
@RequiredArgsConstructor
@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
public class ${className}ServiceImpl extends ServiceImpl<${className}Mapper, ${className}> implements I${className}Service {

	private final ${className}Mapper ${className?uncap_first}Mapper;

	@Override
	public IPage<${className}> find${className}s(QueryRequest request, ${className} ${className?uncap_first}) {
		Page<${className}> page = new Page<>(request.getPageNum(), request.getPageSize());
		SortUtil.handlePageSort(request, page, "${columns[0].classField?uncap_first}", FebsConstant.ORDER_ASC, true);
		return baseMapper.find${className}Page(page, ${className?uncap_first});
	}

	@Override
	public List<${className}> find${className}s(${className} ${className?uncap_first}) {
		LambdaQueryWrapper<${className}> queryWrapper = new LambdaQueryWrapper<>();
		return baseMapper.selectList(queryWrapper);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void create${className}(${className} ${className?uncap_first}) {
		save(${className?uncap_first});
	}
	
	@Override
	public ${className} findBy${columns[0].classField?cap_first}(String ${columns[0].classField?uncap_first}) {
		return getById(${columns[0].classField?uncap_first});
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void update${className}(${className} ${className?uncap_first}) {
		saveOrUpdate(${className?uncap_first});
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void delete${className}(${className} ${className?uncap_first}) {
		LambdaQueryWrapper<${className}> wrapper = new LambdaQueryWrapper<>();
		remove(wrapper);
	}
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void delete${className}s(String[] ids) {
		List<String> list = Arrays.asList(ids);
		removeByIds(list);
	}
}