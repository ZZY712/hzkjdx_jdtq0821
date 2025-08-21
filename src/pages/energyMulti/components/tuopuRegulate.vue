<template>
    <div style=" display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;width: 62.18vw;height: 80.2vh;border: 2px solid rgb(153, 196, 248);">
        <div class="map">
            <div class="mapButton">
                <el-form :inline="true" :model="GDInline" class="demo-form-inline">
                    <el-form-item>
                        <el-select v-model="GDInline.GDModel" placeholder="不同模型孤岛图">
                            <el-option v-for="(item) in GDData" :key="item[0]" :label="item[0]" :value="item[0]"
                                @click.native="GzhfChange(item)"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div :id="topologyId" style="width: 50vw;height: 65.6vh;"></div>
        </div>
        <div id="topologyCharttwo2ass2"
            style="width: 62vw;height: 80vh;margin-left: 0.18vw;margin-top: 0.2vh;position: absolute;top: 0vh;left: 0vw;">
        </div>
        <helpTip :PDFName="PDFName" />
    </div>
</template>

<script>
import { encryptData, decryptData } from '@/utils/cryptoUtils';
import { computeTopology, mapBaidu } from '@/api/requestTopology';
import * as echarts from 'echarts';
import { computeIdData } from "@/api/requestID";
import helpTip from "@/components/helpTip.vue";
export default {
    props: {
        topologyId: {
            type: String,
            default: 'topologyChart2w',
        }
    },
    components: {
        helpTip
    },
    data() {
        return {
            itemStyleData: [
                //一级负荷
                { color: 'rgb(237,16,12)' },
                // 二级负荷
                { color: 'rgb(255,236,63)' },
                // 三级负荷
                { color: 'rgb(95,125,232)' },
                // 无负荷等级
                { color: 'rgb(255,255,255)' },
                // 未恢复供电
                { color: 'rgba(255,255,255,0.4)' }
            ],
            GDInline: {
                GDModel: ''
            },
            GDData: [],
            itemDatas: [
                [[], [], [], []]
            ],
            PDFName: '114杜肆线',
            titleName: '',
            // rect矩形框节点
            rectseriesData: [[]],
            // rectlinks
            rectLinks: [[]],
            // 公共节点
            seriesData: [
                // 定义所有节点
                [],
                [],
                [],
                [],
                [],
            ],
            // 公共线
            seriesLinks: [],
            // 节点状态
            nodeData: [],
            // 线路状态
            loadData: [],
            // 全部数据
            chartInstances: [],
            //保存拓扑识别断线
            openData: '',
            alldata: [[], [], [], []],
            allLinks: [],
            flageNum: 0,
            titleNum: '',
            isStatus: true,
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
                },
                legend: {
                    bottom: '10',
                    left: 'center',
                    textStyle: {
                        color: '#fff'
                    }
                },
                animationDurationUpdate: 100,
                animationEasingUpdate: 'quinticInOut',
                series: data.map((item, index) => ({
                    name: index === 0 ? '一级负荷' : index === 1 ? '二级负荷' : index === 2 ? '三级负荷' : index === 3 ? '无负荷等级' : '未恢复供电',
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
                    data: item,
                    force: {
                        edgeLength: 50,
                        repulsion: 250,
                        gravity: 0.1
                    },
                    itemStyle: {
                        color: index === 0 ? 'rgb(237,16,12)' : index === 1 ? 'rgb(255, 236, 63)' : index === 2 ? 'rgb(95,125,232)' : index === 3 ? 'rgb(255,255,255)' : 'rgba(255,255,255,0.4)',
                        symbolSize: [15, 15],
                    },
                    links: links,
                    lineStyle: {
                        opacity: 1,
                        // color: 'green',
                        width: 2,
                        curveness: 0
                    },
                }))
            };
        },
        GzhfChange(data) {
            let alllinks = JSON.parse(JSON.stringify(this.allLinks));
            data[1].forEach((item, index) => {
                if (item[1] === 0) {
                    alllinks[index].lineStyle = { color: '#85c02100' }
                }
            })
            this.updateChart(this.alldata, alllinks)
        },
        computerChartsBegain() {
            this.loadData.forEach((items, indexs) => {
                // if (items[1] === 0) {
                //     this.seriesLinks = this.seriesLinks.filter(item => {
                //         let shouldKeep = !(item.numFlag === indexs);
                //         return shouldKeep;
                //     });
                // }
                if (items[1] === 0) {
                    this.seriesLinks.forEach((item) => {
                        console.log(item);
                        if (item.numFlag === indexs) {
                            item.status = 3
                        }
                    })
                }
            })
            this.computerCharts()
        },
        computerCharts() {
            let itemdatas = []
            let rectseriesdata = []
            let rectserieslinks = []
            let alldata = [[], [], [], []]
            if (this.loadData.length > 0) {
                alldata = [[], [], [], [], []]
                this.titleName = this.titleNum + '故障恢复'
            }
            let allLinks = []
            let seriesdata = []
            itemdatas = this.itemDatas[0]
            let listLink
            // 设置seriesLinks
            this.seriesLinks.forEach(link => {
                listLink = link.target + '-' + link.source
                switch (link.status) {
                    case 1:
                        if (this.openData) {
                            this.openData.includes(listLink) ? link.lineStyle = { color: '#85c02100' } : link.lineStyle = { color: '#12ff00' };
                        } else {
                            link.lineStyle = { color: '#12ff00' }
                        }
                        break;
                    case 2:
                        link.lineStyle = { color: 'yellow' };
                        break;
                    case 3:
                        link.lineStyle = { color: 'red' };
                        break;
                    case 4:
                        link.lineStyle = this.isStatus ? { type: 'dashed', color: "#fff" } : { color: '#12ff00' };
                        break;
                    default:
                        break;
                }
                link.label = { fontSize: '12', color: 'white' }
            });
            // 负荷节点统一更新
            itemdatas.forEach((items, index) => {
                items.forEach((item) => {
                    if (item != 1) {
                        this.seriesData[0][item - 1].itemStyle = this.itemStyleData[index]
                    }
                })
            })
            if (this.nodeData.length > 0) {
                this.nodeData.forEach((item, index) => {
                    let nameItem = parseInt(item) + 1 + ''
                    if (nameItem === this.seriesData[0][index].name && item[1] === 0) {
                        this.seriesData[0][index].itemStyle = { color: 'rgba(255,255,255,0.4)' }
                    }
                })
            }
            seriesdata = this.seriesData[0]
            this.rectLinks[0] = []
            let symbolImg = 'image://' + require('@/assets/img/jiduan/dianyuan.png')
            let symbolImgs = 'image://' + require('@/assets/img/jiduan/guangdian.png')
            // 矩形框节点统一更新
            if (this.rectseriesData[0].length > 0) {
                this.rectseriesData[0].forEach((item, index) => {
                    rectseriesdata.push({
                        name: 'PV ' + index,
                        x: this.seriesData[0][item - 1].x,
                        y: this.seriesData[0][item - 1].y - 100,
                        draggable: false,
                        fixed: true,
                        symbol: symbolImg,
                        // symbol: 'rect',
                        symbolSize: [30, 30],
                        label: { position: 'inside', fontSize: 10, show: false },
                        itemStyle: { color: '#9C27B0' },
                    })
                    this.rectLinks[0].push({
                        target: 'PV ' + index,
                        source: this.seriesData[0][item - 1].name,
                        status: 1,
                    })
                })
            }
            if (this.rectseriesData[1].length > 0) {
                this.rectseriesData[1].forEach((item, index) => {
                    rectseriesdata.push({
                        name: 'WT ' + index,
                        x: this.seriesData[0][item - 1].x,
                        y: this.seriesData[0][item - 1].y - 100,
                        draggable: false,
                        fixed: true,
                        symbol: symbolImgs,
                        // symbol: 'rect',
                        symbolSize: [30, 30],
                        label: { position: 'inside', fontSize: 10, show: false },
                        itemStyle: { color: '#9C27B0' },
                    })
                    this.rectLinks[0].push({
                        target: 'WT ' + index,
                        source: this.seriesData[0][item - 1].name,
                        status: 1,
                    })
                })
            }
            rectserieslinks = this.rectLinks[0]
            // 设置rectserieslinks
            rectserieslinks.forEach((item) => {
                item.label = { fontSize: '12', color: 'white' }
            })
            alldata[0] = [...seriesdata, ...rectseriesdata]
            allLinks = [...this.seriesLinks, ...rectserieslinks]
            if (this.titleName === 'igdt-cvar 33节点') {
                this.alldata = [[], [], [], []]
                this.allLinks = []
                this.alldata[0] = alldata[0]
                this.allLinks = allLinks
            }
            this.updateChart(alldata, allLinks)
            if (this.nodeData.length > 0) {
                let encryptedData = encryptData({ alldata: alldata, allLinks: allLinks }, process.env.VUE_APP_CRYPTO_KEY);
                sessionStorage.setItem("GZHFDATA", encryptedData);
            }
        },
        computerChart(data, listExtra) {
            this.seriesData = [
                [
                    {
                        name: '1', x: 0, y: 0, status: 1, draggable: false, fixed: true, symbol: 'path://M0,0 L2,0 L2,15 L0,15 Z M2,0 L4,0 L4,15 L2,15 Z M4,0 L6,0 L6,15 L4,15 Z M6,0 L8,0 L8,15 L6,15 Z M8,0 L10,0 L10,15 L8,15 Z',
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
                    },
                ],
                [],
                [],
                []
            ];
            let startData = [];
            this.seriesLinks = [];
            let lastData = [];
            // 转换为字符串
            data.forEach((items, indexs) => {
                lastData.push(items[items.length - 1]);
                items.forEach((item, index) => {
                    data[indexs][index] = data[indexs][index] + '';
                });
                // 收集开始节点
                startData.push(items[0]);
            });// 定义y的高度
            let yHight = [170, -380, -170];
            // 区分不同拓扑的图形高度
            if (startData.length > 4 && startData.length <= 9) {
                yHight = [450, 350, -200, 250, 150, -200, -350, -540];
            }
            let numFlag = 0
            data.forEach((items, indexs) => {
                if (indexs === 0) {
                    items.forEach((item, index) => {
                        if (index > 0) {
                            this.seriesData[0].push({
                                name: item,
                                x: 80 * index,
                                y: 0,
                                status: 1,
                                symbol: 'path://M0,0 L2,0 L2,15 L0,15 Z M2,0 L4,0 L4,15 L2,15 Z M4,0 L6,0 L6,15 L4,15 Z M6,0 L8,0 L8,15 L6,15 Z M8,0 L10,0 L10,15 L8,15 Z',
                                symbolSize: [32, 16],
                                itemStyle: {
                                    color: '#fff',
                                    borderColor: 'rgb(34,99,177)',
                                    borderWidth: 0.5
                                },
                                emphasis: {
                                    itemStyle: {
                                        borderColor: '#FFD700' // 悬停时圆环高亮
                                    }
                                },
                                draggable: false,
                                fixed: true,
                            });
                            this.seriesLinks.push({
                                target: items[index - 1],
                                source: items[index],
                                status: 1,
                                numFlag: numFlag,
                            });
                            numFlag = numFlag + 1
                        }
                        startData.forEach((startItem, startIndex) => {
                            if (item === startItem) {
                                startData[startIndex] = {
                                    name: startItem + '-' + startIndex,
                                    x: 80 * index,
                                    y: 0,
                                };
                            }
                        });
                    });
                } else {
                    startData[indexs].y = yHight[indexs - 1]
                    // startData[indexs].y = yHight[indexs % 4 - 1] * Math.ceil((startData.length - indexs) / 4);
                    items.forEach((item, index) => {
                        if (index > 0) {
                            this.seriesData[0].push({
                                name: item,
                                x: startData[indexs].x + 80 * (index - 1),
                                y: startData[indexs].y,
                                status: 1,
                                symbol: 'path://M0,0 L2,0 L2,15 L0,15 Z M2,0 L4,0 L4,15 L2,15 Z M4,0 L6,0 L6,15 L4,15 Z M6,0 L8,0 L8,15 L6,15 Z M8,0 L10,0 L10,15 L8,15 Z',
                                symbolSize: [32, 16],
                                itemStyle: {
                                    color: '#fff',
                                    borderColor: 'rgb(34,99,177)',
                                    borderWidth: 0.5
                                },
                                emphasis: {
                                    itemStyle: {
                                        borderColor: '#FFD700' // 悬停时圆环高亮
                                    }
                                },
                                draggable: false,
                                fixed: true,
                            });
                            this.seriesLinks.push({
                                target: items[index - 1] + '',
                                source: items[index] + '',
                                status: 1,
                                numFlag: numFlag
                            });
                            numFlag = numFlag + 1
                        }
                        startData.forEach((startItem, startIndex) => {
                            if (item === startItem) {
                                startData[startIndex] = {
                                    name: startItem + '-' + startIndex,
                                    x: 80 * index,
                                    y: startData[indexs].y,
                                };
                            }
                        });
                    });
                }
            });
            // 虚线
            listExtra.forEach((item, index) => {
                let flag = false;
                lastData.forEach((itemLast) => {
                    if (itemLast === item[0] || itemLast === item[1]) {
                        flag = true;
                    }
                });
                if (this.seriesData[0][item[0] - 1].y != this.seriesData[0][item[1] - 1].y && !flag) {
                    this.seriesData[0].push({
                        name: item[0] + '-' + item[1] + '-0',
                        x: this.seriesData[0][item[0] - 1].x,
                        y: (this.seriesData[0][item[0] - 1].y + this.seriesData[0][item[1] - 1].y) / 2 + index * 8,
                        status: 1,
                        draggable: false,
                        fixed: true,
                        itemStyle: { opacity: 0 }
                    }, {
                        name: item[0] + '-' + item[1] + '-1',
                        x: this.seriesData[0][item[1] - 1].x,
                        y: (this.seriesData[0][item[0] - 1].y + this.seriesData[0][item[1] - 1].y) / 2 + index * 8,
                        status: 1,
                        draggable: false,
                        fixed: true,
                        itemStyle: { opacity: 0 }
                    });
                    this.seriesLinks.push({
                        target: item[0] + '',
                        source: item[0] + '-' + item[1] + '-0',
                        status: 4,
                        numFlag: numFlag
                    }, {
                        target: item[0] + '-' + item[1] + '-0',
                        source: item[0] + '-' + item[1] + '-1',
                        status: 4,
                        numFlag: numFlag
                    }, {
                        target: item[0] + '-' + item[1] + '-1',
                        source: item[1] + '',
                        status: 4,
                        numFlag: numFlag
                    });
                    numFlag = numFlag + 1
                } else if (this.seriesData[0][item[0] - 1].y != this.seriesData[0][item[1] - 1].y && flag) {
                    // 判断y值的绝对值来确定透明点的坐标
                    let yAbs = Math.abs(this.seriesData[0][item[1] - 1].y) > Math.abs(this.seriesData[0][item[0] - 1].y);
                    this.seriesData[0].push({
                        name: item[0] + '-' + item[1],
                        x: yAbs ? this.seriesData[0][item[0] - 1].x : this.seriesData[0][item[1] - 1].x,
                        y: yAbs ? this.seriesData[0][item[1] - 1].y : this.seriesData[0][item[0] - 1].y,
                        status: 1,
                        draggable: false,
                        fixed: true,
                        itemStyle: { opacity: 0 }
                    });
                    this.seriesLinks.push({
                        target: item[0] + '',
                        source: item[0] + '-' + item[1],
                        status: 4,
                        numFlag: numFlag
                    }, {
                        target: item[0] + '-' + item[1],
                        source: item[1] + '',
                        status: 4,
                        numFlag: numFlag
                    });
                    numFlag = numFlag + 1
                } else {
                    this.seriesData[0].push({
                        name: item[0] + '-' + item[1] + '-0',
                        x: this.seriesData[0][item[0] - 1].x,
                        y: -60,
                        status: 1,
                        draggable: false,
                        fixed: true,
                        itemStyle: { opacity: 0 }
                    }, {
                        name: item[0] + '-' + item[1] + '-1',
                        x: this.seriesData[0][item[1] - 1].x,
                        y: -60,
                        status: 1,
                        draggable: false,
                        fixed: true,
                        itemStyle: { opacity: 0 }
                    });
                    this.seriesLinks.push({
                        target: item[0] + '',
                        source: item[0] + '-' + item[1] + '-0',
                        status: 4,
                        numFlag: numFlag
                    }, {
                        target: item[0] + '-' + item[1] + '-0',
                        source: item[0] + '-' + item[1] + '-1',
                        status: 4,
                        numFlag: numFlag
                    }, {
                        target: item[0] + '-' + item[1] + '-1',
                        source: item[1] + '',
                        status: 4,
                        numFlag: numFlag
                    });
                    numFlag = numFlag + 1
                }
            });

            // 去除重复的连接
            let uniqueLinks = [];
            let linkSet = new Set();

            this.seriesLinks.forEach(link => {
                let linkString = `${link.target}-${link.source}`;
                if (!linkSet.has(linkString)) {
                    linkSet.add(linkString);
                    uniqueLinks.push(link);
                }
            });
            this.seriesLinks = uniqueLinks;
            if (this.nodeData.length > 0) {
                this.computerChartsBegain();
            } else {
                this.computerCharts();
            }
        },
        requestIdData(datas) {
            computeIdData(datas)
                .then(data => {
                    this.$bus.$emit('returnIdData', data)
                    console.log('获取数据成功', data);
                })
                .catch(error => {
                    console.error('获取数据失败', error);
                });
        },
        computerData(dataName) {
            computeTopology(dataName)
                .then(all => {
                    this.requestIdData({ id: all.id })
                    this.updateNum(all.responses, all.num)
                })
                .catch(error => {
                    console.error('computeTopology 错误:', error);
                });
        },
        // 取数据更新
        updateNum(response, data) {
            let nodeData = []
            let listExtra = []
            this.openData = response.rows[data].branch_fault
            // 全部节点
            nodeData = response.rows[data].listBranch
            // 虚线节点
            listExtra = response.rows[data].listExtra
            function removeSameElements(arr1, arr2) {
                const resultArr1 = [];
                const resultArr2 = [];
                arr1.forEach(item1 => {
                    let isSame = false;
                    arr2.forEach(item2 => {
                        if (JSON.stringify(item1) === JSON.stringify(item2)) {
                            isSame = true;
                        }
                    });
                    if (!isSame) {
                        resultArr1.push(item1);
                    }
                });
                arr2.forEach(item1 => {
                    let isSame = false;
                    arr1.forEach(item2 => {
                        if (JSON.stringify(item1) === JSON.stringify(item2)) {
                            isSame = true;
                        }
                    });
                    if (!isSame) {
                        resultArr2.push(item1);
                    }
                });
                return [resultArr1, resultArr2];
            }
            if (this.openData) {
                const [newArray1, newArray2] = removeSameElements(this.openData, listExtra);
                this.openData = []
                newArray1.forEach((item) => {
                    this.openData.push(item[0] + '-' + item[1])
                })
                listExtra = newArray2
            }
            // 节点等级
            this.itemDatas = [
                [[], [], [], []]
            ]
            if (response.rows[data].load) {
                this.itemDatas[0][0] = response.rows[data].load[0][0]
                this.itemDatas[0][1] = response.rows[data].load[1][0]
                this.itemDatas[0][2] = response.rows[data].load[2][0]
                if (response.rows[data].load.length > 3) { this.itemDatas[0][3] = response.rows[data].load[3][0] }
            }
            this.rectseriesData = [[], []]
            if (response.rows[data].pv) {
                this.rectseriesData[0] = response.rows[data].pv
            }
            if (response.rows[data].wt) {
                this.rectseriesData[1] = response.rows[data].wt
            }
            this.titleName = response.rows[data].name
            this.computerChart(nodeData, listExtra)
        }
    },
    mounted() {
        this.$bus.$on('sendTitlesRegulate', (dataNume) => {
            let response = decryptData(sessionStorage.getItem('topologyDATA'), process.env.VUE_APP_CRYPTO_KEY)
            if (this.nodeData.length > 0) {
                this.nodeData = []
                this.loadData = []
                this.flageNum = 1
            }
            let num;
            for (let index = 0; index < response.rows.length; index++) {
                if (response.rows[index].name === dataNume) {
                    this.requestIdData({ id: response.rows[index].id })
                    num = index;
                    break;
                }
            }
            this.updateNum(response, num)
        })
        this.$bus.$on('chartsRegulate', (allData) => {
            this.GDData = []
            this.GDData = allData[1].data
            this.GzhfChange(allData[1].data[0])
        })
        mapBaidu('topologyCharttwo2ass2')
        this.computerData('114杜肆线');
        // this.computerData('igdt-cvar 33节点');
    },
};
</script>

<style lang="scss" scoped>
.map {
    z-index: 900;

    .mapButton {
        position: absolute;
        // width: 4.5vw;
        height: 3.5vh;
        top: 2.5vh;
        right: 0.5vw;
        z-index: 900;

        /deep/.el-form--inline .el-form-item {
            width: 9.5vw;
        }

        /deep/.el-form--inline .el-form-item__content {
            z-index: 10;
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
