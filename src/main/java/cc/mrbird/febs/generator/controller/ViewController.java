package cc.mrbird.febs.generator.controller;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import cc.mrbird.febs.common.entity.FebsConstant;
import cc.mrbird.febs.common.util.FebsUtil;
import cc.mrbird.febs.generator.entity.GeneratorConfig;
import cc.mrbird.febs.generator.service.IGeneratorConfigService;
import lombok.RequiredArgsConstructor;

/**
 * @author MrBird
 */
@Controller("generatorViews")
@RequestMapping(FebsConstant.VIEW_PREFIX + "generator")
@RequiredArgsConstructor
public class ViewController {

	private final IGeneratorConfigService generatorConfigService;

    @GetMapping("generator")
    @RequiresPermissions("generator:view")
    public String generator() {
        return FebsUtil.view("generator/generator");
    }

    @GetMapping("configure")
    @RequiresPermissions("generator:configure:view")
    public String generatorConfigure(Model model) {
        GeneratorConfig generatorConfig = generatorConfigService.findGeneratorConfig();
        model.addAttribute("config", generatorConfig);
        return FebsUtil.view("generator/configure");
    }
}
