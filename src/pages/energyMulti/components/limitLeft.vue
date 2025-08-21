<template>
    <div style="height: 100%;">
        <div v-for="(item, index) in chartLeft" :key="index" style="height: 50%;">
            <div class="st_titles">
                {{ item.title }}-场景概率{{ item.probability }}
            </div>
            <div class="chart-container" v-loading="loading" element-loading-text="任务未执行"
                element-loading-spinner="el-icon-loading" element-loading-background="rgba(2,42,114,0.9)">
                <div :id=item.id style="height: 100%; width: 100%;"></div>
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
                    id: 'leftlimt1',
                    title: '不确定域上下界',
                    probability: ''
                },
                {
                    id: 'leftlimt2',
                    title: '不确定域上下界',
                    probability: ''
                },
            ],
            colorLine: [
                ['#FFC22E', '#bfc', '#5EC2F2', '#FF4528', '#fff', '#dac', '#faa'],
                ['#bfc', '#5EC2F2', '#FF4528', '#fff', '#dac', '#faa', '#FFC22E'],
            ],
            chartInstances: [], // 存储图表实例
            // 时间
            texts: [],
            // 不确定域下界
            bottoms: [],
            // 不确定域上界
            tops: [],
            // 聚类中心值
            center: []
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

            for (let i = 0; i < this.chartLeft.length; i++) {
                let chartDom1 = document.getElementById(this.chartLeft[i].id);
                if (chartDom1) {
                    let chartInstance = echarts.init(chartDom1);
                    this.tops[i].forEach((item, index) => {
                        this.tops[i][index] = this.tops[i][index] - this.bottoms[i][index]
                    })
                    let option1 = this.getOption(this.texts[i], this.bottoms[i], this.tops[i], this.center[i]);
                    chartInstance.setOption(option1);
                    this.chartInstances.push(chartInstance); // 保存新的图表实例
                    window.addEventListener('resize', () => {
                        chartInstance.resize();
                    });
                }
            }
        },
        getOption(texts, bottoms, tops, center) {
            return {
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        let relVal = params[0].axisValue + '<br/>';
                        relVal += params[1].seriesName + ':' + (params[0].value + params[1].value) + '<br/>';
                        relVal += params[2].seriesName + ':' + params[2].value + '<br/>';
                        relVal += params[0].seriesName + ':' + params[0].value + '<br/>';
                        return relVal;
                    },
                },
                legend: {
                    bottom: 0,
                    textStyle: {
                        color: 'rgb(55, 209, 259)',
                    },
                },
                xAxis: {
                    name: '时间',
                    axisLabel: {
                        // show: true,
                        color: '#fff',
                        fontSize: 12
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#fff',
                            width: 1,//这里是为了突出显示加上的
                        }
                    },
                    // scale: true,
                    data: texts
                },
                yAxis: {
                    name: '风电出力/pu',
                    axisLabel: {
                        // show: true,
                        color: '#fff',
                        fontSize: 12
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#fff',
                            width: 1,//这里是为了突出显示加上的
                        }
                    },
                    min: 0,
                    max: 1,
                    // scale: true,
                },
                series: [
                    {
                        name: "不确定域下界",
                        type: "line",
                        smooth: false,
                        symbol: "circle",
                        stack: "总量", // 数据堆叠，同个类目轴上系列配置相同的 stack 值可以堆叠放置
                        symbolSize: 0,
                        showSymbol: false,
                        // 折线颜色
                        lineStyle: {
                            color: '#FFC22E',
                            type: "solid",
                            width: 3,
                        },
                        areaStyle: {
                            color: "rgba(255,255,255,0)"
                        },
                        data: bottoms
                    },
                    {
                        name: "不确定域上界",
                        type: "line",
                        smooth: false,
                        symbol: "circle",
                        stack: "总量", // 数据堆叠，同个类目轴上系列配置相同的 stack 值可以堆叠放置
                        symbolSize: 0,
                        showSymbol: false,
                        // 折线颜色
                        lineStyle: {
                            color: '#FF4528',
                            type: "solid",
                            width: 3,
                        },
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(
                                1,
                                0,
                                1,
                                1,
                                [
                                    {
                                        offset: 0,
                                        color: "#11ffff",
                                    },
                                    {
                                        offset: 1,
                                        color: "#11ffff",
                                    },
                                ],
                                false
                            ),
                        },
                        data: tops
                    },
                    {
                        name: "聚类中心值",
                        type: "line",
                        symbolSize: 0,
                        symbol: "circle",
                        showAllSymbol: true,
                        // 折线颜色
                        lineStyle: {
                            color: '#bfc',
                            type: "solid",
                            width: 3,
                        },
                        data: center
                    },
                ],
            };
        },
        computerCharts(data) {
            this.texts = []
            this.bottoms = []
            this.tops = []
            this.center = []
            this.chartLeft = []
            data.forEach((items, indexs) => {
                this.texts.push([])
                this.bottoms.push([])
                this.tops.push([])
                this.center.push([])
                this.chartLeft.push({
                    id: 'leftlimt' + indexs,
                    title: '不确定域上下界',
                    probability: items[1]
                })
                items[0].forEach((item) => {
                    this.texts[indexs].push(item[0])
                    this.bottoms[indexs].push(item[1])
                    this.tops[indexs].push(item[3])
                    this.center[indexs].push(item[2])
                })
            })
            this.$nextTick(() => {
                this.updateChart()
                this.loading = false
            })
        },
        openFalse() {
            this.$notify.error({
                title: '错误',
                message: '该日期间暂无数据'
            });
        },
    },
    mounted() {
        this.$bus.$on('RestorationDatas', (allData) => {
            this.computerCharts(allData[1].data)
        })
    },
    activated() {
        // activated钩子执行resize()方法
        this.$nextTick(() => {
            this.chartInstances.forEach((item => {
                item.resize();
            }))
        });
        // this.throttledPostBegain(this.getWindData);
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
