<link rel="stylesheet" th:href="${@mvcResourceUrlProvider.getForLookupPath('/febs/css/${module}/${className?uncap_first}/${className?uncap_first}Add.css')}" media="all">
<div class="layui-fluid" id="${className?uncap_first}-add">
	<form class="layui-form" action="" lay-filter="${className?uncap_first}-add-form">
		<#list columns as column>
		<#if column_index lt 3>
		<div class="layui-form-item">
			<label class="layui-form-label febs-form-item-require">${column.remark}：</label>
			<div class="layui-input-block">
				<input type="text" name="${column.classField?uncap_first}" lay-verify="required"
					autocomplete="off" class="layui-input">
			</div>
		</div>
		</#if>
		</#list>
		<div class="layui-form-item febs-hide">
			<button class="layui-btn" lay-submit="" lay-filter="${className?uncap_first}-add-form-submit" id="submit"></button>
			<button type="reset" class="layui-btn" id="reset"></button>
		</div>
	</form>
</div>
<script th:src="${@mvcResourceUrlProvider.getForLookupPath('/febs/js/${module}/${className?uncap_first}/${className?uncap_first}Add.js')}"></script>