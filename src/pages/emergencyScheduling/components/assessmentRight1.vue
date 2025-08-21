<template>
    <div style="height: 85vh;">
        <div style="height: 50%;">
            <div class="st_titles">
                网损-电压稳定性-最优解图-{{ titleName }}
            </div>
            <div class="chart-container" v-loading="loading" element-loading-text="任务未执行"
                element-loading-spinner="el-icon-loading" element-loading-background="rgba(2,42,114,0.9)">
                <div id='assessmentRight11' style="height: 100%;width: 100%;"></div>
            </div>
        </div>
        <div v-for="(item, index) in chartLeft" :key="index" style="height: 50%;">
            <div class="st_titles">
                {{ item.title }}-{{ titleName }}
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
import util from '@/api/generalFormat'
export default {
    components: {
    },
    data() {
        return {
            loading: true,
            titleName: '',
            chartLeft: [
                // {
                //     id: 'assessmentRight11',
                //     title: '网损-电压稳定性-最优解图',
                // },
                {
                    id: 'assessmentRight12',
                    title: '最优网损随时间变化图',
                },
                {
                    id: 'assessmentRight13',
                    title: '最优电压偏移量随时间变化图',
                },
                {
                    id: 'assessmentRight14',
                    title: '储能随时间变化的最优出力图',
                },
                {
                    id: 'assessmentRight15',
                    title: 'DG随时间变化的最优出力图',
                },
                {
                    id: 'assessmentRight16',
                    title: '优化前后电压对比图',
                },
            ],
            colorLine: ['#FFC22E', '#bfc', '#5EC2F2', '#FF4528', '#fff', '#dac', '#faa', '#FFC22E'],
            chartInstances: [], // 存储图表实例
            xAxisData: [[], [], [], [], []],
            xAxisName: ['时间段', '时间段', '时间段', '时间段', '节点数'],
            yAxisName: ['网损', '电压偏移量', '储能出力', 'DG出力大小', '节点电压(p.u)'],
            seriesData: [
                // 最优网损随时间变化图
                [{
                    name: '网损',
                    data: []
                }],
                // 最优电压偏移量随时间变化图
                [{
                    name: '电压偏移量',
                    data: []
                }],
                // 储能随时间变化的最优出力图
                [{
                    name: '储能1',
                    data: []
                }, {
                    name: '储能2',
                    data: []
                }],
                // DG随时间变化的最优出力图
                [{
                    name: 'DG1',
                    data: []
                }, {
                    name: 'DG2',
                    data: []
                }],
                // 优化前后电压对比图
                [{
                    name: '优化前',
                    data: []
                }, {
                    name: '优化后V1节点电压',
                    data: []
                }, {
                    name: '优化后V2节点电压',
                    data: []
                }],
            ],
            // 最优解集数据
            solutionSetData: [],
            chartInstancesSet: [], // 存储图表实例
        };
    },
    methods: {
        updateChart() {
            // // 销毁之前的图表实例
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
                    let option1 = this.getOption(this.xAxisName[i], this.xAxisData[i], this.yAxisName[i], this.seriesData[i], this.colorLine, i);
                    chartInstance.setOption(option1);
                    this.chartInstances.push(chartInstance); // 保存新的图表实例
                    window.addEventListener('resize', () => {
                        chartInstance.resize();
                    });
                }
            }
        },
        getOption(xAxisName, xAxisData, yAxisName, seriesData, colorLine, indexNum) {
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
                    name: xAxisName,
                    nameTextStyle: {
                        color: '#fff',
                        fontWeight: 'bold'
                    },
                    data: xAxisData,
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
                yAxis: {
                    type: "value",
                    scale: true,
                    name: yAxisName,
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
                },
                series: seriesData.map((item, index) => ({
                    name: item.name,
                    type: "line",
                    // smooth: true,
                    showSymbol: indexNum === 4 ? true : false,
                    symbol: indexNum === 4 ? "triangle" : "circle",
                    symbolSize: 6,
                    data: item.data,
                    itemStyle: {
                        color: colorLine[index],
                    },
                    lineStyle: {
                        width: 2,
                    },
                }))
            };
        },
        updateChartSet() {
            // 销毁之前的图表实例
            this.chartInstancesSet.forEach(instance => {
                if (instance) {
                    window.removeEventListener('resize', instance.resize);//销毁图表监听事件
                    instance.dispose();
                }
            });
            this.chartInstancesSet = [];

            let chartDom1 = document.getElementById('assessmentRight11');
            if (chartDom1) {
                let chartInstance = echarts.init(chartDom1);
                let option1 = this.getOptionSet();
                chartInstance.setOption(option1);
                this.chartInstancesSet.push(chartInstance); // 保存新的图表实例
                window.addEventListener('resize', () => {
                    chartInstance.resize();
                });
            }
        },
        getOptionSet() {
            return {
                tooltip: {
                },
                legend: {
                },
                xAxis: [
                    {
                        type: 'value',
                        scale: true,
                        splitLine: {
                            show: false
                        },
                        name: "网损",
                        nameTextStyle: {
                            color: '#fff',
                            fontWeight: 'nold'
                        },
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
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        scale: true,
                        splitLine: {
                            show: false
                        },
                        name: '电压偏移量',
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
                    }
                ],
                series: [
                    {
                        name: '',
                        type: 'scatter',
                        symbolSize: 6,
                        emphasis: {
                            focus: 'series'
                        },
                        itemStyle: {
                            color: '#FFC22E',
                        },
                        data: this.solutionSetData,
                    },
                ]
            }
        },
        computerCharts(allData) {
            this.xAxisData = [[], [], [], [], []]
            this.xAxisName = ['时间段', '时间段', '时间段', '时间段', '节点数']
            this.yAxisName = ['网损', '电压偏移量', '储能出力', 'DG出力大小', '节点电压(p.u)']
            // 最优网损随时间变化图
            this.seriesData[0] = [{
                name: '网损',
                data: []
            }]
            allData[6].data.forEach((item) => {
                this.xAxisData[0].push(item[1])
                this.seriesData[0][0].data.push(item[2])
            })
            // 最优电压偏移量随时间变化图
            this.seriesData[1] = [{
                name: '电压偏移量',
                data: []
            }]
            allData[4].data.forEach((item) => {
                this.xAxisData[1].push(item[1])
                this.seriesData[1][0].data.push(item[2])
            })
            // 储能随时间变化的最优出力图
            this.seriesData[2] = []
            for (let index = 1; index <= allData[5].data.length; index++) {
                this.seriesData[2].push({
                    name: '储能' + index,
                    data: []
                })
            }
            allData[5].data.forEach((items, indexs) => {
                items.forEach((item) => {
                    if (indexs === 0) {
                        this.xAxisData[2].push(item[1])
                    }
                    this.seriesData[2][indexs].data.push(item[2])
                })
            })

            // DG随时间变化的最优出力图
            this.seriesData[3] = []
            for (let index = 1; index <= allData[7].data.length; index++) {
                this.seriesData[3].push({
                    name: 'DG' + index,
                    data: []
                })
            }
            allData[7].data.forEach((items, indexs) => {
                items.forEach((item) => {
                    if (indexs === 0) {
                        this.xAxisData[3].push(item[1])
                    }
                    this.seriesData[3][indexs].data.push(item[2])
                })
            })
            // 优化前后电压对比图
            this.seriesData[4] = [{
                name: '优化前',
                data: []
            }, {
                name: '优化后V1节点电压',
                data: []
            }, {
                name: '优化后V2节点电压',
                data: []
            }]
            // 优化后
            allData[1].data.forEach((item, index) => {
                this.xAxisData[4].push(index)
                this.seriesData[4][1].data.push(item[2])
            })
            // 优化后
            allData[2].data.forEach((item) => {
                this.seriesData[4][2].data.push(item[2])
            })
            // 优化前
            allData[3].data.forEach((item) => {
                this.seriesData[4][0].data.push(item[2])
            })
            this.solutionSetData = []
            this.solutionSetData = allData[0].data
            this.updateChart()
            this.updateChartSet()
            this.loading = false
        },
        // 获取算法计算初始数据
        postBegain(data) {
            util.post('/get/ac/data', data)
                .then(response => {
                    // 处理POST请求的响应
                    if (response && response.code === 200) {
                        // 请求成功的处理逻辑
                        console.log('请求成功');
                        switch (this.titleName) {
                            case 'nsga_two':
                                this.computerCharts(response.rows)
                                break;
                            default:
                                break;
                        }
                        // this.$message.success('请求成功')
                    } else {
                        // 请求失败的处理逻辑
                        console.log('请求失败');
                        // this.$message.error('服务器错误')  
                    }
                })
                .catch(error => {
                    // 处理POST请求的错误
                    // this.$message.error('POST请求错误')
                    console.log('POST请求错误', error);
                });
        },
    },
    mounted() {
        this.$bus.$on('AssessmentDATA1', (data) => {
            let getWindData = {}
            getWindData = {
                data_type: data.data_type,
                start_date: data.start_date,
                end_date: data.end_date,
                data_id: data.data_id,
                basic_data_id: data.basic_data_id,
                task_id: data.task_id,
            }
            this.titleName = data.data_type.split('&')[1]
            this.postBegain(getWindData);
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
