<template>
    <div style="height: 50%;">
        <div v-for="(item, index) in chartLeft" :key="index" style="height: 100%;">
            <div class="st_titles">
                {{ item.title }}
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
                    id: 'rightlimit11',
                    title: '恢复占比',
                },
            ],
            colorLine: [
                ['#FFC22E', '#bfc', '#5EC2F2', '#FF4528', '#fff', '#dac', '#faa'],
                ['#bfc', '#5EC2F2', '#FF4528', '#fff', '#dac', '#faa', '#FFC22E'],
            ],
            xAxisData: [],
            seriesName: [],
            seriesData: [[], [], [], []],
            chartInstances: [], // 存储图表实例
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
                    let option1 = this.getOption(this.xAxisData, this.seriesName, this.seriesData);
                    chartInstance.setOption(option1);
                    this.chartInstances.push(chartInstance); // 保存新的图表实例
                    window.addEventListener('resize', () => {
                        chartInstance.resize();
                    });
                }
            }
        },
        getOption(xAxisData, seriesName, seriesData) {
            return {
                color: ['#FFC22E', '#bfc', '#5EC2F2', '#FF4528', '#fff', '#dac', '#faa'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                    },
                    formatter: function (params) {
                        let relVal = params[0].name + '<br/>';
                        relVal += params[0].seriesName + ':' + Math.abs(params[0].value) + '<br/>';
                        relVal += params[1].seriesName + ':' + Math.abs(params[1].value) + '<br/>';
                        relVal += params[2].seriesName + ':' + Math.abs(params[2].value) + '<br/>';
                        relVal += params[3].seriesName + ':' + Math.abs(params[2].value) + '<br/>';
                        return relVal; //负数取绝对值变正数
                    },

                },
                legend: {
                    bottom: 0,
                    textStyle: {
                        color: 'rgb(55, 209, 259)',
                    },
                },
                dataZoom: [
                    {
                        type: 'inside', //无滑动条内置缩放   type: 'slider', //缩放滑动条
                        filterMode: 'filter',
                        xAxisIndex: [0], //X轴滑动
                        start: 1,
                        end: 100,
                    },
                ],
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
                    scale: true,
                    data: xAxisData
                },
                yAxis: {
                    name: '恢复比率/%',
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
                    scale: true,
                },
                series: [
                    {
                        name: seriesName[0],
                        symbol: "diamond",
                        type: 'line',
                        yAxisIndex: 0,
                        data: seriesData[0]
                    },
                    {
                        name: seriesName[1],
                        symbol: "diamond",
                        type: 'line',
                        yAxisIndex: 0,
                        data: seriesData[1]
                    },
                    {
                        name: seriesName[2],
                        symbol: "diamond",
                        type: 'line',
                        yAxisIndex: 0,
                        data: seriesData[2]
                    },
                    {
                        name: seriesName[3],
                        symbol: "diamond",
                        type: 'line',
                        yAxisIndex: 0,
                        data: seriesData[3]
                    },

                ]
            };
        },
        computerCharts(data) {
            this.xAxisData = []
            this.seriesName = []
            this.seriesData = [[], [], [], []]
            this.seriesName = data[1]
            data[0].forEach((item) => {
                this.xAxisData.push(item[0])
                this.seriesData[0].push(item[1])
                this.seriesData[1].push(item[2])
                this.seriesData[2].push(item[3])
                this.seriesData[3].push(item[4])
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
            this.computerCharts(allData[8].data)
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
