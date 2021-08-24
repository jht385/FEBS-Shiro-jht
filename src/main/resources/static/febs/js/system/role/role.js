layui.use(['dropdownMenu', 'jquery', 'laydate', 'febs', 'form', 'eleTree', 'table', 'validate'], function () {
    let $ = layui.jquery,
        laydate = layui.laydate,
        febs = layui.febs,
        form = layui.form,
        table = layui.table,
        eleTree = layui.eleTree,
        dropdownMenu = layui.dropdownMenu,
        validate = layui.validate,
        $view = $('#febs-role'),
        $query = $view.find('#query'),
        $reset = $view.find('#reset'),
        $submit = $view.find('#submit'),
        $searchForm = $view.find('#role-table-form'),
        $header = $view.find('#form-header'),
        tableIns;

    form.verify(validate);
    form.render();

    initTable();

    laydate.render({
        elem: '#createTime',
        range: true
    });

    let menuTree = eleTree.render({
        elem: '.menu-tree',
        url: ctx + 'menu/tree',
        showCheckbox: true,
        where: {
            "invalidate_ie_cache": new Date()
        },
        accordion: true,
        checkStrictly: true,
        renderAfterExpand: false,
        request: {
            name: "title",
            key: "id",
            children: "childs",
            checked: "checked",
            data: "data"
        },
        response: {
            statusName: "code",
            statusCode: 200,
            dataName: "data"
        }
    });

    dropdownMenu.render({
        elem: $view.find('.action-more'),
        click: function (name, elem, event) {
            let checkStatus = table.checkStatus('roleTable');
            if (name === 'add') {
                resetRoleForm();
                febs.alert.info("请在表单中填写相关信息");
            }
            if (name === 'delete') {
                if (!checkStatus.data.length) {
                    febs.alert.warn('请选择需要删除的角色');
                } else {
                    febs.modal.confirm('删除角色', '确定删除所选角色？', function () {
                        let roleIds = [];
                        layui.each(checkStatus.data, function (key, item) {
                            roleIds.push(item.roleId);
                        });
                        deleteRoles(roleIds.join(','));
                    });
                }
            }
            if (name === 'export') {
                let params = getQueryParams();
                params.pageSize = $view.find(".layui-laypage-limits option:selected").val();
                params.pageNum = $view.find(".layui-laypage-em").next().html();
                febs.download(ctx + 'role/excel', params, '角色信息表.xlsx');
            }
        },
        options: [
        	{ name: 'add', title: '新增角色', perms: 'role:add' },
        	{ name: 'delete', title: '删除角色', perms: 'role:delete' },
        	{ name: 'export', title: '导出Excel', perms: 'role:export' }
        ]
    });

    table.on('tool(roleTable)', function (obj) {
        let data = obj.data,
            layEvent = obj.event;
        if (layEvent === 'edit') {
            $header.text('修改角色');
            form.val("role-form", {
                "roleId": data.roleId,
                "roleName": data.roleName,
                "remark": data.remark
            });
            if (data.menuIds) {
                menuTree.setChecked(data.menuIds.split(','), true);
            } else {
                menuTree.setChecked([], true);
            }
        }
        if (layEvent === 'del') {
            febs.modal.confirm('删除角色', '确定删除该角色？', function () {
                deleteRoles(data.roleId);
            });
        }
    });

    $query.on('click', function () {
        resetRoleForm();
        tableIns.reload({where: getQueryParams(), page: {curr: 1}});
    });

    $reset.on('click', function () {
        resetRoleForm();
        $searchForm[0].reset();
        tableIns.reload({where: getQueryParams(), page: {curr: 1}});
    });

    $submit.on('click', function () {
        $view.find('#submit-form').trigger('click');
    });

    function initTable() {
        tableIns = febs.table.init({
            elem: $view.find('table'),
            id: 'roleTable',
            url: ctx + 'role/list',
            cols: [[
                {type: 'checkbox'},
                {field: 'roleName', title: '角色名称', minWidth: 120},
                {field: 'remark', title: '角色描述'},
                {field: 'createTime', title: '创建时间', minWidth: 180},
                {title: '操作', toolbar: '#role-option', width: 100}
            ]]
        });
    }

    function getQueryParams() {
    	let params = $searchForm.serializeJson();
        params.invalidate_ie_cache = new Date();
        return params;
    }

    function resetRoleForm() {
        $view.find('#reset-form').trigger('click');
        $header.text('新增角色');
        menuTree.setChecked([], true);
        menuTree.unExpandAll();
    }

    form.on('submit(role-form-submit)', function (data) {
        let selected = menuTree.getChecked(false, true);
        let menuIds = [];
        layui.each(selected, function (key, item) {
            menuIds.push(item.id)
        });
        data.field.menuIds = menuIds.join(',');
        if (!menuIds.length) {
            febs.modal.confirm('提示', '当前角色未授予任何权限，是否继续？', function () {
                addOrUpdateRole(data.field);
            });
        } else {
            addOrUpdateRole(data.field);
        }
        return false;
    });

    function deleteRoles(roleIds) {
        febs.get(ctx + 'role/delete/' + roleIds, null, function () {
            febs.alert.success('删除角色成功');
            $query.trigger('click');
        })
    }

    let addOrUpdateRole = function (data) {
        if (data.roleId && $header.text() === '修改角色') {
            febs.post(ctx + 'role/update', data, function () {
                febs.alert.success('修改角色成功');
                $query.trigger('click');
            });
        } else {
            febs.post(ctx + 'role', data, function () {
                febs.alert.success('新增角色成功');
                $query.trigger('click');
            });
        }
    }
});