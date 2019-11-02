layui.use(['dropdown', 'jquery', 'validate', 'febs', 'form', 'eleTree'], function () {
    var $ = layui.jquery,
        febs = layui.febs,
        form = layui.form,
        validate = layui.validate,
        eleTree = layui.eleTree,
        dropdown = layui.dropdown,
        $view = $('#febs-dept'),
        $query = $view.find('#query'),
        $reset = $view.find('#reset'),
        $submit = $view.find('#submit'),
        $header = $view.find('#form-header'),
        $searchForm = $view.find('#dept-table-form'),
        $deptName = $searchForm.find('input[name="deptName"]'),
        _currentDeptData,
        _deptTree;

    form.verify(validate);
    form.render();

    renderDeptTree();

    eleTree.on("nodeClick(deptTree)", function (d) {
        $header.text('修改部门');
        var data = d.data.currentData.data;
        _currentDeptData = data;
        form.val("dept-form", {
            "deptName": data.deptName,
            "orderNum": data.orderNum,
            "createTime": data.createTime,
            "parentId": data.parentId,
            "deptId": data.deptId
        });
    });

    dropdown.render({
        elem: $view.find('.action-more'),
        click: function (name, elem, event) {
            if (name === 'add') {
                reset();
                var selected = _deptTree.getChecked(false, true);
                if (selected.length > 1) {
                    febs.alert.warn('只能选择一个节点作为父级！');
                    return;
                }
                form.val("dept-form", {
                    "parentId": selected[0] ? selected[0].id : ''
                });
            }
            if (name === 'delete') {
                var checked = _deptTree.getChecked(false, true);
                if (checked.length < 1) {
                    febs.alert.warn('请勾选需要删除的部门');
                    return;
                }
                var deptIds = [];
                layui.each(checked, function (key, item) {
                    deptIds.push(item.id)
                });
                febs.modal.confirm('提示', '当您点击确定按钮后，这些记录将会被彻底删除，如果其包含子记录，也将一并删除！', function () {
                    febs.get(ctx + 'dept/delete/' + deptIds.join(','), null, function () {
                        febs.alert.success('删除成功！');
                        reloadDeptTree();
                        reset();
                    })
                });
            }
            if (name === 'export') {
                febs.download(ctx + 'dept/excel', getQueryParams(), '部门信息表.xlsx');
            }
        },
        options: [
        	{ name: 'add', title: '新增部门', perms: 'dept:add' },
        	{ name: 'delete', title: '删除部门', perms: 'dept:delete' },
        	{ name: 'export', title: '导出Excel', perms: 'dept:export' }
        ]
    });

    $view.on('click', '#submit', function () {
        $view.find('#submit-form').trigger('click');
    });

    $reset.on('click', function () {
        $deptName.val('');
        reloadDeptTree();
        reset();
    });

    $query.on('click', function () {
        reloadDeptTree();
    });

    function getQueryParams() {
        return {
            "deptName": $deptName.val().trim()
        }
    }

    function reset() {
        $header.text('新增部门');
        $view.find('#reset-form').trigger('click');
    }

    function renderDeptTree() {
        _deptTree = eleTree.render({
            elem: '.dept-tree',
            url: ctx + 'dept/tree',
            accordion: true,
            highlightCurrent: true,
            showCheckbox: true,
            checkStrictly: true,
            renderAfterExpand: false,
            where: {
                "deptName": $deptName.val().trim(),
                "invalidate_ie_cache": new Date()
            },
            request: {
                name: 'name',
                key: "id",
                checked: "checked",
                data: 'data'
            },
            response: {
                statusName: "code",
                statusCode: 200,
                dataName: "data"
            }
        });
        return _deptTree;
    }

    function reloadDeptTree() {
        _deptTree = renderDeptTree();
    }

    form.on('submit(dept-form-submit)', function (data) {
        if (data.field.deptId && $header.text().indexOf('修改') !== -1) {
            if (febs.nativeEqual(data.field, _currentDeptData)) {
                febs.alert.warn('数据未作任何修改！');
                return false;
            }
            febs.post(ctx + 'dept/update', data.field, function () {
                febs.alert.success('修改成功');
                reloadDeptTree();
                reset();
            })
        } else {
            febs.post(ctx + 'dept', data.field, function () {
                febs.alert.success('新增成功');
                reloadDeptTree();
                reset();
            })
        }
        return false;
    });
});