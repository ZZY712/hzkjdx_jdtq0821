<template>
    <div style=" display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;width: 62.5vw;height: 80.2vh;border: 2px solid rgb(153, 196, 248);">
        <div id="topologyCharttwo22"
            style="width: 62.3vw;height: 80vh;margin-left: 0.2vw;margin-top: 0.2vh;position: absolute;top: 0vh;left: 0vw;">
        </div>
        <div class="map">
            <div :id='topologyId' style="width: 50vw;height: 65.6vh;"></div>
        </div>
        <helpTip :PDFName="PDFName" />
    </div>
</template>

<script>
import * as echarts from 'echarts';
import util from '@/api/generalFormat'
import { computeTopology, mapBaidu } from '@/api/requestTopology';
import { computeIdData } from "@/api/requestID";
import helpTip from "@/components/helpTip.vue";
export default {
    props: {
        topologyId: {
            type: String,
            default: 'topologyChart2',
        }
    },
    components: {
        helpTip,
    },
    data() {
        return {
            titleName: '',
            // 公共节点
            PDFName: '114杜肆线',
            seriesData: [],
            // 公共线
            seriesLinks: [],
            chartInstances: [],
            computerNodeData: [
                [8, -1, -1],
                [15, 3, 0],
                [17, 3, -4],
                [19, -2, -3],
                [23, 0, -5],
                [36, 1, -7],
                [1, 0, 0],
                [2, 0, -1],
                [3, 0, -2],
                [4, -1, -2],
                [5, 1, -2],
                [6, 0, -3],
                [7, -2, -2],
                [10, 2, -3],
                [11, 2, -4],
                [12, 3, -2],
                [14, 2, -1],
                [16, 3, -3],
                [18, -1, -3],
                [20, -2, -4],
                [21, -3, -3],
                [22, 0, -4],
                [26, -1, -5],
                [27, -2, -5],
                [29, -1, -7],
                [30, -2, -7],
                [31, -2, -6],
                [32, -2, -8],
                [33, -1, -8],
                [34, 0, -8],
                [35, 1, -8],
                [37, 2, -8],
                [9, 2, -2],
                [13, 3, -1],
                [24, 0, -6],
                [25, 1, -5],
                [28, -1, -6],
            ],
            topologyWeatherData: [],
            titleNum: '',
            //正常 0 蓝色预警 1 橙色预警 2 红色预警 3
            colorLine: ['#12ff00', '#0093ff', '#fdff00', '#ff0000']
        };
    },
    methods: {
        updateChart(data, links) {
            // 销毁之前的图表实例
            this.chartInstances.forEach(instance => {
                if (instance) {
                    window.removeEventListener('resize', instance.resize);//销毁图表监听事件
                    instance.dispose();
                }
            });
            this.chartInstances = [];
            var chartDom = document.getElementById(this.topologyId);
            let chartInstance = echarts.init(chartDom);
            var option = this.getOption(data, links);
            chartInstance.setOption(option);
            window.addEventListener('resize', () => {
                chartInstance.resize();
            });
            this.chartInstances.push(chartInstance);
        },
        getOption(data, links) {
            this.PDFName = this.titleName
            return {
                title: {
                    text: this.titleName + '图',
                    right: '0',
                    top: '10',
                    textStyle: {
                        fontSize: '24',
                        color: 'rgb(255,255,255)'
                    }
                },
                tooltip: {
                    triggerOn: 'mousemove',
                    trigger: 'item',
                    formatter: function (params) {
                        let colorLine = ['#12ff00', '#0093ff', '#fdff00', '#ff0000']
                        let str
                        if (params.dataType === 'node') {
                            str = `
              <div style="background:#FFF;display: flex;justify-content: space-between; gap:10px">
                <div>
                  <p>节点：</p>
                  <p>状态：</p>
                  <p>停电时长：</p>
                </div>
                <div style="text-align: right">
                  <p>${params.name || ''}</p>
                  <p style="color: ${colorLine[params.data.flag]}">${params.data.flag === 0 ? '正常' : '预警'}</p>
                  <p>${params.data.times + '/h'}</p>
                  </div>
              </div>`;
                        } else {
                            str = `
              <div style="background:#FFF;display: flex;justify-content: space-between; gap:10px">
                <div>
                  <p>线路编号：</p>
                  <p>状态：</p>
                  <p>故障概率：</p>
                </div>
                <div style="text-align: right">
                  <p>${params.name.split('>')[1] + '-' + params.name.split('>')[0] || ''}</p>
                  <p style="color: ${colorLine[params.data.flag]}">${params.data.flag === 0 ? '正常' : params.data.flag === 1 ? '蓝色预警' : params.data.flag === 2 ? '黄色预警' : '红色预警'}</p>
                  <p>${params.data.probability}</p>
                  </div>
              </div>`;
                        }
                        return str;
                    }
                },
                legend: {
                    bottom: '10',
                    left: 'center',
                    textStyle: {
                        color: '#fff'
                    },
                    itemStyle: {
                        color: '#fff'
                    },
                },
                animationDurationUpdate: 100,
                animationEasingUpdate: 'quinticInOut',
                series: {
                    name: '节点',
                    type: 'graph',
                    layout: 'force',
                    symbolSize: 12,
                    label: {
                        show: true,
                        position: 'bottom',
                        fontSize: '24',
                        color: 'white'
                    },
                    roam: true,
                    data: data,
                    force: {
                        edgeLength: 50,
                        repulsion: 250,
                        gravity: 0.1
                    },
                    itemStyle: {
                        color: 'rgb(237,16,12)',
                        symbolSize: [15, 15],
                    },
                    links: links,
                    lineStyle: {
                        opacity: 1,
                        width: 2,
                        curveness: 0
                    },
                }
            };
        },
        computerData(dataName, number) {
            computeTopology(dataName)
                .then(all => {
                    this.updateNum(all.responses, all.num, number)
                })
                .catch(error => {
                    console.error('computeTopology 错误:', error);
                });
        },
        generateComputerNodeData(input) {
            const nodeMap = {}; // 存储节点信息 {name: [x, y]}
            const mainRow = input[0]; // 第 0 行是主轴（y=0）
            const otherRows = input.slice(1); // 其他行（y=1, 2...）

            // 处理主行（y=0，x递增）
            mainRow.forEach((node, index) => {
                nodeMap[node] = [index, 0]; // x=index, y=0
            });

            // 处理其他行（y 递增，x 与参考节点相同）
            otherRows.forEach((row, rowIndex) => {
                const [refNode, ...nodes] = row; // refNode 是参考节点
                const refX = nodeMap[refNode][0]; // 获取参考节点的 x 坐标
                const y = (rowIndex + 1) * Math.pow(-1, rowIndex); // y=1, 2, 3...
                nodes.forEach((node, index) => {
                    nodeMap[node] = [refX + index, y]; // x 递增，y 与参考节点相同
                });
            });

            // 转换为数组格式 [[name, x, y], ...] 并按 name 排序
            const computerNodeData = Object.entries(nodeMap)
                .map(([name, [x, y]]) => [parseInt(name), x, y])
                .sort((a, b) => a[0] - b[0]);
            return computerNodeData;
        },
        // 取数据更新
        updateNum(response, data, number, computeLoadData, computeNodeData) {
            let LoadData = []
            let listExtra = []
            let allData = []
            let coordinate = []
            LoadData = number === 0 ? response.rows[data].listBranch : computeLoadData
            // listExtra = response.rows[data].listExtra
            listExtra = response.rows[data].listBranch
            // 合并节点连线
            allData = number === 0 ? [...LoadData, ...listExtra] : [...LoadData]
            //节点坐标
            coordinate = response.rows[data].coordinate
            if (coordinate != null) {
                this.computerNodeData = []
                // coordinate.forEach((item) => [
                //     this.computerNodeData.push([
                //         item[0],
                //         item[3],
                //         item[4],
                //     ])
                // ])
                this.computerNodeData = this.generateComputerNodeData(listExtra)
            } else {
                this.computerNodeData = []
                this.computerNodeData = this.generateComputerNodeData(listExtra)
            }

            //拓扑结构名称
            this.titleName = response.rows[data].name
            //处理节点位置坐标
            this.seriesData = [];
            this.computerNodeData.forEach((items) => {
                if (items[0] === 1) {
                    this.seriesData.push({
                        name: items[0] + '',
                        x: items[1],
                        y: 0 - items[2],
                        draggable: false,
                        fixed: true,
                        flag: number === 2 ? computeNodeData[1][items[0] - 1][2] : 0,
                        times: number === 2 ? computeNodeData[1][items[0] - 1][1] : 0,
                        symbol: 'path://M0,0 L2,0 L2,15 L0,15 Z M2,0 L4,0 L4,15 L2,15 Z M4,0 L6,0 L6,15 L4,15 Z M6,0 L8,0 L8,15 L6,15 Z M8,0 L10,0 L10,15 L8,15 Z',
                        symbolSize: [50, 25],
                        itemStyle: {
                            color: '#70A1FF',
                            borderColor: 'rgb(34,99,177)',
                            borderWidth: 0.5
                        },
                        emphasis: {
                            itemStyle: {
                                borderColor: '#FFD700' // 悬停时圆环高亮
                            }
                        }
                    });
                } else {
                    this.seriesData.push({
                        name: items[0] + '',
                        x: items[1],
                        y: 0 - items[2],
                        draggable: false,
                        fixed: true,
                        flag: number === 2 ? computeNodeData[1][items[0] - 1][2] : 0,
                        times: number === 2 ? computeNodeData[1][items[0] - 1][1] : 0,
                        symbol: 'path://M0,0 L2,0 L2,15 L0,15 Z M2,0 L4,0 L4,15 L2,15 Z M4,0 L6,0 L6,15 L4,15 Z M6,0 L8,0 L8,15 L6,15 Z M8,0 L10,0 L10,15 L8,15 Z',
                        symbolSize: number != 2 ? [32, 16] : computeNodeData[1][items[0] - 1][2] === 0 ? [32, 16] : [40, 20],
                        itemStyle: {
                            color: number != 2 ? '#fff' : computeNodeData[1][items[0] - 1][2] === 0 ? '#fff' : '#fdff00',
                            borderColor: 'rgb(34,99,177)',
                            borderWidth: 0.5
                        },
                        emphasis: {
                            itemStyle: {
                                borderColor: '#FFD700' // 悬停时圆环高亮
                            }
                        }
                    });
                }
            }
            );
            //处理连线
            this.seriesLinks = [];
            if (number === 0) {
                allData.forEach((items) => {
                    for (let index = 0; index < items.length - 1; index++) {
                        this.seriesLinks.push({
                            target: items[index + 1] + '',
                            source: items[index] + '',
                            flag: 0,
                            probability: 0,
                            lineStyle: { color: this.colorLine[0] }
                        });
                    }
                });
            } else {
                allData[1].forEach((items) => {
                    this.seriesLinks.push({
                        target: items[1] + '',
                        source: items[2] + '',
                        flag: items[4],
                        probability: items[3],
                        lineStyle: { color: this.colorLine[items[4]] }
                    });
                });
            }
            this.updateChart(this.seriesData, this.seriesLinks)
        },
        requestIdData(datas) {
            computeIdData(datas)
                .then(data => {
                    this.$bus.$emit('returnIdData', data)
                    console.log('获取数据成功');
                })
                .catch(error => {
                    console.error('获取数据失败', error);
                });
        },
        requestBegain() {
            // 课题一
            // computeTopology('114杜肆线')
            //     .then(all => {
            //         this.requestIdData({ id: all.id })
            //         this.updateNum(all.responses, all.num, 0)
            //     })
            //     .catch(error => {
            //         console.error('computeTopology 错误:', error);
            //     });
            if (this.$route.path != '/pingu') {
                let getBegainData = {
                    modelState: "极端天气灾害下的配电网停电风险智能预警",
                }
                util.post('/get/ac/newest/data', getBegainData)
                    .then(response => {
                        if (response && response.code === 200) {
                            console.log('请求成功');
                            computeTopology('114杜肆线')
                                .then(all => {
                                    this.requestIdData({ id: all.id })
                                    this.updateNum(all.responses, all.num, 2, response.rows[1].data[0], response.rows[0].data[0])
                                })
                                .catch(error => {
                                    console.error('computeTopology 错误:', error);
                                });
                        } else {
                            console.log('请求失败');
                        }
                    })
                    .catch(error => {
                        console.log('POST请求错误', error);
                    });
            }
        },
    },
    mounted() {
        mapBaidu('topologyCharttwo22')
        this.requestBegain();
        this.$bus.$on('ZDTUOPUDatas', (dataname) => {
            computeTopology(dataname)
                .then(all => {
                    this.requestIdData({ id: all.id })
                    this.updateNum(all.responses, all.num, 0)
                })
                .catch(error => {
                    console.error('computeTopology 错误:', error);
                });
        })
        this.$bus.$on('PINGULEEFT1DATA', (data) => {
            computeTopology('114杜肆线')
                .then(all => {
                    this.requestIdData({ id: all.id })
                    this.updateNum(all.responses, all.num, 1, data[1].data[0])
                })
                .catch(error => {
                    console.error('computeTopology 错误:', error);
                });
        })
    },
};
</script>

<style lang="scss" scoped>
.map {
    .mapButton {
        position: absolute;
        font-size: 1.6vh;
        color: #fff;
        border: 1px solid rgba(31, 91, 193, 1);
        background-color: rgba(14, 39, 84, 0.68);
        width: 6.5vw;
        height: 4vh;
        line-height: 4vh;
        text-align: center;
        top: 6.4vh;
        right: 2vw;
        cursor: pointer;
        z-index: 1000;
    }

    .mapButton:hover {
        border: 1px solid rgba(31, 91, 193, 1);
        background-color: rgba(21, 255, 0, 0.61);
    }
}
</style>
