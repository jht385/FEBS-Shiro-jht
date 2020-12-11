layui.use(['jquery', 'form', 'febs'], function () {
    let $ = layui.jquery,
        febs = layui.febs,
        form = layui.form,
        _currentData = {
            theme: currentUser.theme,
            isTab: currentUser.isTab
        },
        $view = $('#febs-user-profile');

    form.render();
    initSettings();

    $view.find('#user-img img').attr('src', ctx + "febs/images/avatar/" + currentUser.avatar);
    $view.on('click', '#update-user-info', function () {
        febs.modal.view('个人信息修改', 'user/profile/update', {
            area: $(window).width() <= 750 ? '90%' : '50%',
            btn: ['确定'],
            yes: function () {
                $('#profile-update').find('#submit').trigger('click');
            }
        });
    });

    $view.on('click', '#user-profile img', function () {
        febs.modal.view('点击更换', 'user/avatar', {
            area: $(window).width() <= 750 ? '90%' : '650px',
            offset: '100px'
        });
    });

    $view.on('click', '#submit', function () {
        $view.find('#submit-form').trigger('click');
    });

    function initSettings() {
        form.val("system-setting-form", _currentData);
    }

    form.on("radio(theme)", function (data) {
        let $sidebar = $('#app-sidebar');
        if (data.value === 'black') {
            $sidebar.removeClass('febs-theme-white');
        }
        if (data.value === 'white') {
            $sidebar.addClass('febs-theme-white');
        }
    });

    form.on('submit(system-setting-form-submit)', function (data) {
        if (febs.nativeEqual(data.field, _currentData)) {
            febs.alert.warn('数据未作任何修改');
            return false;
        }
        febs.post(ctx + 'user/theme/update', data.field, function () {
            _currentData = data.field;
            febs.modal.confirm('修改成功','是否马上刷新页面生效？',function () {
                window.location.reload();
            });
        });
        return false;
    });
})