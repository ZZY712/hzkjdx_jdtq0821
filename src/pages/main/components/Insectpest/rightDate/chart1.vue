<template>
    <div class="top">
        <div class="st_titles">
            故障恢复图
        </div>
        <div class="chart-container" v-loading="loading" element-loading-text="任务未执行"
            element-loading-spinner="el-icon-loading" element-loading-background="rgba(2,42,114,0.9)">
            <!-- 折线图容器 -->
            <div id="rightGZHFlimit1" class="chart"></div>
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
                    id: 'rightGZHFlimit1',
                    title: '故障恢复',
                },
            ],
            colorLine: [
                ['#FFC22E', '#bfc', '#5EC2F2', '#FF4528', '#fff', '#dac', '#faa'],
                ['#bfc', '#5EC2F2', '#FF4528', '#fff', '#dac', '#faa', '#FFC22E'],
            ],
            xAxisData: [],
            seriesData: [[], [], [], []],
            chartInstances: [], // 存储图表实例
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

            let chartDom1 = document.getElementById("rightGZHFlimit1");
            if (chartDom1) {
                let chartInstance = echarts.init(chartDom1);
                let option1 = this.getOption(this.xAxisData, this.seriesData);
                chartInstance.setOption(option1);
                this.chartInstances.push(chartInstance); // 保存新的图表实例
                window.addEventListener('resize', () => {
                    chartInstance.resize();
                });
            }
        },
        getOption(xAxisData, seriesData) {
            return {
                color: ['#FFC22E', '#bfc', '#5EC2F2', '#FF4528', '#fff', '#dac', '#faa'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                    },
                    formatter: function (params) {
                        let relVal = params[0].name + '<br />';
                        relVal += params[0].seriesName + ':' + Math.abs(params[0].value) + '功率/KW' + '<br />';
                        relVal += params[1].seriesName + ':' + Math.abs(params[1].value) + '功率/KW' + '<br />';
                        relVal += params[2].seriesName + ':' + Math.abs(params[2].value) + '功率/KW' + '<br />';
                        relVal += params[3].seriesName + ':' + Math.abs(params[2].value) + '功率/KW' + '<br />';
                        return relVal; //负数取绝对值变正数
                    },

                },
                legend: {
                    bottom: 0,
                    textStyle: {
                        color: 'rgb(55, 209, 259)',
                    },
                },
                dataZoom: [
                    {
                        type: 'inside', //无滑动条内置缩放   type: 'slider', //缩放滑动条
                        filterMode: 'filter',
                        xAxisIndex: [0], //X轴滑动
                        start: 1,
                        end: 100,
                    },
                ],
                xAxis: {
                    name: '时间',
                    axisLabel: {
                        // show: true,
                        color: '#fff',
                        fontSize: 12
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#fff',
                            width: 1,//这里是为了突出显示加上的
                        }
                    },
                    scale: true,
                    data: xAxisData
                },
                yAxis: {
                    name: '功率/KW',
                    axisLabel: {
                        // show: true,
                        color: '#fff',
                        fontSize: 12
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#fff',
                            width: 1,//这里是为了突出显示加上的
                        }
                    },
                    scale: true,
                },
                series: [
                    {
                        name: '储能充电',
                        type: 'bar',
                        stack: '总量',
                        yAxisIndex: 0,
                        data: seriesData[0]
                    },
                    {
                        name: '储能放电',
                        type: 'bar',
                        stack: '总量',
                        yAxisIndex: 0,
                        data: seriesData[1]
                    },
                    {
                        name: '风电',
                        type: 'bar',
                        stack: '总量',
                        yAxisIndex: 0,
                        data: seriesData[2]
                    },
                    {
                        name: '负荷',
                        symbol: "diamond",
                        symbolSize: 12,
                        type: 'line',
                        yAxisIndex: 0,
                        data: seriesData[3]
                    },

                ]
            };
        },
        computerCharts(data) {
            this.xAxisData = []
            this.seriesData = [[], [], [], []]
            data.forEach((item) => {
                this.xAxisData.push(item[0])
                this.seriesData[0].push(0 - item[1])
                this.seriesData[1].push(item[2])
                this.seriesData[2].push(item[3])
                this.seriesData[3].push(item[4])
            })
            this.$nextTick(() => {
                this.updateChart()
                this.loading = false
            })
        },
        computerData() {
            // 加载存储在sessionStorage中的数据
            const encryptedData = sessionStorage.getItem('ReGZHFDATA');
            if (encryptedData) {
                const decryptedData = decryptData(encryptedData, process.env.VUE_APP_CRYPTO_KEY);
                let allData = decryptedData.data;
                this.computerCharts(allData[7].data)
            } else {
                let getBegainData = {
                    modelState: "故障恢复",
                }
                util.post('/get/ac/newest/data', getBegainData)
                    .then(response => {
                        if (response && response.code === 200) {
                            console.log('请求成功');
                            sessionStorage.setItem("ReGZHFDATA", encryptData({ data: response.rows }, process.env.VUE_APP_CRYPTO_KEY));
                            let allData = response.rows;
                            this.computerCharts(allData[7].data)
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
    mounted() {
        this.computerData()
    },
}
</script>
<style lang="scss" scoped>
.top {
    width: 100%;
    /* height: 100%; */
    z-index: 999;
    height: 34vh;

    /deep/.el-loading-spinner i {
        color: #40f3ff00;
        // font-size: 8vh;
    }

    /* padding-bottom: 5.5vh; */
    /* height: 28vh; */

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
        animation-name: moveRightToLeft;
        animation-duration: 1.5s;
        animation-fill-mode: forwards;

        .chart {
            width: 27vw;
            height: 100%;
        }
    }
}

/* .chartclass{

} */
</style>