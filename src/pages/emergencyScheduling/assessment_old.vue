<template>
    <div class="contain">
        <div class="title">
            <!-- 可靠性和韧性评估 -->
        </div>
        <div class="bodyTab">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="极端天气下多能协同优化调度" name="1">极端天气下多能协同优化调度</el-tab-pane>
                <el-tab-pane label="电网-路网联合应急优化调度" name="2">电网-路网联合应急优化调度</el-tab-pane>
            </el-tabs>
        </div>
        <div class="bodyCharts">
            <div class="bodyCarts_head">
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                    <el-form-item label="区域">
                        <el-select v-model="formInline.region" placeholder="请选择地区">
                            <el-option label="地区一" value="shanghai"></el-option>
                            <el-option label="地区二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">确定</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="bodyCarts_main">
                <div v-for="(item, index) in this.chartName" :key="index" style="height: 100%;width: 25%;">
                    <div class="st_titles">
                        {{ item.title }}
                    </div>
                    <div class="chart-container">
                        <div :id=item.id style=" width:100%;height: 100%;"></div>
                    </div>
                </div>
            </div>
            <div class="bodyCarts_bottom">
                <div class="st_titles">
                    配电网可靠性和韧性指标体系
                </div>
                <el-table height="14.5vw" :header-cell-style="{ background: 'rgba(0,25,47,0.7)', color: '#fff' }"
                    :data="tableData" style="width: 90%;margin-left: 5%;margin-top: -0.5%;font-size: 1.4vh;" border>
                    <el-table-column prop="maxTime" label="系统可容忍的最长修复时间" align="center"></el-table-column>
                    <el-table-column prop="maxLoss" label="负荷损失最严重程度" align="center"></el-table-column>
                    <el-table-column prop="area" label="系统功能曲线缺失面积" align="center"></el-table-column>
                    <el-table-column prop="cost" label="故障恢复调控成本" align="center"></el-table-column>
                    <el-table-column prop="rate" label="系切负荷概率" align="center"></el-table-column>
                    <el-table-column prop="powerEx" label="停电功率期望值" align="center"></el-table-column>
                    <el-table-column prop="electricEx" label="电量不足期望值" align="center"></el-table-column>
                    <el-table-column prop="maxpowerCut" label="最大停电功率" align="center"></el-table-column>
                </el-table>
            </div>
        </div>
    </div>

</template>

