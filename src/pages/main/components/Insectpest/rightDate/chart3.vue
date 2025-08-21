<template>
    <div class="top">
        <div class="st_titles">
            箱线图(GAN生成数据)
        </div>
        <div class="chart-container">
            <!-- 折线图容器 -->
            <div id="chart3" class="chart" v-loading="loading" element-loading-text="任务未执行"
                element-loading-spinner="el-icon-loading" element-loading-background="rgba(2,42,114,0.9)">>

            </div>
        </div>
    </div>
</template>
<script>
import * as echarts from 'echarts'
import { decryptData } from '@/utils/cryptoUtils';
export default {
    components: {
    },
    data() {
        return {
            loading: true,
            colorLine: ['#63b2ee', '#76da91', '#f8cb7f', '#f89588'],
            chartInstances: [],
        };
    },
    methods: {
        updateChart(data, outliers, xName) {
            // 销毁之前的图表实例
            this.chartInstances.forEach(instance => {
                if (instance) {
                    window.removeEventListener('resize', instance.resize);
                    instance.dispose();
                }
            });
            this.chartInstances = [];
            // 遍历图表进行渲染
            let chartDom = document.getElementById("chart3");
            if (chartDom) {
                let chartInstance = echarts.init(chartDom);
                let option = this.getOption(data, outliers, xName);
                chartInstance.setOption(option);
                this.chartInstances.push(chartInstance);
                window.addEventListener('resize', () => {
                    chartInstance.resize();
                });
            }
        },
        getOption(data, outliers, xName) {
            return {
                tooltip: {
                    trigger: 'item',
                    axisPointer: { type: "shadow" }
                },
                color: ['#f8cb7f', '#76da91', '#63b2ee', '#f89588'],
                grid: {
                    left: '10%',
                    top: '20%',
                    right: '10%',
                    bottom: '15%',
                    // borderColor: "#fff",
                    borderWidth: 2
                },
                xAxis: {
                    type: 'category',
                    data: xName,
                    axisLabel: {
                        color: '#fff',
                        fontSize: 12,
                        formatter: '{value}'
                    }
                },
                yAxis: {
                    axisLabel: {
                        color: '#fff',
                        fontSize: 12,
                    }
                },
                series: [
                    {
                        // name: 'boxplot',
                        type: 'boxplot',
                        data: data,
                        itemStyle: {
                            borderWidth: 2,
                            borderColor: this.colorLine[1]
                        },
                        lineStyle: {
                            width: 2
                        }
                    },
                    {
                        name: 'outlier',
                        type: 'scatter',
                        data: outliers
                    }
                ]
            };
        },
        computerData() {
            // 加载存储在sessionStorage中的数据
            const encryptedData = sessionStorage.getItem('BOXDATA');
            if (encryptedData) {
                const decryptedData = decryptData(encryptedData, process.env.VUE_APP_CRYPTO_KEY);
                let alldata = decryptedData;
                this.updateChart(alldata.data[1], alldata.outliers[1], alldata.xName)
                this.loading = false
            }
        }
    },
    mounted() {
        // this.computerData();
    },
}
</script>
<style lang="scss" scoped>
.top {
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
    background-size: 100% 107%;
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

/* .chartclass{

} */
</style>