<template>
    <div class="body_Charts">
        <div class="body_left">
            <div v-for="(item, index) in chartLeft" :key="index + item.title" style="height: 100%;">
                <div class="st_titles">
                    {{ item.title }}
                </div>
                <div class="chart-container" v-loading="loading" element-loading-text="任务未执行"
                    element-loading-spinner="el-icon-loading" element-loading-background="rgba(2,42,114,0.2)">
                    <div :id=item.id style="width: 100%;height: 30vh;"></div>
                </div>
            </div>
        </div>
        <draggable v-model="carDisaster" tag="div" v-bind="{ animation: 200 }">
            <div v-for="(items, indexs) in carDisaster" :key="indexs" class="card">
                <div style="text-align: center;font-size: 1.6vh;font-weight: bold;">
                    {{ items.name }}
                </div>
                <div>
                    <el-table height="10vw" :header-cell-style="{ background: 'rgba(0,25,47,0)', color: '#fff' }"
                        :data="items.data" style="width: 95%;margin-left: 2.5%;margin-top: -0.5%;font-size: 1.4vh;"
                        border>
                        <el-table-column v-for="(item, index) in items.tableData" :key="index" :prop="item.name"
                            :label="item.label" align="center"></el-table-column>
                    </el-table>
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
            // 左侧
            chartLeft: [
                {
                    id: 'leftStereo1',
                    title: '不同数量场景下平均成本',
                    seriesType: 'line',
                    xAxisData: [],
                    xAxisName: '场景数',
                    yAxisName: '成本(元)'
                },
                // {
                //     id: 'leftStereo2',
                //     title: '50个场景下不同方案的停电损失',
                //     seriesType: 'line',
                //     xAxisData: [],
                //     xAxisName: '场景',
                //     yAxisName: '停电损失(元)'
                // },
            ],
            leftData: [
                // 左一
                [
                    {
                        name: '',
                        data: []
                    },
                ],
                // 左二
                [
                    {
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
                    },
                ],
            ],
            colorLine: [
                ['#14c8d4', '#faa', '#5EC2F2', '#FF4528', '#fff', '#dac', '#faa'],
                ['#14c8d4', '#faa', '#5EC2F2', '#FF4528', '#fff', '#dac', '#faa'],
            ],
            carDisaster: [
                {
                    name: '故障场景孤岛数量统计',
                    tableData: [
                        {
                            name: 'gudaoNums',
                            label: '孤岛数量'
                        },
                        {
                            name: 'nums',
                            label: '场景数'
                        },

                    ],
                    data: []
                },
                {
                    name: '所提方法规划结果',
                    tableData: [
                        {
                            name: 'yjfdcrl',
                            label: '应急发电车容量'
                        },
                        {
                            name: 'tzcb',
                            label: '投资成本/元'
                        },
                        {
                            name: 'tdss',
                            label: '停电损失/元'
                        },
                        {
                            name: 'rycb',
                            label: '燃油成本/元'
                        },
                    ],
                    data: []
                },
                {
                    name: '不同方案的优化结果',
                    tableData: [
                        {
                            name: 'fa',
                            label: '方案'
                        },
                        {
                            name: 'pjtdss',
                            label: '平均停电损失/元'
                        },
                        {
                            name: 'pjrycb',
                            label: '平均燃油成本/元'
                        },
                        {
                            name: 'yjfhhfl',
                            label: '一级负荷恢复率/%'
                        },
                        {
                            name: 'ejfhhfl',
                            label: '二级负荷恢复率/%'
                        },
                    ],
                    data: []
                },
                {
                    name: '不同场景数下两种算法对比结果',
                    tableData: [
                        {
                            name: 'cjsl',
                            label: '场景数量'
                        },
                        {
                            name: 'qjsjfjosf',
                            label: '求解时间(非解耦算法)'
                        },
                        {
                            name: 'mbhsfjosf',
                            label: '目标函数(非解耦算法)'
                        },
                        {
                            name: 'qjsjPHA1',
                            label: '求解时间(PHA ρ=1)'
                        },
                        {
                            name: 'mbhsPHA1',
                            label: '目标函数(PHA ρ=1)'
                        },
                        {
                            name: 'qjsjPHA30',
                            label: '求解时间(PHA ρ=30)'
                        },
                        {
                            name: 'mbhsPHA30',
                            label: '目标函数(PHA ρ=30)'
                        },
                        {
                            name: 'qjsjPHA300',
                            label: '求解时间(PHA ρ=300)'
                        },
                        {
                            name: 'mbhsPHA300',
                            label: '目标函数(PHA ρ=300)'
                        },
                    ],
                    data: []
                },
            ],
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
                var option1 = this.getOption(this.leftData[i], this.chartLeft[i].xAxisData, this.chartLeft[i].seriesType, this.chartLeft[i].xAxisName, this.chartLeft[i].yAxisName, this.colorLine[i],);
                chartInstance.setOption(option1);
                window.addEventListener('resize', () => {
                    chartInstance.resize();
                });
                this.chartInstances.push(chartInstance);
            }
        },
        getOption(data, xAxisData, seriesType, xAxisName, yAxisName, colorLine) {
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
                    name: xAxisName,
                    nameTextStyle: {
                        color: '#fff',
                    },
                    data: xAxisData,
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
        computerData(data) {
            // 不同数量场景下平均成本
            this.chartLeft[0].xAxisData = []
            this.leftData[0][0].data = []
            data[0].data.forEach((item) => {
                this.chartLeft[0].xAxisData.push(item[0])
                this.leftData[0][0].data.push(item[1])
            })
            //故障场景孤岛数量统计
            this.carDisaster[0].data = []
            data[4].data[0].forEach((item, index) => {
                if (index > 0) {
                    this.carDisaster[0].data.push({
                        gudaoNums: item,
                        nums: data[4].data[1][index],
                    })
                }
            })
            //所提方法规划结果
            this.carDisaster[1].data = []
            this.carDisaster[1].data.push({
                yjfdcrl: data[1].data[0][0],
                tzcb: data[1].data[0][1],
                tdss: data[1].data[0][2],
                rycb: data[1].data[0][3],
            })
            //不同方案的优化结果
            this.carDisaster[2].data = []
            data[5].data.forEach((item) => {
                this.carDisaster[2].data.push({
                    fa: item[0],
                    pjtdss: item[1],
                    pjrycb: item[2],
                    yjfhhfl: item[3],
                    ejfhhfl: item[4],
                })
            })
            //不同场景数下两种算法对比结果
            this.carDisaster[3].data = []
            data[6].data.forEach((item) => {
                this.carDisaster[3].data.push({
                    cjsl: item[0],
                    qjsjfjosf: item[1],
                    mbhsfjosf: item[2],
                    qjsjPHA1: item[3],
                    mbhsPHA1: item[4],
                    qjsjPHA30: item[4],
                    mbhsPHA30: item[5],
                    qjsjPHA300: item[6],
                    mbhsPHA300: item[7],
                })
            })
            this.updateChart()
            this.loading = false
        }
    },
    mounted() {
        this.$bus.$on('carData', (allData) => {
            this.computerData(allData.data);
        })
    },
    beforeDestroy() {
    }
}
</script>

