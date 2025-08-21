<template>
    <div style="height: 85vh;">
        <div v-for="(item, index) in chartLeft" :key="index" style="height: 50%;">
            <div class="st_titles">
                {{ item.title }}-{{ titleName }}
            </div>
            <div class="chart-container" v-loading="loading" element-loading-text="任务未执行"
                element-loading-spinner="el-icon-loading" element-loading-background="rgba(2,42,114,0.9)">
                <div :id=item.id style="height: 100%;width: 100%;"></div>
            </div>
        </div>
        <assessment3DLeft v-if="isShow3D"></assessment3DLeft>
    </div>
</template>

<script>
import * as echarts from 'echarts'
import assessment3DLeft from '@/pages/emergencyScheduling/components/assessment3DLeft.vue'
import util from '@/api/generalFormat'
export default {
    components: {
        assessment3DLeft,
    },
    data() {
        return {
            loading: true,
            isShow3D: false,
            titleName: '',
            chartLeft: [
                {
                    id: 'assessmentLeft11',
                    title: '最优网损随时间变化图',
                },
                {
                    id: 'assessmentLeft12',
                    title: '优化前后电压对比图',
                },
                {
                    id: 'assessmentLeft13',
                    title: '储能随时间变化的最优出力图',
                },
                {
                    id: 'assessmentLeft14',
                    title: 'DG随时间变化的最优出力图',
                },
                // {
                //     id: 'assessmentLeft15',
                //     title: '网损随迭代次数收敛图'
                // }
            ],
            colorLine: ['#FFC22E', '#bfc', '#5EC2F2', '#FF4528', '#fff', '#dac', '#faa', '#FFC22E'],
            chartInstances: [], // 存储图表实例
            xAxisData: [[], [], [], [], []],
            xAxisName: ['时间段', '节点数', '时间段', '时间段', '迭代次数'],
            yAxisName: ['网损', '节点电压(p.u)', '储能出力', 'DG出力大小', "最好收敛"],
            seriesData: [
                // 最优网损随时间变化图
                [{
                    name: '网损',
                    data: []
                }],
                // 优化前后电压对比图
                [{
                    name: '优化前',
                    data: []
                }, {
                    name: '优化后',
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
                // 网损随迭代次数收敛图
                [{
                    name: '客观空间',
                    data: []
                }],
            ],
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
                        fontWeight: 'nold'
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
                            width: 1,
                        }
                    },
                },
                series: seriesData.map((item, index) => ({
                    name: item.name,
                    type: this.titleName === 'maque' ? "bar" : "line",
                    // smooth: true,
                    showSymbol: indexNum === 1 ? true : false,
                    symbol: indexNum === 1 ? "triangle" : "circle",
                    symbolSize: 10,
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
        computerCharts(allData) {
            this.xAxisData = [[], [], [], []]
            this.xAxisName = ['时间段', '节点数', '时间段', '时间段']
            this.yAxisName = ['网损', '节点电压(p.u)', '储能出力', 'DG出力大小'],
                // 最优网损随时间变化图
                this.seriesData[0] = [{
                    name: '网损',
                    data: []
                }]
            allData[3].data.forEach((item) => {
                this.xAxisData[0].push(item[1])
                this.seriesData[0][0].data.push(item[2])
            })
            // 优化前后电压对比图
            this.seriesData[1] = [{
                name: '优化前',
                data: []
            }, {
                name: '优化后',
                data: []
            }]
            // 优化后
            allData[0].data.forEach((item, index) => {
                this.xAxisData[1].push(index)
                this.seriesData[1][1].data.push(item[2])
            })
            // 优化前
            allData[1].data.forEach((item) => {
                this.seriesData[1][0].data.push(item[2])
            })
            // 储能随时间变化的最优出力图
            this.seriesData[2] = []
            for (let index = 1; index <= allData[2].data.length; index++) {
                this.seriesData[2].push({
                    name: '储能' + index,
                    data: []
                })
            }
            allData[2].data.forEach((items, indexs) => {
                items.forEach((item) => {
                    if (indexs === 0) {
                        this.xAxisData[2].push(item[1])
                    }
                    this.seriesData[2][indexs].data.push(item[2])
                })
            })

            // DG随时间变化的最优出力图
            this.seriesData[3] = []
            for (let index = 1; index <= allData[4].data.length; index++) {
                this.seriesData[3].push({
                    name: 'DG' + index,
                    data: []
                })
            }
            allData[4].data.forEach((items, indexs) => {
                items.forEach((item) => {
                    if (indexs === 0) {
                        this.xAxisData[3].push(item[1])
                    }
                    this.seriesData[3][indexs].data.push(item[2])
                })
            })
            this.seriesData[4] = [{
                name: '客观空间',
                data: []
            }]
            this.xAxisData[4] = []
            this.chartLeft = [
                {
                    id: 'assessmentLeft11',
                    title: '最优网损随时间变化图',
                },
                {
                    id: 'assessmentLeft12',
                    title: '优化前后电压对比图',
                },
                {
                    id: 'assessmentLeft13',
                    title: '储能随时间变化的最优出力图',
                },
                {
                    id: 'assessmentLeft14',
                    title: 'DG随时间变化的最优出力图',
                }
            ]
            if (this.titleName === 'mixture') {
                allData[5].data.forEach((item) => {
                    this.xAxisData[4].push(item[0])
                    this.seriesData[4][0].data.push(item[2])
                })
                this.xAxisName = ['时间段', '节点数', '时间段', '时间段', '迭代次数']
                this.yAxisName = ['网损', '节点电压(p.u)', '储能出力', 'DG出力大小', '收敛结果'],
                    this.chartLeft = [
                        {
                            id: 'assessmentLeft11',
                            title: '最优网损随时间变化图',
                        },
                        {
                            id: 'assessmentLeft12',
                            title: '优化前后电压对比图',
                        },
                        {
                            id: 'assessmentLeft13',
                            title: '储能随时间变化的最优出力图',
                        },
                        {
                            id: 'assessmentLeft14',
                            title: 'DG随时间变化的最优出力图',
                        },
                        {
                            id: 'assessmentLeft15',
                            title: '网损随迭代次数收敛图'
                        }
                    ]
            }
            this.$nextTick(() => {
                this.updateChart()
            })
            this.loading = false
        },
        computerChartsGoa(allData) {
            this.xAxisData = [[], [], []]
            this.xAxisName = ['时间段', '节点数', '迭代次数']
            this.yAxisName = ['网损', '节点电压(p.u)', '网损消耗均值'],
                // 最优网损随时间变化图
                this.seriesData[0] = [{
                    name: '网损',
                    data: []
                }]
            allData[3].data.forEach((item) => {
                this.xAxisData[0].push(item[1])
                this.seriesData[0][0].data.push(item[2])
            })
            // 优化前后电压对比图
            this.seriesData[1] = [{
                name: '优化前',
                data: []
            }, {
                name: '优化后',
                data: []
            }]
            // 优化后
            allData[0].data.forEach((item, index) => {
                this.xAxisData[1].push(index)
                this.seriesData[1][1].data.push(item[2])
            })
            // 优化前
            allData[1].data.forEach((item) => {
                this.seriesData[1][0].data.push(item[2])
            })
            // 网损消耗均值
            this.seriesData[2] = [{
                name: '网损消耗均值',
                data: []
            }]
            allData[2].data.forEach((item) => {
                this.xAxisData[2].push(item[0])
                this.seriesData[2][0].data.push(item[2])
            })
            this.chartLeft = [
                {
                    id: 'assessmentLeft11',
                    title: '最优网损随时间变化图',
                },
                {
                    id: 'assessmentLeft12',
                    title: '优化前后电压对比图',
                },
                {
                    id: 'assessmentLeft13',
                    title: '网损消耗均值图',
                },
            ]
            this.$bus.$emit('assess3DLeftData', allData)
            this.$nextTick(() => {
                this.updateChart()
            })
            this.loading = false
        },
        computerChartsMaque(allData) {
            this.xAxisData = [[]]
            this.xAxisName = ['迭代次数']
            this.yAxisName = ['适应度值'],
                // 最优网损随时间变化图
                this.seriesData[0] = [{
                    name: '适应度',
                    data: []
                }]
            allData[0].data.forEach((item) => {
                this.xAxisData[0].push(item[0])
                this.seriesData[0][0].data.push(item[2])
            })
            this.chartLeft = [
                {
                    id: 'assessmentLeft11',
                    title: '适应度',
                },
            ]
            this.$bus.$emit('assess3DLeftDataMaque', allData)
            this.$nextTick(() => {
                this.updateChart()
            })
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
                            case 'goa':
                                this.isShow3D = true
                                this.$nextTick(() => {
                                    this.computerChartsGoa(response.rows)
                                })
                                break;
                            case 'maque':
                                this.isShow3D = true
                                this.$nextTick(() => {
                                    this.computerChartsMaque(response.rows)
                                })
                                break;
                            case 'awoa':
                            case 'mixture':
                                this.isShow3D = false
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
        begainCompute() {
            this.titleName = "awoa"
            let getBegainData = {
                modelState: "awoa",
                // modelState: "台风模型线路故障概率",
            }
            util.post('/get/ac/newest/data', getBegainData)
                .then(response => {
                    if (response && response.code === 200) {
                        console.log('请求成功');
                        this.computerCharts(response.rows)
                    } else {
                        console.log('请求失败');
                    }
                })
                .catch(error => {
                    console.log('POST请求错误', error);
                });
        }
    },
    mounted() {
        this.$bus.$on('AssessmentDATA0', (data) => {
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
        this.begainCompute()
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
