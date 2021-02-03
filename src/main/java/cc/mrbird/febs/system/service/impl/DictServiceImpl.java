package cc.mrbird.febs.system.service.impl;

import cc.mrbird.febs.common.entity.FebsConstant;
import cc.mrbird.febs.common.entity.QueryRequest;
import cc.mrbird.febs.common.utils.SortUtil;
import cc.mrbird.febs.system.entity.Dict;
import cc.mrbird.febs.system.mapper.DictMapper;
import cc.mrbird.febs.system.service.IDictService;
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
public class DictServiceImpl extends ServiceImpl<DictMapper, Dict> implements IDictService {

	private final DictMapper dictMapper;

	@Override
	public IPage<Dict> findDicts(QueryRequest request, Dict dict) {
		Page<Dict> page = new Page<>(request.getPageNum(), request.getPageSize());
		SortUtil.handlePageSort(request, page, "id", FebsConstant.ORDER_ASC, true);
		return baseMapper.findDictPage(page, dict);
	}

	@Override
	public List<Dict> findDicts(Dict dict) {
		LambdaQueryWrapper<Dict> queryWrapper = new LambdaQueryWrapper<>();
		return baseMapper.selectList(queryWrapper);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void createDict(Dict dict) {
		save(dict);
	}
	
	@Override
	public Dict findById(String id) {
		return getById(id);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateDict(Dict dict) {
		saveOrUpdate(dict);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteDict(Dict dict) {
		LambdaQueryWrapper<Dict> wrapper = new LambdaQueryWrapper<>();
		remove(wrapper);
	}
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteDicts(String[] ids) {
		List<String> list = Arrays.asList(ids);
		removeByIds(list);
	}
}