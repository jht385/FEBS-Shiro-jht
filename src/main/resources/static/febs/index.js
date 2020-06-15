// 扩展模块别名如 febs: 'lay/modules/febs'
// 依赖模块'febs', 'conf'
layui.extend({
    febs: 'lay/modules/febs',
    validate: 'lay/modules/validate'
}).define(['febs', 'conf', 'jquery'], function (exports) {
    layui.febs.initPage();
    // 拓展jq函数
    var $ = layui.jquery;
    $.fn.serializeJson = function() {
        var serializeObj = {};
        $(this.serializeArray()).each(function(){
            serializeObj[this.name] = this.value;
        });
        return serializeObj;
    };
    //console.log("\n %c FEBS-Shiro 2.0 %c https://github.com/wuyouzhuguli/FEBS-Shiro %c 如果该项目对您有帮助的话，还请点个star给予精神支持！🐤", "color: #fff; font-size: .84rem;background: #366ed8; padding:5px 0;", "font-size: .84rem;background: #fff; border: 2px solid #b0e0a8;border-left: none; padding:3px 0;"," font-size: .84rem;background: #fcf9ec; padding:5px 0;margin-left: 8px");
    // index会注册到layui对象下，layui.index()可以调用
    // 上面layui.febs.initPage因为其模块内是这样定义的exports('febs', self)
    exports('index', function(){});
});