<template>
    <div style="height: 85vh;">
        <div v-for="(item, index) in chartRight" :key="index + item.title" style="height: 46%;">
            <div class="st_titles">
                {{ item.title }}直方图
            </div>
            <div class="chart-container" v-loading="loading" element-loading-text="任务未执行"
                element-loading-spinner="el-icon-loading" element-loading-background="rgba(2,42,114,0.9)">
                <div :id="item.id" style=" width:100%; height: 100%;"></div>
            </div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
    data() {
        return {
            loading: true,
            colorLine: ['#14c8d4', '#faa'], // 柱子颜色
            chartRight: [
                {
                    id: 'histogram1',
                    title: '温度',
                },
                {
                    id: 'histogram2',
                    title: '湿度',
                }
            ],
            chartInstances: [] // 存储图表实例
        };
    },
    methods: {
        // 更新图表
        updateChart(testData) {
            // 销毁之前的图表实例
            this.chartInstances.forEach(instance => {
                if (instance) {
                    window.removeEventListener('resize', instance.resize); // 销毁图表监听事件
                    instance.dispose();
                }
            });
            this.chartInstances = [];
            // 更新图表数据
            for (let i = 0; i < testData.length; i++) {
                let chartDom = document.getElementById(this.chartRight[i].id);
                if (chartDom) {
                    let chartInstance = echarts.init(chartDom);
                    let option = this.getOption(testData[i]);
                    chartInstance.setOption(option);
                    this.chartInstances.push(chartInstance); // 保存新的图表实例
                    window.addEventListener('resize', () => {
                        chartInstance.resize();
                    });
                }
            }
        },
        getOption(data) {
            let seriesData = data.map((dataset, index) => ({
                name: index === 0 ? 'GAN模型数据' : '原始数据',
                type: 'bar',
                barGap: index === 0 ? '0%' : '-100%', // 设置柱状图之间的间隔为0%
                itemStyle: index === 0 ? {
                    color: 'rgba(248,203,127,0.9)',
                } : {
                    color: 'rgba(118,218,145,0.9)',
                },
                // barWidth: '80%', // 控制柱子宽度
                data: index === 0 ? data[1].map((d) => ({
                    value: d.frequencies,
                })) : data[0].map((d) => ({
                    value: d.frequencies,
                }))
            }));

            let bins = data[0].map(d => d.bin);

            return {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                color: ['#f8cb7f', '#76da91', '#63b2ee', '#f89588'],
                legend: {
                    bottom: 0,
                    textStyle: {
                        color: 'rgb(255, 255, 255)',
                    },
                },
                xAxis: {
                    name: '区间',
                    type: 'category',
                    data: bins,
                    boundaryGap: false,
                    axisLabel: {
                        show: false,
                        // interval: 0, // 设置间隔为0，使得所有标签都显示
                        color: '#fff',
                        fontWeight: 'bold'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#fff'
                        }
                    },
                },
                yAxis: {
                    name: '次数',
                    type: 'value',
                    axisLabel: {
                        color: '#fff'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#fff'
                        }
                    }
                },
                series: seriesData
            };
        },
        // 数据处理方法，处理输入的数据并更新图表
        computerData(dataArray) {
            if (dataArray) {
                let testData = [[[], []], [[], []], [[], []], [[], []]]
                // // 模拟接口数据
                // let testDatas = [
                //     [[[1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1], [1, 2, 3, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 5]],
                //     [[1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1], [1, 2, 3, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 5]]],
                //     [[[1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1], [1, 2, 3, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 5]],
                //     [[1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1], [1, 2, 3, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 5]]],
                //     [[[1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1], [1, 2, 3, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 5]],
                //     [[1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1], [1, 2, 3, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 5]]],
                //     [[[1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1], [1, 2, 3, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 5]],
                //     [[1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1], [1, 2, 3, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 5]]],]
                if (dataArray.data[0][1].length) {
                    dataArray.data.forEach((item, indexs) => {
                        let binsOld = item[0][0];
                        let frequenciesOld = item[0][1];
                        let bins = item[1][0];
                        let frequencies = item[1][1];
                        for (let i = 0; i < frequenciesOld.length; i++) {
                            testData[indexs][0].push({
                                bin: binsOld[i] + '-' + binsOld[i + 1],
                                frequencies: frequenciesOld[i]
                            })
                            testData[indexs][1].push({
                                bin: bins[i] + '-' + bins[i + 1],
                                frequencies: frequencies[i]
                            })
                        }
                    });
                } else {
                    dataArray.data.forEach((item, indexs) => {
                        let binsOld = item[0][0];
                        let frequenciesOld = item[0][1];
                        for (let i = 0; i < frequenciesOld.length; i++) {
                            testData[indexs][0].push({
                                bin: binsOld[i] + '-' + binsOld[i + 1],
                                frequencies: frequenciesOld[i]
                            })
                        }
                    });
                }
                let chartRightData = [];
                // let titleNames = ['WD', 'SD', 'FS', 'YL'];
                let titleNames = dataArray.dataname.split(',');

                titleNames.forEach((name) => {
                    chartRightData.push({
                        id: `${name}br1`,
                        title: name === 'WD' ? '温度' : name === 'SD' ? '湿度' : name === 'FS' ? '风速' : '雨量',
                    });
                });
                this.chartRight = chartRightData;
                // 确保DOM元素已渲染完成后再更新图表
                this.$nextTick(() => {
                    // this.loading = true;
                    this.updateChart(testData);
                    this.loading = false;
                });
            } else {
                this.openFalse();
            }
        },
        openFalse() {
            this.$notify.error({
                title: '错误',
                message: '该日期间暂无数据'
            });
        }
    },
    mounted() {
        this.$bus.$on('windData', (data) => {
            this.computerData(data[2]);
        });
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
    width: 100%;
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
