layui.use(['jquery', 'form', 'table', 'febs', 'laydate'], function () {
    var $ = layui.jquery,
        form = layui.form,
        table = layui.table,
        febs = layui.febs,
        laydate = layui.laydate,
        $view = $('#febs-generator'),
        $query = $view.find('#query'),
        $reset = $view.find('#reset'),
        $searchForm = $view.find('form'),
        tableIns;

    laydate.render({
        elem: '#createTime',
        range: true
    });

    form.render();
    initTable();

    $query.on('click', function () {
        tableIns.reload({where: getQueryParams(), page: {curr: 1}});
    });

    $reset.on('click', function () {
        $searchForm[0].reset();
        tableIns.reload({where: getQueryParams(), page: {curr: 1}});
    });

    function initTable() {
        tableIns = febs.table.init({
            elem: $view.find('table'),
            id: 'configureTable',
            url: ctx + 'generator/tables/info',
            cols: [[
                {type: 'checkbox'},
                {field: 'name', title: '表名'},
                {field: 'remark', title: '备注'},
                {field: 'dataRows', title: '数据量（行）'},
                {field: 'createTime', title: '创建时间', minWidth: 180},
                {field: 'updateTime', title: '修改时间', minWidth: 180},
                {title: '操作', toolbar: '#generator-option', minWidth: 140}
            ]]
        });
    }

    function getQueryParams() {
        return {
            tableName: $searchForm.find("input[name='tableName']").val().trim(),
            invalidate_ie_cache: new Date()
        };
    }

    table.on('tool(configureTable)', function (obj) {
        var data = obj.data,
            layEvent = obj.event;
        if (layEvent === 'generate') {
        	if(data.remark == null || data.remark == ''){
        		febs.alert.error('表描述不能为空');
        		return;
        	}
            febs.modal.confirm('代码生成', '确定生成数据表<strong> ' + data.name + ' </strong>对应的前后端代码？', function () {
                febs.download(ctx + 'generator', data, data.name + '_code.zip');
            });
        }
    });
})