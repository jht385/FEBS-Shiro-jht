<link rel="stylesheet" th:href="${@mvcResourceUrlProvider.getForLookupPath('/febs/css/${module}/${className?uncap_first}/${className?uncap_first}Update.css')}" media="all">
<div class="layui-fluid" id="${className?uncap_first}-update">
	<form class="layui-form" action="" lay-filter="${className?uncap_first}-update-form">
		<div class="layui-form-item febs-hide">
			<label class="layui-form-label febs-form-item-require">${columns[0].remark}：</label>
			<div class="layui-input-block">
				<input type="text" name="${columns[0].classField?uncap_first}" data-th-value="${"$"}{${(className?uncap_first)}.${columns[0].classField?uncap_first}}"
					lay-verify="required" autocomplete="off" class="layui-input">
			</div>
		</div>
		<#list columns as column>
		<#if column_index gt 0 && column_index lt 3>
		<div class="layui-form-item">
			<label class="layui-form-label febs-form-item-require">${column.remark}：</label>
			<div class="layui-input-block">
				<input type="text" name="${column.classField?uncap_first}" data-th-id="${className?uncap_first}"
					lay-verify="required" autocomplete="off" class="layui-input">
			</div>
		</div>
		</#if>
		</#list>
		<div class="layui-form-item febs-hide">
			<button class="layui-btn" lay-submit="" lay-filter="${className?uncap_first}-update-form-submit" id="submit"></button>
		</div>
	</form>
</div>
<script th:inline="javascript">
	var ${className?uncap_first} = [[${"$"}{${className?uncap_first}}]];
	var ac = [[${"$"}{ac}]];
</script>
<script type="text/javascript" data-th-inline="javascript" th:src="${@mvcResourceUrlProvider.getForLookupPath('/febs/js/${module}/${className?uncap_first}/${className?uncap_first}Update.js')}"></script>