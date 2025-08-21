<template>
    <div class="contain">
        <div class="title">
            <!-- 源网荷储巡航 -->
        </div>
        <div class="bodyCharts">
            <div class="body_left">
                <div v-for="(item, index) in chartLeft" :key="index" style="height: 50%;">
                    <div class="st_titles">
                        {{ item.title }}
                    </div>
                    <div class="chart-container">
                        <div :id=item.id style=" width: 100%;height: 100%;"></div>
                    </div>
                </div>
            </div>
            <div class="body_center">
                <div class="mapChart">
                    <el-form :inline="true" :model="formInline" class="demo-form-inline">
                        <el-form-item>
                            <el-select v-model="formInline.region" placeholder="地区">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item>
                            <el-select v-model="formInline.time" placeholder="时间">
                                <el-option label="时间一" value="shanghai"></el-option>
                                <el-option label="时间二" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button size="small" type="primary" @click="onSubmit">确定</el-button>
                            <el-button size="small" type="primary" @click="onCancel">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="tuopuChart">
                    <Maps />
                </div>
                <div class="pup">
                    <div class="st_titles">
                        天气聚类
                    </div>
                    <el-table height="10vw" :header-cell-style="{ background: 'rgba(0,25,47,0.7)', color: '#fff' }"
                        :data="tableData" style="width: 90%;margin-left: 5%;margin-top: -0.5%;font-size: 1.4vh;" border>
                        <el-table-column prop="year" label="年份" align="center"></el-table-column>
                        <el-table-column prop="season" label="季节" align="center"></el-table-column>
                        <el-table-column prop="weather" label="天气类型" align="center"></el-table-column>
                        <el-table-column prop="days_count" label="天数" align="center"></el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="body_right">
                <div v-for="(item, index) in chartRight" :key="index" style="height: 50%;">
                    <div class="st_titles">
                        {{ item.title }}
                    </div>
                    <div class="chart-container">
                        <div :id=item.id style=" width: 100%;height: 100%;"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts'
