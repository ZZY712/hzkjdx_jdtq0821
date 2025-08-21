<template>
    <div style="height: 42.5vh;">
        <div v-for="(item, index) in chartLeft" :key="index + item.title" style="height: 100%;">
            <div class="st_titles">
                {{ item.title }}-{{ titleName }}
            </div>
            <div class="chart-container" v-loading="loading" element-loading-text="任务未执行"
                element-loading-spinner="el-icon-loading" element-loading-background="rgba(2,42,114,0.9)">
                <div :id="item.id" style="height: 100%; width: 100%;"></div>
            </div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts'
import 'echarts-gl';
export default {
    data() {
        return {
            loading: true,
            colorLine: ['#bfc', '#5EC2F2', '#FF4528', '#fff', '#dac', '#faa', '#FFC22E'],
            chartLeft: [
                {
                    id: 'zhenduanLeft1ass1',
                    title: '风力最优出力',
                    probability: ''
                },
                {
                    id: 'zhenduanLeft1ass2',
                    title: '电容器最优出力',
                    probability: ''
                },
            ],
            chartInstances: [],
            allDatas: [],
            titleName: '',
        };
    },
    methods: {
        updateChart() {
            // 销毁之前的图表实例
            this.chartInstances.forEach(instance => {
                if (instance) {
                    window.removeEventListener('resize', instance.resize);
                    instance.dispose();
                }
            });
            this.chartInstances = [];

            for (let i = 0; i < this.chartLeft.length; i++) {
                let chartDom = document.getElementById(this.chartLeft[i].id);
                if (chartDom) {
                    let chartInstance = echarts.init(chartDom);
                    let option = this.getOption(this.allDatas[i], this.colorLine);
                    chartInstance.setOption(option);
                    this.chartInstances.push(chartInstance);
                    window.addEventListener('resize', () => chartInstance.resize());
                }
            }
        },
        getOption(datasets, colors) {
            return {
                tooltip: {},
                // legend: {
                //     top: 0,
                //     textStyle: {
                //         color: 'rgb(255, 255, 255)',
                //     },

                // },
                xAxis3D: {
                    type: 'value',
                    name: '节点序号',
                    nameTextStyle: {
                        fontWeight: 'bold',
                        color: '#fff',
                    },
                    axisLabel: {
                        show: true,
                        fontWeight: 'bold',
                        color: '#fff',
                        interval: 2
                    },
                },
                yAxis3D: {
                    type: 'value',
                    name: '时间',
                    nameTextStyle: {
                        fontWeight: 'bold',
                        color: '#fff',
                    },
                    axisLabel: {
                        show: true,
                        fontWeight: 'bold',
                        color: '#fff',
                        interval: 2
                    },
                },
                zAxis3D: {
                    type: 'value',
                    name: '电压峰值/pu',
                    scale: true,
                    nameTextStyle: {
                        fontWeight: 'bold',
                        color: '#fff',
                    },
                    axisLabel: {
                        show: true,
                        fontWeight: 'bold',
                        color: '#fff',
                        interval: 2
                    },
                },
                grid3D: {
                    boxHeight: 80,
                    viewControl: {
                        alpha: 10,
                        beta: 30
                    },
                    light: {
                        main: {
                            intensity: 1,
                            shadow: true
                        },
                        ambient: {
                            intensity: 0.5
                        }
                    }
                },
                series: datasets.map((data, index) => ({
                    type: 'line3D',
                    data: data,
                    lineStyle: {
                        width: 4,
                        color: colors[index]
                    },
                    itemStyle: {
                        color: colors[index]
                    },
                    name: `节点 ${index + 1}`
                }))
            };
        },
        computerData(allDatas) {
            this.allDatas = []
            this.chartLeft = [
                {
                    id: 'zhenduanLeft1ass1',
                    title: '风力最优出力',
                },
                {
                    id: 'zhenduanLeft1ass2',
                    title: '电容器最优出力',
                },
            ],
                allDatas[4].data.forEach((items, indexs) => {
                    items.forEach((item, index) => {
                        allDatas[4].data[indexs][index][1] = index
                    })
                })
            allDatas[5].data.forEach((items, indexs) => {
                items.forEach((item, index) => {
                    allDatas[5].data[indexs][index][1] = index
                })
            })
            this.allDatas.push(allDatas[4].data)
            this.allDatas.push(allDatas[5].data)
            this.$nextTick(() => {
                this.updateChart();
                this.loading = false
            })
        },
        computerDataMaque(allDatas) {
            this.allDatas = []
            this.chartLeft = [
                {
                    id: 'zhenduanLeft1ass1',
                    title: '优化前电压图',
                },
                {
                    id: 'zhenduanLeft1ass2',
                    title: '优化后电压图',
                },
            ],
                allDatas[1].data.forEach((items, indexs) => {
                    items.forEach((item, index) => {
                        allDatas[1].data[indexs][index][1] = indexs
                    })
                })
            allDatas[2].data.forEach((items, indexs) => {
                items.forEach((item, index) => {
                    allDatas[2].data[indexs][index][1] = indexs
                })
            })
            this.allDatas.push(allDatas[1].data)
            this.allDatas.push(allDatas[2].data)
            this.$nextTick(() => {
                this.updateChart();
                this.loading = false
            })
        },
    },
    mounted() {
        this.$bus.$on('assess3DLeftData', (allDatas) => {
            this.loading = true
            this.titleName = 'goa'
            this.computerData(allDatas)
        })
        this.$bus.$on('assess3DLeftDataMaque', (allDatas) => {
            this.loading = true
            this.titleName = 'maque'
            this.computerDataMaque(allDatas)
        })
    }
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
        //font-size: 8vh;
    }

    /deep/.el-loading-spinner {
        //top: 36%;
    }
}
</style>
