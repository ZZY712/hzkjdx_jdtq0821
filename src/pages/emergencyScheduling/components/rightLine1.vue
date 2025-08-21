<template>
    <div id="topologyCardRight1" class="cardTopology" v-loading="loading" element-loading-text="任务未执行"
        element-loading-spinner="el-icon-loading" element-loading-background="rgba(2,42,114,0.2)"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    data() {
        return {
            loading: true,
            colorLine: ['#5EC2F2', '#14c8d4', '#FF4528', '#fff', '#bfc', '#dac', '#faa'],
            leftData: [
                {
                    name: [],
                    data: [0, 0, 0, 0],
                    xAxisData: [0, 0, 0, 0],
                }
            ],
            titleName: '灾害发生后光伏机组的预测出力',
            chartInstances: [],
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
            let chartDom1 = document.getElementById('topologyCardRight1');
            if (chartDom1) {
                let chartInstance = echarts.init(chartDom1);
                let option1 = this.getOption(this.leftData);
                chartInstance.setOption(option1);
                this.chartInstances.push(chartInstance); // 保存新的图表实例
                window.addEventListener('resize', () => {
                    chartInstance.resize();
                });
            }
        },
        getOption(data) {
            return {
                title: {
                    text: this.titleName,
                    textStyle: {
                        color: '#fff',
                    },
                    left: 'center',
                },
                tooltip: {
                    trigger: 'axis',
                },
                legend: {
                    bottom: 0,
                    textStyle: {
                        color: '#fff',
                    },
                },
                xAxis: {
                    type: 'category',
                    data: data[0].xAxisData,
                    axisLabel: {
                        show: true,
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: 10,
                    },
                },
                yAxis: [
                    {
                        name: '预测出力',
                        type: 'value',
                        nameTextStyle: {
                            color: '#fff',
                            fontWeight: 'bold'
                        },
                        axisLabel: {
                            show: true,
                            color: '#fff',
                            fontWeight: 'bold'
                        },
                        axisPointer: {
                            snap: true,
                        },
                    },
                ],
                series: data[0].data.map((item, index) => ({
                    name: '节点' + data[0].name[index],
                    type: 'line',
                    data: item,
                })),
            };
        },
        // 处理光伏机组预测出力
        computerData(allData) {
            let xAxisData = [];
            let powerData = {};
            this.leftData = [
                {
                    name: [],
                    data: [],
                    xAxisData: [],
                }
            ]
            allData.data[1].date[0].forEach((item) => {
                // 时间
                // item[1] = item[1].split(' ')[1]
                if (!xAxisData.includes(item[1])) {
                    xAxisData.push(item[1]);
                }
                // 节点
                if (!this.leftData[0].name.includes(item[0])) {
                    this.leftData[0].name.push(item[0]);
                }
                // 处理 powerData
                if (!powerData[item[0]]) {
                    powerData[item[0]] = [];
                }
                if (item[3]) {
                    powerData[item[0]].push(item[3]);
                }
            })
            this.leftData[0].xAxisData = xAxisData
            this.leftData[0].name.forEach((item) => {
                this.leftData[0].data.push(powerData[item])
            })
            this.updateChart()
            this.loading = false
        }
    },
    mounted() {
        this.$bus.$on('LastData', (allData) => {
            this.computerData(allData)
        })
    },
    beforeDestroy() {
    }
}
</script>

<style lang="scss" scoped>
.cardTopology {
    height: 30vh;

    /deep/.el-loading-spinner i {
        color: #40f3ff00;
        // font-size: 8vh;
    }

    /deep/.el-loading-mask {
        z-index: 999;
    }
}
</style>
