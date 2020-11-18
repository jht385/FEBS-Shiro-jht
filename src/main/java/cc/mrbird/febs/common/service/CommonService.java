package cc.mrbird.febs.common.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import cc.mrbird.febs.common.mapper.CommonMapper;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommonService {

	private final CommonMapper commonMapper;

	public List<Map<String, Object>> list(Map<String, Object> map) {
		return commonMapper.list(map);
	}

}
