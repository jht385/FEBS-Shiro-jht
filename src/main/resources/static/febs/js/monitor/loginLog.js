layui.use(['jquery', 'laydate', 'form', 'table', 'febs', 'dropdown'], function () {
    var $ = layui.jquery,
        laydate = layui.laydate,
        febs = layui.febs,
        form = layui.form,
        table = layui.table,
        dropdown = layui.dropdown,
        $view = $('#febs-login-log'),
        $query = $view.find('#query'),
        $reset = $view.find('#reset'),
        $searchForm = $view.find('form'),
        sortObject = {field: 'loginTime', type: null},
        tableIns,
        createTimeFrom,
        createTimeTo;

    laydate.render({
        elem: '#login-log-createTime',
        range: true,
        trigger: 'click'
    });

    form.render();

    initTable();

    dropdown.render({
        elem: $view.find('.action-more'),
        click: function (name, elem, event) {
            if (name === 'delete') {
                var checkStatus = table.checkStatus('loginLogTable');
                if (!checkStatus.data.length) {
                    febs.alert.warn('请勾选需要删除的日志');
                } else {
                    febs.modal.confirm('删除日志', '确定删除所选日志？', function () {
                        var logIds = [];
                        layui.each(checkStatus.data, function (key, item) {
                            logIds.push(item.id)
                        });
                        deleteLogs(logIds.join(','))
                    });
                }
            }
            if (name === 'export') {
                var params = $.extend(getQueryParams(), {field: sortObject.field, order: sortObject.type});
                params.pageSize = $view.find(".layui-laypage-limits option:selected").val();
                params.pageNum = $view.find(".layui-laypage-em").next().html();
                febs.download(ctx + 'loginLog/excel', params, '登录日志表.xlsx');
            }
        },
        options: [ {
            name: 'delete',
            title: '删除日志',
            perms: 'loginlog:delete'
        }, {
            name: 'export',
            title: '导出Excel',
            perms: 'loginlog:export'
        }]
    });

    table.on('tool(loginLogTable)', function (obj) {
        var data = obj.data,
            layEvent = obj.event;
        if (layEvent === 'del') {
            febs.modal.confirm('删除日志', '确定删除该条登录日志？', function () {
                deleteLogs(data.id);
            });
        }
    });

    table.on('sort(loginLogTable)', function (obj) {
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
        sortObject.type = 'null';
        createTimeTo = null;
        createTimeFrom = null;
        tableIns.reload({where: getQueryParams(), page: {curr: 1}, initSort: sortObject});
    });

    function initTable() {
        tableIns = febs.table.init({
            elem: $view.find('table'),
            id: 'loginLogTable',
            url: ctx + 'loginLog/list',
            cols: [[
                {type: 'checkbox'},
                {field: 'username', title: '登录用户'},
                {field: 'ip', title: 'IP地址'},
                {field: 'location', title: '登录地点', minWidth: 180},
                {field: 'loginTime', title: '登录时间', minWidth: 180, sort: true},
                {field: 'system', title: '登录系统'},
                {field: 'browser', title: '浏览器'},
                {title: '操作', toolbar: '#login-log-option'}
            ]]
        });
    }

    function deleteLogs(logIds) {
        febs.get(ctx + 'loginLog/delete/' + logIds, null, function () {
            febs.alert.success('删除登录日志成功');
            $query.click();
        });
    }

    function getQueryParams() {
    	var params = $searchForm.serializeJson();
        var createTime = params.time;
        if (createTime) {
            createTimeFrom = createTime.split(' - ')[0];
            createTimeTo = createTime.split(' - ')[1];
        }
        params.invalidate_ie_cache = new Date();
        params.loginTimeFrom = createTimeFrom;
        params.loginTimeTo = createTimeTo;
        return params;
    }
})