layui.define(['jquery'], function (exports) {
    var $ = layui.jquery;
    var CLS_DROPDOWN_MENU = 'layui-dropdownMenu';
    var CLS_DROPDOWN_MENU_RIGHT = 'layui-dropdownMenu-direright';
    var CLS_SELECT = 'layui-dropdownMenu-select';
    var CLS_OPTION = 'layui-dropdownMenu-option';
    var CLS_TITLE = 'layui-dropdownMenu-title';
    var CLS_ARROW = 'febs-arrow-up';
    var HTML_DROPDOWN_MENU = '<div class="' + CLS_DROPDOWN_MENU + '"><div>';
    var DEPTH = 0;
    var INDEX = 0;

    var Class = function (config) {
        this.config = $.extend({}, this.config, config);
        this.render(config)
    };
    Class.prototype.config = {
        width: 150,
        trigger: 'click'
    };
    Class.prototype.dropdownMenuElem = '';
    Class.prototype.exists = false;
    Class.prototype.depth = 0;
    Class.prototype.index = 0;
    Class.prototype.render = function (config) {
        var self = this;
        if (typeof this.config.elem == 'string') {
            $(document).on('click', this.config.elem, event)
        } else {
            this.config.elem.click(event)
        }

        function event(e) {
            e.stopPropagation();
            if (self.dropdownMenuElem === '') {
                INDEX += 1;
                self.index = INDEX;

                var dropdownMenu = $(HTML_DROPDOWN_MENU).attr('lay-index', self.index);
                $('.' + CLS_DROPDOWN_MENU + '[lay-index="' + self.index + '"]').remove();

                dropdownMenu.html(self.createOptionsHtml(config));
                $('body').prepend(dropdownMenu);
                dropdownMenu.on('click', '.' + CLS_OPTION, function (e) {
                    e.stopPropagation();
                    if ($.isFunction(config.click)) {
                        config.click($(this).attr('lay-name'), $(this), e);
                        dropdownMenu.hide()
                    }
                });
                self.dropdownMenuElem = dropdownMenu;
                self.dropdownMenuSelect = dropdownMenu.find('.' + CLS_SELECT)
            }

            var dropdownMenu = self.dropdownMenuElem;

            var top = $(this).offset().top + $(this).height() + 12;
            var left = $(this).offset().left - 5;
            dropdownMenu.css({
                top: top - 10
            });
            var offsetWidth = (self.depth + 1) * self.config.width;

            if (left + offsetWidth > $(window).width()) {
                dropdownMenu
                    .addClass('layui-dropdownMenu-right')
                    .css('left', left - dropdownMenu.width() + $(this).width());
                self.dropdownMenuSelect.css({left: 'auto', right: self.config.width})
            } else {
                dropdownMenu.removeClass('layui-dropdownMenu-right').css('left', left);
                self.dropdownMenuSelect.css({right: 'auto', left: self.config.width})
            }

            $('body').one('click', function (e) {
                dropdownMenu.stop().animate(
                    {
                        top: '-=100000',
                        opacity: 0
                    },
                    1
                );
            });

            dropdownMenu
                .show()
                .stop()
                .animate(
                    {
                        top: '+=10',
                        opacity: 1
                    },
                    250
                )
        }
    };
    Class.prototype.createOptionsHtml = function (data, depth) {
        depth = depth || 0;
        var self = this;
        var width = self.config.width + 'px;';
        var html =
            '<div class="' +
            CLS_SELECT +
            '" style="width:' +
            width +
            (depth > 0 ? 'left:' + width : '') +
            '">';
        if (depth === 0) {
            html += '<div class="' + CLS_ARROW + '"></div>'
        }
        layui.each(data.options, function (i, option) {
            var paserHtml = false;
            var permissions = currentUser.permissionSet;
            var options = option.options || [];
            if (option.perms) {
                if (permissions.indexOf(option.perms) !== -1) {
                    paserHtml = true;
                }
            } else {
                paserHtml = true;
            }
            if (paserHtml) {
                html +=
                    '<div lay-name=' +
                    option.name +
                    ' class="' +
                    CLS_OPTION +
                    '"><p class="' +
                    CLS_TITLE +
                    ' layui-elip"><span class="layui-icon ' +
                    option.icon +
                    '"></span>' +
                    option.title +
                    '</p>' +
                    (options.length > 0
                        ? '<i class="layui-icon layui-icon-right"></i>'
                        : '');
                option.options = option.options || [];
                if (option.options.length > 0)
                    html += self.createOptionsHtml(option, depth + 1);
                html += '</div>';
                if (self.depth < depth) self.depth = depth
            }
        });
        html += '</div>';
        return html
    };

    var self = {
        render: function (config) {
            new Class(config)
        }
    };
    exports('dropdownMenu', self)
});
