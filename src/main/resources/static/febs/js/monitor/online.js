layui.use(['jquery', 'form', 'table', 'febs'], function () {
    let $ = layui.jquery,
        laydate = layui.laydate,
        febs = layui.febs,
        form = layui.form,
        table = layui.table,
        $view = $('#febs-online'),
        $query = $view.find('#query'),
        $reset = $view.find('#reset'),
        $searchForm = $view.find('form'),
        tableIns;

    form.render();

    initTable();

    table.on('tool(onlineTable)', function (obj) {
        let data = obj.data,
            layEvent = obj.event;
        if (layEvent === 'del') {
            febs.modal.confirm('踢出用户', '确定将该用户踢出？', function () {
                if (data.current) {
                    $.get(ctx + 'logout', function () {
                        window.location.reload();
                    });
                } else {
                    febs.get(ctx + "session/delete/" + data.id, null, function () {
                        febs.alert.success('踢出用户成功');
                        $query.click();
                    });
                }
            });
        }
    });

    $query.on('click', function () {
        tableIns.reload({where: getQueryParams()});
    });

    $reset.on('click', function () {
        $searchForm[0].reset();
        tableIns.reload({where: getQueryParams()});
    });

    function initTable() {
        tableIns = febs.table.init({
            elem: $view.find('table'),
            id: 'onlineTable',
            url: ctx + 'session/list',
            page: false,
            cols: [[
                {title: '用户名', templet: '#online-username', minWidth: 180},
                {field: 'startTimestamp', title: '登录时间', minWidth: 180},
                {field: 'lastAccessTime', title: '最后访问时间', minWidth: 180},
                {field: 'host', title: 'IP地址', minWidth: 165},
                {field: 'location', title: '登录地点', minWidth: 180},
                {title: '状态', templet: '#online-status'},
                {title: '操作', toolbar: '#online-option'}
            ]],
            done: function (r) {
                $view.find('span#count').html('当前共<strong> ' + r.count + ' </strong>人在线')
                    .parents('div.febs-hide').show();
            }
        });
    }

    function getQueryParams() {
    	let params = $searchForm.serializeJson();
        params.invalidate_ie_cache = new Date();
        return params;
    }
})