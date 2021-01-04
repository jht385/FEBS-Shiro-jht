package cc.mrbird.febs.common.mapper;

import java.util.List;
import java.util.Map;

public interface CommonMapper {

	List<Map<String, Object>> list(Map<String, Object> map);

	int cnt(Map<String, Object> map);
	
	int delete(Map<String, Object> map);
	
	int update(Map<String, Object> map);
	
}
