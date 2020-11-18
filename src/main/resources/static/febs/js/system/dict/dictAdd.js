layui.use(['febs', 'form', 'validate'], function () {
	var $ = layui.$,
		febs = layui.febs,
		layer = layui.layer,
		form = layui.form,
		$view = $('#dict-add'),
		validate = layui.validate;

	form.verify(validate);
	form.render();
	
	if(dict){
		initDictValue();
	}

	function initDictValue() {
		form.val("dict-add-form", {
			"type": dict.type,
			"description": dict.description,
			"name": dict.name,
			"value": dict.value
		});
	}

	form.on('submit(dict-add-form-submit)', function (data) {
		febs.post(ctx + 'system/dict', data.field, function () {
			layer.closeAll();
			febs.alert.success('新增成功');
			$('#febs-dict').find('#query').click();
		});
		return false;
	});
});