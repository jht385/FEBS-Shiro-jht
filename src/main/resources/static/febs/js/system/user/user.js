layui.use(['dropdown', 'jquery', 'laydate', 'form', 'table', 'febs', 'treeSelect'], function () {
    var $ = layui.jquery,
        laydate = layui.laydate,
        febs = layui.febs,
        form = layui.form,
        table = layui.table,
        treeSelect = layui.treeSelect,
        dropdown = layui.dropdown,
        $view = $('#febs-user'),
        $query = $view.find('#query'),
        $reset = $view.find('#reset'),
        $searchForm = $view.find('form'),
        sortObject = {field: 'createTime', type: null},
        tableIns;

    form.render();

    initTable();

    laydate.render({
        elem: '#createTime',
        range: true,
        trigger: 'click'
    });

    dropdown.render({
        elem: $view.find('.action-more'),
        click: function (name, elem, event) {
            var checkStatus = table.checkStatus('userTable');
            if (name === 'add') {
                febs.modal.open('新增用户', 'system/user/add', {
                    btn: ['提交', '重置'],
                    area: $(window).width() <= 750 ? '95%' : '50%',
                    yes: function (index, layero) {
                        $('#user-add').find('#submit').trigger('click');
                    },
                    btn2: function () {
                        $('#user-add').find('#reset').trigger('click');
                        return false;
                    }
                });
            }
            if (name === 'delete') {
                if (!checkStatus.data.length) {
                    febs.alert.warn('请选择需要删除的用户');
                } else {
                    febs.modal.confirm('删除用户', '确定删除该用户？', function () {
                        var userIds = [];
                        layui.each(checkStatus.data, function (key, item) {
                            userIds.push(item.userId)
                        });
                        deleteUsers(userIds.join(','));
                    });
                }
            }
            if (name === 'reset') {
                if (!checkStatus.data.length) {
                    febs.alert.warn('请选择需要重置密码的用户');
                } else {
                    var usernames = [];
                    layui.each(checkStatus.data, function (key, item) {
                        usernames.push(item.username)
                    });
                    febs.post(ctx + 'user/password/reset/' + usernames.join(','), null, function () {
                        febs.alert.success('所选用户密码已重置为1234qwer');
                    });
                }
            }
            if (name === 'export') {
                var params = $.extend(getQueryParams(), {field: sortObject.field, order: sortObject.type});
                params.pageSize = $view.find(".layui-laypage-limits option:selected").val();
                params.pageNum = $view.find(".layui-laypage-em").next().html();
                febs.download(ctx + 'user/excel', params, '用户信息表.xlsx');
            }
        },
        options: [{
            name: 'add',
            title: '新增用户',
            perms: 'user:add'
        }, {
            name: 'delete',
            title: '删除用户',
            perms: 'user:delete'
        }, {
            name: 'reset',
            title: '密码重置',
            perms: 'user:password:reset'
        }, {
            name: 'export',
            title: '导出Excel',
            perms: 'user:export'
        }]
    });

    treeSelect.render({
        elem: $view.find('#dept'),
        type: 'get',
        data: ctx + 'dept/select/tree',
        placeholder: '请选择',
        search: false
    });

    table.on('tool(userTable)', function (obj) {
        var data = obj.data,
            layEvent = obj.event;
        if (layEvent === 'detail') {
            febs.modal.view('用户信息', 'system/user/detail/' + data.username, {
                area: $(window).width() <= 750 ? '95%' : '660px'
            });
        }
        if (layEvent === 'del') {
            febs.modal.confirm('删除用户', '确定删除该用户？', function () {
                deleteUsers(data.userId);
            });
        }
        if (layEvent === 'edit') {
            febs.modal.open('修改用户', 'system/user/update/' + data.username, {
                area: $(window).width() <= 750 ? '90%' : '50%',
                btn: ['提交', '取消'],
                yes: function (index, layero) {
                    $('#user-update').find('#submit').trigger('click');
                },
                btn2: function () {
                    layer.closeAll();
                }
            });
        }
    });

    table.on('sort(userTable)', function (obj) {
        sortObject = obj;
        tableIns.reload({
            initSort: obj,
            where: $.extend(getQueryParams(), {
                field: obj.field,
                order: obj.type
            })
        });
    });

    $query.on('click', function () {
        var params = $.extend(getQueryParams(), {field: sortObject.field, order: sortObject.type});
        tableIns.reload({where: params, page: {curr: 1}});
    });

    $reset.on('click', function () {
        $searchForm[0].reset();
        treeSelect.revokeNode('dept');
        sortObject.type = 'null';
        tableIns.reload({where: getQueryParams(), page: {curr: 1}, initSort: sortObject});
    });

    function initTable() {
        tableIns = febs.table.init({
            elem: $view.find('table'),
            id: 'userTable',
            url: ctx + 'user/list',
            cols: [[
                {type: 'checkbox'},
                {field: 'username', title: '用户名', minWidth: 100},
                {title: '性别', templet: '#user-sex'},
                {field: 'deptName', title: '部门'},
                {field: 'mobile', title: '手机', minWidth: 165},
                {field: 'email', title: '邮箱', minWidth: 180},
                {title: '状态', templet: '#user-status'},
                {field: 'createTime', title: '创建时间', minWidth: 180, sort: true},
                {title: '操作', toolbar: '#user-option', minWidth: 140}
            ]]
        });
    }

    function getQueryParams() {
        var createTimeFrom,
            createTimeTo,
            createTime = $searchForm.find('input[name="createTime"]').val();
        if (createTime) {
            createTimeFrom = createTime.split(' - ')[0];
            createTimeTo = createTime.split(' - ')[1];
        }
        return {
            createTimeFrom: createTimeFrom,
            createTimeTo: createTimeTo,
            username: $searchForm.find('input[name="username"]').val().trim(),
            status: $searchForm.find("select[name='status']").val(),
            sex: $searchForm.find("select[name='sex']").val(),
            mobile: $searchForm.find("input[name='mobile']").val().trim(),
            deptId: $searchForm.find("input[name='dept']").val().trim(),
            invalidate_ie_cache: new Date()
        };
    }

    function deleteUsers(userIds) {
        var currentUserId = currentUser.userId + '';
        if (('' + userIds).split(',').indexOf(currentUserId) !== -1) {
            febs.alert.warn('所选用户包含当前登录用户，无法删除');
            return;
        }
        febs.get(ctx + 'user/delete/' + userIds, null, function () {
            febs.alert.success('删除用户成功');
            $query.click();
        });
    }
})