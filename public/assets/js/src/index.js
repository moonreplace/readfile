define(function (require) {

    $.get('/api/pv/portal/2015-12-02', function (data) {

        var keys = [];

        var androids = [];

        var ios = [];

        data.Android.forEach(function (dataObj) {
            Object.keys(dataObj).forEach(function (key) {
                keys.push(key.split('/')[2]);
                androids.push(dataObj[key]);
            });
        });

        data.ios.forEach(function (dataObj) {
            Object.keys(dataObj).forEach(function (key) {
                ios.push(dataObj[key]);
            });
        });

        var option = {
            title : {
                text: '首页的PV'
            },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['最高气温','最低气温']
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {show: true, type: ['line', 'bar']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : keys
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel : {
                        formatter: '{value}'
                    }
                }
            ],
            series : [
                {
                    name:'Android',
                    type:'line',
                    data: androids,
                    markPoint : {
                        data : [
                            {type : 'max', name: '最大值'},
                            {type : 'min', name: '最小值'}
                        ]
                    },
                    markLine : {
                        data : [
                            {type : 'average', name: '平均值'}
                        ]
                    }
                },
                {
                    name:'IOS',
                    type:'line',
                    data: ios,
                    markPoint : {
                        data : [
                            {type : 'max', name: '最大值'},
                            {type : 'min', name: '最小值'}
                        ]
                    },
                    markLine : {
                        data : [
                            {type : 'average', name : '平均值'}
                        ]
                    }
                }
            ]
        };

         var myChart = window.echarts.init(document.getElementById('main'));
         myChart.setOption(option);
    });
});
