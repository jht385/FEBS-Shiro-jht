layui.use(['jquery', 'febs', 'form', 'formSelects', 'validate', 'treeSelect'], function () {
    var $ = layui.jquery,
        febs = layui.febs,
        layer = layui.layer,
        formSelects = layui.formSelects,
        treeSelect = layui.treeSelect,
        form = layui.form,
        validate = layui.validate;
    $view = $('#user-update');

    form.verify(validate);
    form.render();
debugger;
    initUserValue();

    formSelects.render();

    treeSelect.render({
        elem: $view.find('#user-update-dept'),
        type: 'get',
        data: ctx + 'dept/select/tree',
        placeholder: '请选择',
        search: false,
        success: function () {
            treeSelect.checkNode('user-update-dept', user.deptId);
        }
    });

    formSelects.config('user-update-role', {
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
        success: function () {
            formSelects.value('user-update-role', user.roleId.split(','));
        },
        error: function (id, url, searchVal, err) {
            console.error(err);
            febs.alert.error('获取角色列表失败');
        }
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