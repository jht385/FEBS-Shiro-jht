layui.use(['element', 'jquery', 'febs'], function () {
    var $ = layui.jquery,
        element = layui.element,
        febs = layui.febs,
        $view = $('#febs-avatar');

    $view.find('img').each(function () {
        var $this = $(this);
        $this.on('click', function () {
            var $that = $(this);
            var target_src = $that.attr("src").replace('febs/images/avatar/', '');
            febs.get(ctx + 'user/avatar/' + target_src, null, function () {
                layui.layer.closeAll();
                febs.modal.confirm('修改成功','是否马上刷新页面生效？',function () {
                    window.location.reload();
                });
            })
        })
    })
});