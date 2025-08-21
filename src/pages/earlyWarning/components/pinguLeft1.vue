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
        <div class="mapButtonSelect">
            <el-select v-model="timeDate" placeholder="时间">
                <el-option v-for="(item) in allData" :key="item[0]" :label="item[0]" :value="item[0]"
                    @click.native="computerChart(item)"></el-option>
            </el-select>
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
                    seriesType: 'bar',
                    yAxisName: '风险概率'
                },
            ],
            leftData: [
                [
                    {
                        name: '风险概率',
                        data: []
                    },
                ],
            ],
            colorLine: [
                ['#FFC22E', '#bfc', '#5EC2F2', '#FF4528', '#fff', '#dac', '#faa'],
                ['#bfc', '#5EC2F2', '#FF4528', '#fff', '#dac', '#faa', '#FFC22E'],
            ],
            allTimes: [],
            chartInstances: [], // 存储图表实例
            allData: [],
            timeDate: ''
        };
    },
    methods: {
        updateChart(char, charData) {
            // 销毁之前的图表实例
            this.chartInstances.forEach(instance => {
                if (instance) {
                    window.removeEventListener('resize', instance.resize);//销毁图表监听事件
                    instance.dispose();
                }
            });
            this.chartInstances = [];

            for (let i = 0; i < char.length; i++) {
                var chartDom1 = document.getElementById(char[i].id);
                let chartInstance = echarts.init(chartDom1);
                var option1 = this.getOption(charData[i], char[i].seriesType, char[i].yAxisName, this.colorLine[i],);
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
                    name: '线路编号',
                    nameTextStyle: {
                        color: '#fff',
                    },
                    data: this.allTimes,
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
                        min: 0,
                        max: 1,
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
                    symbol: 'circle',     //设定为实心点
                    symbolSize: 0,
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
        computerChart(data) {
            this.leftData[0][0].data = []
            this.allTimes = []
            this.timeDate = data[0]
            data[1].forEach((item) => {
                this.leftData[0][0].data.push(item[3]);
                this.allTimes.push(item[1] + '-' + item[2])
            });
            this.updateChart(this.chartLeft, this.leftData)
            this.loading = false
        }
    },
    mounted() {
        this.$bus.$on('PINGULEEFT1DATA', (data) => {
            this.allData = data[1].data
            this.computerChart(data[1].data[0])
        })
        this.$bus.$on('PINGULEEFT1DATA1', (data) => {
            this.allData = data[0].data
            this.computerChart(data[0].data[0])
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
.mapButtonSelect {
    position: absolute;
    color: rgb(255, 255, 255);
    top: 6%;
    right: 1%;
    cursor: pointer;
    z-index: 900;

    /deep/.el-input input {
        font-size: 1.6vh;
        color: rgb(255, 255, 255);
        border: 1px solid rgba(31, 91, 193, 1);
        background-color: rgba(14, 39, 84, 0.68);
    }

    /deep/::placeholder {
        color: rgb(255, 255, 255);
        font-weight: bold;
    }

    /deep/.el-input__inner {
        text-align: center;
        color: rgb(255, 255, 255);
        font-weight: bold;
    }

    /deep/.el-select {
        width: 10.5vw;
        color: rgb(255, 255, 255);
    }
}

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
