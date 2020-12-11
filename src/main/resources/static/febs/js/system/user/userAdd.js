layui.use(['febs', 'form', 'validate', 'xmSelect'], function () {
    let $ = layui.$,
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

    deptXmlSelect = xmSelect.render({
        el: '#user-add-dept',
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
        el: '#user-add-data-permission',
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
    });

    roleXmSelect = xmSelect.render({
        el: '#user-add-role',
        toolbar: {show: true},
        name: 'roleId',
        theme: {
            color: '#52c41a',
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
    });

    form.on('submit(user-add-form-submit)', function (data) {
    	if (!data.field.roleId) {
            febs.alert.warn('请选择用户角色');
            return false;
        }
        febs.post(ctx + 'user', data.field, function () {
            layer.closeAll();
            febs.alert.success('新增用户成功，初始密码为 1234qwer');
            $('#febs-user').find('#query').click();
        });
        return false;
    });
});