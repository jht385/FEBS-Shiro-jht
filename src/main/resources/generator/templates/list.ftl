<link rel="stylesheet" th:href="@{febs/css/${module}/${className?uncap_first}/${className?uncap_first}.css}" media="all">
<div class="layui-fluid layui-anim febs-anim" id="febs-${className?uncap_first}" lay-title="${tableComment}">
	<div class="layui-row febs-container">
		<div class="layui-col-md12">
			<div class="layui-card">
				<div class="layui-card-body febs-table-full">
					<form class="layui-form layui-table-form" lay-filter="${className?uncap_first}-table-form">
						<div class="layui-row">
							<div class="layui-col-md10">
								<div class="layui-form-item">
									<#list columns as column>
									<#if column_index lt 3>
									<div class="layui-inline">
										<label class="layui-form-label layui-form-label-sm">${column.remark}</label>
										<div class="layui-input-inline">
											<input type="text" name="${column.classField?uncap_first}" autocomplete="off" class="layui-input">
										</div>
									</div>
									</#if>
									</#list>
								</div>
							</div>
							<div class="layui-col-md2 layui-col-sm12 layui-col-xs12 table-action-area">
								<div class="layui-btn layui-btn-sm layui-btn-primary febs-button-blue-plain table-action" id="query">
									<i class="layui-icon">&#xe848;</i>
								</div>
								<div class="layui-btn layui-btn-sm layui-btn-primary febs-button-blue-plain table-action" id="reset">
									<i class="layui-icon">&#xe79b;</i>
								</div>
								<div class="layui-btn layui-btn-sm layui-btn-primary table-action action-more"
									shiro:hasAnyPermissions="${className?uncap_first}:add,${className?uncap_first}:update,${className?uncap_first}:password:reset">
									<i class="layui-icon">&#xe875;</i>
								</div>
							</div>
						</div>
					</form>
					<table lay-filter="${className?uncap_first}Table" lay-data="{id: '${className?uncap_first}Table'}"></table>
				</div>
			</div>
		</div>
	</div>
</div>
<script type="text/html" id="${className?uncap_first}-status">
	{{#
	var status = {
	1: {title: '有效', color: 'green'},
	0: {title: '禁用', color: 'volcano'}
	}[d.status];
	}}
	<span class="layui-badge febs-bg-{{status.color}}">{{ status.title }}</span>
</script>
<script type="text/html" id="${className?uncap_first}-option">
	<span shiro:lacksPermission="${className?uncap_first}:view,${className?uncap_first}:update,${className?uncap_first}:delete">
		<span class="layui-badge-dot febs-bg-orange"></span> 无权限
	</span>
	<a lay-event="detail" shiro:hasPermission="${className?uncap_first}:view"><i class="layui-icon febs-edit-area febs-green">&#xe7a5;</i></a>
	<a lay-event="edit" shiro:hasPermission="${className?uncap_first}:update"><i class="layui-icon febs-edit-area febs-blue">&#xe7a4;</i></a>
	<a lay-event="del" shiro:hasPermission="${className?uncap_first}:delete"><i class="layui-icon febs-edit-area febs-red">&#xe7f9;</i></a>
</script>
<script th:src="@{febs/js/${module}/${className?uncap_first}/${className?uncap_first}.js}"></script>