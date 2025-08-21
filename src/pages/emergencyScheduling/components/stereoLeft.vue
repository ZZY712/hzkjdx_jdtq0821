<template>
    <div class="title_main">
        <div id="topologyCard" class="cardTopology" v-loading="loading" element-loading-text="任务未执行"
            element-loading-spinner="el-icon-loading" element-loading-background="rgba(2,42,114,0.2)">
        </div>
        <draggable v-model="preDisaster" tag="div" v-bind="{ animation: 200 }">
            <div v-for="(item, index) in preDisaster" :key="index" class="card">
                <div style="text-align: center;font-size: 1.6vh;font-weight: bold;">
                    {{ item.name }}
                </div>
                <div>
                    <div>预布局成本：{{ item.cost }}元</div>
                    <div>移动储能配置节点：{{ item.node }}</div>
                    <div style="text-align: center;">支路状态</div>
                    <div>断开{{ item.state[0] }}</div>
                    <!-- <div>未断开:{{ item.state[1] }}</div> -->
                </div>
            </div>
        </draggable>
    </div>
</template>

<script>
import draggable from 'vuedraggable';
import * as echarts from 'echarts'
export default {
    components: {
        draggable,
    },
    data() {
        return {
            loading: true,
            colorLine: ['#5EC2F2', '#14c8d4', '#FF4528', '#fff', '#bfc', '#dac', '#faa'],
            leftData: [
                {
                    name: '预布局成本',
                    data: [0, 0, 0, 0]
                }
            ],
            titleName: '不同算法预布局成本',
            preDisaster: [
                {
                    name: '确定性优化-考虑移动储能',
                    cost: '',
                    node: [],
                    state: [],
                },
                {
                    name: '确定性优化',
                    cost: '',
                    node: [],
                    state: [],
                },
                {
                    name: '鲁棒优化-考虑移动储能',
                    cost: '',
                    node: [],
                    state: [],
                },
                {
                    name: '鲁棒优化',
                    cost: '',
                    node: [],
                    state: [],
                },
            ],
            chartInstances: [],
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
            let chartDom1 = document.getElementById('topologyCard');
            if (chartDom1) {
                let chartInstance = echarts.init(chartDom1);
                let option1 = this.getOption(this.leftData);
                chartInstance.setOption(option1);
                this.chartInstances.push(chartInstance); // 保存新的图表实例
                window.addEventListener('resize', () => {
                    chartInstance.resize();
                });
            }
        },
        getOption(data) {
            return {
                title: {
                    text: this.titleName,
                    textStyle: {
                        color: '#fff',
                    },
                    left: 'center',
                },
                tooltip: {
                    trigger: 'axis',
                },
                xAxis: {
                    data: ['确定性优化(含移动)', '确定性优化',
                        '鲁棒优化(含移动)', '鲁棒优化'],
                    axisLabel: {
                        show: true,
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: 8,
                    },
                },
                yAxis: [
                    {
                        name: '预布局成本/元',
                        type: 'value',
                        nameTextStyle: {
                            color: '#fff',
                            fontWeight: 'bold'
                        },
                        axisLabel: {
                            show: true,
                            color: '#fff',
                            fontWeight: 'bold'
                        },
                        axisPointer: {
                            snap: true,
                        },
                    },
                ],
                series: data.map((item, index) => ({
                    name: item.name,
                    type: 'bar',
                    data: item.data,
                    showSymbol: true,//是否默认展示圆点
                    symbol: 'circle',     //设定为实心点
                    symbolSize: 0,
                    smooth: true,
                    emphasis: {
                        focus: 'series'
                    },
                    itemStyle: {
                        color: this.colorLine[index], // 设置单独的颜色
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
    },
    mounted() {
        this.$bus.$on('PreData', (allData) => {
            this.leftData[0].data = []
            this.preDisaster.forEach((item, index) => {
                let nodeData = []
                let stateData = [[], []]
                item.cost = parseInt(allData.data[3 * index + 0].data[0])
                this.leftData[0].data.push(item.cost)
                allData.data[3 * index + 1].data.forEach((item, index) => {
                    if (item) {
                        nodeData.push(index + 1)
                    }
                })
                allData.data[3 * index + 2].data.forEach((item, index) => {
                    if (item) {
                        stateData[0].push(index + 1)
                    } else {
                        stateData[1].push(index + 1)
                    }
                })
                item.node = nodeData
                item.state = stateData
            })
            this.updateChart()
            this.loading = false
        })
        // this.updateChart()
    },
    beforeDestroy() {
    }
}
</script>

<style lang="scss" scoped>
.title_main {
    width: 100%;
    height: 95%;
    /* 启用垂直滚动条 */
    overflow-y: auto;
    overflow-x: hidden;

    /deep/.el-loading-spinner i {
        color: #40f3ff00;
        // font-size: 8vh;
    }

    /deep/.el-loading-mask {
        z-index: 900;
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

    .cardTopology {
        height: 30vh;
    }

    .card {
        // border: 1px solid #14c0d3de;
        font-size: 1.6vh;
        border-radius: 2vh;
        margin-left: 5%;
        margin-bottom: 5%;
        height: 16vh;
        width: 85%;
        color: #fff;
        background-color: rgba(7, 185, 225, 0.21);
        cursor: pointer;
    }

    .card:hover {
        background-color: rgba(7, 185, 225, 0.5);
    }

}
</style>
