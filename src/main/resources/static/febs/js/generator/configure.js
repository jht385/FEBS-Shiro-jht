layui.use(['febs', 'form'], function () {
    var $ = layui.$,
        febs = layui.febs,
        form = layui.form,
        $view = $('#febs-generator-configure'),
        $trimValue = $view.find('input[name="trimValue"]'),
        $trimValueItem = $trimValue.parents('.layui-form-item');

    form.render();
    initFormValue();

    form.on("radio(isTrim)", function (data) {
        if (data.value === '1') {
            trimValueItemShow();
        } else {
            trimValueItemHide();
        }
    });

    function initFormValue() {
        form.val("generator-configure-form", {
            "id": config.id,
            "author": config.author,
            "basePackage": config.basePackage,
            "controllerPackage": config.controllerPackage,
            "servicePackage": config.servicePackage,
            "serviceImplPackage": config.serviceImplPackage,
            "entityPackage": config.entityPackage,
            "mapperPackage": config.mapperPackage,
            "mapperXmlPackage": config.mapperXmlPackage,
            "htmlRoot": config.htmlRoot,
            "jsRoot": config.jsRoot,
            "cssRoot": config.cssRoot,
            "isTrim": config.isTrim,
            "trimValue": config.trimValue,
            "module": config.module
        });

        if (config.isTrim === '1') {
            trimValueItemShow();
        } else {
            trimValueItemHide();
        }
    }

    function trimValueItemShow() {
        $trimValueItem.show();
    }

    function trimValueItemHide() {
        form.val("generator-configure-form", {
            "trimValue": ''
        });
        $trimValueItem.hide();
    }

    form.on('submit(generator-configure-form-submit)', function (data) {
        if (febs.nativeEqual(data.field, config)) {
            febs.alert.warn('数据未作任何修改！');
            return false;
        }
        febs.post(ctx + 'generatorConfig/update', data.field, function (r) {
            febs.alert.success('修改成功');
        });
        return false;
    });
});