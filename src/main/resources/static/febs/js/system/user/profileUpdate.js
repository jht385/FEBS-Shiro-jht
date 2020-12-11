layui.use(['febs', 'form', 'validate', 'xmSelect'], function () {
    let $ = layui.$,
        febs = layui.febs,
        layer = layui.layer,
        xmSelect = layui.xmSelect,
        form = layui.form,
        user = currentUser,
        validate = layui.validate,
        deptXmlSelect;

    form.verify(validate);
    form.render();

    initUserValue();

    deptXmlSelect = xmSelect.render({
        el: '#profile-update-dept',
        model: {label: {type: 'text'}},
        tree: {
            show: true,
            strict: false,
            showLine: false,
            clickCheck: true,
            expandedKeys: [-1],
        },
        name: 'deptId',
        theme: {
            color: '#52c41a',
        },
        prop: {
            value: 'id'
        },
        height: 'auto',
        on: function (data) {
            if (data.isAdd) {
                return data.change.slice(0, 1)
            }
        }
    });
    
    febs.get(ctx + 'dept/select/tree', null, function (data) {
        deptXmlSelect.update(data);
        user.deptId && deptXmlSelect.setValue([user.deptId]);
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