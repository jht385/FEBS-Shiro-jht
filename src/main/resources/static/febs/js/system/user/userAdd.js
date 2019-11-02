layui.use(['febs', 'form', 'formSelects', 'validate', 'treeSelect'], function () {
    var $ = layui.$,
        febs = layui.febs,
        layer = layui.layer,
        formSelects = layui.formSelects,
        treeSelect = layui.treeSelect,
        form = layui.form,
        $view = $('#user-add'),
        validate = layui.validate;

    form.verify(validate);
    form.render();

    formSelects.render();

    treeSelect.render({
        elem: $view.find('#user-add-dept'),
        type: 'get',
        data: ctx + 'dept/select/tree',
        placeholder: '请选择',
        search: false
    });

    formSelects.config('user-add-role', {
        searchUrl: ctx + 'role',
        response: {
            statusCode: 200
        },
        beforeSuccess: function (id, url, searchVal, result) {
            var data = result.data;
            var tranData = [];
            for (var i = 0; i < data.length; i++) {
                tranData.push({
                    name: data[i].roleName,
                    value: data[i].roleId
                })
            }
            result.data = tranData;
            return result;
        },
        error: function (id, url, searchVal, err) {
            console.error(err);
            febs.alert.error('获取角色列表失败');
        }
    });

    form.on('submit(user-add-form-submit)', function (data) {
        febs.post(ctx + 'user', data.field, function () {
            layer.closeAll();
            febs.alert.success('新增用户成功，初始密码为 1234qwer');
            $('#febs-user').find('#query').click();
        });
        return false;
    });
});