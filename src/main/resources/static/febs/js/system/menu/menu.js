layui.use(['dropdown', 'jquery', 'febs', 'form', 'eleTree', 'validate', 'xmSelect'], function () {
	let $ = layui.jquery,
        laydate = layui.laydate,
        febs = layui.febs,
        form = layui.form,
        validate = layui.validate,
        eleTree = layui.eleTree,
        xmSelect = layui.xmSelect,
        dropdown = layui.dropdown,
        $view = $('#febs-menu'),
        $query = $view.find('#query'),
        $reset = $view.find('#reset'),
        $submit = $view.find('#submit'),
        $searchForm = $view.find('#menu-table-form'),
        $menuName = $searchForm.find('input[name="menuName"]'),
        $type = $view.find('input[type="radio"][name="type"]'),
        $icon = $view.find('input[name="icon"]'),
        $icon_parent = $icon.parents('.layui-form-item'),
        $url = $view.find('input[name="url"]'),
        $url_parent = $url.parents('.layui-form-item'),
        $order = $view.find('input[name="orderNum"]'),
        $order_parent = $order.parents('.layui-form-item'),
        $header = $view.find('#form-header'),
        _currentMenuData,
        menuXmlSelect,
        _menuTree;

    form.verify(validate);
    form.render();
    
    menuXmlSelect = xmSelect.render({
        el: '#parent-menu-id',
        model: {label: {type: 'text'}},
        tree: {
            show: true,
            strict: false,
            showLine: false,
            clickCheck: true,
            expandedKeys: [-1],
        },
        name: 'parentId',
        theme: {
            color: '#52c41a',
        },
        prop: {
            value: 'id',
            name: 'title',
            children: 'childs'
        },
        height: 'auto',
        on: function (data) {
            if (data.isAdd) {
                return data.change.slice(0, 1)
            }
        }
    });

    febs.get(ctx + 'menu/tree', null, function (data) {
        menuXmlSelect.update(data)
    });

    dropdown.render({
        elem: $view.find('#action-more'),
        click: function (name, elem, event) {
            if (name === 'add') {
                reset();
            }
            if(name == 'addChildren'){
            	reset();
                febs.alert.info("请在表单中填写相关信息");
            }
            if (name === 'delete') {
            	let checked = _menuTree.getChecked(false, true);
                if (checked.length < 1) {
                    febs.alert.warn('请勾选需要删除的菜单或按钮');
                    return;
                }
                let menuIds = [];
                layui.each(checked, function (key, item) {
                    menuIds.push(item.id)
                });
                febs.modal.confirm('提示', '当您点击确定按钮后，这些记录将会被彻底删除，如果其包含子记录，也将一并删除！', function () {
                    febs.get(ctx + 'menu/delete/' + menuIds.join(','), null, function () {
                        febs.alert.success('删除成功！');
                        reloadMenuTree();
                        reset();
                    })
                });
            }
            if (name === 'export') {
                febs.download(ctx + 'menu/excel', {
                    "menuName": $menuName.val().trim()
                }, '菜单信息表.xlsx');
            }
        },
        options: [
        	{ name: 'add', title: '新增', perms: 'menu:add' },
        	{ name: 'addChildren', title: '新增子菜单', perms: 'menu:add' },
        	{ name: 'delete', title: '删除', perms: 'menu:delete' },
        	{ name: 'export', title: '导出Excel', perms: 'menu:export' }
	    ]
    });

    _menuTree = renderMenuTree();

    eleTree.on("nodeClick(menuTree)", function (d) {
    	let data = d.data.currentData.data;
        _currentMenuData = data;
        $type.attr("disabled", true);
        let type = data.type;
        handleTypeChange(type);
        if (type === '0') { // 菜单
            $header.text('修改菜单');
        } else { // 按钮
            $header.text('修改按钮');
        }
        form.val("menu-form", {
            "icon": data.icon,
            "url": data.url,
            "orderNum": data.orderNum,
            "type": data.type,
            "menuName": data.menuName,
            "perms": data.perms,
            "parentId": data.parentId,
            "menuId": data.menuId
        });
        if (data.parentId) {
            menuXmlSelect.setValue([data.parentId]);
        } else {
            menuXmlSelect.setValue([])
        }
    });

    form.on("radio(menu-type)", function (data) {
        handleTypeChange(data.value);
    });

    $reset.on('click', function () {
        $menuName.val('');
        reloadMenuTree();
        reset();
    });

    $query.on('click', function () {
        reloadMenuTree();
        reset();
    });

    $submit.on('click', function () {
        $view.find('#submit-form').trigger('click');
    });

    $icon.focus(function () {
        febs.modal.open('图标选择', 'others/febs/icon', {
            btn: ['确定'],
            yes: function () {
                let icon = $('#febs-icon').find('.icon-active .icon-name').text();
                if (icon) {
                    form.val("menu-form", {
                        "icon": 'layui-icon-' + icon
                    });
                } else {
                    form.val("menu-form", {
                        "icon": ''
                    });
                }
                layer.closeAll();
            }
        });
    });

    function reset() {
        $view.find('#reset-form').trigger('click');
        handleTypeChange('0');
        $type.removeAttr("disabled");
    }

    function renderMenuTree() {
        _menuTree = eleTree.render({
            elem: '.menuTree',
            url: ctx + 'menu/tree',
            where: {
                "menuName": $menuName.val().trim(),
                "invalidate_ie_cache": new Date()
            },
            accordion: true,
            highlightCurrent: true,
            showCheckbox: true,
            checkStrictly: true,
            checkOnClickNode: true,
            expandOnClickNode: false,
            renderAfterExpand: false,
            request: {
                name: "title", key: "id", children: "childs", checked: "checked", data: "data"
            },
            response: {
                statusName: "code", statusCode: 200, dataName: "data"
            }
        });
        return _menuTree;
    }

    function reloadMenuTree() {
        _menuTree = renderMenuTree();
    }

    let handleTypeChange = function (type) {
        form.val("menu-form", {
            "icon": '', "url": '', "orderNum": ''
        });
        if (type === '1') {
            $header.text('新增按钮');
            $icon_parent.hide();
            $url_parent.hide();
            $order_parent.hide();
        } else {
            $header.text('新增菜单');
            $icon_parent.show();
            $url_parent.show();
            $order_parent.show();
        }
    };

    form.on('submit(menu-form-submit)', function (data) {
        if (data.field.menuId && $header.text().indexOf('修改') !== -1) {
            if (febs.nativeEqual(data.field, _currentMenuData)) {
                febs.alert.warn('数据未作任何修改！');
                return false;
            }
            febs.post(ctx + 'menu/update', data.field, function () {
                febs.alert.success('修改成功');
                reloadMenuTree();
                reset();
            })
        } else {
            febs.post(ctx + 'menu', data.field, function () {
                febs.alert.success('新增成功');
                reloadMenuTree();
                reset();
            })
        }
        return false;
    });
});