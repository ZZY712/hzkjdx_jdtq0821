<template>
    <div style=" display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;width: 62.5vw;height: 80.2vh;border: 2px solid rgb(153, 196, 248);">
        <div class="returnHome">
            <el-dropdown v-if="isDgShow">
                <span class="el-dropdown-link">
                    <a>算法结果-{{ topolopyName }}</a>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(item, index) in DgName" :key="item"
                        @click.native="changeTopolpy(item, index)">{{
                            item
                        }}</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <a v-if="isButtonShow" @click="autoChangeTopolpy()">移动储能移动预览</a>
        </div>
        <div id="topologyCharttwo22st"
            style="width: 62.3vw;height: 80vh;margin-left: 0.2vw;margin-top: 0.2vh;position: absolute;top: 0vh;left: 0vw;">
        </div>
        <div class="map">
            <div :id='topologyId' style="width: 50vw;height: 65.6vh;"></div>
        </div>
        <helpTip :PDFName="PDFName" />
    </div>
</template>

<script>
import { decryptData } from '@/utils/cryptoUtils';
import { computeTopology, mapBaidu } from '@/api/requestTopology';
import { computeIdData } from "@/api/requestID";
import * as echarts from 'echarts';
import helpTip from "@/components/helpTip.vue";
export default {
    props: {
        topologyId: {
            type: String,
            default: 'topologyChart2',
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
                // DG
                { color: 'rgb(255,255,255)' },
                // 未恢复供电
                { color: 'rgba(255,255,255,0.4)' }
            ],
            itemDatas: [
                [[], [], [], []]
            ],
            titleName: '',
            PDFName: '114杜肆线',
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
            // 记录全部的节点、线
            allData: [[], [], [], []],
            allLinks: [],
            // 获取不同算法的结果
            DgName: [],
            isDgShow: false,
            topolopyName: '',
            // 移动储能接入点 1接入 0未接入
            DgData: [[], [], [], []],
            // 支路状态 1断开 0未断开
            DgNode: [[], [], [], []],
            // 灾后故障线路-分时间
            timeData: [],
            // 移动储能节点 时间为单位
            messData: [],
            // 全部数据
            chartInstances: [],
            flageNum: 0,
            titleNum: '',
            isButtonShow: false,
            timer: ''
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
                        let str
                        if (Object.keys(params.data).includes('allDataBus')) {
                            str = `
              <div style="background:#FFF;display: flex;justify-content: space-between; gap:10px">
                <div>
                  <p>编号：</p>
                  <p>type：</p>
                  <p>Pd：</p>
                  <p>Qd：</p>
                  <p>Gs：</p>
                  <p>Bs：</p>
                  <p>area：</p>
                  <p>Vm：</p>
                  <p>Va：</p>
                  <p>baseKV：</p>
                  <p>zone：</p>
                  <p>Vmax：</p>
                  <p>Vmin：</p>
                </div>
                <div style="text-align: right">
                  <p>${params.name || ''}</p>
                  <p>${params.data.allDataBus[1]}</p>
                  <p>${params.data.allDataBus[2]}</p>
                  <p>${params.data.allDataBus[3]}</p>
                  <p>${params.data.allDataBus[4]}</p>
                  <p>${params.data.allDataBus[5]}</p>
                  <p>${params.data.allDataBus[6]}</p>
                  <p>${params.data.allDataBus[7]}</p>
                  <p>${params.data.allDataBus[8]}</p>
                  <p>${params.data.allDataBus[9]}</p>
                  <p>${params.data.allDataBus[10]}</p>
                  <p>${params.data.allDataBus[11]}</p>
                  <p>${params.data.allDataBus[12]}</p>
                </div>
              </div>`;
                        } else {
                            str = `
              <div style="background:#FFF;display: flex;justify-content: space-between; gap:10px">
                <div>
                  <p>编号：</p>
                  <p>状态：</p>
                </div>
                <div style="text-align: right">
                  <p>${params.name || ''}</p>
                  <p style="color:${params.data.status === 1 ? 'green' : params.data.status === 2 ? 'yellow' : params.data.status === 3 ? 'red' : ''}">
                    ${params.data.status === 1 ? '正常' : params.data.status === 2 ? '警告' : params.data.status === 3 ? '危险' : ''}</p>
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
                        width: 2,
                        curveness: 0
                    },
                }))
            };
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
        computerData() {
            let dataName = ''
            switch (this.$route.path) {
                case '/stereoStrategy':
                    // dataName = '灾前'
                    dataName = '114杜肆线'
                    break;
                case '/assessment':
                    // dataName = 'awoa'
                    dataName = '114杜肆线'
                    break;
                default:
                    break;
            }
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
            // 全部节点
            nodeData = response.rows[data].listBranch
            // 虚线节点
            listExtra = response.rows[data].listExtra
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
            // 处理矩形框节点
            this.rectseriesData = []
            let rectseriesDatas = {
                mess: [],
                pv: [],
                wt: [],
                dg: [],
            }
            if (response.rows[data].mess.length) {
                rectseriesDatas.mess = response.rows[data].mess ? response.rows[data].mess : []
            }
            if (response.rows[data].pv.length) {
                rectseriesDatas.pv = response.rows[data].pv ? response.rows[data].pv : []
            }
            if (response.rows[data].wt.length) {
                rectseriesDatas.wt = response.rows[data].wt ? response.rows[data].wt : []
            }
            if (response.rows[data].dg.length) {
                rectseriesDatas.dg = response.rows[data].dg ? response.rows[data].dg : []
            }

            let result = {};
            function addToResult(arr, label) {
                arr.forEach((item, index) => {
                    if (!result[item]) {
                        result[item] = [];
                    }
                    result[item].push(label + '' + index);
                });
            }
            addToResult(rectseriesDatas.mess, 'MESS');
            addToResult(rectseriesDatas.pv, 'PV');
            addToResult(rectseriesDatas.wt, 'WT');
            addToResult(rectseriesDatas.dg, 'DG');
            let finalResult = Object.keys(result).map(key => ({
                itemNum: parseInt(key),
                name: result[key].join(' ')
            }));
            this.rectseriesData = finalResult;

            this.titleName = response.rows[data].name
            this.computerChart(nodeData, listExtra)
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
                // 收集结束节点
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
            this.computerCharts(lastData);
        },
        computerCharts(lastData) {
            let itemdatas = []
            let rectseriesdata = []
            let rectserieslinks = []
            let alldata = [[], [], [], []]
            let allLinks = []
            let seriesdata = []
            itemdatas = this.itemDatas[0]
            // 设置seriesLinks
            this.seriesLinks.forEach(link => {
                switch (link.status) {
                    case 1:
                        link.lineStyle = { color: '#12ff00' };
                        break;
                    case 2:
                        link.lineStyle = { color: 'yellow' };
                        break;
                    case 3:
                        link.lineStyle = { color: 'red' };
                        break;
                    case 4:
                        link.lineStyle = { type: 'dashed', color: "#fff" };
                        break;
                    default:
                        break;
                }
                link.label = { fontSize: '12', color: 'white' }
            });
            // 负荷节点统一更新
            itemdatas.forEach((items, index) => {
                if (items.length > 0) {
                    items.forEach((item) => {
                        if (item != 1) {
                            this.seriesData[0][item - 1].itemStyle = this.itemStyleData[index]
                        }
                    })
                }
            })
            seriesdata = this.seriesData[0]
            this.rectLinks[0] = []
            // let symbolImg = 'image://' + require('@/assets/img/jiduan/dianyuan.png')
            // 矩形框节点统一更新
            if (this.rectseriesData.length > 0) {
                this.rectseriesData.forEach((item) => {
                    rectseriesdata.push({
                        name: item.name,
                        x: this.seriesData[0][item.itemNum - 1].x,
                        y: item.itemNum <= lastData[1] ? this.seriesData[0][item.itemNum - 1].y + 100 : this.seriesData[0][item.itemNum - 1].y - 100,
                        draggable: false,
                        fixed: true,
                        // symbol: symbolImg,
                        symbol: 'rect',
                        symbolSize: [55, 20],
                        label: { position: 'inside', fontSize: 12, show: true },
                        itemStyle: { color: '#9C27B0' },
                    })
                    this.rectLinks[0].push({
                        target: item.name,
                        source: this.seriesData[0][item.itemNum - 1].name,
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
            this.allData = [[], [lastData[1]], [seriesdata.length], [this.seriesLinks.length]]
            this.allData[0] = alldata[0]
            this.allLinks = []
            this.allLinks = allLinks
            this.updateChart(alldata, allLinks)
        },
        changeTopolpy(item, index) {
            let topolopyName = this.topolopyName.split('(')[1]
            if (topolopyName === '灾前)') {
                this.changeTopolpyPre(item, index)
            } else {
                this.changeTopolpyLast(item, index)
            }
        },
        changeTopolpyPre(titleName, value) {
            this.titleName = this.topolopyName + '-' + titleName
            let allDataOld = JSON.parse(JSON.stringify(this.allData));
            let allLinkOld = JSON.parse(JSON.stringify(this.allLinks));
            let dgname = 'MESS';
            let flageNum = 0;
            let allDatas = [[], [], [], []]
            let allLinks = []
            allDatas[0] = allDataOld[0].slice(0, allDataOld[2])
            allLinks = allLinkOld.slice(0, allDataOld[3])
            this.DgData[value].forEach((item, index) => {
                if (item) {
                    allDatas[0].push({
                        name: dgname + flageNum,
                        x: allDatas[0][index].x,
                        y: (index + 1) <= allDataOld[1][0] ? allDatas[0][index].y + 100 : allDatas[0][index].y - 100,
                        draggable: false,
                        fixed: true,
                        symbol: 'rect',
                        symbolSize: [40, 30],
                        label: { position: 'inside', fontSize: 12, show: true },
                        itemStyle: { color: '#9C27B0' },
                    })
                    allLinks.push({
                        target: dgname + flageNum,
                        source: allDatas[0][index].name,
                        status: 1,
                    })
                    flageNum++
                }
            })
            allLinks.forEach((item, index) => {
                if (index <= 31 && this.DgNode[value][index]) {
                    item.lineStyle.color = '#85c02100'
                }
            })
            // 找虚线
            for (let index = 32; index < this.DgNode[value].length; index++) {
                if (this.DgNode[value][index]) {
                    for (let i = index; i < allLinks.length; i++) {
                        if (index === allLinks[i].nrmFlag) {
                            allLinks[i].lineStyle.color = '#fff0'
                        }
                    }
                }
            }
            this.$nextTick(() => {
                this.updateChart(allDatas, allLinks)
            })
        },
        changeTopolpyLast(titleName, value) {
            this.titleName = this.topolopyName + '-' + titleName
            let allDataOld = JSON.parse(JSON.stringify(this.allData));
            let allLinkOld = JSON.parse(JSON.stringify(this.allLinks));
            let allDatas = [[], [], [], []]
            let allLinks = []
            allDatas[0] = allDataOld[0].slice(0, allDataOld[2])
            allLinks = allLinkOld.slice(0, allDataOld[3])
            if (this.messData[titleName].length > 0) {
                this.messData[titleName].forEach((items) => {
                    allDatas[0].push({
                        name: items.name,
                        x: allDatas[0][items.power - 1].x,
                        y: items.power <= allDataOld[1][0] ? allDatas[0][items.power - 1].y + 100 : allDatas[0][items.power - 1].y - 100,
                        draggable: false,
                        fixed: true,
                        symbol: 'rect',
                        symbolSize: [40, 30],
                        label: { position: 'inside', fontSize: 12, show: true },
                        itemStyle: { color: '#9C27B0' },
                    })
                    allLinks.push({
                        target: items.name,
                        source: allDatas[0][items.power - 1].name,
                        status: 1,
                    })
                })
            }
            let numFlag = 0
            this.timeData[value].load.forEach((item) => {
                if (item <= 31) {
                    for (let i = numFlag; i <= 31; i++) {
                        if (item === allLinks[i].numFlag) {
                            allLinks[i].lineStyle.color = '#85c02100'
                            numFlag = i
                        }
                    }
                } else {
                    // 找虚线
                    for (let index = 32; index < allLinks.length; index++) {
                        if (item === allLinks[index].numFlag) {
                            allLinks[index].lineStyle.color = '#fff0'
                        }
                    }
                }
            })
            this.$nextTick(() => {
                this.updateChart(allDatas, allLinks)
            })
        },
        changeCar(carData) {
            this.isDgShow = false
            let allDataOld = JSON.parse(JSON.stringify(this.allData));
            let allLinkOld = JSON.parse(JSON.stringify(this.allLinks));
            let allDatas = [[], [], [], []]
            let allLinks = []
            allDatas[0] = allDataOld[0].slice(0, allDataOld[2])
            allLinks = allLinkOld.slice(0, allDataOld[3])
            carData[2].data.forEach((item) => {
                if (item[1] === 0) {
                    allLinks[item[0] - 1].lineStyle.color = '#fff0'
                }
            })
            carData[3].data.forEach((items) => {
                allDatas[0].push({
                    name: 'DG-' + items[0],
                    x: allDatas[0][items[1] - 1].x,
                    y: allDatas[0][items[1] - 1].y > 0 ? allDatas[0][items[1] - 1].y + 100 : allDatas[0][items[1] - 1].y - 100,
                    draggable: false,
                    fixed: true,
                    symbol: 'rect',
                    symbolSize: [30, 20],
                    label: { position: 'inside', fontSize: 12, show: true },
                    itemStyle: { color: 'rgba(97, 115, 25, 1)' },
                })
                allLinks.push({
                    target: 'DG-' + items[0],
                    source: allDatas[0][items[1] - 1].name,
                    status: 1,
                })
            })
            this.$nextTick(() => {
                this.updateChart(allDatas, allLinks)
            })
        },
        //动态执行
        autoChangeTopolpy() {
            let indexNum = 0
            let that = this
            if (that.timer != '') {
                clearInterval(that.timer)
            }
            that.timer = window.setInterval(function () {
                if (indexNum < that.DgName.length) {
                    that.changeTopolpyLast(that.DgName[indexNum], indexNum)
                    indexNum++
                } else {
                    // 去除定时器
                    window.clearInterval(that.timer)
                }
            }, 1000 * 6)
        }
    },
    mounted() {
        this.$bus.$on('sendTopolpys', (dataName) => {
            this.isDgShow = true
            let response = decryptData(sessionStorage.getItem('topologyDATA'), process.env.VUE_APP_CRYPTO_KEY)
            let num;
            for (let index = 0; index < response.rows.length; index++) {
                if (response.rows[index].name === dataName) {
                    this.requestIdData({ id: response.rows[index].id })
                    num = index;
                    break;
                }
            }
            this.updateNum(response, num)
        })
        this.$bus.$on('PreData', (alldata) => {
            this.isButtonShow = false
            this.isDgShow = true
            let NameData = []
            this.DgName = []
            this.topolopyName = alldata.topolopyName + '(灾前)'
            for (let i = 0; i < alldata.data.length / 3; i++) {
                NameData = alldata.data[3 * i + 0].dataname.split('-')
                if (NameData.length === 3) {
                    this.DgName.push(NameData[0] + NameData[1])
                } else {
                    this.DgName.push(NameData[0])
                }
                this.DgData[i] = []
                this.DgData[i] = alldata.data[3 * i + 1].data
                this.DgNode[i] = []
                this.DgNode[i] = alldata.data[3 * i + 2].data
            }
            this.changeTopolpyPre(this.DgName[0], 0)
        })
        this.$bus.$on('LastTopolpyData', (alldata) => {
            this.isDgShow = true
            this.isButtonShow = true
            this.DgName = []
            this.topolopyName = alldata.topolopyName + '(灾后)'
            // 移动储能节点 时间为单位
            this.messData = []
            alldata.topolpyData.forEach((item) => {
                if (!this.messData[item.time]) {
                    this.messData[item.time] = [];
                }
                if (item.time) {
                    this.messData[item.time].push(item);
                }
            })
            // 灾后故障线路
            this.timeData = []
            alldata.loadData.forEach((items) => {
                let loadData = []
                items[1].forEach((item) => {
                    loadData.push(item[1])
                });
                this.DgName.push(items[0])
                this.timeData.push({
                    time: items[0],
                    load: loadData
                });
            })
            this.autoChangeTopolpy()
            this.changeTopolpyLast(this.DgName[0], 0)
        })
        this.$bus.$on('carData', (allData) => {
            this.changeCar(allData.data);
        })
        mapBaidu('topologyCharttwo22st')
        this.computerData();
    },
};
</script>

<style lang="scss" scoped>
.returnHome {
    // width: 100%;
    position: absolute;
    right: 0%;
    top: 10%;
    z-index: 999;

    .el-dropdown-link {
        cursor: pointer;
        color: #409EFF;
    }

    .el-icon-arrow-down {
        font-size: 12px;
    }

    a {
        text-decoration: none;
        background-color: rgba(97, 115, 25, 0.5);
        color: #fff;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 1.2vh;
        font-weight: bold;
        transition: background-color 0.3s;
    }

    a:hover {
        background-color: #0073e6;
        cursor: pointer
    }
}

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
        z-index: 10;
    }

    .mapButton:hover {
        border: 1px solid rgba(31, 91, 193, 1);
        background-color: rgba(21, 255, 0, 0.61);
    }
}
</style>
