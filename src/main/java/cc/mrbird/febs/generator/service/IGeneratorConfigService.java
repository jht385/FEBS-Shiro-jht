package cc.mrbird.febs.generator.service;

import cc.mrbird.febs.generator.entity.GeneratorConfig;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * @author MrBird
 */
public interface IGeneratorConfigService extends IService<GeneratorConfig> {

	GeneratorConfig findGeneratorConfig();

	void updateGeneratorConfig(GeneratorConfig generatorConfig);
}
