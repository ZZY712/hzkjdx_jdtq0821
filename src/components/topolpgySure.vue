<template>
    <div>
        <div class="map">
            <div id="topologyChartLeixing" style="width: 41.4vw;height: 47vh;border: 2px solid rgb(153, 196, 248);">
            </div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import lodash from 'lodash';
export default {
    data() {
        return {
            itemStyleData: [
                //一级负荷
                { color: 'rgb(237,16,12)' },
                // 二级负荷
                { color: 'rgb(255,236,63)' },
                // 三级负荷
                { color: 'rgb(95,125,232)' },
                // EV
                { color: 'rgb(115,165,84)' }
            ],
            itemDatas: [
                // 高新科技园区拓扑
                [
                    //一级负荷
                    [1, 2, 6, 8, 11, 15, 18, 19, 24, 27, 30, 33],
                    //二级负荷
                    [3, 4, 7, 10, 12, 13, 16, 17, 20, 21, 23, 26, 29, 31],
                    //三级负荷
                    [5, 9, 14, 22, 25, 28, 32],
                ]
            ],
            titleName: 'XX区拓扑',
            // rect矩形框节点
            rectseriesData: [
                // 高新科技园区拓扑
                [
                    // 节点 24
                    { name: 'PV ESS ', x: 480, y: -250, status: 1, },
                    // 节点 21
                    { name: 'PV ESS', x: 400, y: 330, status: 1, },
                    // 节点 11
                    { name: ' PV ESS', x: 800, y: 130, status: 1, },
                    // 节点 30
                    { name: 'GT', x: 880, y: -250, status: 1, },
                    // 节点 18
                    { name: 'ESS', x: 1360, y: 130, status: 1, }
                ],
            ],
            // rectlinks
            rectLinks: [
                // 高新科技园区拓扑
                [
                    // 节点24
                    { target: 'PV ESS ', source: '24', status: 1, },
                    // 节点21
                    { target: 'PV ESS', source: '21', status: 1, },
                    // 节点11
                    { target: ' PV ESS', source: '11', status: 1, },
                    // 节点30
                    { target: 'GT', source: '30', status: 1, },
                    // 节点18
                    { target: 'ESS', source: '18', status: 1, },

                ],
            ],
            // 公共节点
            seriesData: [
                [// 定义所有节点
                    { name: '电源', x: -80, y: 0, status: 1, draggable: false, fixed: true, symbol: 'rect', itemStyle: { color: 'rgba(50,50,50,1)' }, symbolSize: [8, 30] },
                    { name: '1', x: 0, y: 0, status: 1, },
                    { name: '2', x: 80, y: 0, status: 1, },
                    { name: '3', x: 160, y: 0, status: 1, },
                    { name: '4', x: 240, y: 0, status: 1, },
                    { name: '5', x: 320, y: 0, status: 1, },
                    { name: '6', x: 400, y: 0, status: 1, },
                    { name: '7', x: 480, y: 0, status: 1, },
                    { name: '8', x: 560, y: 0, status: 1, },
                    { name: '9', x: 640, y: 0, status: 1, },
                    { name: '10', x: 720, y: 0, status: 1, },
                    { name: '11', x: 800, y: 0, status: 1, },
                    { name: '12', x: 880, y: 0, status: 1, },
                    { name: '13', x: 960, y: 0, status: 1, },
                    { name: '14', x: 1040, y: 0, status: 1, },
                    { name: '15', x: 1120, y: 0, status: 1, },
                    { name: '16', x: 1200, y: 0, status: 1, },
                    { name: '17', x: 1280, y: 0, status: 1, },
                    { name: '18', x: 1360, y: 0, status: 1, },

                    { name: '19', x: 240, y: 200, status: 1, },
                    { name: '20', x: 320, y: 200, status: 1, },
                    { name: '21', x: 400, y: 200, status: 1, },
                    { name: '22', x: 480, y: 200, status: 1, },


                    { name: '23', x: 400, y: -400, status: 1, },
                    { name: '24', x: 480, y: -400, status: 1, },
                    { name: '25', x: 560, y: -400, status: 1, },

                    { name: '26', x: 560, y: -150, status: 1, },
                    { name: '27', x: 640, y: -150, status: 1, },
                    { name: '28', x: 720, y: -150, status: 1, },
                    { name: '29', x: 800, y: -150, status: 1, },
                    { name: '30', x: 880, y: -150, status: 1, },
                    { name: '31', x: 960, y: -150, status: 1, },
                    { name: '32', x: 1040, y: -150, status: 1, },
                    { name: '33', x: 1120, y: -150, status: 1, },

                    { name: "4-23", x: 240, y: -400, status: 1, draggable: false, fixed: true, itemStyle: { opacity: 0 } },
                    { name: "6-26", x: 400, y: -150, status: 1, draggable: false, fixed: true, itemStyle: { opacity: 0 } },
                    { name: "2-19", x: 80, y: 200, status: 1, draggable: false, fixed: true, itemStyle: { opacity: 0 } },
                    { name: "21-8-0", x: 400, y: 100, status: 1, draggable: false, fixed: true, itemStyle: { opacity: 0 } },
                    { name: "21-8-1", x: 560, y: 100, status: 1, draggable: false, fixed: true, itemStyle: { opacity: 0 } },
                    { name: "22-12", x: 880, y: 200, status: 1, draggable: false, fixed: true, itemStyle: { opacity: 0 } },
                    { name: "25-29", x: 800, y: -400, status: 1, draggable: false, fixed: true, itemStyle: { opacity: 0 } },
                    { name: "33-18", x: 1360, y: -150, status: 1, draggable: false, fixed: true, itemStyle: { opacity: 0 } },
                ],
                [],
                [],
            ],
            // 公共线
            seriesLinks: [
                // 定义节点之间的连接关系
                { target: '电源', source: '1', status: 1, },
                { target: '2', source: '1', status: 1, },
                { target: '3', source: '2', status: 1, },
                { target: '4', source: '3', status: 1, },
                { target: '5', source: '4', status: 1, },
                { target: '6', source: '5', status: 1, },
                { target: '7', source: '6', status: 1, },
                { target: '8', source: '7', status: 1, },
                { target: '9', source: '8', status: 1, },
                { target: '10', source: '9', status: 1, },
                { target: '11', source: '10', status: 1, },
                { target: '12', source: '11', status: 1, },
                { target: '13', source: '12', status: 1, },
                { target: '14', source: '13', status: 1, },
                { target: '15', source: '14', status: 1, },
                { target: '16', source: '15', status: 1, },
                { target: '17', source: '16', status: 1, },
                { target: '18', source: '17', status: 1, },

                { target: '19', source: "2-19", status: 1, },
                { target: "2-19", source: '2', status: 1, },

                { target: '20', source: '19', status: 1, },
                { target: '21', source: '20', status: 1, },
                { target: '22', source: '21', status: 1, },

                { target: '23', source: "4-23", status: 1, },
                { target: "4-23", source: '4', status: 1, },

                { target: '24', source: '23', status: 1, },
                { target: '25', source: '24', status: 1, },

                { target: '26', source: "6-26", status: 1, },
                { target: "6-26", source: '6', status: 1, },

                { target: '27', source: '26', status: 1, },
                { target: '28', source: '27', status: 1, },
                { target: '29', source: '28', status: 1, },
                { target: '30', source: '29', status: 1, },
                { target: '31', source: '30', status: 1, },
                { target: '32', source: '31', status: 1, },
                { target: '33', source: '32', status: 1, },
                // 虚线连接
                // 节点21-8
                { target: '21', source: "21-8-0", status: 4, },
                { target: "21-8-0", source: "21-8-1", status: 4, },
                { target: "21-8-1", source: '8', status: 4, },
                // 节点22-12
                { target: '22', source: "22-12", status: 4, },
                { target: "22-12", source: '12', status: 4, },
                // 节点25-29
                { target: '25', source: "25-29", status: 4, },
                { target: "25-29", source: '29', status: 4, },
                // 节点33-18
                { target: '33', source: "33-18", status: 4, },
                { target: "33-18", source: '18', status: 4, },
            ],
            chartInstances: []
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
            var chartDom = document.getElementById('topologyChartLeixing');
            let chartInstance = echarts.init(chartDom);
            var option = this.getOption(data, links);
            chartInstance.setOption(option);
            window.addEventListener('resize', () => {
                chartInstance.resize();
            });
            this.chartInstances.push(chartInstance);
        },
        getOption(data, links) {
            let that = this
            return {
                // backgroundColor: "rgba(255,255,255,0.4)",
                title: {
                    text: this.titleName + '图',
                    left: 'center',
                    top: '10',
                    textStyle: {
                        fontSize: '24',
                        color: 'rgb(255,255,255)'
                    }
                },
                tooltip: {
                    triggerOn: 'click',
                    trigger: 'item',
                    formatter: lodash.throttle(function (params) {
                        that.clickTopolpy(data)
                        const str = `
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
                        return str;
                    }, 2000)
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
                    name: index === 0 ? '一级负荷' : index === 1 ? '二级负荷' : index === 2 ? '三级负荷' : 'EV',
                    type: 'graph',
                    layout: 'force',
                    symbolSize: 12,
                    label: {
                        show: true,
                        position: 'bottom',
                        fontSize: '12',
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
                        color: index === 0 ? 'rgb(237,16,12)' : index === 1 ? 'rgb(255, 236, 63)' : index === 2 ? 'rgb(95,125,232)' : 'rgb(115,165,84)',
                        symbolSize: [15, 15],
                    },
                    links: links,
                    lineStyle: {
                        opacity: 1,
                        // color: 'green',
                        width: 3,
                        curveness: 0
                    },
                }))
            };
        },
        computerChart() {
            let itemdatas = []
            let rectseriesdata = []
            let rectserieslinks = []
            let alldata = [[], [], []]
            let allLinks = []
            let seriesdata = []
            switch (this.titleName) {
                case 'XX区拓扑':
                    itemdatas = this.itemDatas[0]
                    rectseriesdata = this.rectseriesData[0]
                    rectserieslinks = this.rectLinks[0]
                    break;
                default:
                    break;
            }
            // 设置seriesLinks
            this.seriesLinks.forEach(link => {
                switch (link.status) {
                    case 1:
                        link.lineStyle = { color: 'green' };
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
            // 设置rectserieslinks
            rectserieslinks.forEach((item) => {
                item.label = { fontSize: '12', color: 'white' }
            })
            // 负荷节点统一更新
            itemdatas.forEach((items, index) => {
                items.forEach((item) => {
                    this.seriesData[0][item].itemStyle = this.itemStyleData[index]
                    this.seriesData[0][item].symbolSize = [15, 15]
                    this.seriesData[0][item].draggable = true
                    this.seriesData[0][item].fixed = true
                })
            })
            seriesdata = this.seriesData[0]
            // 矩形框节点统一更新
            rectseriesdata.forEach((item) => {
                item.draggable = true
                item.fixed = true
                item.symbol = 'rect'
                item.symbolSize = [40, 20]
                item.label = { position: 'inside', fontSize: 10 }
                item.itemStyle = { color: '#9C27B0' }
            })
            alldata[0] = [...seriesdata, ...rectseriesdata]
            allLinks = [...this.seriesLinks, ...rectserieslinks]
            this.updateChart(alldata, allLinks)
        },
        clickTopolpy(params) {
            console.log(params);
            console.log(this.chartInstances);
            this.chartInstances[0].resize();
            // console.log(params.data.name);
        }
    },
    mounted() {
        this.$bus.$on('sendTitles', (data) => {
            switch (data) {
                case "1":
                    this.titleName = '市中心拓扑'
                    break;
                case "2":
                    this.titleName = '老城区拓扑'
                    break;
                case "3":
                    this.titleName = '高新科技园区拓扑'
                    break;
                case "4":
                    this.titleName = '新农村拓扑'
                    break;
                default:
                    break;
            }
            this.computerChart();
        })
        this.computerChart();
    },
};
</script>

<style lang="scss" scoped>
.map {
    position: absolute;
    top: 2%;
    left: 27.1%;
}
</style>
