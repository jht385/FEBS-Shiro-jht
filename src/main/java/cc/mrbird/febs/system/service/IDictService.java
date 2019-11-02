package cc.mrbird.febs.system.service;

import cc.mrbird.febs.system.entity.Dict;

import cc.mrbird.febs.common.entity.QueryRequest;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

public interface IDictService extends IService<Dict> {
	IPage<Dict> findDicts(QueryRequest request, Dict dict);

	List<Dict> findDicts(Dict dict);

	void createDict(Dict dict);

	void updateDict(Dict dict);

	void deleteDict(Dict dict);

	void deleteDicts(String[] ids);

	Dict findById(String id);
}