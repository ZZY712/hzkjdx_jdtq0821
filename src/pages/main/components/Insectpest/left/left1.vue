<template>
    <div class="bodyCharts">
        <div class="body_left">
            <LoadData style="width: 27vw;height: 50%;" />
            <div v-for="(item, index) in chartLeft" :key="index + item.title" style="height: 50%;">
                <div class="st_titles">
                    {{ item.title }}
                </div>
                <div @mouseover="changeTable(index)" class="chart-container" v-loading="loading"
                    element-loading-text="任务未执行" element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(2,42,114,0.9)">
                    <div :id=item.id style="width: 27vw;height: 100%;"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts'
import util from '@/api/generalFormat'
import LoadData from './LoadData';
import { encryptData, decryptData } from '@/utils/cryptoUtils';
export default {
    components: {
        LoadData
    },
    data() {
        return {
            loading: true,
            // 左侧
            chartLeft: [
                {
                    id: 'leftdeep1',
                    title: '温度数据',
                    seriesType: 'line',
                    yAxisName: '℃'
                },
                {
                    id: 'leftdeep2',
                    title: '湿度数据',
                    seriesType: 'line',
                    yAxisName: 'g/m³'
                },
                {
                    id: 'rightdeep1',
                    title: '风速数据',
                    seriesType: 'line',
                    yAxisName: 'm/s'
                },
                {
                    id: 'rightdeep2',
                    title: '雨量数据',
                    seriesType: 'line',
                    yAxisName: 'mm/㎡'
                }
            ],
            leftData: [
                // 左一
                [
                    {
                        name: '温度',
                        data: []
                    },
                    {
                        name: '温度预测',
                        data: []
                    },
                ],
                // 左二
                [
                    {
                        name: '湿度',
                        data: []
                    },
                    {
                        name: '湿度预测',
                        data: []
                    },
                ],
                // 右一
                [
                    {
                        name: '风速',
                        data: []
                    },
                    {
                        name: '风速预测',
                        data: []
                    },
                ],
                // 右二
                [
                    {
                        name: '雨量',
                        data: []
                    },
                    {
                        name: '雨量预测',
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
            oldValue: -1,
            allTableData: [],
            chartInstances: []
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
        changeTable(value) {
            if (this.oldValue != value) {
                this.oldValue = value
                this.$bus.$emit('allTableData', this.allTableData[value])
            }
        },
        // 计算echarts数据
        computerChartS(data) {
            this.allTableData = []
            this.allTableData = data
            this.leftData.forEach((items, index) => {
                items.forEach((item) => {
                    if (index != 2) {
                        item.data = []
                    }
                })
            })
            this.allTimes = []
            data[0].data.forEach((item, index) => {
                this.leftData[0][0].data.push(item[1]);
                this.leftData[0][1].data.push(item[2]);
                this.allTimes.push(item[0])
                if (data[1].data[index]) {
                    this.leftData[1][0].data.push(data[1].data[index][1]);
                    this.leftData[1][1].data.push(data[1].data[index][2]);
                }
                if (data[2].data[index]) {
                    this.leftData[2][0].data.push(data[2].data[index][1]);
                    this.leftData[2][1].data.push(data[2].data[index][2]);
                }
                if (data[3].data[index]) {
                    this.leftData[3][0].data.push(data[3].data[index][1]);
                    this.leftData[3][1].data.push(data[3].data[index][2]);
                }
            });
            this.updateChart()
            this.loading = false;
        },
        computerData() {
            const encryptedData = sessionStorage.getItem('YUJINGBEGINDATA');
            if (encryptedData) {
                const decryptedData = decryptData(encryptedData, process.env.VUE_APP_CRYPTO_KEY);
                let allData = decryptedData.data;
                this.computerChartS(allData)
            } else {
                let getBegainData = {
                    modelState: "天气预测模型(预测)",
                }
                util.post('/get/ac/newest/data', getBegainData)
                    .then(response => {
                        if (response && response.code === 200) {
                            console.log('请求成功');
                            let encryptedData = encryptData({ data: response.rows }, process.env.VUE_APP_CRYPTO_KEY);
                            sessionStorage.setItem("YUJINGBEGINDATA", encryptedData);
                            this.computerChartS(response.rows)
                            this.loading = false
                        } else {
                            console.log('请求失败');
                        }
                    })
                    .catch(error => {
                        console.log('POST请求错误', error);
                    });
            }
        }
    },
    watch: {

    },
    mounted() {
        this.computerData()
    },
    beforeDestroy() {
    }
}
</script>

<style lang="scss" scoped>
.bodyCharts {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 75vh;

    /deep/.el-loading-spinner i {
        color: #40f3ff00;
        // font-size: 8vh;
    }

    .body_left {
        // width: 27%;
        height: 100%;
        position: relative;
        /* 启用垂直滚动条 */
        overflow-y: auto;
        overflow-x: hidden;

        .st_titles {
            background-size: 100% 107%;
            background-repeat: no-repeat;
            background-image: url('../../../../../assets/img/ch/item_new.png');
        }

        .chart-container {
            position: relative;
            height: calc(100% - 4vh);
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-image: url('../../../../../assets/img/ch/chbg_new.png');
            transform: translateX(-50%);
            animation-name: moveRight;
            animation-duration: 1.5s;
            animation-fill-mode: forwards;
        }

        /* 自定义滚动条样式 */
        &::-webkit-scrollbar {
            width: 4px;
        }

        &::-webkit-scrollbar-thumb {
            background: #4f668e;
            /* 滚动条滑块的颜色 */
            border-radius: 4px;
        }

        &::-webkit-scrollbar-track {
            background: #525579;
            /* 滚动条轨道的颜色 */
            border-radius: 4px;
        }
    }
}
</style>
