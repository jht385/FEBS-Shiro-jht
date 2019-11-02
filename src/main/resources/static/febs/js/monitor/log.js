layui.use(['jquery', 'laydate', 'form', 'table', 'febs', 'dropdown'], function () {
    var $ = layui.jquery,
        laydate = layui.laydate,
        febs = layui.febs,
        form = layui.form,
        table = layui.table,
        dropdown = layui.dropdown,
        $view = $('#febs-log'),
        $query = $view.find('#query'),
        $reset = $view.find('#reset'),
        $delete = $view.find('#delete'),
        $searchForm = $view.find('form'),
        sortObject = {field: 'time', type: null},
        tableIns;

    laydate.render({
        elem: '#createTime',
        range: true,
        trigger: 'click'
    });

    form.render();
    initTable();

    dropdown.render({
        elem: $view.find('.action-more'),
        click: function (name, elem, event) {
            if (name === 'delete') {
                var checkStatus = table.checkStatus('logTable');
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
                febs.download(ctx + 'log/excel', params, '系统日志表.xlsx');
            }
        },
        options: [{
            name: 'delete',
            title: '删除日志',
            perms: 'log:delete'
        }, {
            name: 'export',
            title: '导出Excel',
            perms: 'log:export'
        }]
    });

    table.on('tool(logTable)', function (obj) {
        var data = obj.data,
            layEvent = obj.event;
        if (layEvent === 'del') {
            febs.modal.confirm('删除日志', '确定删除该条系统日志？', function () {
                deleteLogs(data.id);
            });
        }
    });

    table.on('sort(logTable)', function (obj) {
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
        tableIns.reload({where: getQueryParams(), page: {curr: 1}, initSort: sortObject});
    });

    function initTable() {
        tableIns = febs.table.init({
            elem: $view.find('table'),
            id: 'logTable',
            url: ctx + 'log/list',
            cols: [[
                {type: 'checkbox'},
                {field: 'username', title: '操作人'},
                {field: 'operation', title: '操作描述'},
                {field: 'time', title: '耗时', templet: "#log-time", sort: true},
                {field: 'method', title: '操作方法'},
                {field: 'params', title: '方法参数'},
                {field: 'ip', title: 'IP地址'},
                {field: 'location', title: '操作地点'},
                {field: 'createTime', title: '创建时间', minWidth: 180, sort: true},
                {title: '操作', toolbar: '#log-option'}
            ]]
        });
    }

    function deleteLogs(logIds) {
        febs.get(ctx + 'log/delete/' + logIds, null, function () {
            febs.alert.success('删除系统日志成功');
            $query.click();
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
            operation: $searchForm.find('input[name="operation"]').val().trim(),
            invalidate_ie_cache: new Date()
        };
    }
})