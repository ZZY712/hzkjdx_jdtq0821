<template>
    <div>
        <div class="map">
            <div id="topologyChart22"
                style="width: 42vw;height: 56vh;border-radius: 3vh;margin-left: 3vh;margin-top: 1vh;position: absolute;top: 0vh;left: 0vw;">
            </div>
            <div :id='topologyId' style="width: 33.6vw; height: 44.8vh;">
            </div>
            <div class="mapChart">
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                    <el-form-item>
                        <el-select v-model="formInline.topology" placeholder="区域拓扑图">
                            <el-option v-for="(item) in topologyName" :key="item" :label="item" :value="item"
                                @click.native="changeTopology(item)"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <helpTip :PDFName="PDFName" />
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import util from '@/api/generalFormat'
import { computeTopology, mapBaidu } from '@/api/requestTopology';
import { encryptData } from '@/utils/cryptoUtils';
import { computeIdData, computeIdLoadData } from "@/api/requestID";
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
            PDFName: '114杜肆线',
            // 公共节点
            seriesData: [],
            formInline: {
                topology: "114杜肆线",
            },
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
            titleNum: '',
            topologyName: [],
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
                // title: {
                //     text: this.titleName + '图',
                //     right: '0',
                //     top: '10',
                //     textStyle: {
                //         fontSize: '24',
                //         color: 'rgb(255,255,255)'
                //     }
                // },
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
                // legend: {
                //     bottom: '10',
                //     left: 'center',
                //     textStyle: {
                //         color: '#fff'
                //     },
                //     itemStyle: {
                //         color: '#fff'
                //     },
                // },
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
                        fontSize: '16',
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
                        symbolSize: [30, 18],
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
                        // symbol: 'rect',
                        // itemStyle: number != 2 ? { color: '#fff' } : computeNodeData[1][items[0] - 1][2] === 0 ? { color: 'rgba(50,50,50,1)' } : { color: '#fdff00' },
                        // symbolSize: [40, 12],
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
                        symbolSize: number != 2 ? [20, 12] : computeNodeData[1][items[0] - 1][2] === 0 ? [20, 12] : [30, 18],
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
                        lineStyle: { color: this.colorLine[items[4]], width: 4, }
                    });
                });
            }
            this.updateChart(this.seriesData, this.seriesLinks)
        },
        computerLoadSum(data) {
            let loadsum = [0, 0, 0, 0]
            let nodesum = [0, 0]
            data.rows[1].data[0][1].forEach((item) => {
                loadsum[item[4]]++
            })
            data.rows[0].data[0][1].forEach((item) => {
                nodesum[item[2]]++
            })
            this.$bus.$emit('loadSum', loadsum)
            this.$bus.$emit('nodeSum', nodesum)
        },
        requestTopology(dataName) {
            util.get('/get/topology/data')
                .then(response => {
                    if (response && response.code === 200) {
                        console.log('请求成功');
                        let encryptedData = encryptData({ rows: response.rows, }, process.env.VUE_APP_CRYPTO_KEY);
                        sessionStorage.setItem("topologyDATA", encryptedData);
                        this.topologyName = []
                        response.rows.forEach((item) => {
                            this.topologyName.push(item.name)
                        })
                        this.requestBegain(dataName);
                    } else {
                        console.log('请求失败');
                    }
                })
                .catch(error => {
                    console.log('GET请求错误', error);
                });
        },
        requestIdData(datas, dataName) {
            computeIdLoadData(datas)
                .then(data => {
                    this.$bus.$emit('returnLoadData', { data: data, name: dataName })
                    console.log('获取数据成功', data);
                })
                .catch(error => {
                    console.error('获取数据失败', error);
                });
            computeIdData(datas)
                .then(data => {
                    this.$bus.$emit('returnIdData', data)
                    console.log('获取数据成功', data);
                })
                .catch(error => {
                    console.error('获取数据失败', error);
                });
        },
        testChange() {
            let res = {
                rows: [
                    {
                        id: 23,
                        name: "114杜肆线",
                        nb: 5,
                        nl: 4,
                        load: null,
                        listBranch: [
                            [
                                1,
                                2,
                                3
                            ],
                            [
                                1,
                                4
                            ],
                            [
                                2,
                                5
                            ]
                        ],
                        listExtra: [],
                        control: [],
                        branch_fault: [],
                        coordinate: [
                            [
                                1,
                                0.0,
                                0.0,
                                0.0,
                                0.0
                            ],
                            [
                                2,
                                501.0,
                                471.0,
                                1.0,
                                2.0
                            ],
                            [
                                3,
                                579.0,
                                1421.0,
                                2.0,
                                4.0
                            ],
                            [
                                4,
                                590.0,
                                446.0,
                                4.0,
                                1.0
                            ],
                            [
                                5,
                                579.0,
                                1387.0,
                                2.0,
                                3.0
                            ]
                        ],
                        dg: [],
                        pv: [],
                        wt: [],
                        mess: []
                    }
                ]
            }
            this.updateNum(res, 0, 0)
        },
        changeTopology(dataName) {
            computeTopology(dataName)
                .then(all => {
                    this.requestIdData({ id: all.id }, dataName)
                    this.updateNum(all.responses, all.num, 0)
                })
                .catch(error => {
                    console.error('computeTopology 错误:', error);
                });
        },
        requestBegain(dataName) {
            // this.changeTopology(dataName)
            let getBegainData = {
                modelState: "极端天气灾害下的配电网停电风险智能预警",
            }
            util.post('/get/ac/newest/data', getBegainData)
                .then(response => {
                    if (response && response.code === 200) {
                        console.log('请求成功');
                        this.$bus.$emit('NEWTOPOLOGYDATA', response.rows)
                        this.computerLoadSum(response)
                        computeTopology(dataName)
                            .then(all => {
                                this.requestIdData({ id: all.id }, dataName)
                                this.updateNum(all.responses, all.num, 2, response.rows[1].data[0], response.rows[0].data[0]);
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
    mounted() {
        mapBaidu("topologyChart22");
        // this.testChange()
        // 114杜肆线
        this.requestTopology('114杜肆线');
    },
};
</script>

<style lang="scss" scoped>
.map {
    width: 42vw;
    height: 56vh;
    margin-left: 3vh;
    border-radius: 3vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 2px solid rgb(153, 196, 248);
    // background-size: 100% 100%;
    // background-repeat: no-repeat;
    // background-image: url('../../../../assets/img/jiduan/tuopu_bg.png');
    // background-color: rgb(37, 124, 196);
    margin-top: 1vh;
    -moz-box-shadow: 4px 5px 20px rgba(42, 171, 140, 0.75);
    -webkit-box-shadow: 4px 5px 20px rgba(42, 171, 140, 0.75);
    box-shadow: 4px 5px 20px rgba(42, 171, 140, 0.75);

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

    .mapChart {
        position: absolute;
        top: 2vh;
        right: 2vw;

        /deep/.el-form--inline .el-form-item {
            width: 8vw;
            margin-right: 0;
        }

        /deep/.el-form-item {
            margin-bottom: 0;
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


    }
}
</style>
