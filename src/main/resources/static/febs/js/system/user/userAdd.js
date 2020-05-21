layui.use(['febs', 'form', 'formSelects', 'validate', 'treeSelect', 'eleTree'], function () {
    var $ = layui.$,
        febs = layui.febs,
        layer = layui.layer,
        formSelects = layui.formSelects,
        treeSelect = layui.treeSelect,
        form = layui.form,
        eleTree = layui.eleTree,
        $view = $('#user-add'),
        validate = layui.validate,
        _deptTree;

    form.verify(validate);
    form.render();

    formSelects.render();
    renderDeptTree();

    treeSelect.render({
        elem: $view.find('#user-add-dept'),
        type: 'get',
        data: ctx + 'dept/select/tree',
        placeholder: '请选择',
        search: false
    });
    
    function renderDeptTree() {
        _deptTree = eleTree.render({
            elem: $view.find('.data-permission-tree'),
            url: ctx + 'dept/tree',
            accordion: true,
            highlightCurrent: true,
            showCheckbox: true,
            checkStrictly: true,
            renderAfterExpand: false,
            request: {
                name: 'name',
                key: "id",
                checked: "checked",
                data: 'data'
            },
            response: {
                statusName: "code",
                statusCode: 200,
                dataName: "data"
            }
        });
        return _deptTree;
    }

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
    	var checked = _deptTree.getChecked(false, true);
        var deptIds = [];
        layui.each(checked, function (key, item) {
            deptIds.push(item.id)
        });
        data.deptIds = deptIds.join(",");
        febs.post(ctx + 'user', data.field, function () {
            layer.closeAll();
            febs.alert.success('新增用户成功，初始密码为 1234qwer');
            $('#febs-user').find('#query').click();
        });
        return false;
    });
});