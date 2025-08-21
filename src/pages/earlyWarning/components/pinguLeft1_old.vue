<template>
    <div style="height: 85vh;">
        <div v-for="(item, index) in chartLeft" :key="index + item.title" style="height: 100%;">
            <div class="st_titles">
                {{ item.title }}
            </div>
            <div class="chart-container" v-loading="loading" element-loading-text="任务未执行"
                element-loading-spinner="el-icon-loading" element-loading-background="rgba(2,42,114,0.9)">
                <div :id=item.id style="height: 100%; width:100%;"></div>
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
                    title: '风速及故障概率变化图',
                    probability: ''
                },
                // {
                //     id: 'regulateLeft12',
                //     title: '风速及故障概率变化图',
                //     probability: ''
                // },
            ],
            colorLine: [
                ['#FFC22E', '#bfc', '#5EC2F2', '#FF4528', '#fff', '#dac', '#faa'],
                ['#bfc', '#5EC2F2', '#FF4528', '#fff', '#dac', '#faa', '#FFC22E'],
            ],
            chartInstances: [], // 存储图表实例
            yAxisData: [[], []],
            xAxisData: []
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
                    let option1 = this.getOption(this.xAxisData, this.yAxisData);
                    chartInstance.setOption(option1);
                    this.chartInstances.push(chartInstance); // 保存新的图表实例
                    window.addEventListener('resize', () => {
                        chartInstance.resize();
                    });
                }
            }
        },
        getOption(xAxisData, yAxisData) {
            return {
                tooltip: {
                    trigger: "axis",
                },
                legend: {
                    show: true,
                    left: "center",
                    top: "10",
                    textStyle: {
                        color: "#fff"
                    },
                },
                xAxis: {
                    type: "category",
                    data: xAxisData,
                    name: '时间',
                    nameTextStyle: {
                        color: '#fff',
                    },
                    boundaryGap: false,
                    axisLabel: {
                        show: true,
                        fontWeight: 'bold',
                        color: '#fff',
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#fff',
                            width: 1,
                        }
                    },
                },
                yAxis: yAxisData.map((item, index) => ({
                    type: "value",
                    name: index === 0 ? '风速/(m/s)' : '故障概率%',
                    nameTextStyle: {
                        fontWeight: 'bold',
                        color: '#fff',
                    },
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
                })),
                series: [
                    {
                        name: "风速",
                        type: "line",
                        smooth: true,
                        showSymbol: false,
                        symbol: "circle",
                        symbolSize: 6,
                        data: yAxisData[0],
                        itemStyle: {
                            color: '#5EC2F2',
                        },
                        lineStyle: {
                            width: 2.5,
                        },
                    },
                    {
                        name: "故障概率",
                        type: "line",
                        yAxisIndex: 1,
                        smooth: true,
                        showSymbol: false,
                        symbol: "circle",
                        symbolSize: 6,
                        data: yAxisData[1],
                        itemStyle: {
                            color: '#FFC22E',
                        },
                        lineStyle: {
                            width: 2.5,
                        },
                    },
                ],
            };
        },
    },
    mounted() {
        this.$bus.$on('PINGULEEFT1DATA', (data) => {
            console.log(data);
            this.yAxisData = [[], []]
            this.xAxisData = []
            data[0].data.forEach((item) => {
                // 时间
                this.xAxisData.push(item[0])
                // 风速
                this.yAxisData[0].push(item[1])
                // 故障概率
                this.yAxisData[1].push(item[2])
            })
            this.updateChart()
            this.loading = false
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
