<template>
    <div class="contain">
        <div class="title">
            <!-- 多能互补策略生成 -->
        </div>
        <div class="bodyTab">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="多能自治" name="1">多能自治</el-tab-pane>
                <el-tab-pane label="多能协同" name="2">多能协同</el-tab-pane>
                <el-tab-pane label="多能紧急" name="3">多能紧急</el-tab-pane>
                <el-tab-pane label="自愈恢复" name="4">自愈恢复</el-tab-pane>
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
                <div v-for="(item, index) in chartName" :key="index" style="height: 100%;width: 36%;">
                    <div class="st_titles">
                        {{ item.title }}
                    </div>
                    <div class="chart-container">
                        <div :id=item.id style=" width:100%;height: 100%;"></div>
                    </div>
                </div>
            </div>
            <div class="bodyCarts_bottom">
                <div class="bottomTitle">
                    策略生成：当前为{{ this.titlesName }}状态，采用xxx方式进行调度
                </div>
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
                    title: 'XX地区区域负荷',
                    seriesType: 'bar',
                    yAxisName: ''
                },
                {
                    id: 'chartS2',
                    title: 'XX地区能源情况',
                    seriesType: 'bar',
                    yAxisName: ''
                }
            ],
            chartData: [
                // 一
                [
                    {
                        name: 'XX地区区域负荷',
                        data: [2678, 2677, 2657, 2679, 2500, 2269, 2271, 2385, 2298, 2221, 2221, 2152, 2112, 2113, 2124, 2169, 2211, 2149, 1947, 1938, 1893, 1951, 1975, 2023, 2117, 2189, 2192, 2211, 2247, 2080, 2106, 2132, 2084, 2017, 1960, 1927, 1843, 1722, 1672, 1627, 1627, 1623, 1622, 1621, 1614, 1625, 1613, 1621, 1605, 1606, 1621, 1603, 1624, 1608, 1622, 1631, 1630, 1615, 1627, 1624, 1627, 1684, 1719, 1721, 1808, 1880, 2016, 2242, 2418, 2600, 2811, 3000, 3258, 3420, 3574, 3606, 3528, 3379, 3473, 3512, 3538, 3542, 3501, 3631, 3730, 3790, 3720, 3677, 3646, 3595, 3472, 3509, 3393, 3394, 3412, 3162]
                    }
                ],
                // 二
                [
                    {
                        name: 'XX地区能源情况',
                        data: [2678, 2677, 2657, 2679, 2500, 2269, 2271, 2385, 2298, 2221, 2221, 2152, 2112, 2113, 2124, 2169, 2211, 2149, 1947, 1938, 1893, 1951, 1975, 2023, 2117, 2189, 2192, 2211, 2247, 2080, 2106, 2132, 2084, 2017, 1960, 1927, 1843, 1722, 1672, 1627, 1627, 1623, 1622, 1621, 1614, 1625, 1613, 1621, 1605, 1606, 1621, 1603, 1624, 1608, 1622, 1631, 1630, 1615, 1627, 1624, 1627, 1684, 1719, 1721, 1808, 1880, 2016, 2242, 2418, 2600, 2811, 3000, 3258, 3420, 3574, 3606, 3528, 3379, 3473, 3512, 3538, 3542, 3501, 3631, 3730, 3790, 3720, 3677, 3646, 3595, 3472, 3509, 3393, 3394, 3412, 3162]
                    }
                ]
            ],
            colorLine: ['#FFC22E', '#5EC2F2', '#FF4528', '#fff', '#bfc', '#dac', '#faa'],
            activeName: '1',
            titlesName: '多能自治',
            formInline: {
                region: ''
            }
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
            height: 12%;

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
            height: 68%;

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
            width: 100%;
            height: 20%;

            .bottomTitle {
                font-size: 1.2vw;
                color: #fff;
                font-weight: bold;
                margin-left: 6vw;
                margin-top: 6vh;
            }
        }
    }

}
</style>
