package cc.mrbird.febs.system.mapper;

import cc.mrbird.febs.system.entity.Dict;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

public interface DictMapper extends BaseMapper<Dict> {
	IPage<Dict> findDictPage(Page<Dict> page, Dict dict);
}