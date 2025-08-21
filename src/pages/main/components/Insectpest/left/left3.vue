<template>
    <div class="bot">
        <div class="st_titles">
            单点故障
        </div>
        <div class="chart-container">
            <!-- 折线图容器 -->
            <div id="zhenduanDDGZ21" class="chart" v-loading="loading" element-loading-text="任务未执行"
                element-loading-spinner="el-icon-loading" element-loading-background="rgba(2,42,114,0.9)"></div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts'
import util from '@/api/generalFormat'
import { encryptData, decryptData } from '@/utils/cryptoUtils';
export default {
    components: {
    },
    data() {
        return {
            loading: true,
            chartLeft: [
                {
                    id: 'zhenduanDDGZ21',
                    title: '单点故障',
                },
                // {
                //     id: 'zhenduanLeft22',
                //     title: '两点故障',
                // },
                // {
                //     id: 'zhenduanLeft23',
                //     title: '三点故障',
                // },
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
                    name: '方案一',
                    data: []
                },
                {
                    name: '方案二',
                    data: []
                },
                {
                    name: '方案三',
                    data: []
                }],
                // 两点故障
                [{
                    name: '方案一',
                    data: []
                },
                {
                    name: '方案二',
                    data: []
                },
                {
                    name: '方案三',
                    data: []
                }],
                // 三点故障
                [{
                    name: '方案一',
                    data: []
                },
                {
                    name: '方案二',
                    data: []
                },
                {
                    name: '方案三',
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

            let chartDom1 = document.getElementById("zhenduanDDGZ21");
            if (chartDom1) {
                let chartInstance = echarts.init(chartDom1);
                let option1 = this.getOption(this.allDatas[0], this.colorLine[0], this.xAxisData[0]);
                chartInstance.setOption(option1);
                this.chartInstances.push(chartInstance); // 保存新的图表实例
                window.addEventListener('resize', () => {
                    chartInstance.resize();
                });
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
            let items = allDatas[1]
            this.allDatas[0] = [{
                name: '方案一',
                data: items[1][1]
            },
            {
                name: '方案二',
                data: items[2][1]
            },
            {
                name: '方案三',
                data: [91, 71, 63, 48, 27, 10, 6]
            }]
            this.xAxisData[0] = []
            this.xAxisData[0] = items[1][2]
            this.$nextTick(() => {
                this.updateChart();
                this.loading = false
            })
        },
        computerData1() {
            // 加载存储在sessionStorage中的数据
            const encryptedData = sessionStorage.getItem('ZDFTUDATA');
            if (encryptedData) {
                const decryptedData = decryptData(encryptedData, process.env.VUE_APP_CRYPTO_KEY);
                this.computerData(decryptedData.allDatas)
            } else {
                let data = {
                    data_type: "配网结构数据&故障定位-性能比较(容错)",
                    columns: '',
                    start_date: "2021-01-01 01:00:00",
                    end_date: "2021-01-01 01:00:00",
                    data_id: "D000090",
                    basic_data_id: "X000831T0007AT0000N0000&&33节点",
                }
                util.post('/get/ac/data', data)
                    .then(response => {
                        if (response && response.code === 200) {
                            console.log('请求成功');
                            this.computerChartS(response.rows)
                        } else {
                            console.log('请求失败');
                        }
                    })
                    .catch(error => {
                        console.log('POST请求错误', error);
                    });
            }
        },
        computerChartS(data) {
            let encryptedData
            switch (data[0].dataname) {
                case '故障定位-性能比较(容错)':
                    encryptedData = encryptData({ allDatas: data[0].data, }, process.env.VUE_APP_CRYPTO_KEY);
                    sessionStorage.setItem("ZDFTUDATA", encryptedData);
                    this.computerData(data[0].data)
                    break;
                default:
                    break;
            }
        },
    },
    mounted() {
        this.computerData1()
    },
}
</script>
<style lang="scss" scoped>
.bot {
    width: 100%;
    /* height: 100%; */
    z-index: 999;
    height: 34vh;
    /* padding-bottom: 5.5vh; */
    /* height: 28vh; */
}

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

    .chart {
        width: 27vw;
        height: 100%;
    }
}

/* .chartclass{

} */
</style>
