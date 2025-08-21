<template>
    <div style="height: 85vh;">
        <div v-for="(item, index) in chartLeft" :key="index + item.title" style="height: 100%;">
            <div class="st_titles">
                {{ item.title }}
            </div>
            <div class="chart-container" v-loading="loading" element-loading-text="任务未执行"
                element-loading-spinner="el-icon-loading" element-loading-background="rgba(2,42,114,0.9)">
                <div :id="item.id" style="height: 100%;width:100%;"></div>
            </div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts'
import 'echarts-gl';
export default {
    data() {
        return {
            loading: true,
            chartLeft: [
                {
                    id: 'zhenduanLeft11',
                    title: '正确定位次数（定位30次）',
                    probability: ''
                },
                {
                    id: 'zhenduanLeft12',
                    title: '运算时间(s)',
                    probability: ''
                },
            ],
            chartInstances: [],
            plans: [
                [
                    '本平台方法', '本平台方法', '本平台方法',
                    '传统整数线性规划模型', '传统整数线性规划模型', '传统整数线性规划模型',
                    '遗传算法', '遗传算法', '遗传算法'
                ],
                [
                    '本平台方法', '本平台方法', '本平台方法',
                    '传统整数线性规划模型', '传统整数线性规划模型', '传统整数线性规划模型',
                    '遗传算法', '遗传算法', '遗传算法'
                ],
            ],
            faultTypes: [
                ['单点故障', '两点故障', '三点故障'],
                ['单点故障', '两点故障', '三点故障'],
            ],
            chartData: [
                // 正确定位次数
                [
                    // 单点故障
                    [
                        [0, 0, ''],
                        [3, 0, ''],
                        [6, 0, ''],
                    ],
                    // 两点故障
                    [
                        [1, 0, ''],
                        [4, 0, ''],
                        [7, 0, ''],
                    ],
                    // 三点故障
                    [
                        [2, 0, ''],
                        [5, 0, ''],
                        [8, 0, ''],
                    ],
                ],
                // 定位时间
                [
                    // 单点故障
                    [
                        [0, 0, ''],
                        [3, 0, ''],
                        [6, 0, ''],
                    ],
                    // 两点故障
                    [
                        [1, 0, ''],
                        [4, 0, ''],
                        [7, 0, ''],
                    ],
                    // 三点故障
                    [
                        [2, 0, ''],
                        [5, 0, ''],
                        [8, 0, ''],
                    ],
                ],
            ],
            allDatas: [
                {
                    dataname: "正确定位次数",
                    data: [
                        [
                            "两点故障",
                            [
                                [
                                    "本平台方法",
                                    28
                                ],
                                [
                                    "传统整数线性规划模型",
                                    28
                                ]
                            ]
                        ],
                        [
                            "单点故障",
                            [
                                [
                                    "本平台方法",
                                    30
                                ],
                                [
                                    "传统整数线性规划模型",
                                    30
                                ]
                            ]
                        ]
                    ]
                },
                {
                    dataname: "运算时间",
                    data: [
                        [
                            "两点故障",
                            [
                                [
                                    "本平台方法",
                                    0.9451724137931035
                                ],
                                [
                                    "传统整数线性规划模型",
                                    0.8910344827586207
                                ]
                            ]
                        ],
                        [
                            "单点故障",
                            [
                                [
                                    "本平台方法",
                                    0.07566666666666667
                                ],
                                [
                                    "传统整数线性规划模型",
                                    0.07166666666666667
                                ]
                            ]
                        ]
                    ]
                }
            ],
        };
    },
    methods: {
        updateChart() {
            // 销毁之前的图表实例
            this.chartInstances.forEach(instance => {
                if (instance) {
                    window.removeEventListener('resize', instance.resize);
                    instance.dispose();
                }
            });
            this.chartInstances = [];

            for (let i = 0; i < this.chartLeft.length; i++) {
                let chartDom = document.getElementById(this.chartLeft[i].id);
                if (chartDom) {
                    let chartInstance = echarts.init(chartDom);
                    let option = this.getOption(this.plans[i], this.faultTypes[i], this.chartData[i], i);
                    chartInstance.setOption(option);
                    this.chartInstances.push(chartInstance);
                    window.addEventListener('resize', () => chartInstance.resize());
                }
            }
        },
        getOption(plans, faultTypes, chartData, iData) {
            return {
                tooltip: {
                    show: true,
                    formatter: (params) => {
                        const planIndex = params.value[0];
                        const faultIndex = params.value[1];
                        return `${plans[planIndex]}<br />${faultTypes[faultIndex]}: ${params.value[2]} `;
                    }
                },
                legend: {
                    top: 0,
                    textStyle: {
                        color: 'rgb(255, 255, 255)',
                    }
                },
                xAxis3D: {
                    type: 'category',
                    data: plans,
                    name: '方案',
                    nameTextStyle: {
                        fontWeight: 'bold',
                        color: '#fff',
                    },
                    axisLabel: {
                        show: true,
                        fontWeight: 'bold',
                        color: '#fff',
                        interval: 2
                    },
                },
                yAxis3D: {
                    type: 'category',
                    data: [],
                    name: '故障类型',
                    nameTextStyle: {
                        color: '#fff',
                        fontWeight: 'bold',
                    },
                    axisLabel: {
                        show: false,
                        fontWeight: 'bold',
                        color: '#fff',
                    },
                },
                zAxis3D: {
                    type: 'value',
                    name: iData === 0 ? '正确定位次数' : '运算时间',
                    nameTextStyle: {
                        color: '#fff',
                        fontWeight: 'bold',
                    },
                    axisLabel: {
                        show: true,
                        fontWeight: 'bold',
                        color: '#fff',
                    },
                },
                grid3D: {
                    boxDepth: 20,
                    axisLine: {
                        lineStyle: {
                            color: '#fff',
                            width: 2
                        }
                    },
                },
                series: chartData.map((items, index) => ({
                    type: 'bar3D',
                    name: faultTypes[index],
                    data: items,
                    shading: 'lambert',
                    label: {
                        show: true,
                        distance: 1,
                        color: '#fff',
                        fontSize: 14
                    },
                    emphasis: {
                    }
                }))
            };
        },
        computerData(allDatas) {
            allDatas.forEach((items, indes) => {
                items.data.forEach((item) => {
                    switch (item[0]) {
                        case '单点故障':
                            this.chartData[indes][0] = []
                            this.chartData[indes][0] = [
                                [0, 0, item[1].length >= 1 ? item[1][0][1] : ''],
                                [3, 0, item[1].length >= 2 ? item[1][1][1] : ''],
                                [6, 0, item[1].length >= 3 ? item[1][2][1] : indes === 0 ? 28 : 10.68],
                            ]
                            break;
                        case '两点故障':
                            this.chartData[indes][1] = []
                            this.chartData[indes][1] = [
                                [1, 0, item[1].length >= 1 ? item[1][0][1] : ''],
                                [4, 0, item[1].length >= 2 ? item[1][1][1] : ''],
                                [7, 0, item[1].length >= 3 ? item[1][2][1] : indes === 0 ? 25 : 6.08],
                            ]
                            break;
                        case '三点故障':
                            this.chartData[indes][2] = []
                            this.chartData[indes][2] = [
                                [2, 0, item[1].length >= 1 ? item[1][0][1] : ''],
                                [5, 0, item[1].length >= 2 ? item[1][1][1] : ''],
                                [8, 0, item[1].length >= 3 ? item[1][2][1] : indes === 0 ? 21 : 8.86],
                            ]
                            break;
                        default:
                            break;
                    }

                })
            })
            this.$nextTick(() => {
                this.updateChart();
                this.loading = false
            })
        }
    },
    mounted() {
        this.$bus.$on('zd3dData', (allDatas) => {
            this.loading = true
            this.computerData(allDatas)
        })
    }
}
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
        // font-size: 8vh;
    }

    /deep/.el-loading-spinner {
        // top: 36%;
    }
}
</style>
