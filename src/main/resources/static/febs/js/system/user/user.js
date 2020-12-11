layui.use(['dropdown', 'jquery', 'laydate', 'form', 'table', 'febs', 'xmSelect'], function () {
    let $ = layui.jquery,
        laydate = layui.laydate,
        febs = layui.febs,
        form = layui.form,
        table = layui.table,
        dropdown = layui.dropdown,
        $view = $('#febs-user'),
        $query = $view.find('#query'),
        $reset = $view.find('#reset'),
        $searchForm = $view.find('form'),
        sortObject = {field: 'createTime', type: null},
        tableIns,
        createTimeFrom,
        createTimeTo,
        deptXmlSelect;

    form.render();

    initTable();

    laydate.render({
        elem: '#user-createTime',
        range: true,
        trigger: 'click'
    });

    dropdown.render({
        elem: $view.find('.action-more'),
        click: function (name, elem, event) {
            let checkStatus = table.checkStatus('userTable');
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
                        let userIds = [];
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
                    let usernames = [];
                    layui.each(checkStatus.data, function (key, item) {
                        usernames.push(item.username)
                    });
                    febs.post(ctx + 'user/password/reset/' + usernames.join(','), null, function () {
                        febs.alert.success('所选用户密码已重置为1234qwer');
                    });
                }
            }
            if (name === 'export') {
                let params = $.extend(getQueryParams(), {field: sortObject.field, order: sortObject.type});
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

    deptXmlSelect = xmSelect.render({
        el: '#dept',
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
        on: function(data){
            if(data.isAdd){
                return data.change.slice(0, 1)
            }
        }
    });

    febs.get(ctx + 'dept/select/tree', null, function (data) {
        deptXmlSelect.update(
            data
        )
    });

    table.on('tool(userTable)', function (obj) {
        let data = obj.data,
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
        let params = $.extend(getQueryParams(), {field: sortObject.field, order: sortObject.type});
        tableIns.reload({where: params, page: {curr: 1}});
    });

    $reset.on('click', function () {
        $searchForm[0].reset();
        sortObject.type = 'null';
        deptXmlSelect.setValue(['']);
        createTimeTo = null;
        createTimeFrom = null;
        tableIns.reload({where: getQueryParams(true), page: {curr: 1}, initSort: sortObject});
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

    function getQueryParams(flag) {
        deptId = deptXmlSelect.getValue('valueStr');
        if (flag) {
            deptId = '';
        }
    	let params = $searchForm.serializeJson();
    	params.deptId = deptId;
        let createTime = params.time;
        if (createTime) {
            createTimeFrom = createTime.split(' - ')[0];
            createTimeTo = createTime.split(' - ')[1];
        }
        params.invalidate_ie_cache = new Date();
        params.createTimeFrom = createTimeFrom;
        params.createTimeTo = createTimeTo;
        return params;
    }

    function deleteUsers(userIds) {
        let currentUserId = currentUser.userId + '';
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