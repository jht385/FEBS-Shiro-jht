layui.use(['jquery', 'table', 'febs', 'form'], function () {
    var $ = layui.jquery,
        table = layui.table,
        febs = layui.febs,
        $view = $('#febs-httptrace'),
        $searchForm = $view.find('form'),
        $query = $view.find('#query'),
        $reset = $view.find('#reset'),
        form = layui.form,
        tableIns;

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
            page: false,
            id: 'httptraceTable',
            url: ctx + 'febs/actuator/httptrace',
            cols: [[
                {field: 'requestTime', title: '请求时间', minWidth: 180},
                {title: '请求方法', templet: "#httptrace-method"},
                {field: 'url', title: '请求URL', minWidth: 380},
                {title: '响应状态', templet: '#httptrace-status'},
                {title: '请求耗时', templet: '#httptrace-time'}
            ]],
            done: function (r) {
                $view.find('#count').text(r.count);
            }
        });
    }

    function getQueryParams() {
        return {
            method: $searchForm.find('select[name="method"]').val(),
            url: $searchForm.find('input[name="url"]').val().trim(),
            invalidate_ie_cache: new Date()
        };
    }
});