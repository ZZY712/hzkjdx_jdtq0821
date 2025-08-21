<template>
    <div style="height: 42vh;">
        <div v-for="(item, index) in chartRight" :key="index + item.title" style="height: 50%;">
            <div class="st_titles">
                {{ item.title }}直方图
            </div>
            <div class="chart-container" v-loading="item.loading" element-loading-text="任务未执行"
                element-loading-spinner="el-icon-loading" element-loading-background="rgba(2,42,114,0.9)">
                <div :id="item.id" style=" width: 24.3vw; height: 100%;"></div>
            </div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
    data() {
        return {
            colorLine: ['#14c8d4', '#faa'], // 柱子颜色
            chartRight: [
                {
                    id: 'histogram11233',
                    title: '特征重要性-LightGBM',
                    data: [],
                    loading: true
                },
                {
                    id: 'histogram11234',
                    title: '特征重要性-RF',
                    data: [],
                    loading: true
                },
            ],
            chartInstances: [] // 存储图表实例
        };
    },
    methods: {
        // 更新图表
        updateChart() {
            // 销毁之前的图表实例
            this.chartInstances.forEach(instance => {
                if (instance) {
                    window.removeEventListener('resize', instance.resize); // 销毁图表监听事件
                    instance.dispose();
                }
            });
            this.chartInstances = [];
            // 更新图表数据
            for (let i = 0; i < this.chartRight.length; i++) {
                let chartDom = document.getElementById(this.chartRight[i].id);
                if (chartDom) {
                    let chartInstance = echarts.init(chartDom);
                    let option = this.getOption(this.chartRight[i].data);
                    chartInstance.setOption(option);
                    this.chartInstances.push(chartInstance); // 保存新的图表实例
                    window.addEventListener('resize', () => {
                        chartInstance.resize();
                    });
                }
            }
        },
        getOption(data) {
            return {
                tooltip: {
                    trigger: 'axis'
                },
                dataset: {
                    source: data
                },
                xAxis: {
                    name: '重要性',
                    nameLocation: 'center',
                    nameGap: 25, // 调整这个值以靠近底部
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
                    type: 'category',
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
                    orient: 'horizontal',
                    left: 'center',
                    show: false,
                    text: ['High Score', 'Low Score'],
                    dimension: 0,
                    inRange: {
                        color: ['#65B581', '#FFCE34', '#FD665F']
                    }
                },
                series: [
                    {
                        type: 'bar',
                        encode: {
                            x: '重要性',
                            y: 'product'
                        }
                    }
                ]
            };
        },
        openFalse() {
            this.$notify.error({
                title: '错误',
                message: '该日期间暂无数据'
            });
        }
    },
    mounted() {
        this.$bus.$on('sendTopology2Data', (alldatas) => {
            if (alldatas.dataType === '拓扑结构&特征重要性-LightGbm') {
                this.chartRight[0].data = []
                this.chartRight[0].data = alldatas.data[0].data
                this.$nextTick(() => {
                    this.updateChart()
                    this.chartRight[0].loading = false
                })
            } else {
                this.chartRight[1].data = []
                this.chartRight[1].data = alldatas.data[0].data
                this.$nextTick(() => {
                    this.updateChart()
                    this.chartRight[1].loading = false
                })
            }
            // this.computerData(data[2]);
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

    /deep/.el-loading-spinner .el-loading-text {
        // top: 36%;
        color: #ffffff;
        font-size: 1.6vh;
    }
}
</style>
