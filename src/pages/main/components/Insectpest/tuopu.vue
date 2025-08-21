<template>
    <div>
        <div class="map">
            <img class="map_topleft" width="4%" height="auto" src="../../../../assets/img/map/1.png" alt="">
            <img class="map_topright" width="4%" height="auto" src="../../../../assets/img/map/2.png" alt="">
            <img class="map_bottomleft" width="4%" height="auto" src="../../../../assets/img/map/3.png" alt="">
            <img class="map_bottomright" width="4%" height="auto" src="../../../../assets/img/map/4.png" alt="">
            <div id="topologyChart"
                style="width: 42vw; height: 52vh;margin-left: 3vh;margin-top: 5vh;border: 2px solid rgb(153, 196, 248);">
            </div>
        </div>
    </div>
</template>
<script>
import * as echarts from 'echarts'

export default {
    data() {
        return {
            seriesData: [],
            seriesLinks: []
        }
    },
    mounted() {
        this.changeSum()
    },
    methods: {
        changeSum() {
            for (let i = 0; i < 18; i++) {
                this.seriesData.push({
                    name: i + 1,
                    draggable: false,
                    fixed: true,
                    status: 1,
                    // itemStyle: { color: "yellow" },
                    x: 80 * i,
                    y: 0
                });
                if (i < 17) {
                    this.seriesLinks.push({
                        target: i,
                        source: i + 1,
                        status: 1,
                        value: '正常',
                        label: {
                            normal: {
                                show: true,
                                textStyle: {
                                    fontSize: '12',
                                    color: 'white'
                                }
                            }
                        }
                    })
                }
            }
            for (let i = 18; i < 22; i++) {
                this.seriesData.push({
                    name: i + 1,
                    draggable: false,
                    fixed: true,
                    status: 1,
                    x: 80 * (i - 17),
                    y: -200
                });
                if (i < 21) {
                    this.seriesLinks.push({
                        target: i,
                        source: i + 1,
                        status: 1,
                        value: '正常',
                        label: {
                            normal: {
                                show: true,
                                textStyle: {
                                    fontSize: '12',
                                    color: 'white'
                                }
                            }
                        }
                    })
                }
                this.seriesLinks.push({
                    target: 1,
                    source: 18,
                    status: 1,
                    value: '正常',
                    label: {
                        normal: {
                            show: true,
                            textStyle: {
                                fontSize: '12',
                                color: 'white'
                            }
                        }
                    }
                })
            }
            for (let i = 22; i < 25; i++) {
                this.seriesData.push({
                    name: i + 1,
                    draggable: false,
                    fixed: true,
                    status: 1,
                    x: 80 * (i - 20),
                    y: 250
                });
                if (i < 24) {
                    this.seriesLinks.push({
                        target: i,
                        source: i + 1,
                        status: 1,
                        value: '正常',
                        label: {
                            normal: {
                                show: true,
                                textStyle: {
                                    fontSize: '12',
                                    color: 'white'
                                }
                            }
                        }
                    })
                }
                this.seriesLinks.push({
                    target: 2,
                    source: 22,
                    status: 1,
                    value: '正常',
                    label: {
                        normal: {
                            show: true,
                            textStyle: {
                                fontSize: '12',
                                color: 'white'
                            }
                        }
                    }
                })
            }
            for (let i = 25; i < 33; i++) {
                this.seriesData.push({
                    name: i + 1,
                    draggable: false,
                    fixed: true,
                    status: 1,
                    x: 80 * (i - 20),
                    y: 150
                });
                if (i < 32) {
                    this.seriesLinks.push({
                        target: i,
                        source: i + 1,
                        status: 1,
                        value: '正常',
                        label: {
                            normal: {
                                show: true,
                                textStyle: {
                                    fontSize: '12',
                                    color: 'white'
                                }
                            }
                        }
                    })
                }
                this.seriesLinks.push({
                    target: 5,
                    source: 25,
                    status: 1,
                    value: '正常',
                    label: {
                        normal: {
                            show: true,
                            textStyle: {
                                fontSize: '12',
                                color: 'white'
                            }
                        }
                    }
                })
            }
            this.initChart();
        },
        //Echarts数据渲染
        initChart() {
            const container = document.getElementById('topologyChart')
            this.chart = echarts.init(container)
            var option = this.getOption();
            this.chart.setOption(option);
        },
        getOption() {
            return {
                title: {
                    text: '原始网络',
                    left: 'center',
                    top: '10',
                    textStyle: {
                        fontSize: '24',
                        color: 'rgb(255,255,255)'
                    }
                },
                tooltip: {
                    //提示框  // 触发方式 mousemove, click, none, mousemove|click
                    triggerOn: 'mousemove',
                    // item 图形触发， axis 坐标轴触发， none 不触发 // triggerOn: 'click',
                    trigger: 'item',

                    // 自定义数据
                    formatter: function (params) {
                        // var arr = params.name.split(">")
                        const str = `
              <div style="background:#FFF;display: flex;justify-content: space-between; gap:10px">
                <div>
                  <p>编号：</p>
                  <p>名称：</p>
                  <p>状态：</p>
                </div>
                <div style="text-align: right">
                  <p>${params.name || ''}</p>
                  <p>测试设备</p>
                  <p style="color:${params.data.status === 1 ? 'green' : params.data.status === 2 ? 'yellow' : 'red'}">${params.data.status === 1 ? '正常' : params.data.status === 2 ? '警告' : '危险'
                            }</p>
                </div>
              </div>`;
                        return str;
                    }
                },
                legend: {
                    show: true,
                    data: [
                    ],
                    textStyle: {
                        fontSize: '12',
                        color: 'rgb(255,255,255)'
                    }
                },
                animationDurationUpdate: 100,
                animationEasingUpdate: 'quinticInOut',
                series: [
                    {
                        name: '网络拓扑图',
                        type: 'graph',
                        layout: 'force',
                        symbolSize: 12,
                        color: 'green',
                        // edgeSymbol: ['arrow'],
                        edgeLabel: {
                            normal: {
                                show: true,
                                textStyle: {
                                    fontSize: 10
                                },
                                formatter: "{c}"
                            }
                        },
                        label: {
                            normal: {
                                show: true,
                                position: 'bottom',
                                textStyle: {
                                    fontSize: '12',
                                    color: 'white'
                                }
                            }
                        },
                        roam: true,
                        focusNodeAdjacency: true,
                        data: this.seriesData,
                        force: {
                            edgeLength: 50,
                            repulsion: 250,
                            gravity: 0.1
                        },
                        links: this.seriesLinks,
                        lineStyle: {
                            normal: {
                                opacity: 0.9,
                                color: 'green',
                                width: 3,
                                curveness: 0
                            }
                        },
                    }
                ]
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.map {

    .map_topleft {
        position: absolute;
        top: 0;
        left: 0;
    }

    .map_topright {
        position: absolute;
        top: 0;
        right: 0;
    }

    .map_bottomleft {
        position: absolute;
        bottom: 0;
        left: 0;
        display: flex;
        align-items: flex-end;
    }

    .map_bottomright {
        position: absolute;
        bottom: 0;
        right: 0;
        display: flex;
        align-items: flex-end;
    }
}
</style>
