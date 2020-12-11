layui.use(['dropdown', 'jquery', 'form', 'table', 'febs'], function () {
    let $ = layui.jquery,
        laydate = layui.laydate,
        febs = layui.febs,
        form = layui.form,
        table = layui.table,
        dropdown = layui.dropdown,
        $view = $('#febs-job-log'),
        $query = $view.find('#query'),
        $reset = $view.find('#reset'),
        $searchForm = $view.find('form'),
        sortObject = {field: 'createTime', type: null},
        tableIns;

    form.render();
    initTable();

    dropdown.render({
        elem: $view.find('.action-more'),
        click: function (name, elem, event) {
            let checkStatus = table.checkStatus('jobLogTable');
            if (name === 'delete') {
                if (!checkStatus.data.length) {
                    febs.alert.warn('请选择需要删除的调度日志');
                } else {
                    febs.modal.confirm('删除日志', '确定删除该调度日志？', function () {
                        let jobLogIds = [];
                        layui.each(checkStatus.data, function (key, item) {
                            jobLogIds.push(item.logId)
                        });
                        deleteJobsLogs(jobLogIds.join(','));
                    });
                }
            }
            if (name === 'export') {
                let params = $.extend(getQueryParams(), {field: sortObject.field, order: sortObject.type});
                params.pageSize = $view.find(".layui-laypage-limits option:selected").val();
                params.pageNum = $view.find(".layui-laypage-em").next().html();
                febs.download(ctx + 'jobLog/excel', params, '调度日志表.xlsx');
            }
        },
        options: [{
            name: 'delete',
            title: '删除日志',
            perms: 'job:log:delete'
        }, {
            name: 'export',
            title: '导出Excel',
            perms: 'job:log:export'
        }]
    });

    $query.on('click', function () {
        let params = $.extend(getQueryParams(), {field: sortObject.field, order: sortObject.type});
        tableIns.reload({where: params, page: {curr: 1}});
    });

    $reset.on('click', function () {
        $searchForm[0].reset();
        sortObject.type = 'null';
        tableIns.reload({where: getQueryParams(), page: {curr: 1}, initSort: sortObject});
    });

    table.on('tool(jobLogTable)', function (obj) {
        let data = obj.data,
            layEvent = obj.event;
        if (layEvent === 'del') {
            febs.modal.confirm('删除调度日志', '确定删除调度日志？', function () {
                deleteJobsLogs(data.logId);
            });
        }
    });

    table.on('sort(jobLogTable)', function (obj) {
        sortObject = obj;
        tableIns.reload({
            initSort: obj,
            where: $.extend(getQueryParams(), {
                field: obj.field,
                order: obj.type
            })
        });
    });

    function deleteJobsLogs(jobLogIds) {
        febs.get(ctx + 'jobLog/delete/' + jobLogIds, null, function () {
            febs.alert.success('删除调度日志成功');
            $query.click();
        });
    }

    function initTable() {
        tableIns = febs.table.init({
            elem: $view.find('table'),
            id: 'jobLogTable',
            url: ctx + 'jobLog',
            cols: [[
                {type: 'checkbox'},
                {field: 'jobId', title: '任务ID', width: 80},
                {field: 'beanName', title: 'Bean名称'},
                {field: 'methodName', title: '方法名称', maxWidth: 200},
                {field: 'params', title: '方法参数', maxWidth: 180},
                {title: '状态', templet: '#jobLog-status'},
                {field: 'error', title: '异常信息', maxWidth: 200},
                {title: '耗时', templet: '#jobLog-times'},
                {field: 'createTime', title: '执行时间', minWidth: 180, sort: true},
                {title: '操作', toolbar: '#jobLog-option', minWidth: 140}
            ]]
        });
    }

    function getQueryParams() {
    	let params = $searchForm.serializeJson();
        params.invalidate_ie_cache = new Date();
        return params;
    }
})