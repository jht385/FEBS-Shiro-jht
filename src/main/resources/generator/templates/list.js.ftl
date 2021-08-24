layui.use(['dropdownMenu', 'jquery', 'form', 'table', 'febs'], function () {
	let $ = layui.jquery,
		laydate = layui.laydate,
		febs = layui.febs,
		form = layui.form,
		table = layui.table,
		dropdownMenu = layui.dropdownMenu,
		$view = $('#febs-${className?uncap_first}'),
		$query = $view.find('#query'),
		$reset = $view.find('#reset'),
		$searchForm = $view.find('form'),
		sortObject = {field: '${columns[0].classField?uncap_first}', type: null},
		tableIns;

	form.render();

	initTable();

	dropdownMenu.render({
		elem: $view.find('.action-more'),
		click: function (name, elem, event) {
			let checkStatus = table.checkStatus('${className?uncap_first}Table');
			if (name === 'add') {
				febs.modal.open('新增', '${module}/${className?uncap_first}/add', {
					btn: ['提交', '重置'],
					area: $(window).width() <= 750 ? '95%' : '50%',
					yes: function (index, layero) {
						$('#${className?uncap_first}-add').find('#submit').trigger('click');
					},
					btn2: function () {
						$('#${className?uncap_first}-add').find('#reset').trigger('click');
						return false;
					}
				});
			}
		},
		options: [
			{ name: 'add', title: '新增', perms: '${className?uncap_first}:add' }
		]
	});

	table.on('tool(${className?uncap_first}Table)', function (obj) {
		let data = obj.data,
			layEvent = obj.event;
		if (layEvent === 'detail') {
			febs.modal.view('信息', '${module}/${className?uncap_first}/detail/' + data.${columns[0].classField?uncap_first}, {
				area: $(window).width() <= 750 ? '95%' : '660px'
			});
		}
		if (layEvent === 'del') {
			febs.modal.confirm('删除', '确定删除？', function () {
				delete${className}s(data.${columns[0].classField?uncap_first});
			});
		}
		if (layEvent === 'edit') {
			febs.modal.open('修改', '${module}/${className?uncap_first}/update/' + data.${columns[0].classField?uncap_first}, {
				area: $(window).width() <= 750 ? '90%' : '50%',
				btn: ['提交', '取消'],
				yes: function (index, layero) {
					$('#${className?uncap_first}-update').find('#submit').trigger('click');
				},
				btn2: function () {
					layer.closeAll();
				}
			});
		}
	});

	table.on('sort(${className?uncap_first}Table)', function (obj) {
		sortObject = obj;
		tableIns.reload({
			initSort: obj,
			where: $.extend(getQueryParams(), {
				field: obj.field,
				order: obj.type
			})
		});
	});

	$query.on('click', function () {
		let params = $.extend(getQueryParams(), {field: sortObject.field, order: sortObject.type});
		tableIns.reload({where: params, page: {curr: 1}});
	});

	$reset.on('click', function () {
		$searchForm[0].reset();
		sortObject.type = 'null';
		tableIns.reload({where: getQueryParams(), page: {curr: 1}, initSort: sortObject});
	});

	function initTable() {
		tableIns = febs.table.init({
			elem: $view.find('table'),
			id: '${className?uncap_first}Table',
			url: ctx + '${module}/${className?uncap_first}/list',
			cols: [[
				{type: 'checkbox'},
				<#list columns as column>
				{field: '${column.classField?uncap_first}', title: '${column.remark}', minWidth: 100, sort: true<#if column_index gt 3>, hide: true</#if>},
				</#list>
				{title: '操作', toolbar: '#${className?uncap_first}-option', minWidth: 140}
			]]
		});
	}

	function getQueryParams() {
		return {
			<#list columns as column>
			<#if column_index lt 3>
			${column.classField?uncap_first} : $searchForm.find('input[name="${column.classField?uncap_first}"]').val().trim()<#if column_index != 2>,</#if>
			</#if>
			</#list>
		};
	}

	function delete${className}s(ids) {
		febs.get(ctx + '${module}/${className?uncap_first}/delete/' + ids, null, function () {
			febs.alert.success('删除成功');
			$query.click();
		});
	}
})