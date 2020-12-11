layui.use(['dropdown', 'jquery', 'laydate', 'form', 'table', 'febs'], function () {
    let $ = layui.jquery,
        laydate = layui.laydate,
        febs = layui.febs,
        form = layui.form,
        table = layui.table,
        dropdown = layui.dropdown,
        $view = $('#febs-job'),
        $query = $view.find('#query'),
        $reset = $view.find('#reset'),
        $searchForm = $view.find('form'),
        sortObject = {field: 'createTime', type: null},
        tableIns;

    form.render();
    initTable();

    $query.on('click', function () {
        let params = $.extend(getQueryParams(), {field: sortObject.field, order: sortObject.type});
        tableIns.reload({where: params, page: {curr: 1}});
    });

    $reset.on('click', function () {
        $searchForm[0].reset();
        sortObject.type = 'null';
        tableIns.reload({where: getQueryParams(), page: {curr: 1}, initSort: sortObject});
    });

    dropdown.render({
        elem: $view.find('.action-more'),
        click: function (name, elem, event) {
            let checkStatus = table.checkStatus('jobTable');
            if (name === 'add') {
                febs.modal.open('新增任务', 'job/job/add', {
                    btn: ['提交', '重置'],
                    area: $(window).width() <= 750 ? '95%' : '50%',
                    yes: function (index, layero) {
                        $('#job-add').find('#submit').trigger('click');
                    },
                    btn2: function () {
                        $('#job-add').find('#reset').trigger('click');
                        return false;
                    }
                });
            }
            if (name === 'delete') {
                if (!checkStatus.data.length) {
                    febs.alert.warn('请勾选需要删除的任务');
                } else {
                    febs.modal.confirm('删除任务', '确定删除所选任务？', function () {
                        let jobIds = [];
                        layui.each(checkStatus.data, function (key, item) {
                            jobIds.push(item.jobId)
                        });
                        deleteJobs(jobIds.join(','))
                    });
                }
            }
            if (name === 'pause') {
                if (!checkStatus.data.length) {
                    febs.alert.warn('请勾选需要暂停的任务');
                } else {
                    febs.modal.confirm('暂停任务', '确定暂停所选任务？', function () {
                        let jobIds = [];
                        layui.each(checkStatus.data, function (key, item) {
                            jobIds.push(item.jobId)
                        });
                        febs.get(ctx + 'job/pause/' + jobIds.join(','), null, function () {
                            febs.alert.success('暂停任务成功');
                            $query.click();
                        })
                    });
                }
            }
            if (name === 'resume') {
                if (!checkStatus.data.length) {
                    febs.alert.warn('请勾选需要恢复的任务');
                } else {
                    febs.modal.confirm('恢复任务', '确定恢复所选任务？', function () {
                        let jobIds = [];
                        layui.each(checkStatus.data, function (key, item) {
                            jobIds.push(item.jobId)
                        });
                        febs.get(ctx + 'job/resume/' + jobIds.join(','), null, function () {
                            febs.alert.success('恢复任务成功');
                            $query.click();
                        })
                    });
                }
            }
            if (name === 'run') {
                if (!checkStatus.data.length) {
                    febs.alert.warn('请勾选需要执行的任务');
                } else {
                    febs.modal.confirm('执行任务', '确定执行所选任务？', function () {
                        let jobIds = [];
                        layui.each(checkStatus.data, function (key, item) {
                            jobIds.push(item.jobId)
                        });
                        febs.get(ctx + 'job/run/' + jobIds.join(','), null, function () {
                            febs.alert.success('执行任务成功');
                            $query.click();
                        })
                    });
                }
            }
            if (name === 'export') {
                let params = $.extend(getQueryParams(), {field: sortObject.field, order: sortObject.type});
                params.pageSize = $view.find(".layui-laypage-limits option:selected").val();
                params.pageNum = $view.find(".layui-laypage-em").next().html();
                febs.download(ctx + 'job/excel', params, '任务表.xlsx');
            }
        },
        options: [{
            name: 'add',
            title: '新增任务',
            perms: 'job:add'
        }, {
            name: 'delete',
            title: '删除任务',
            perms: 'job:delete'
        }, {
            name: 'pause',
            title: '暂停任务',
            perms: 'job:pause'
        }, {
            name: 'resume',
            title: '恢复任务',
            perms: 'job:resume'
        }, {
            name: 'run',
            title: '执行任务',
            perms: 'job:run'
        }, {
            name: 'export',
            title: '导出Excel',
            perms: 'job:export'
        }]
    });

    table.on('tool(jobTable)', function (obj) {
        let data = obj.data,
            layEvent = obj.event;
        if (layEvent === 'del') {
            febs.modal.confirm('删除任务', '确定删除该任务？', function () {
                deleteJobs(data.jobId);
            });
        }
        if (layEvent === 'edit') {
            febs.modal.open('修改任务', 'job/job/update/' + data.jobId, {
                area: $(window).width() <= 750 ? '90%' : '50%',
                btn: ['提交', '取消'],
                yes: function (index, layero) {
                    $('#job-update').find('#submit').trigger('click');
                },
                btn2: function () {
                    layer.closeAll();
                }
            });
        }
    });

    table.on('sort(jobTable)', function (obj) {
        sortObject = obj;
        tableIns.reload({
            initSort: obj,
            where: $.extend(getQueryParams(), {
                field: obj.field,
                order: obj.type
            })
        });
    });

    function initTable() {
        tableIns = febs.table.init({
            elem: $view.find('table'),
            id: 'jobTable',
            url: ctx + 'job',
            cols: [[
                {type: 'checkbox'},
                {field: 'jobId', title: '任务ID', width: 80},
                {field: 'beanName', title: 'Bean名称'},
                {field: 'methodName', title: '方法名称', maxWidth: 200},
                {field: 'params', title: '方法参数', maxWidth: 180},
                {field: 'cronExpression', title: 'cron表达式', maxWidth: 180},
                {field: 'remark', title: '备注', maxWidth: 200},
                {field: 'createTime', title: '创建时间', minWidth: 180, sort: true},
                {title: '状态', templet: '#job-status'},
                {title: '操作', toolbar: '#job-option', minWidth: 140}
            ]]
        });
    }

    function deleteJobs(jobIds) {
        febs.get(ctx + 'job/delete/' + jobIds, null, function () {
            febs.alert.success('删除任务成功');
            $query.click();
        });
    }

    function getQueryParams() {
    	let params = $searchForm.serializeJson();
        params.invalidate_ie_cache = new Date();
        return params;
    }
})