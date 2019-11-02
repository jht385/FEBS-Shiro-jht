layui.use(['jquery', 'febs', 'form', 'validate'], function () {
    var $ = layui.jquery,
        febs = layui.febs,
        form = layui.form,
        $view = $('#job-add'),
        validate = layui.validate;

    form.verify(validate);
    form.render();

    form.on('submit(job-add-form-submit)', function (data) {
        febs.post(ctx + 'job', data.field, function () {
            layer.closeAll();
            febs.alert.success('新增任务成功');
            $('#febs-job').find('#query').click();
        });
        return false;
    });

});