<script>
import * as echarts from 'echarts'
export default {
    data() {
        return {
            chartName: [
                {
                    id: 'chartS1',
                    title: '系统可容忍的最长修复时间',
                    seriesType: 'bar',
                    yAxisName: ''
                },
                {
                    id: 'chartS2',
                    title: '期望值',
                    seriesType: 'bar',
                    yAxisName: ''
                }
                ,
                {
                    id: 'chartS3',
                    title: '最大停电功率',
                    seriesType: 'bar',
                    yAxisName: ''
                }
            ],
            chartData: [
                // 一
                [
                    {
                        name: '系统可容忍的最长修复时间',
                        data: [2678, 2677, 2657, 2679, 2500, 2269, 2271, 2385, 2298, 2221, 2221, 2152, 2112, 2113, 2124, 2169, 2211, 2149, 1947, 1938, 1893, 1951, 1975, 2023, 2117, 2189, 2192, 2211, 2247, 2080, 2106, 2132, 2084, 2017, 1960, 1927, 1843, 1722, 1672, 1627, 1627, 1623, 1622, 1621, 1614, 1625, 1613, 1621, 1605, 1606, 1621, 1603, 1624, 1608, 1622, 1631, 1630, 1615, 1627, 1624, 1627, 1684, 1719, 1721, 1808, 1880, 2016, 2242, 2418, 2600, 2811, 3000, 3258, 3420, 3574, 3606, 3528, 3379, 3473, 3512, 3538, 3542, 3501, 3631, 3730, 3790, 3720, 3677, 3646, 3595, 3472, 3509, 3393, 3394, 3412, 3162]
                    }
                ],
                // 二
                [
                    {
                        name: '停电功率期望值',
                        data: [2678, 2677, 2657, 2679, 2500, 2269, 2271, 2385, 2298, 2221, 2221, 2152, 2112, 2113, 2124, 2169, 2211, 2149, 1947, 1938, 1893, 1951, 1975, 2023, 2117, 2189, 2192, 2211, 2247, 2080, 2106, 2132, 2084, 2017, 1960, 1927, 1843, 1722, 1672, 1627, 1627, 1623, 1622, 1621, 1614, 1625, 1613, 1621, 1605, 1606, 1621, 1603, 1624, 1608, 1622, 1631, 1630, 1615, 1627, 1624, 1627, 1684, 1719, 1721, 1808, 1880, 2016, 2242, 2418, 2600, 2811, 3000, 3258, 3420, 3574, 3606, 3528, 3379, 3473, 3512, 3538, 3542, 3501, 3631, 3730, 3790, 3720, 3677, 3646, 3595, 3472, 3509, 3393, 3394, 3412, 3162]
                    },
                    {
                        name: '电量不足期望值',
                        data: [2678, 2677, 2657, 2679, 2500, 2269, 2271, 2385, 2298, 2221, 2221, 2152, 2112, 2113, 2124, 2169, 2211, 2149, 1947, 1938, 1893, 1951, 1975, 2023, 2117, 2189, 2192, 2211, 2247, 2080, 2106, 2132, 2084, 2017, 1960, 1927, 1843, 1722, 1672, 1627, 1627, 1623, 1622, 1621, 1614, 1625, 1613, 1621, 1605, 1606, 1621, 1603, 1624, 1608, 1622, 1631, 1630, 1615, 1627, 1624, 1627, 1684, 1719, 1721, 1808, 1880, 2016, 2242, 2418, 2600, 2811, 3000, 3258, 3420, 3574, 3606, 3528, 3379, 3473, 3512, 3538, 3542, 3501, 3631, 3730, 3790, 3720, 3677, 3646, 3595, 3472, 3509, 3393, 3394, 3412, 3162]
                    }
                ],
                // 三
                [
                    {
                        name: '最大停电功率',
                        data: [2678, 2677, 2657, 2679, 2500, 2269, 2271, 2385, 2298, 2221, 2221, 2152, 2112, 2113, 2124, 2169, 2211, 2149, 1947, 1938, 1893, 1951, 1975, 2023, 2117, 2189, 2192, 2211, 2247, 2080, 2106, 2132, 2084, 2017, 1960, 1927, 1843, 1722, 1672, 1627, 1627, 1623, 1622, 1621, 1614, 1625, 1613, 1621, 1605, 1606, 1621, 1603, 1624, 1608, 1622, 1631, 1630, 1615, 1627, 1624, 1627, 1684, 1719, 1721, 1808, 1880, 2016, 2242, 2418, 2600, 2811, 3000, 3258, 3420, 3574, 3606, 3528, 3379, 3473, 3512, 3538, 3542, 3501, 3631, 3730, 3790, 3720, 3677, 3646, 3595, 3472, 3509, 3393, 3394, 3412, 3162]
                    }
                ]
            ],
            colorLine: ['#FFC22E', '#5EC2F2', '#FF4528', '#fff', '#bfc', '#dac', '#faa'],
            activeName: '1',
            titlesName: '极端天气下多能协同优化调度',
            formInline: {
                region: ''
            },
            tableData: [
                {
                    maxTime: 'XX时长',
                    maxLoss: '严重程度',
                    area: '30',
                    cost: '30',
                    rate: '30',
                    powerEx: '30',
                    electricEx: '30',
                    maxpowerCut: '30',
                },
                {
                    maxTime: 'XX时长',
                    maxLoss: '严重程度',
                    area: '30',
                    cost: '30',
                    rate: '30',
                    powerEx: '30',
                    electricEx: '30',
                    maxpowerCut: '30',
                },
                {
                    maxTime: 'XX时长',
                    maxLoss: '严重程度',
                    area: '30',
                    cost: '30',
                    rate: '30',
                    powerEx: '30',
                    electricEx: '30',
                    maxpowerCut: '30',
                },
                {
                    maxTime: 'XX时长',
                    maxLoss: '严重程度',
                    area: '30',
                    cost: '30',
                    rate: '30',
                    powerEx: '30',
                    electricEx: '30',
                    maxpowerCut: '30',
                },
                {
                    maxTime: 'XX时长',
                    maxLoss: '严重程度',
                    area: '30',
                    cost: '30',
                    rate: '30',
                    powerEx: '30',
                    electricEx: '30',
                    maxpowerCut: '30',
                },
            ]
        }
    },
    methods: {
        handleClick(data) {
            this.titlesName = data.label
            this.formInline = {
                region: ''
            }
        },
        onSubmit() {
            console.log('submit!');
        },
        updateChart() {
            if (this.chartInstance) {
                this.chartInstance.dispose(); // 销毁图表实例
            }
            for (let i = 0; i < this.chartName.length; i++) {
                var chartDom2 = document.getElementById(this.chartName[i].id);
                this.chartInstance = echarts.init(chartDom2);
                var option2 = this.getOption(this.chartData[i], this.chartName[i].seriesType, this.chartName[i].yAxisName);
                this.chartInstance.setOption(option2);
            }
        },
        getOption(data, seriesType, yAxisName) {
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
                    data: Array.from({ length: data[0].data.length + 1 }, (_, i) => i),
                    // data: [
                    //     '6:00', '6:15', '6:30', '6:45', '7:00', '7:15', '7:30', '7:45', '8:00', '8:15', '8:30', '8:45', '9:00', '9:15', '9:30', '9:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30'
                    // ],
                    axisLabel: {
                        show: true,
                        interval: 9,
                        textStyle: {
                            fontWeight: 'bold'
                        },

                    },
                },
                yAxis: [
                    {
                        name: yAxisName,
                        type: 'value',
                        nameTextStyle: {
                            fontWeight: 'bold'
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                fontWeight: 'bold'
                            }
                        },
                        axisPointer: {
                            snap: true,
                        },
                    },
                ],
                series: data.map((item, index) => ({
                    name: item.name,
                    type: seriesType,
                    data: item.data,
                    // 是否有阴影面积
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: '#FFC22E'
                            },
                            {
                                offset: 1,
                                color: 'rgb(255, 70, 131)'
                            }
                        ])
                    },
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
        this.updateChart();
    },
    beforeDestroy() {
    }
}
</script>

