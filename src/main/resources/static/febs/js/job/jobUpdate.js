layui.use(['jquery', 'febs', 'form', 'validate'], function () {
    var $ = layui.jquery,
        febs = layui.febs,
        form = layui.form,
        $view = $('#job-update'),
        validate = layui.validate;

    form.verify(validate);
    form.render();

    initJobValue();

    function initJobValue() {
        form.val("job-update-form", {
            "jobId": job.jobId,
            "status": job.status,
            "beanName": job.beanName,
            "methodName": job.methodName,
            "params": job.params,
            "cronExpression": job.cronExpression,
            "remark": job.remark
        });
    }

    form.on('submit(job-update-form-submit)', function (data) {
        if (febs.nativeEqual(data.field, job)) {
            febs.alert.warn('数据未作任何修改！');
            return false;
        }
        febs.post(ctx + 'job/update', data.field, function () {
            layer.closeAll();
            febs.alert.success('任务修改成功');
            $('#febs-job').find('#query').click();
        });
        return false;
    });
});