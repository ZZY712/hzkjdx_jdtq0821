<template>
    <div style="height: 42vh;">
        <div v-for="(item, index) in chartLeft" :key="index" style="height: 50%;">
            <div class="st_titles">
                {{ item.title }}-{{ '识别成功率：' + item.roteNum + '%' }}
            </div>
            <div class="chart-container" v-loading="item.loading" element-loading-text="任务未执行"
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
            chartLeft: [
                {
                    id: 'leftzd2lstm0',
                    title: 'matrix(训练)-Dnn',
                    loading: true,
                    roteNum: ''
                },
                {
                    id: 'leftzd2lstm1',
                    title: 'matrix(训练)-CnnAttention',
                    loading: true,
                    roteNum: ''
                },
            ],
            chartInstances: [],
            leftData: [
                // 左一
                {
                    name: '',
                    data: []
                }, {
                    name: '',
                    data: []
                },
            ],
            allDatas: [
                {
                    name: '',
                    data: []
                }, {
                    name: '',
                    data: []
                }
            ],
        };
    },
    methods: {
        updateChart() {
            // 销毁之前的图表实例
            this.chartInstances.forEach(instance => {
                if (instance) {
                    window.removeEventListener('resize', instance.resize); // 销毁图表监听事件
                    instance.dispose();
                }
            });
            this.chartInstances = [];


            // 左侧
            for (let i = 0; i < this.chartLeft.length; i++) {
                // 生成 xAxisData 和 yAxisData
                let xAxisData = this.generateAxisData(this.leftData[i].data, 0);
                let yAxisData = this.generateAxisData(this.leftData[i].data, 1);
                let chartDom1 = document.getElementById(this.chartLeft[i].id);
                let chartInstance = echarts.init(chartDom1);
                let option1 = this.getOption(chartDom1, this.leftData[i].data, xAxisData, yAxisData);
                chartInstance.setOption(option1);
                window.addEventListener('resize', () => {
                    chartInstance.resize();
                });
                this.chartInstances.push(chartInstance);
            }
        },
        generateAxisData(data, index) {
            let axisData = Array.from(new Set(data.map(item => item[index])));
            axisData.sort((a, b) => a - b); // 对轴数据进行排序
            return axisData;
        },
        getOption(domName, seriesData, xAxisData, yAxisData) {
            return {
                toolbox: {
                    feature: {
                        // dataZoom: { yAxisIndex: 'none' }, // 数据区域缩放
                        // restore: { show: true }, // 重置
                        // saveAsImage: { show: true }, // 导出图片
                        myFull: { // 全屏
                            show: true,
                            title: '全屏',
                            icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
                            onclick: () => {
                                // 全屏查看
                                if (domName.requestFullScreen) { // HTML W3C 提议
                                    domName.requestFullScreen()
                                } else if (domName.msRequestFullscreen) { // IE11
                                    domName.msRequestFullScreen()
                                } else if (domName.webkitRequestFullScreen) { // Webkit
                                    domName.webkitRequestFullScreen()
                                } else if (domName.mozRequestFullScreen) { // Firefox
                                    domName.mozRequestFullScreen()
                                }
                                // 退出全屏
                                if (domName.requestFullScreen) {
                                    document.exitFullscreen()
                                } else if (domName.msRequestFullScreen) {
                                    document.msExitFullscreen()
                                } else if (domName.webkitRequestFullScreen) {
                                    document.webkitCancelFullScreen()
                                } else if (domName.mozRequestFullScreen) {
                                    document.mozCancelFullScreen()
                                }
                            },
                            iconStyle: {
                                color: "#fff"
                            }
                        }
                    }
                },
                title: {
                    // text: 'Confusion Matrix',
                    left: 'center',
                    textStyle: {
                        color: '#fff'
                    }
                },
                tooltip: {
                    position: 'top'
                },
                grid: {
                    height: '75%',
                    top: '10%',
                },
                xAxis: {
                    name: '辨识拓扑类型',
                    nameLocation: 'middle',
                    nameGap: 30,
                    type: 'category',
                    data: xAxisData,
                    splitArea: {
                        show: true
                    },
                    nameTextStyle: {
                        fontWeight: 'bold',
                        color: '#fff'
                    },
                    axisLabel: {
                        show: true,
                        fontWeight: 'bold',
                        color: '#fff'
                    }
                },
                yAxis: {
                    name: '实际拓扑类型',
                    nameLocation: 'middle',
                    nameGap: 30,
                    type: 'category',
                    data: yAxisData.reverse(), // 使行从上往下增大
                    splitArea: {
                        show: true
                    },
                    nameTextStyle: {
                        fontWeight: 'bold',
                        color: '#fff'
                    },
                    axisLabel: {
                        show: true,
                        fontWeight: 'bold',
                        color: '#fff'
                    }
                },
                visualMap: {
                    min: 0,
                    // max: 15,
                    calculable: true,
                    orient: 'vertical',
                    right: '0%',
                    top: '10%',
                    textStyle: {
                        color: '#fff'
                    },
                    color: ['rgba(8,48,107,1)', 'rgb(123,182,217)', 'rgba(245,245,244,0.5)']
                },
                series: [
                    {
                        name: '热力图',
                        type: 'heatmap',
                        data: seriesData.map((item) => {
                            return [item[1], yAxisData.length - 1 - item[0], item[2] || '0'];
                        }),
                        label: {
                            show: true
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
        },
        computerData(data) {
            this.updateChart()
            this.chartLeft[data].loading = false
        }
    },
    mounted() {
        this.$bus.$on('sendTopologyData', (alldatas) => {
            let trueSum = 0, sums = 0
            alldatas.data[0].data.forEach((item) => {
                if (item[0] === item[1]) trueSum += item[2]
                sums += item[2]
            })
            //  预测
            if (alldatas.dataType === '拓扑结构&拓扑自动辨识(训练)-CnnAttention') {
                alldatas.data.forEach((item) => {
                    if (item.dataname === 'matrix') {
                        this.allDatas[1].data = []
                        this.allDatas[1].data = item.data
                        this.leftData[1].data = []
                        this.leftData[1].data = this.allDatas[1].data
                    }
                })
                this.chartLeft[1].roteNum = ((trueSum * 100) / sums).toFixed(2)
                this.computerData(1)
            }
            // 训练
            else if (alldatas.dataType === '拓扑结构&拓扑自动辨识(训练)-Dnn') {
                alldatas.data.forEach((item) => {
                    if (item.dataname === 'matrix') {
                        this.allDatas[0].data = []
                        this.allDatas[0].data = item.data
                        this.leftData[0].data = []
                        this.leftData[0].data = this.allDatas[0].data
                    }
                })
                this.chartLeft[0].roteNum = ((trueSum * 100) / sums).toFixed(2)
                this.computerData(0)
            }
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

    /deep/.el-loading-spinner .el-loading-text {
        // top: 36%;
        color: #ffffff;
        font-size: 1.6vh;
    }

}
</style>
