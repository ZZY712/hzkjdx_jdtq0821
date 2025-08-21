<template>
    <div style="height: 85vh;">
        <div v-for="(item, index) in chartLeft" :key="index + item.title" style="height: 100%;">
            <div class="st_titles">
                {{ item.title }}
            </div>
            <div class="chart-container" v-loading="loading" element-loading-text="任务未执行"
                element-loading-spinner="el-icon-loading" element-loading-background="rgba(2,42,114,0.9)">
                <div :id=item.id style="height: 100%;width:100%;"></div>
            </div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts'
import { encryptData } from '@/utils/cryptoUtils';
export default {
    components: {
    },
    data() {
        return {
            loading: true,
            chartLeft: [
                {
                    id: 'zhenduanLeft21',
                    title: '单点故障',
                },
                {
                    id: 'zhenduanLeft22',
                    title: '两点故障',
                },
                {
                    id: 'zhenduanLeft23',
                    title: '三点故障',
                },
            ],
            colorLine: [
                ['#bfc', '#5EC2F2', '#FF4528', '#fff', '#dac', '#faa', '#FFC22E'],
                ['#bfc', '#5EC2F2', '#FF4528', '#fff', '#dac', '#faa', '#FFC22E'],
                ['#bfc', '#5EC2F2', '#FF4528', '#fff', '#dac', '#faa', '#FFC22E'],
            ],
            chartInstances: [], // 存储图表实例
            allDatas: [
                // 单点故障
                [{
                    name: '本平台方法',
                    data: []
                },
                {
                    name: '传统整数线性规划模型',
                    data: []
                },
                {
                    name: '遗传算法',
                    data: []
                }],
                // 两点故障
                [{
                    name: '本平台方法',
                    data: []
                },
                {
                    name: '传统整数线性规划模型',
                    data: []
                },
                {
                    name: '遗传算法',
                    data: []
                }],
                // 三点故障
                [{
                    name: '本平台方法',
                    data: []
                },
                {
                    name: '传统整数线性规划模型',
                    data: []
                },
                {
                    name: '遗传算法',
                    data: []
                }],
            ],
            xAxisData: [
                // 单点故障
                [],
                // 两点故障
                [],
                // 三点故障
                [],
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
                    let option1 = this.getOption(this.allDatas[i], this.colorLine[i], this.xAxisData[i]);
                    chartInstance.setOption(option1);
                    this.chartInstances.push(chartInstance); // 保存新的图表实例
                    window.addEventListener('resize', () => {
                        chartInstance.resize();
                    });
                }
            }
        },
        getOption(seriesData, colorLine, xAxisData) {
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
                    name: 'FTU信号丢失数量',
                    nameTextStyle: {
                        color: '#fff',
                        fontWeight: 'nold'
                    },
                    nameGap: 30,
                    nameLocation: "middle", // x轴name处于x轴的什么位置
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
                yAxis: {
                    type: "value",
                    name: '准确率/%',
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
                    smooth: true,
                    showSymbol: false,
                    symbol: "circle",
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
        computerData(allDatas) {
            this.chartLeft = []
            allDatas.forEach((items, indexs) => {
                this.chartLeft.push({
                    id: 'zhenduanLeft21' + indexs,
                    title: items[0],
                })
                this.allDatas[indexs] = [{
                    name: '本平台方法',
                    data: items.length >= 2 ? items[1][1] : []
                },
                {
                    name: '传统整数线性规划模型',
                    data: items.length >= 3 ? items[2][1] : []
                },
                {
                    name: '遗传算法',
                    data: items[0] === '单点故障' ? [91, 71, 63, 48, 27, 10, 6] : items[0] === '两点点故障' ? [83, 46, 26, 20, 5, 0, 0] : [73, 53, 39, 31, 10, 2, 0]
                }]
                this.xAxisData[indexs] = []
                this.xAxisData[indexs] = items.length >= 2 ? items[1][2] : []
            })
            this.$nextTick(() => {
                this.updateChart();
                this.loading = false
            })
        }
    },
    mounted() {
        this.$bus.$on('ZDFTUData', (allDatas) => {
            this.loading = true
            let encryptedData = encryptData({ allDatas: allDatas, }, process.env.VUE_APP_CRYPTO_KEY);
            sessionStorage.setItem("ZDFTUDATA", encryptedData);
            this.computerData(allDatas)
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
