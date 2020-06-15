layui.use(['febs', 'form', 'validate', 'treeSelect'], function () {
    var $ = layui.$,
        febs = layui.febs,
        layer = layui.layer,
        treeSelect = layui.treeSelect,
        form = layui.form,
        user = currentUser,
        $view = $('#profile-update'),
        validate = layui.validate;

    form.verify(validate);
    form.render();

    initUserValue();

    treeSelect.render({
        elem: $view.find('#profile-update-dept'),
        type: 'get',
        data: ctx + 'dept/select/tree',
        placeholder: '请选择',
        search: false,
        success: function () {
            treeSelect.checkNode('profile-update-dept', user.deptId);
        }
    });

    function initUserValue() {
        form.val("profile-update-form", {
            "username": user.username,
            "mobile": user.mobile,
            "email": user.email,
            "sex": user.sex,
            "description": user.description
        });
    }

    form.on('submit(profile-update-form-submit)', function (data) {
        if (febs.nativeEqual(data.field, user)) {
            febs.alert.warn('数据未作任何修改！');
            return false;
        }
        febs.post(ctx + 'user/profile/update', data.field, function () {
            layer.closeAll();
            febs.modal.confirm('修改成功', '是否马上刷新页面生效？', function () {
                window.location.reload();
            });
        });
        return false;
    });
});