<style lang="scss" scoped>
.body_Charts {
    width: 100%;
    height: 95%;
    /* 启用垂直滚动条 */
    overflow-y: auto;
    overflow-x: hidden;

    /deep/.el-loading-spinner i {
        color: #40f3ff00;
        // font-size: 8vh;
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

    .body_left {
        height: 36vh;
        position: relative;

    }

    .card {
        // border: 1px solid #14c0d3de;
        font-size: 1.6vh;
        border-radius: 2vh;
        margin-left: 5%;
        margin-bottom: 5%;
        height: 24vh;
        width: 85%;
        color: #fff;
        background-color: rgba(7, 185, 225, 0.21);
        cursor: pointer;

        /deep/.el-table tr {
            height: 2vh;
            background-color: rgba(18, 39, 101, 0.7);
        }

        /deep/ .el-table,
        .el-table__expanded-cell {
            background-color: rgba(0, 0, 0, 0);
            color: #fff;
        }

        /deep/.el-table thead {
            background-color: rgba(0, 47, 38, 0.7);
        }

        /deep/.el-table tbody tr:hover>td {
            background-color: rgba(67, 145, 228, 0.2);
        }

        /deep/.el-table--scrollable-y .el-table__body-wrapper:-webkit-scrollbar {
            /*隐藏滚轮*/
            // display: none;
        }

        ::v-deep .el-table--scrollable-x .el-table__body-wrapper {
            overflow-x: auto;
        }

        ::-webkit-scrollbar {
            width: 6px;
            height: 8px;
            background-color: rgba(32, 86, 131, 0.3);
        }

        //里面滑块
        ::-webkit-scrollbar-thumb {
            box-shadow: inset 0 0 2px rgba(0, 0, 0, .3);
            -webkit-box-shadow: inset 0 0 wpx rgba(0, 0, 0, .3);
            background-color: #205683;
            border-radius: 3px;
        }

        ::-webkit-scrollbar-track {
            box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
            border-radius: 3px;
            background: rgba(0, 0, 0, 0.2);
        }

        /deep/.el-table--border th.el-table__cell.gutter:last-of-type {
            display: none;
        }
    }

    .card:hover {
        background-color: rgba(7, 185, 225, 0.5);
    }
}
</style>
