<template>
    <div style="height: 85vh;">
        <div v-for="(item, index) in chartLeft" :key="index + item.title" style="height: 50%;">
            <div class="st_titles">{{ item.title }}</div>
            <div class="chart-container" v-loading="loading" element-loading-text="任务未执行"
                element-loading-spinner="el-icon-loading" element-loading-background="rgba(2,42,114,0.9)">
                <div :id="item.id" style="height: 100%; width: 100%;"></div>
            </div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import { encryptData } from '@/utils/cryptoUtils';

export default {
    data() {
        return {
            loading: true,
            chartLeft: [
                { id: 'leftsc3', title: '箱线图(原始数据)' },
                { id: 'leftsc4', title: '箱线图(GAN生成数据)' }
            ],
            colorLine: ['#63b2ee', '#76da91', '#f8cb7f', '#f89588'],
            xName: ['WD', 'SD', 'FS', 'YL'],
            AllData: [[], []],
            chartInstances: [] // 存储图表实例
        };
    },
    methods: {
        updateChart(allData) {
            // 销毁之前的图表实例
            this.chartInstances.forEach(instance => {
                if (instance) {
                    window.removeEventListener('resize', instance.resize);
                    instance.dispose();
                }
            });
            this.chartInstances = [];
            // 清空旧数据并更新数据
            this.AllData = [[], []];
            let outliers = [[], []]
            for (let i = 0; i < allData.length; i++) {
                if (allData[i][0]) {
                    this.AllData[i].push(allData[i][0].slice(0, 5));
                    this.AllData[i].push(allData[i][1].slice(0, 5));
                    this.AllData[i].push(allData[i][2].slice(0, 5));
                    this.AllData[i].push(allData[i][3].slice(0, 5));
                    outliers[i].push(allData[i][0][5][0]);
                    outliers[i].push(allData[i][1][5][0]);
                    outliers[i].push(allData[i][2][5][0]);
                    outliers[i].push(allData[i][3][5][0]);
                }
            }
            const encryptedData = encryptData({ data: this.AllData, outliers: outliers, xName: this.xName }, process.env.VUE_APP_CRYPTO_KEY);
            sessionStorage.setItem("BOXDATA", encryptedData);
            // 遍历图表进行渲染
            this.chartLeft.forEach((item, i) => {
                let chartDom = document.getElementById(item.id);
                if (chartDom) {
                    let chartInstance = echarts.init(chartDom);
                    let option = this.getOption(this.AllData[i], outliers[i]);
                    chartInstance.setOption(option);
                    this.chartInstances.push(chartInstance);
                    window.addEventListener('resize', () => {
                        chartInstance.resize();
                    });
                }
            });
        },
        getOption(data, outliers) {
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
                    borderWidth: 2
                },
                xAxis: {
                    type: 'category',
                    data: this.xName,
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
        openFalse() {
            this.$notify.error({
                title: '错误',
                message: '该日期间暂无数据'
            });
        },
        computerData1(dataArray) {
            this.loading = false
            if (dataArray) {
                this.updateChart(dataArray.data);
                this.loading = false
            } else {
                this.openFalse();
            }
        }
    },
    mounted() {
        this.$bus.$on('windData', (data) => {
            this.xName = data[2].dataname.split(',')
            this.computerData1(data[3])
        });

    },
};
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
        font-size: 8vh;
    }

    /deep/.el-loading-spinner {
        top: 36%;
    }
}
</style>
