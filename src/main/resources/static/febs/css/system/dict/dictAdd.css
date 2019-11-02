layui.use(['febs', 'form', 'validate'], function () {
	var $ = layui.$,
		febs = layui.febs,
		layer = layui.layer,
		form = layui.form,
		$view = $('#dict-add'),
		validate = layui.validate;

	form.verify(validate);
	form.render();

	form.on('submit(dict-add-form-submit)', function (data) {
		febs.post(ctx + 'system/dict', data.field, function () {
			layer.closeAll();
			febs.alert.success('新增成功');
			$('#febs-dict').find('#query').click();
		});
		return false;
	});
});