layui.use(['febs', 'form', 'xmSelect', 'validate'], function () {
    let $ = layui.jquery,
        febs = layui.febs,
        layer = layui.layer,
        form = layui.form,
        xmSelect = layui.xmSelect,
        validate = layui.validate,
        dataPermissionXmlSelect,
        roleXmSelect,
        deptXmlSelect;

    form.verify(validate);
    form.render();

    initUserValue();
    
    deptXmlSelect = xmSelect.render({
        el: '#user-update-dept',
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

    dataPermissionXmlSelect = xmSelect.render({
        el: '#user-update-data-permission',
        model: {label: {type: 'text'}},
        tree: {
            show: true,
            strict: false,
            showLine: false,
            clickCheck: true,
            expandedKeys: [-1],
        },
        name: 'deptIds',
        theme: {
            color: '#52c41a',
        },
        prop: {
            value: 'id'
        },
        height: 'auto'
    });

    febs.get(ctx + 'dept/select/tree', null, function (data) {
        deptXmlSelect.update(data)
        dataPermissionXmlSelect.update(data)
        user.deptId && deptXmlSelect.setValue([user.deptId]);
        user.deptIds && dataPermissionXmlSelect.setValue(user.deptIds.split(","));
    });

    roleXmSelect = xmSelect.render({
        el: '#user-update-role',
        toolbar: {show: true},
        name: 'roleId',
        theme: {
            color: '#32c787',
        },
        prop: {
            name: 'roleName',
            value: 'roleId'
        },
        data: []
    });

    febs.get(ctx + 'role', null, function (data) {
        roleXmSelect.update({
            data: data.data,
            autoRow: true,
        })
        roleXmSelect.setValue(user.roleId.split(','));
    });

    function initUserValue() {
        form.val("user-update-form", {
            "username": user.username,
            "mobile": user.mobile,
            "email": user.email,
            "status": user.status,
            "sex": user.sex,
            "description": user.description
        });
    }

    form.on('submit(user-update-form-submit)', function (data) {
    	if (!data.field.roleId) {
            febs.alert.warn('请选择用户角色');
            return false;
        }
        if (febs.nativeEqual(data.field, user)) {
            febs.alert.warn('数据未作任何修改！');
            return false;
        }
        febs.post(ctx + 'user/update', data.field, function () {
            layer.closeAll();
            febs.alert.success(user.username + ' 用户数据修改成功');
            $('#febs-user').find('#query').click();
        });
        return false;
    });
});