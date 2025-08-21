<template>
    <div style="height: 85vh;">
        <div v-for="(item, index) in chartLeft" :key="index" style="height: 50%;">
            <div class="st_titles">
                {{ item.title }}
            </div>
            <div class="chart-container" v-loading="loading" element-loading-text="任务未执行"
                element-loading-spinner="el-icon-loading" element-loading-background="rgba(2,42,114,0.9)">
                <div :id=item.id style="height: 100%;width: 100%;"></div>
            </div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    components: {
    },
    data() {
        return {
            loading: true,
            chartLeft: [
                {
                    id: 'regulateLeft11',
                    title: '不同模型出力对比图',
                    seriesType: 'line',
                    yAxisName: '功率/KW'
                },
                {
                    id: 'regulateLeft12',
                    title: '确定性模型储能出力图',
                    seriesType: 'bar',
                    yAxisName: '储能出力/KW'
                },
            ],
            leftData: [
                // 左一
                [
                    {
                        name: '确定出力',
                        data: []
                    },
                    {
                        name: '机会出力',
                        data: []
                    },
                    {
                        name: '风险出力',
                        data: []
                    },
                ],
                // 左二
                [
                    {
                        name: '储能充电',
                        data: []
                    },
                    {
                        name: '储能放电',
                        data: []
                    },
                ],
            ],
            colorLine: [
                ['#14c8d4', '#faa', '#5EC2F2', '#FF4528', '#fff', '#dac', '#faa'],
                ['#14c8d4', '#faa', '#5EC2F2', '#FF4528', '#fff', '#dac', '#faa'],
                ['#14c8d4', '#faa', '#5EC2F2', '#FF4528', '#fff', '#dac', '#faa'],
                ['#14c8d4', '#faa', '#5EC2F2', '#FF4528', '#fff', '#dac', '#faa'],
                ['#FFC22E', '#FF4528', '#FF4528', '#fff', '#dac', '#faa', '#FFC22E'],
                ['#dac', '#43eec6', '#fff', '#dac', '#faa', '#FFC22E', '#bfc'],
                ['#ccffaa', '#FFC22E', '#fff', '#faa', '#FFC22E', '#bfc', '#5EC2F2'],
            ],
            chartInstances: [], // 存储图表实例
            allTime: [],
        };
    },
    methods: {
        updateChart() {
            // 销毁之前的图表实例
            this.chartInstances.forEach(instance => {
                if (instance) {
                    window.removeEventListener('resize', instance.resize);//销毁图表监听事件
                    instance.dispose();
                }
            });
            this.chartInstances = [];

            // 左侧
            for (let i = 0; i < this.chartLeft.length; i++) {
                var chartDom1 = document.getElementById(this.chartLeft[i].id);
                let chartInstance = echarts.init(chartDom1);
                var option1 = this.getOption(this.leftData[i], this.chartLeft[i].seriesType, this.chartLeft[i].yAxisName, this.colorLine[i],);
                chartInstance.setOption(option1);
                window.addEventListener('resize', () => {
                    chartInstance.resize();
                });
                this.chartInstances.push(chartInstance);
            }
        },
        getOption(data, seriesType, yAxisName, colorLine) {
            return {
                title: {

                },
                legend: {
                    bottom: 0,
                    textStyle: {
                        color: 'rgb(55, 209, 259)',
                    },
                },
                toolbox: {

                },
                tooltip: {
                    trigger: 'axis',
                },
                xAxis: {
                    name: 't/h',
                    nameTextStyle: {
                        color: '#fff',
                    },
                    data: this.allTime,
                    axisLabel: {
                        show: true,
                        fontWeight: 'bold',
                        color: '#fff',
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#fff',
                            width: 1,//这里是为了突出显示加上的
                        }
                    },
                },
                yAxis: [
                    {
                        name: yAxisName,
                        nameTextStyle: {
                            fontWeight: 'bold',
                            color: '#fff',
                        },
                        type: 'value',
                        axisLabel: {
                            show: true,
                            color: '#fff',
                            fontWeight: 'bold'
                        },
                        axisPointer: {
                            snap: true,
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#fff',
                                width: 1,//这里是为了突出显示加上的
                            }
                        },
                    },
                ],
                series: data.map((item, index) => ({
                    name: item.name,
                    type: seriesType,
                    data: item.data,
                    showSymbol: true,//是否默认展示圆点
                    symbol: "diamond",
                    symbolSize: 12,
                    smooth: true,
                    emphasis: {
                        focus: 'series'
                    },
                    itemStyle: {
                        color: colorLine[index], // 设置单独的颜色
                    },
                    animationDelay: function (idx) {
                        return idx * 10;
                    }
                })),
                animationEasing: 'elasticOut',
                animationDelayUpdate: function (idx) {
                    return idx * 5;
                }
            };
        },
        computerCharts(alldata) {
            this.allTime = []
            alldata[0].data.forEach((item, index) => {
                this.leftData[0][index].data = []
                item[1].forEach((item1) => {
                    if (index === 0) {
                        this.allTime.push(item1[0])
                    }
                    this.leftData[0][index].data.push(item1[1])
                })
            })
            alldata[3].data.forEach((item, index) => {
                this.leftData[1][index].data = []
                item[1].forEach((item1) => {
                    this.leftData[1][index].data.push(item1[1])
                })
            })
            this.$nextTick(() => {
                this.updateChart()
                this.loading = false
            })
        },
    },
    mounted() {
        this.$bus.$on('chartsRegulate', (allData) => {
            this.computerCharts(allData)
        })
    },
}
</script>

<style lang="scss" scoped>
.st_titles {
    background-size: 100% 107%;
    background-repeat: no-repeat;
    background-image: url('../../../assets/img/ch/item_new.png');
}

.chart-container {
    position: relative;
    height: calc(100% - 4vh);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-image: url('../../../assets/img/ch/chbg_new.png');
    transform: translateX(-50%);
    animation-name: moveRight;
    animation-duration: 1.5s;
    animation-fill-mode: forwards;

    /deep/.el-loading-spinner i {
        color: #40f3ff00;
        // font-size: 8vh;
    }

    /deep/.el-loading-spinner {
        // top: 36%;
    }
}
</style>
