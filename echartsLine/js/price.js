/**
 * Created by yidi.zhao on 2018/3/30.
 */

import echarts from '../lib/echarts.min';
import IScroll from '../lib/iscroll';

export default class PriceTrend {
    constructor(data) {
        this.data = data;
        this.itemLength = 32; // 设置每一个节点的宽度
        this.currentIndex = this.data.todayIndex; // 今天
        this.renderPriceTrend();
    }

    renderPriceTrend() {
        let width = this.itemLength * (this.data.price.length); // 宽度
        $("#price-trend")
            .removeClass("m-place-holder")
            .css({"background": "#142946"})
            .html('<div class="m-echarts" id="echarts">' +
                    '<div class="m-container" style="width:' + width + 'px">' +
                    '<div id="container" class="m-container"></div>' +
                '</div></div>');
        this.setInitOption();
        this.initScroll();
    }

    /**
     * 配置echart的options
     */
    setInitOption() {
        let dom = document.getElementById("container");
        // var myChart = echarts.init(dom, null, {renderer: 'svg'});
        this.myChart = echarts.init(dom);
        let colors = ['#4682B4', '#48D1CC', '#675bba'];

        // 设置最初的option
        this.initOption = {
            animation: false, // 不使用动画
            grid: { // 直角坐标系的位置,left.right隐藏边界值
                left: -10,
                top: 30, // 防止X轴被遮挡
                right: -30,
                bottom: 0
            },
            tooltip: { // 提示框组件
                trigger: 'axis', // 三维度激活
                triggerOn: 'none', // click方式激活
                axisPointer: { // 线的样式
                    type: 'line',
                    snap: true,
                    label: {
                        backgroundColor: "transparent",
                        color: '#FF8C00'
                    },
                    lineStyle: {
                        opacity: 0 // 删除竖线
                    },
                    crossStyle: {
                        opacity: 0 // 删除横线
                    }
                }
            },
            xAxis: [
                {
                    type: 'category',
                    data: this.data.date,
                    inside: true,
                    offset: -60,
                    z: 100,
                    boundaryGap: false,
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        showMinLabel: true,
                        interval: 0,
                        color: '#6dccd9'
                    }
                }
            ],
            yAxis: { // y轴不展示
                show: false,
                max: (value) => { // 设置Y轴最大值，避免遮挡X轴上坐标展示
                    return value.max + 100;
                },
                min: (value) => { // 设置Y轴最大值，避免遮挡X轴上坐标展示
                    return value.min - 1000;
                },
                axisPointer: { // 线的样式
                    show: false
                }
            },
            series: [{
                data: "¥"+this.data.price,
                symbol: 'circle',
                symbolSize: 20,
                type: 'line',
                smooth: true,
                areaStyle: {
                    origin: "start", // 颜色填充坐标轴底部
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgb(15, 255, 183)'
                    }, {
                        offset: 1,
                        color: 'rgb(6, 134, 190)'
                    }]),
                },
                lineStyle: {
                    normal: {
                        color: colors[1],
                        width: 1,
                        type: 'solid'
                    }
                },
                itemStyle: {
                    normal: {
                        borderWidth: 2,
                        borderColor: colors[1],
                        color: colors[1]
                    }
                },
                //期望价格
                markLine: {
                    symbol: 'none',
                    label: {
                        position: 'start',
                        backgroundColor: "#fff", // 使用颜色块
                        padding: [4, 12, 4, 4],
                        color: '#616161',
                        fontSize: 10,
                        formatter: '最低价{help|￥' + this.priceTrendDetailInfo.price + '}',
                        rich: {
                            help: {
                                color: '#FF8C00'
                            }
                        }
                    },
                    lineStyle: {
                        color: '#FF8C00'
                    },
                    data: [ { // data设置出错会导致基准线无法显示
                        x: 105, // 距离Y轴的距离
                        yAxis: this.priceTrendDetailInfo.price, // Y轴的值
                    }]
                }
            }]
        };
        this.myChart.setOption(this.initOption);
    }

    /**
     * 初始化scroll
     */
    initScroll(){
        if(this.myScrollX) {
            this.myScrollX.refresh();
            return;
        }
        //水平方向的scroll
        if($('#scrollerX .m-container').length>0) {
            let width = $('#scrollerX .m-container').width();
            $('#scrollerX').css({width: width});
            this.myScrollX = new IScroll('#wrapperX', { scrollX: true, scrollY: false });
            this.myScrollX.refresh();
        }
    }
}