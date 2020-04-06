layui.use(['apexcharts', 'febs', 'jquery', 'util'], function () {
    var $ = layui.jquery,
        util = layui.util,
        $view = $('#febs-index'),
        febs = layui.febs;

    febs.get(ctx + 'index/' + currentUser.username, null, function (r) {
        handleSuccess(r.data);
    });

    function handleSuccess(data) {
        var hour = new Date().getHours();
        var time = hour < 6 ? '早上好' : (hour <= 11 ? '上午好' : (hour <= 13 ? '中午好' : (hour <= 18 ? '下午好' : '晚上好')));
        var welcomeArr = [
            '喝杯咖啡休息下吧☕',
            '要不要和朋友打局LOL',
            '今天又写了几个Bug呢',
            '今天在群里吹水了吗',
            '今天吃了什么好吃的呢',
            '今天您微笑了吗😊',
            '今天帮助别人了吗',
            '准备吃些什么呢',
            '周末要不要去看电影？'
        ];
        var index = Math.floor((Math.random() * welcomeArr.length));
        var welcomeMessage = time + '，<a id="febs-index-user">' + currentUser.username + '</a>，' + welcomeArr[index];
        $view.find('#today-ip').text(data.todayIp).end()
            .find('#today-visit-count').text(data.todayVisitCount).end()
            .find('#total-visit-count').text(data.totalVisitCount).end()
            .find('#user-dept').text(currentUser.deptName ? currentUser.deptName : '暂无所属部门').end()
            .find('#user-role').text(currentUser.roleName ? currentUser.roleName : '暂无角色').end()
            .find('#last-login-time').text(currentUser.lastLoginTime ? currentUser.lastLoginTime : '第一次访问系统').end()
            .find('#welcome-message').html(welcomeMessage).end()
            .find('#user-avatar').attr('src', ctx + "febs/images/avatar/" + currentUser.avatar);

        var currentTime = new Date().getTime();
        var yourVisitCount = [];
        var totalVisitCount = [];
        var lastTenDays = [
            util.toDateString(new Date(currentTime - 1000 * 9 * 86400), 'MM-dd'),
            util.toDateString(new Date(currentTime - 1000 * 8 * 86400), 'MM-dd'),
            util.toDateString(new Date(currentTime - 1000 * 7 * 86400), 'MM-dd'),
            util.toDateString(new Date(currentTime - 1000 * 6 * 86400), 'MM-dd'),
            util.toDateString(new Date(currentTime - 1000 * 5 * 86400), 'MM-dd'),
            util.toDateString(new Date(currentTime - 1000 * 4 * 86400), 'MM-dd'),
            util.toDateString(new Date(currentTime - 1000 * 3 * 86400), 'MM-dd'),
            util.toDateString(new Date(currentTime - 1000 * 2 * 86400), 'MM-dd'),
            util.toDateString(new Date(currentTime - 1000 * 86400), 'MM-dd'),
            util.toDateString(new Date(currentTime), 'MM-dd')
        ];


        layui.each(lastTenDays, function (k, i) {
            var contain = false;
            layui.each(data.lastSevenUserVisitCount, function (key, item) {
                if (i === item.days) {
                    yourVisitCount.push(item.count);
                    contain = true;
                }
            });
            if (!contain) yourVisitCount.push(0);
            contain = false;
            layui.each(data.lastSevenVisitCount, function (key, item) {
                if (i === item.days) {
                    totalVisitCount.push(item.count);
                    contain = true;
                }
            });
            if (!contain) totalVisitCount.push(0);
        });

        var options = {
            chart: {
                height: 350,
                type: 'area',
                toolbar: {
                    show: false
                }
            },
            colors: ['#1890ff', '#0acf97'],
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '32rem'
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
            	width: [3, 3],
                curve: 'smooth'
            },
            series: [{
                name: '总数',
                data: totalVisitCount
            }, {
                name: '您',
                data: yourVisitCount
            }],
            xaxis: {
                categories: lastTenDays,
                axisTicks: {
                    show: true
                },
                axisBorder: {
                    show: true,
                    color: '#f1f1f1'
                }
            },
            fill: {
            	type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: false,
                    opacityFrom: 0.5,
                    opacityTo: 0,
                    stops: [0, 90, 100]
                }
            },
            title: {
                text: '近10天系统访问记录',
                align: 'left',
                style: {
                    color: 'rgba(0, 0, 0, .65)'
                }
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return "访问次数 " + val + " 次"
                    }
                }
            },
            grid: {
                row: {
                    colors: ['transparent', 'transparent'],
                    opacity: 0.2
                },
                borderColor: '#f1f1f1'
            }
        };

        new ApexCharts(
            document.querySelector("#chart"),
            options
        ).render();
    }

    $view.on('click', '#febs-index-user',function () {
        febs.navigate("/user/profile");
    })
});