<style lang="scss" scoped>
.contain {
    height: 85vh;
    border: 2px solid rgb(153, 196, 248);

    .title {
        height: 1.8vw;
        font-size: 1.5vw;
        text-align: center;
        font-weight: bold;
        -webkit-text-stroke: 1px #413c47;
        -webkit-text-fill-color: #fff;
        animation: shine 2.4s infinite;
    }

    .bodyTab {
        display: flex;
        // justify-content: space-between;
        width: 100%;
        height: 7vh;

        /deep/.el-tabs__header {
            padding-left: 1vw;
            height: 7vh;
        }

        /deep/.el-tabs__content {
            width: 0;
            height: 0;
        }

        /deep/.el-tabs__item {
            font-size: 1vw;
            color: #fff;
        }

        /deep/.el-tabs__item.is-active {
            color: rgb(0, 255, 251);
        }
    }

    .bodyCharts {
        width: 100%;
        height: 74vh;

        .bodyCarts_head {
            width: 100%;
            height: 10%;

            /deep/.el-form.demo-form-inline.el-form--inline {
                margin-left: 1vw;
            }

            /deep/.el-form-item__label {
                color: #fff;
                font-size: 1vw;
            }

            /deep/.el-input input {
                font-size: 1.6vh;
                border: 1px solid rgba(31, 91, 193, 1);
                background-color: rgba(14, 39, 84, 0.68);
            }

            /deep/.el-input__inner {
                text-align: center;
                color: rgb(255, 255, 255);
                font-weight: bold;
            }

            /deep/.el-select .el-input .el-select__caret {
                color: rgb(255, 255, 255);
            }

            /deep/::placeholder {
                color: rgb(255, 255, 255);
                font-weight: bold;
            }

            /deep/.el-button--primary {
                font-weight: bold;
                border: 1px solid rgba(31, 91, 193, 1);
                background-color: rgba(14, 39, 84, 0.68);
            }

            /deep/.el-button--primary:focus,
            .el-button--primary:hover {
                font-weight: bold;
                border: 1px solid rgb(0, 255, 251);
                background-color: rgba(21, 255, 0, 0.61);
            }
        }

        .bodyCarts_main {
            display: flex;
            justify-content: space-around;
            width: 100%;
            height: 45%;

            .st_titles {
                background-size: 100% 107%;
                background-repeat: no-repeat;
                background-image: url('../../assets/img/ch/item_new.png');
            }

            .chart-container {
                position: relative;
                height: calc(100% - 4vh);
                background-size: 100% 100%;
                background-repeat: no-repeat;
                background-image: url('../../assets/img/ch/chbg_new.png');
                transform: translateX(-50%);
                animation-name: moveRight;
                animation-duration: 1.5s;
                animation-fill-mode: forwards;
            }
        }

        .bodyCarts_bottom {
            width: 98%;
            height: 44%;
            margin-left: 1%;
            border: 1px solid #ffa;

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
                overflow-x: hidden;
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
    }

}
</style>
