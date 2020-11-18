layui.use(['jquery', 'febs', 'form', 'validate'], function () {
	var $ = layui.jquery,
		febs = layui.febs,
		layer = layui.layer,
		form = layui.form,
		validate = layui.validate;
	$view = $('#dict-update');

	form.verify(validate);
	form.render();

	initDictValue();

	function initDictValue() {
		form.val("dict-update-form", {
			"id": dict.id,
			"type": dict.type,
			"description": dict.description,
			"name": dict.name,
			"value": dict.value
		});
	}

	form.on('submit(dict-update-form-submit)', function (data) {
		if (febs.nativeEqual(data.field, dict)) {
			febs.alert.warn('数据未作任何修改！');
			return false;
		}
		febs.post(ctx + 'system/dict/update', data.field, function () {
			layer.closeAll();
			febs.alert.success(dict.id + ' 数据修改成功');
			$('#febs-dict').find('#query').click();
		});
		return false;
	});
});