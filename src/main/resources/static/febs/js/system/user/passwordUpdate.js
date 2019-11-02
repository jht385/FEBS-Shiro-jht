layui.use(['febs', 'form', 'validate', 'layer'], function () {
    var $ = layui.$,
        validate = layui.validate,
        form = layui.form,
        febs = layui.febs,
        layer = layui.layer,
        $view = $('#user-password-update');

    form.verify(validate);
    form.render();

    form.on('submit(password-update-form-submit)', function (data) {
        if (data.field.newPassword !== data.field.confirmPassword) {
            febs.alert.warn('两次密码输入不一致！');
            return false;
        }
        febs.post(ctx + 'user/password/update', data.field, function (r) {
            layer.closeAll();
            febs.modal.success('修改成功', '密码修改成功，请重新登录', function () {
                window.location.href = ctx + 'logout';
            });
        });
        return false;
    });
});