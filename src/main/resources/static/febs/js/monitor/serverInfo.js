layui.use(['jquery', 'febs'], function () {
    var $ = layui.jquery,
        febs = layui.febs,
        util = layui.util,
        $view = $('#febs-server-info');
    $view.find('#time').text(util.toDateString(new Date().getTime(), 'yyyy年MM月dd日 HH时mm分ss秒'));

    $view.find('a#refresh').on('click', function () {
        var isTab = currentUser.isTab;
        if (isTab === '1') {
            febs.view.tab.refresh();
        } else {
            window.location.reload();
        }
    });
});