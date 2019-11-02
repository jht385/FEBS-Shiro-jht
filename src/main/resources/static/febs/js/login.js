// 扩展模块别名validate: './febs/lay/modules/validate'
// 加载模块use(['form'内置, 'layer'内置, 'validate'扩展]
// 回调会带上加载的模块接口如(form, layer)，不写需要像validate = layui.validate这样
// 回调内就是加载完模块后所做的事
layui.extend({
	validate: './febs/lay/modules/validate'
}).use(['form', 'layer', 'validate'], function (form, layer) {
    var $ = layui.jquery, // layui内置了jquery，想要使用jq的$需要这样定义一下
        validate = layui.validate,
        $view = $('#febs-login'),
        type = 'login',
        $loginDiv = $view.find('#login-div'),
        $registDiv = $view.find('#regist-div');

    form.verify(validate);
    form.render();
    initCode();

    //提交登录表单
    form.on('submit(login-submit)', function (data) {
        var loading = $(this).find('.layui-icon');
        if (loading.is(":visible")) return;
        loading.show();
        $.post(ctx + 'login', data.field, function (r) {
            if (r.code === 200) {
                location.href = ctx + 'index';
            } else {
                layer.msg(r.message);
                loading.hide();
                initCode();
            }
        });
        return false;
    });

    //提交注册表单
    form.on('submit(regist-submit)', function (data) {
        if (data.field.password !== data.field.passwordB) {
            layer.msg('两次密码输入不一致！');
            return;
        }
        var loading = $(this).find('.layui-icon');
        if (loading.is(":visible")) return;
        loading.show();
        $.post(ctx + 'regist', data.field, function (r) {
            if (r.code === 200) {
                layer.msg('注册成功，请登录');
                loading.hide();
                $view.find('#login-href').trigger('click');
            } else {
                layer.msg(r.message);
                loading.hide();
            }
        });
        return false;
    });

    function initCode() {
        $view.find('#codeimg').attr("src", ctx + "images/captcha?data=" + new Date().getTime());
    }

    $view.find('#codeimg').on('click', function () {
        initCode();
    });

    $view.find('#regist-href').on('click', function () {
        resetForm();
        type = 'regist';
        $loginDiv.hide();
        $registDiv.show();
    });

    $view.find('#login-href').on('click', function () {
        resetForm();
        type = 'login';
        $loginDiv.show();
        $registDiv.hide();
    });

    function resetForm() {
        $registDiv.find('input[name="username"]').val('')
            .end().find('input[name="password"]').val('')
            .end().find('input[name="passwordB"]').val('');
        $loginDiv.find('input[name="username"]').val('')
            .end().find('input[name="password"]').val('')
            .end().find('input[name="verifyCode"]').val('');
    }

    $(document).on('keydown', function (e) {
        if (e.keyCode === 13) {
            if (type === 'login') $view.find('#login').trigger("click");
            if (type === 'regist') $view.find('#regist').trigger("click");
        }
    });
});