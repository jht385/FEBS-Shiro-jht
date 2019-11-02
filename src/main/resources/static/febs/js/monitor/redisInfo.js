layui.use(['apexcharts', 'util', 'jquery', 'febs'], function () {
    var $ = layui.jquery,
        util = layui.util,
        febs = layui.febs,
        $view = $('#febs-redis-info');

    $view.find('a#continue').on('click', function () {
        var isTab = currentUser.isTab;
        if (isTab === '1') {
            febs.view.tab.refresh();
        } else {
            window.location.reload();
        }
    });

    var minMemory = 1e10;
    var maxMemory = -1e10;
    var currentTime = new Date().getTime();

    var memoryData = [
        {"x": util.toDateString(new Date(currentTime - 1000 * 16), 'mm:ss'), "y": 0.000},
        {"x": util.toDateString(new Date(currentTime - 1000 * 14), 'mm:ss'), "y": 0.000},
        {"x": util.toDateString(new Date(currentTime - 1000 * 12), 'mm:ss'), "y": 0.000},
        {"x": util.toDateString(new Date(currentTime - 1000 * 10), 'mm:ss'), "y": 0.000},
        {"x": util.toDateString(new Date(currentTime - 1000 * 8), 'mm:ss'), "y": 0.000},
        {"x": util.toDateString(new Date(currentTime - 1000 * 6), 'mm:ss'), "y": 0.000},
        {"x": util.toDateString(new Date(currentTime - 1000 * 4), 'mm:ss'), "y": 0.000},
        {"x": util.toDateString(new Date(currentTime - 1000 * 2), 'mm:ss'), "y": 0.000}
    ];

    var redisMemoryInterval = getRedisMemoryInterval();

    function getRedisMemoryInterval() {
        return setInterval(function () {
            var urlHash = window.location.hash;
            if (urlHash.indexOf('monitor/redis/info') !== -1) {
                $.get(ctx + 'redis/memoryInfo', function (r) {
                    var currentMemory = (r.used_memory / 102.4).toFixed(3);
                    if (currentMemory < minMemory) {
                        minMemory = currentMemory;
                    }
                    if (currentMemory > maxMemory) {
                        maxMemory = currentMemory;
                    }
                    memoryData.push({
                        "x": util.toDateString(new Date(), 'mm:ss'),
                        "y": currentMemory
                    });
                    if (memoryData.length > 8) {
                        memoryData.shift();
                    }
                    redisMemoryChart.updateSeries([{
                        data: memoryData,
                        yaxis: {
                            min: minMemory,
                            max: maxMemory
                        }
                    }]);
                });
            }
        }, 2e3);
    }

    var redisMemoryChartOptions = {
        chart: {
            height: 320,
            type: 'area',
            animations: {
                enabled: true,
                easing: 'linear',
                dynamicAnimation: {
                    speed: 2000
                }
            },
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        xaxis: {
            axisTicks: {
                show: false
            },
            axisBorder: {
                show: true,
                color: '#f1f1f1'
            }
        },
        series: [{
            name: '实时内存占用（kb)',
            data: memoryData
        }],
        markers: {
            size: 0
        },
        legend: {
            show: false
        },
        grid: {
            row: {
                colors: ['transparent', 'transparent'],
                opacity: 0.2
            },
            borderColor: '#f1f3fa'
        }
    };

    var redisMemoryChart = new ApexCharts(
        document.querySelector("#redisMemoryChart"),
        redisMemoryChartOptions
    );

    redisMemoryChart.render();


    var minKeySize = 1e10;
    var maxKeySize = -1e10;

    var KeySizeData = [
        {"x": util.toDateString(new Date(currentTime - 1000 * 16), 'mm:ss'), "y": 0.000},
        {"x": util.toDateString(new Date(currentTime - 1000 * 14), 'mm:ss'), "y": 0.000},
        {"x": util.toDateString(new Date(currentTime - 1000 * 12), 'mm:ss'), "y": 0.000},
        {"x": util.toDateString(new Date(currentTime - 1000 * 10), 'mm:ss'), "y": 0.000},
        {"x": util.toDateString(new Date(currentTime - 1000 * 8), 'mm:ss'), "y": 0.000},
        {"x": util.toDateString(new Date(currentTime - 1000 * 6), 'mm:ss'), "y": 0.000},
        {"x": util.toDateString(new Date(currentTime - 1000 * 4), 'mm:ss'), "y": 0.000},
        {"x": util.toDateString(new Date(currentTime - 1000 * 2), 'mm:ss'), "y": 0.000}
    ];

    var redisKeySizeInterval = getRedisKeySizeInterval();

    function getRedisKeySizeInterval() {
        return setInterval(function () {
            var urlHash = window.location.hash;
            if (urlHash.indexOf('monitor/redis/info') !== -1) {
                $.get(ctx + 'redis/keysSize', function (r) {
                    var currentKeySize = r.dbSize;
                    if (currentKeySize < minKeySize) {
                        minKeySize = currentKeySize;
                    }
                    if (currentKeySize > maxKeySize) {
                        maxKeySize = currentKeySize;
                    }
                    KeySizeData.push({
                        "x": util.toDateString(new Date(), 'mm:ss'),
                        "y": currentKeySize
                    });
                    if (KeySizeData.length > 8) {
                        KeySizeData.shift();
                    }
                    redisKeySizeChart.updateSeries([{
                        data: KeySizeData,
                        yaxis: {
                            min: minKeySize,
                            max: maxKeySize
                        }
                    }]);
                });
            }
        }, 2e3);
    }

    var redisKeySizeChartOptions = {
        chart: {
            height: 320,
            type: 'area',
            animations: {
                enabled: true,
                easing: 'linear',
                dynamicAnimation: {
                    speed: 2000
                }
            },
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            }
        },
        colors: ['#775DD0'],
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        series: [{
            name: '实时key个数（个)',
            data: KeySizeData
        }],
        xaxis: {
            axisTicks: {
                show: false
            },
            axisBorder: {
                show: true,
                color: '#f1f1f1'
            }
        },
        markers: {
            size: 0
        },
        legend: {
            show: false
        },
        grid: {
            row: {
                colors: ['transparent', 'transparent'],
                opacity: 0.2
            },
            borderColor: '#f1f3fa'
        }
    };

    var redisKeySizeChart = new ApexCharts(
        document.querySelector("#redisKeySizeChart"),
        redisKeySizeChartOptions
    );

    redisKeySizeChart.render();

    febs.routeLeave(function (route, nextPath, next) {
        clearInterval(redisMemoryInterval);
        clearInterval(redisKeySizeInterval);
        next();
        $view.find('a#continue').parents('.febs-hide').show();
    })

});