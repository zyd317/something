/**
 * Created by yidi.zhao on 2018/3/30.
 */
export default class GetPriceTrend{
    constructor(data, priceTrendDetailInfo) {
        this.itemLength = 53; // 设置每一个节点的宽度
        this.currentIndex = -1; // 防止按钮被多次点击,默认第一个按钮被点击
        setData(data, priceTrendDetailInfo);
    }

    setData(data, priceTrendDetailInfo) {
        this.priceTime = [];
        this.priceHasIcon = [];
        this.price = [];
        this.data = data;
        this.startData = data[0].depDate; // 开始日期
        this.priceTrendDetailInfo = priceTrendDetailInfo;
        this.formatData();
    }

    renderPriceTrend() {
        $("#price-trend")
            .removeClass("m-place-holder")
            .css({"background": "#142946"})
            .html(Mustache.render(index, {width: this.itemLength * (this.priceHasIcon.length)}));
        this.render();
    }

    /**
     * 格式化data
     */
    formatData() {
        var priceTime = [];
        var priceHasIcon = [];
        var price = [];
        this.data.forEach((item){
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
        var cn_week = ['日', '一', '二', '三', '四', '五', '六'];
        var time = new Date(date);
        date = date.split("-");
        return (date[1] + '.' + date[2] + '\n星期' + cn_week[time.getDay()]);
    }

    /**
     * 配置echart的options
     */
    render() {
        this.imageMarkLabel = new Image();
        this.imageMarkLabel.src = 'https://s.qunarzz.com/flight_hd/lowFlight/bg.png';
        var dom = document.getElementById("container");
        // var myChart = echarts.init(dom, null, {renderer: 'svg'});
        this.myChart = echarts.init(dom);
        var colors = ['#4682B4', '#48D1CC', '#675bba'];
        var option = {
            animation: false, // 不使用动画
            grid: { // 直角坐标系的位置,left.right隐藏边界值
                left: -30,
                top: 30, // 防止X轴被遮挡
                right: -30,
                bottom: 0
            },
            tooltip: { // 提示框组件
                trigger: 'axis', // 三维度激活
                formatter: (value) => {
                this.dealClick(value[0].dataIndex, true);
    },
        triggerOn: 'click', // click方式激活
            axisPointer: { // 线的样式
            type: 'cross',
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
                offset: -45,
                boundaryGap: false,
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'solid',
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: colors[0]
                        }, {
                            offset: 1,
                            color: 'transparent'
                        }]),
                        width: 1
                    }
                },
                axisLabel: {
                    showMinLabel: true,
                    interval: 0,
                    color: '#fff'
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
                    color: colors[0]
                }
            }
        ],
            yAxis: { // y轴不展示
            show: false,
                max: (value) => { // 设置Y轴最大值，避免遮挡X轴上坐标展示
                return value.max + 100;
            },
            min: (value) => { // 设置Y轴最大值，避免遮挡X轴上坐标展示
                return value.min - 1500;
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
                }])
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
                    yAxis: this.priceTrendDetailInfo.price // Y轴的值
                }]
            }
        }]
    };

        this.myChart.setOption(option);
        this.optionTemp = JSON.stringify(option); // 保存最初的option

        this.scrollToLowestData();
    }

    /**
     * 初始滚动价格到指定位置
     * 计算出每一栏的宽度，使其滚动的中间
     */
    scrollToLowestData(){
        var oneFrameTotal = Math.floor(window.innerWidth / this.itemLength / 2);
        var index = Math.ceil((new Date(this.startData) - new Date(this.priceTrendDetailInfo.depDate)) / 86400000);
        var day = index + oneFrameTotal;
        $("#echarts").scrollLeft(-day * this.itemLength);
        this.dealClick(-index, false);
    }

    /**
     * 处理选中的样式,边界节点废弃，没有效果(为了图能够衔接在一起)
     * @param index 选中的index
     * @param needGetNewData 是否需要请求数据，第一次的时候不需要
     */
    dealClick(index, needGetNewData) {
        if (index !== this.currentIndex && index > 0 && index < this.price.length) {
            var option1 = JSON.parse(this.optionTemp); // 获取最初的option
            var beforePrice = this.price[index]; // 该节点上次的数值
            var newPrice = beforePrice; // 该节点重新请求数据的值

            // 首次默认选中
            option1.series[0].data[index] = {
                value: newPrice,
                symbol: 'image://https://s.qunarzz.com/flight_hd/lowFlight/btn.png',
                symbolSize: 40
            };
            this.myChart.setOption(option1); // 更新数据
            this.currentIndex = index; // 保存本次的index
        }
    }
}