import Maps from '@/components/map.vue'
export default {
    components: {
        Maps
    },
    data() {
        return {
            // 左侧
            chartLeft: [
                {
                    id: 'left1',
                    title: 'XX地区能源初始数据',
                    seriesType: 'line',
                    yAxisName: ''
                },
                {
                    id: 'left2',
                    title: 'XX地区负荷数据',
                    seriesType: 'bar',
                    yAxisName: ''
                },
            ],
            leftData: [
                // 左一
                [
                    {
                        name: '光伏',
                        data: [2678, 2677, 2657, 2679, 2500, 2269, 2271, 2385, 2298, 2221, 2221, 2152, 2112, 2113, 2124, 2169, 2211, 2149, 1947, 1938, 1893, 1951, 1975, 2023, 2117, 2189, 2192, 2211, 2247, 2080, 2106, 2132, 2084, 2017, 1960, 1927, 1843, 1722, 1672, 1627, 1627, 1623, 1622, 1621, 1614, 1625, 1613, 1621, 1605, 1606, 1621, 1603, 1624, 1608, 1622, 1631, 1630, 1615, 1627, 1624, 1627, 1684, 1719, 1721, 1808, 1880, 2016, 2242, 2418, 2600, 2811, 3000, 3258, 3420, 3574, 3606, 3528, 3379, 3473, 3512, 3538, 3542, 3501, 3631, 3730, 3790, 3720, 3677, 3646, 3595, 3472, 3509, 3393, 3394, 3412, 3162]
                    },
                    {
                        name: '风电',
                        data: [2678, 2677, 2657, 2679, 2500, 2269, 2271, 2385, 2298, 2221, 2221, 2152, 2112, 2113, 2124, 2169, 2211, 2149, 1947, 1938, 1893, 1951, 1975, 2023, 2117, 2189, 2192, 2211, 2247, 2080, 2106, 2132, 2084, 2017, 1960, 1927, 1843, 1722, 1672, 1627, 1627, 1623, 1622, 1621, 1614, 1625, 1613, 1621, 1605, 1606, 1621, 1603, 1624, 1608, 1622, 1631, 1630, 1615, 1627, 1624, 1627, 1684, 1719, 1721, 1808, 1880, 2016, 2242, 2418, 2600, 2811, 3000, 3258, 3420, 3574, 3606, 3528, 3379, 3473, 3512, 3538, 3542, 3501, 3631, 3730, 3790, 3720, 3677, 3646, 3595, 3472, 3509, 3393, 3394, 3412, 3162]
                    },
                ],
                // 左二
                [
                    {
                        name: '新能源占比',
                        data: [2678, 2677, 2657, 2679, 2500, 2269, 2271, 2385, 2298, 2221, 2221, 2152, 2112, 2113, 2124, 2169, 2211, 2149, 1947, 1938, 1893, 1951, 1975, 2023, 2117, 2189, 2192, 2211, 2247, 2080, 2106, 2132, 2084, 2017, 1960, 1927, 1843, 1722, 1672, 1627, 1627, 1623, 1622, 1621, 1614, 1625, 1613, 1621, 1605, 1606, 1621, 1603, 1624, 1608, 1622, 1631, 1630, 1615, 1627, 1624, 1627, 1684, 1719, 1721, 1808, 1880, 2016, 2242, 2418, 2600, 2811, 3000, 3258, 3420, 3574, 3606, 3528, 3379, 3473, 3512, 3538, 3542, 3501, 3631, 3730, 3790, 3720, 3677, 3646, 3595, 3472, 3509, 3393, 3394, 3412, 3162]
                    },
                    {
                        name: '该地区用电负荷',
                        data: [2678, 2677, 2657, 2679, 2500, 2269, 2271, 2385, 2298, 2221, 2221, 2152, 2112, 2113, 2124, 2169, 2211, 2149, 1947, 1938, 1893, 1951, 1975, 2023, 2117, 2189, 2192, 2211, 2247, 2080, 2106, 2132, 2084, 2017, 1960, 1927, 1843, 1722, 1672, 1627, 1627, 1623, 1622, 1621, 1614, 1625, 1613, 1621, 1605, 1606, 1621, 1603, 1624, 1608, 1622, 1631, 1630, 1615, 1627, 1624, 1627, 1684, 1719, 1721, 1808, 1880, 2016, 2242, 2418, 2600, 2811, 3000, 3258, 3420, 3574, 3606, 3528, 3379, 3473, 3512, 3538, 3542, 3501, 3631, 3730, 3790, 3720, 3677, 3646, 3595, 3472, 3509, 3393, 3394, 3412, 3162]
                    },
                ],
            ],
            colorLine: ['#FFC22E', '#5EC2F2', '#FF4528', '#fff', '#bfc', '#dac', '#faa'],
            // 右侧
            chartRight: [
                {
                    id: 'right1',
                    title: 'XX地区能源预测数据',
                    seriesType: 'line',
                    yAxisName: ''
                },
                {
                    id: 'right2',
                    title: 'XX地区负荷数据',
                    seriesType: 'bar',
                    yAxisName: ''
                }
            ],
            rightData: [
                // 右一
                [
                    {
                        name: '光伏',
                        data: [2678, 2677, 2657, 2679, 2500, 2269, 2271, 2385, 2298, 2221, 2221, 2152, 2112, 2113, 2124, 2169, 2211, 2149, 1947, 1938, 1893, 1951, 1975, 2023, 2117, 2189, 2192, 2211, 2247, 2080, 2106, 2132, 2084, 2017, 1960, 1927, 1843, 1722, 1672, 1627, 1627, 1623, 1622, 1621, 1614, 1625, 1613, 1621, 1605, 1606, 1621, 1603, 1624, 1608, 1622, 1631, 1630, 1615, 1627, 1624, 1627, 1684, 1719, 1721, 1808, 1880, 2016, 2242, 2418, 2600, 2811, 3000, 3258, 3420, 3574, 3606, 3528, 3379, 3473, 3512, 3538, 3542, 3501, 3631, 3730, 3790, 3720, 3677, 3646, 3595, 3472, 3509, 3393, 3394, 3412, 3162]
                    },
                    {
                        name: '风电',
                        data: [2678, 2677, 2657, 2679, 2500, 2269, 2271, 2385, 2298, 2221, 2221, 2152, 2112, 2113, 2124, 2169, 2211, 2149, 1947, 1938, 1893, 1951, 1975, 2023, 2117, 2189, 2192, 2211, 2247, 2080, 2106, 2132, 2084, 2017, 1960, 1927, 1843, 1722, 1672, 1627, 1627, 1623, 1622, 1621, 1614, 1625, 1613, 1621, 1605, 1606, 1621, 1603, 1624, 1608, 1622, 1631, 1630, 1615, 1627, 1624, 1627, 1684, 1719, 1721, 1808, 1880, 2016, 2242, 2418, 2600, 2811, 3000, 3258, 3420, 3574, 3606, 3528, 3379, 3473, 3512, 3538, 3542, 3501, 3631, 3730, 3790, 3720, 3677, 3646, 3595, 3472, 3509, 3393, 3394, 3412, 3162]
                    },
                ],
                // 右二
                [
                    {
                        name: '新能源',
                        data: [2678, 2677, 2657, 2679, 2500, 2269, 2271, 2385, 2298, 2221, 2221, 2152, 2112, 2113, 2124, 2169, 2211, 2149, 1947, 1938, 1893, 1951, 1975, 2023, 2117, 2189, 2192, 2211, 2247, 2080, 2106, 2132, 2084, 2017, 1960, 1927, 1843, 1722, 1672, 1627, 1627, 1623, 1622, 1621, 1614, 1625, 1613, 1621, 1605, 1606, 1621, 1603, 1624, 1608, 1622, 1631, 1630, 1615, 1627, 1624, 1627, 1684, 1719, 1721, 1808, 1880, 2016, 2242, 2418, 2600, 2811, 3000, 3258, 3420, 3574, 3606, 3528, 3379, 3473, 3512, 3538, 3542, 3501, 3631, 3730, 3790, 3720, 3677, 3646, 3595, 3472, 3509, 3393, 3394, 3412, 3162]
                    }
                ]
            ],
            formInline: {
                region: '',
                time: '',
            },
            // 表格数据
            tableData: [
                {
                    year: 'XX年',
                    season: 'XX季节',
                    weather: '天气类型',
                    days_count: '30',
                },
                {
                    year: 'XX年',
                    season: 'XX季节',
                    weather: '天气类型',
                    days_count: '30',
                },
                {
                    year: 'XX年',
                    season: 'XX季节',
                    weather: '天气类型',
                    days_count: '30',
                },
                {
                    year: 'XX年',
                    season: 'XX季节',
                    weather: '天气类型',
                    days_count: '30',
                },
            ]
        };
    },
    methods: {
        onSubmit() {
            console.log('submit!');
        },
        onCancel() {
            this.formInline = {
                region: '',
                time: '',
            }
        },
        updateChart() {
            if (this.chartInstance) {
                this.chartInstance.dispose(); // 销毁图表实例
            }
            // 左侧
            for (let i = 0; i < this.chartLeft.length; i++) {
                var chartDom1 = document.getElementById(this.chartLeft[i].id);
                this.chartInstance = echarts.init(chartDom1);
                var option1 = this.getOption(this.leftData[i], this.chartLeft[i].seriesType, this.chartLeft[i].yAxisName);
                this.chartInstance.setOption(option1);
            }
            // 右侧
            for (let i = 0; i < this.chartRight.length; i++) {
                var chartDom2 = document.getElementById(this.chartRight[i].id);
                this.chartInstance = echarts.init(chartDom2);
                var option2 = this.getOption(this.rightData[i], this.chartRight[i].seriesType, this.chartRight[i].yAxisName);
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

    .bodyCharts {
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 95%;
        // margin-top: -1.8%;

        .body_left {
            width: 27%;
            height: 100%;
            position: relative;
            /* 启用垂直滚动条 */
            overflow-y: auto;
            overflow-x: hidden;

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
        }

        .body_center {
            width: 45%;
            height: 100%;
            position: relative;

            .mapChart {
                height: 6%;

                /deep/.el-form--inline .el-form-item {
                    width: 6vw;
                }

                /deep/.el-form--inline .el-form-item__content {
                    z-index: 1000;
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
                    color: #fff;
                    font-weight: bold;
                    border: 1px solid rgba(31, 91, 193, 1);
                    background-color: rgba(14, 39, 84, 0.68);
                    width: 2.72vw;
                }

                /deep/.el-button--primary:focus,
                .el-button--primary:hover {
                    font-weight: bold;
                    border: 1px solid rgba(31, 91, 193, 1);
                    background-color: rgba(21, 255, 0, 0.61);
                }
            }

            .tuopuChart {
                height: 64%;
            }

            .pup {
                height: 30%;
                border: 1px solid #ffa;
                margin-bottom: 1%;

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

        .body_right {
            width: 27%;
            height: 100%;
            position: relative;
            /* 启用垂直滚动条 */
            overflow-y: auto;
            overflow-x: hidden;

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
        }
    }
}
</style>
