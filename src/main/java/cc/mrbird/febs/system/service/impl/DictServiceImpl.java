package cc.mrbird.febs.system.service.impl;

import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import cc.mrbird.febs.common.entity.FebsConstant;
import cc.mrbird.febs.common.entity.QueryRequest;
import cc.mrbird.febs.common.utils.SortUtil;
import cc.mrbird.febs.system.entity.Dict;
import cc.mrbird.febs.system.mapper.DictMapper;
import cc.mrbird.febs.system.service.IDictService;

@Service
@Transactional(propagation = Propagation.SUPPORTS, readOnly = true, rollbackFor = Exception.class)
public class DictServiceImpl extends ServiceImpl<DictMapper, Dict> implements IDictService {

	@Override
	public IPage<Dict> findDicts(QueryRequest request, Dict dict) {
		Page<Dict> page = new Page<>(request.getPageNum(), request.getPageSize());
		SortUtil.handlePageSort(request, page, "id", FebsConstant.ORDER_ASC, false);
		return baseMapper.findDictPage(page, dict);
	}

	@Override
	public List<Dict> findDicts(Dict dict) {
		LambdaQueryWrapper<Dict> queryWrapper = new LambdaQueryWrapper<>();
		return baseMapper.selectList(queryWrapper);
	}

	@Override
	@Transactional
	public void createDict(Dict dict) {
		save(dict);
	}
	
	@Override
	public Dict findById(String id) {
		return getById(id);
	}

	@Override
	@Transactional
	public void updateDict(Dict dict) {
		saveOrUpdate(dict);
	}

	@Override
	@Transactional
	public void deleteDict(Dict dict) {
		LambdaQueryWrapper<Dict> wrapper = new LambdaQueryWrapper<>();
		remove(wrapper);
	}
	
	@Override
	@Transactional
	public void deleteDicts(String[] ids) {
		List<String> list = Arrays.asList(ids);
		removeByIds(list);
	}
}