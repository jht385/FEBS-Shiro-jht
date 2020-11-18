layui.use(['dropdown', 'jquery', 'form', 'table', 'febs', 'xmSelect'], function () {
	var $ = layui.jquery,
		laydate = layui.laydate,
		febs = layui.febs,
		form = layui.form,
		table = layui.table,
		dropdown = layui.dropdown,
		xmSelect = layui.xmSelect,
		$view = $('#febs-dict'),
		$query = $view.find('#query'),
		$reset = $view.find('#reset'),
		$searchForm = $view.find('form'),
		sortObject = {field: 'id', type: null},
		tableIns;

	let dictTypeData = [];
	dictTypeData[0] = {name: '所有', value: ''};
	for(let i = 0; i < dictType.length; i++){
		dictTypeData[i + 1] = {name: dictType[i].description, value: dictType[i].type};
	}
	
	form.render();
	
	var vmType = xmSelect.render({
		el: '#type', radio: true, clickClose: true,
		data: dictTypeData
	})

	initTable();

	dropdown.render({
		elem: $view.find('.action-more'),
		click: function (name, elem, event) {
			var checkStatus = table.checkStatus('dictTable');
			if (name === 'add') {
				febs.modal.open('新增', 'system/dict/add', {
					btn: ['提交', '重置'],
					area: $(window).width() <= 750 ? '95%' : '50%',
					yes: function (index, layero) {
						$('#dict-add').find('#submit').trigger('click');
					},
					btn2: function () {
						$('#dict-add').find('#reset').trigger('click');
						return false;
					}
				});
			}
		},
		options: [
			{ name: 'add', title: '新增', perms: 'dict:add' }
		]
	});

	table.on('tool(dictTable)', function (obj) {
		var data = obj.data,
			layEvent = obj.event;
		if (layEvent === 'plus') {
			febs.modal.open('修改', 'system/dict/plus/' + data.id, {
				area: $(window).width() <= 750 ? '90%' : '50%',
				btn: ['提交', '取消'],
				yes: function (index, layero) {
					$('#dict-add').find('#submit').trigger('click');
				},
				btn2: function () {
					layer.closeAll();
				}
			});
		}
		if (layEvent === 'del') {
			febs.modal.confirm('删除', '确定删除？', function () {
				deleteDicts(data.id);
			});
		}
		if (layEvent === 'edit') {
			febs.modal.open('修改', 'system/dict/update/' + data.id, {
				area: $(window).width() <= 750 ? '90%' : '50%',
				btn: ['提交', '取消'],
				yes: function (index, layero) {
					$('#dict-update').find('#submit').trigger('click');
				},
				btn2: function () {
					layer.closeAll();
				}
			});
		}
	});

	table.on('sort(dictTable)', function (obj) {
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
		var params = $.extend(getQueryParams(), {field: sortObject.field, order: sortObject.type});
		tableIns.reload({where: params, page: {curr: 1}});
	});

	$reset.on('click', function () {
		$searchForm[0].reset();
		sortObject.type = 'null';
		vmType.setValue([ ]);
		tableIns.reload({where: getQueryParams(), page: {curr: 1}, initSort: sortObject});
	});

	function initTable() {
		tableIns = febs.table.init({
			elem: $view.find('table'),
			id: 'dictTable',
			url: ctx + 'system/dict/list',
			cols: [[
				{type: 'checkbox'},
				{field: 'id', title: '编号', minWidth: 100, hide: true},
				{field: 'type', title: '类型', minWidth: 100, sort: true},
				{field: 'description', title: '描述', minWidth: 100, sort: true},
				{field: 'name', title: '标签名', minWidth: 100, sort: true},
				{field: 'value', title: '数据值', minWidth: 100, sort: true},
				{field: 'sort', title: '排序', minWidth: 100, sort: true, hide: true},
				{field: 'parentId', title: '父级编号', minWidth: 100, sort: true, hide: true},
				{field: 'createBy', title: '创建者', minWidth: 100, sort: true, hide: true},
				{field: 'createDate', title: '创建时间', minWidth: 100, sort: true, hide: true},
				{field: 'updateBy', title: '更新者', minWidth: 100, sort: true, hide: true},
				{field: 'updateDate', title: '更新时间', minWidth: 100, sort: true, hide: true},
				{field: 'remarks', title: '备注信息', minWidth: 100, sort: true, hide: true},
				{field: 'delFlag', title: '删除标记', minWidth: 100, sort: true, hide: true},
				{field: 'ex1', title: '扩展字段1', minWidth: 100, sort: true, hide: true},
				{title: '操作', toolbar: '#dict-option', minWidth: 140}
			]]
		});
	}

	function getQueryParams() {
		return {
			name : $searchForm.find('input[name="name"]').val().trim(),
			value : $searchForm.find('input[name="value"]').val().trim(),
			type : vmType.getValue('value')[0]
		};
	}

	function deleteDicts(ids) {
		febs.get(ctx + 'system/dict/delete/' + ids, null, function () {
			febs.alert.success('删除成功');
			$query.click();
		});
	}
})