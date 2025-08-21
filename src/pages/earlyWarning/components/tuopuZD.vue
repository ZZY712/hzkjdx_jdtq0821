<template>
    <div>
        <div class="map">
            <div v-if="isShowTuoPu" class="mapButtonSelect">
                <el-select v-model="TPSBState" placeholder="故障定位">
                    <el-option v-for="(item, index) in ZDTIMEData" :key="item[0]" :label="item[0]" :value="item[0]"
                        @click.native="ZDTIMEChange(index)"></el-option>
                </el-select>
            </div>
            <div id="topologyChartone22"
                style="width: 62.3vw;height: 80vh;margin-left: 0.2vw;margin-top: 0.2vh;position: absolute;top: 0vh;left: 0vw;">
            </div>
            <div :id="topologyId" :style="styleTuopu"></div>
        </div>
        <helpTip :PDFName="PDFName" />
    </div>
</template>

<script>
import { gotoDigitalTwin } from '@/assets/gdDev/utils';
import { encryptData, decryptData } from '@/utils/cryptoUtils';
import { computeTopology, mapBaidu } from '@/api/requestTopology';
import { computeIdData } from "@/api/requestID";
// import util from '@/api/generalFormat'
import helpTip from "@/components/helpTip.vue";
import * as echarts from 'echarts';
export default {
    props: {
        topologyId: {
            type: String,
            default: 'topologyChart2',
        },
        styleTuopu: {
            type: String,
            default: 'width: 50vw;height: 65.6vh',
        },
        isShowTuoPu: {
            type: Boolean,
            default: true,
        }
    },
    components: {
        helpTip
    },
    data() {
        return {
            isShowRes: false,
            ZDTIMEData: [],
            PDFName: '114杜肆线',
            TPSBState: '',
            timer: '',
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
            itemDatas: [
                [[], [], [], []]
            ],
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
            chartInstance.on("dblclick", (params) => {
                const data = params.data
                if (data.name) {
                    if (data.name.indexOf('DG') != -1) {
                        // 跳转到数字孪生风电视角
                        gotoDigitalTwin(this.$router, 'windPower')
                    } else {
                        gotoDigitalTwin(this.$router)
                    }
                }
            })
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
                        if (params.dataType === 'edge') {
                            str = `
              <div style="background:#FFF;display: flex;justify-content: space-between; gap:10px">
                <div>
                  <p>线路编号：</p>
                  <p>状态：</p>
                </div>
                <div style="text-align: right">
                  <p>${params.data.target + '-' + params.data.source || ''}</p>
                  <p>${params.data.dataType === '0' ? '正常' : params.data.dataType === '1' ? '接地故障' : params.data.dataType === '2' ? '重合不成故障' : params.data.dataType || '正常'}</p>
                  </div>
              </div>`;
                            return str;
                        }
                    }
                },
                // legend: {
                //     bottom: '10',
                //     left: 'center',
                //     textStyle: {
                //         color: '#fff'
                //     }
                // },
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
        computerChartsBegain() {
            this.loadData.forEach((items) => {
                // if (items[1] === 0) {
                //     this.seriesLinks = this.seriesLinks.filter(item => {
                //         let shouldKeep = !(item.numFlag === items[0]);
                //         return shouldKeep;
                //     });
                // }
                if (items[1] === 0) {
                    this.seriesLinks.forEach((item) => {
                        if (item.numFlag === items[0]) {
                            item.status = 3
                            item.dataType = items[2]
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
                this.titleName = this.titleNum
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
            // 矩形框节点统一更新
            if (this.rectseriesData[0].length > 0) {
                this.rectseriesData[0].forEach((item, index) => {
                    rectseriesdata.push({
                        name: 'DG ' + index,
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
                        target: 'DG ' + index,
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
            // console.log(alldata, 'alldata');

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
            let numFlag = 1
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
            if (this.loadData.length > 0) {
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
        computerData() {
            // let dataName = 'FTU&故障恢复 33节点'
            let dataName = '114杜肆线'
            computeTopology(dataName)
                .then(all => {
                    this.requestIdData({ id: all.id })
                    this.updateNum(all.responses, all.num)
                })
                .catch(error => {
                    console.error('computeTopology 错误:', error);
                });
        },
        ZDTIMEChange(indexs, topologyName) {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }

            const response = decryptData(sessionStorage.getItem('topologyDATA'), process.env.VUE_APP_CRYPTO_KEY);
            let num = 0;

            // 提取公共操作到函数
            const executeOperation = (indexs) => {
                // 1. 安全访问数组
                if (indexs >= this.ZDTIMEData.length || indexs < 0) {
                    return false;
                }

                // 2. 查找拓扑
                const topology = response.rows.find(item => item.name === topologyName);
                if (topology) {
                    this.requestIdData({ id: topology.id });
                    num = response.rows.indexOf(topology);
                }

                // 3. 更新状态
                this.TPSBState = this.ZDTIMEData[indexs][0];
                this.titleNum = `${topologyName}-${this.ZDTIMEData[indexs][0]}`;

                // 4. 更新加载数据
                this.loadData = this.ZDTIMEData[indexs][1].map(item => [item, 0, '故障']);

                // 5. 更新数量
                this.updateNum(response, num);
                return true;
            };

            // 初始执行
            if (!executeOperation(indexs)) {
                return;
            }

            // 启动定时器
            this.timer = setInterval(() => {
                // 检查路由
                if (this.$route.path !== '/zhenduan') {
                    clearInterval(this.timer);
                    this.timer = null;
                    return;
                }

                // 递增索引（先递增再检查）
                indexs++;

                // 安全检查
                if (indexs >= this.ZDTIMEData.length) {
                    clearInterval(this.timer);
                    this.timer = null;
                    return;
                }

                // 执行操作
                executeOperation(indexs);
            }, 6000); // 6秒
        },
        ZDTIMEChangeFL(indexs, topologyName) {
            // 清除现有定时器
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }

            // 解密并获取拓扑数据
            const response = decryptData(sessionStorage.getItem('topologyDATA'), process.env.VUE_APP_CRYPTO_KEY);
            if (!response || !response.rows) {
                console.error('无效的拓扑数据');
                return;
            }

            // const topologyName = 'FTU&故障恢复 33节点';

            // 查找目标拓扑
            const targetTopology = response.rows.find(item => item.name === topologyName);
            if (!targetTopology) {
                console.error('未找到指定拓扑:', topologyName);
                return;
            }

            const topologyId = targetTopology.id;
            const topologyIndex = response.rows.indexOf(targetTopology);

            // 执行单次操作的函数
            const executeOperation = (indexs) => {
                // 安全访问数组
                if (!this.ZDTIMEData || indexs >= this.ZDTIMEData.length || indexs < 0) {
                    return false;
                }

                // 更新状态
                this.TPSBState = this.ZDTIMEData[indexs][0];
                this.titleNum = `${topologyName}-${this.ZDTIMEData[indexs][0]}`;

                // 更新加载数据（注意item是数组）
                this.loadData = this.ZDTIMEData[indexs][1].map(item => [
                    item[0],   // 第一个元素
                    0,         // 固定值0
                    item[3]    // 第四个元素作为状态
                ]);

                // 请求数据并更新
                this.requestIdData({ id: topologyId });
                this.updateNum(response, topologyIndex);
                return true;
            };

            // 初始执行
            if (!executeOperation(indexs)) {
                return;
            }

            // 启动定时器
            let currentIndex = indexs;
            this.timer = setInterval(() => {
                // 检查路由
                if (this.$route.path !== '/zhenduan') {
                    clearInterval(this.timer);
                    this.timer = null;
                    return;
                }

                // 递增索引
                currentIndex++;

                // 检查索引范围
                if (currentIndex >= this.ZDTIMEData.length) {
                    clearInterval(this.timer);
                    this.timer = null;
                    return;
                }

                // 执行操作
                executeOperation(currentIndex);
            }, 6000); // 6秒间隔
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
            this.rectseriesData = [[]]
            if (response.rows[data].dg) {
                this.rectseriesData[0] = response.rows[data].dg
            }
            this.titleName = this.TPSBState != '' ? this.TPSBState + '-' + response.rows[data].name : response.rows[data].name
            this.computerChart(nodeData, listExtra)
        },
    },
    mounted() {
        this.$bus.$on('ZDRestorationDatas', (allData) => {
            this.ZDTIMEData = []
            this.ZDTIMEData = allData[0].data
            let topologyName = allData[0].topology_name
            this.ZDTIMEChange(0, topologyName)
            this.flageNum = 1
        })
        this.$bus.$on('ZDRestorationDatasFL', (allData) => {
            this.ZDTIMEData = []
            this.ZDTIMEData = allData[0].data
            // let topologyName = '114杜肆线'
            let topologyName = allData[0].topology_name
            this.ZDTIMEChangeFL(0, topologyName)
            this.flageNum = 1
        })
        this.$bus.$on('ZDTUOPUDatas', (dataName) => {
            let response = decryptData(sessionStorage.getItem('topologyDATA'), process.env.VUE_APP_CRYPTO_KEY)
            let num
            for (let index = 0; index < response.rows.length; index++) {
                if (response.rows[index].name === dataName) {
                    this.requestIdData({ id: response.rows[index].id })
                    num = index;
                    break;
                }
            }
            this.updateNum(response, num)
        })
        mapBaidu('topologyChartone22')
        this.computerData();
    },
    beforeDestroy() {
        if (this.timer != '') {
            clearInterval(this.timer)
        }
    },
};
</script>

<style lang="scss" scoped>
.map {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 62.5vw;
    height: 80.2vh;
    border: 2px solid rgb(153, 196, 248);

    .mapButtonSelect {
        position: absolute;
        color: rgb(255, 255, 255);
        top: 6%;
        right: 1%;
        cursor: pointer;
        z-index: 900;

        /deep/.el-input input {
            font-size: 1.6vh;
            color: rgb(255, 255, 255);
            border: 1px solid rgba(31, 91, 193, 1);
            background-color: rgba(14, 39, 84, 0.68);
        }

        /deep/::placeholder {
            color: rgb(255, 255, 255);
            font-weight: bold;
        }

        /deep/.el-input__inner {
            text-align: center;
            color: rgb(255, 255, 255);
            font-weight: bold;
        }

        /deep/.el-select {
            width: 8.5vw;
            color: rgb(255, 255, 255);
        }
    }
}
</style>
