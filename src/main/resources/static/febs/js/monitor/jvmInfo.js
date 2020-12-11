layui.use(['jquery', 'febs'], function () {
    let $ = layui.jquery,
        febs = layui.febs,
        util = layui.util,
        $view = $('#febs-jvminfo');
    $view.find('#time').text(util.toDateString(new Date().getTime(), 'yyyy年MM月dd日 HH时mm分ss秒'));

    $view.find('a#refresh').on('click', function () {
        let isTab = currentUser.isTab;
        if (isTab === '1') {
            febs.view.tab.refresh();
        } else {
            window.location.reload();
        }
    });
});