layui.use(['jquery', 'febs', 'form', 'validate'], function () {
	let $ = layui.jquery,
		febs = layui.febs,
		layer = layui.layer,
		form = layui.form,
		validate = layui.validate;
	$view = $('#${className?uncap_first}-update');

	form.verify(validate);
	form.render();

	init${className}Value();

	function init${className}Value() {
		form.val("${className?uncap_first}-update-form", {
			<#list columns as column>
			<#if column_index lt 3>
			"${column.classField?uncap_first}": ${className?uncap_first}.${column.classField?uncap_first}<#if column_index != 2>,</#if>
			</#if>
			</#list>
		});
	}

	form.on('submit(${className?uncap_first}-update-form-submit)', function (data) {
		if (febs.nativeEqual(data.field, ${className?uncap_first})) {
			febs.alert.warn('数据未作任何修改！');
			return false;
		}
		febs.post(ctx + '${module}/${className?uncap_first}/update', data.field, function () {
			layer.closeAll();
			febs.alert.success(${className?uncap_first}.${columns[0].classField?uncap_first} + ' 数据修改成功');
			$('#febs-${className?uncap_first}').find('#query').click();
		});
		return false;
	});
});