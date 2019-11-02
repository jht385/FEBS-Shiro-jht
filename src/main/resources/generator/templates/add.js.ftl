layui.use(['febs', 'form', 'validate'], function () {
	var $ = layui.$,
		febs = layui.febs,
		layer = layui.layer,
		form = layui.form,
		$view = $('#${className?uncap_first}-add'),
		validate = layui.validate;

	form.verify(validate);
	form.render();

	form.on('submit(${className?uncap_first}-add-form-submit)', function (data) {
		febs.post(ctx + '${module}/${className?uncap_first}', data.field, function () {
			layer.closeAll();
			febs.alert.success('新增成功');
			$('#febs-${className?uncap_first}').find('#query').click();
		});
		return false;
	});
});