/**
 * Created by yidi.zhao on 2018/3/30.
 */

import echarts from '../lib/echarts.min';
import IScroll from '../lib/iscroll';

export default class PriceTrend {
    constructor() {
        this.itemLength = 53; // 设置每一个节点的宽度
        this.currentIndex = -1; // 防止按钮被多次点击,默认第一个按钮被点击
    }

    setData(data, priceTrendDetailInfo){
        this.priceTime = [];
        this.priceHasIcon = [];
        this.price = [];
        this.data = data;
        this.startData = data[0].depDate; // 开始日期
        this.priceTrendDetailInfo = priceTrendDetailInfo;
        this.formatData();
        this.renderPriceTrend();
    }

    renderPriceTrend() {
        let width = this.itemLength * (this.priceHasIcon.length);
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

    /**
     * 格式化data
     */
    formatData() {
        let priceTime = [];
        let priceHasIcon = [];
        let price = [];
        this.data.forEach((item) => {
            priceTime.push(this.parseDate(item.depDate));
            priceHasIcon.push("¥" + item.price);
            price.push(item.price);
        });

        this.priceTime = priceTime;
        this.priceHasIcon = priceHasIcon;
        this.price = price;
    }

    /**
     * 将"2018-09-01" -> "09-01\n星期一"
     * @param date
     * @return {string}
     */
    parseDate(date) {
        let cn_week = ['日', '一', '二', '三', '四', '五', '六'];
        let time = new Date(date);
        date = date.split("-");
        return (date[1] + '.' + date[2] + '\n星期' + cn_week[time.getDay()]);
    }

    /**
     * 配置echart的options
     */
    setInitOption() {
        this.imageMarkLabel = new Image();
        this.imageMarkLabel.src = './img/bg.png';
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
                formatter: (value) => {
                    this.dealClick(value[0].dataIndex);
                },
                triggerOn: 'click', // click方式激活
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
                    data: this.priceTime,
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
                },
                {
                    type: 'category',
                    data: this.priceHasIcon,
                    position: "top",
                    boundaryGap: false,
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        onZero: false,
                        lineStyle: {
                            color: colors[0]
                        }
                    },
                    axisLabel: {
                        showMinLabel: true,
                        interval: 0, // 显示所有数值
                        color: colors[0],
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: 'solid',
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: colors[0],
                            }, {
                                offset: 1,
                                color: 'transparent',
                            }]),
                            width: 1,
                        }
                    },
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
                data: this.price,
                symbol: 'emptyCircle',
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
                        // backgroundColor: "#fff", // 使用颜色块
                        backgroundColor: {
                            image: this.imageMarkLabel, // 支持为 HTMLImageElement, HTMLCanvasElement，不支持路径字符串
                            repeat: 'repeat'
                        },
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
        this.setXRange(this.initOption); // 设置X轴的价格区间，得到初始的initOption

        this.drawChart();
    }

    /**
     * 开始绘制echarts,并且设置初始值，滚动到初始位置
     */
    drawChart(){
        let oneFrameTotal = Math.floor(window.innerWidth/this.itemLength/2);
        let index = Math.ceil((new Date(this.priceTrendDetailInfo.depDate) - new Date(this.startData))/86400000);
        let day = oneFrameTotal - index;

        // 首次默认选中
        let option1 = $.extend(true, {}, this.initOption); // 获取最初的option
        this.setClickShape(option1, index, this.price[index]);

        this.currentIndex = index; // 保存初始index

        // todo 不知道这个为什么滚不回去了
        // $("#wrapperX").scrollLeft(-day*this.itemLength); // 滚动到初始位置
    }

    /**
     * 设置X轴特殊数据的样式
     * @param option1
     */
    setXRange(option1){
        let selectStartTime = '2018-04-19';
        let selectEndTime = '2018-04-28';
        // 设置时间区间样式
        let startIndex = this.getDataIndex(this.data, selectStartTime);
        let endIndex = this.getDataIndex(this.data, selectEndTime, true);
        for(let i=startIndex;i<=endIndex;i++){
            option1.xAxis[0].data[i] = {
                value: this.priceTime[i],
                textStyle: {
                    color: "#fff"
                }
            };
        }
    }
    getDataIndex(arr, item, endTag){
        for(let i=0;i<arr.length;i++){
            if((new Date(item)-new Date(arr[i].date))/86400000 === 0){
                return i;
            } else if((new Date(item)-new Date(arr[i].date))/86400000 < 0){
                if(endTag){
                    return i-1;
                } else {
                    return i;
                }
            }
        }
    }

    /**
     * 处理选中的样式,边界节点废弃，没有效果(为了图能够衔接在一起)
     * @param index 选中的index
     */
    dealClick(index) {
        // 非点击的本节点和边界节点
        if (index !== this.currentIndex && index > 0 && index < this.price.length ) {
            let option2 = $.extend(true, {}, this.initOption);
            this.price[index] += 10;

            option2.series[0].data = this.price; // 更新数据
            this.setClickShape(option2, index, this.price[index]);

            this.currentIndex = index; // 保存本次的index
        }
    }

    /**
     * 设置点击按钮的特效
     * @param option1
     * @param index
     * @param newPrice
     */
    setClickShape(option1, index, newPrice){
        // 设置选中样式
        option1.series[0].data[index] = {
            value: newPrice,
            symbol: 'image://./img/btn.png',
            symbolSize: 40
        };
        option1.xAxis[0].data[index] = {
            value: this.priceTime[index].value || this.priceTime[index],
            textStyle: {
                color: "#c96e1e"
            }
        };
        option1.xAxis[1].data[index] = {
            value: this.priceHasIcon[index].value || this.priceHasIcon[index],
            textStyle: {
                color: "#c96e1e"
            }
        };
        this.myChart.setOption(option1); // 更新数据
    }
}