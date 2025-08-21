<template>
    <div style="height: 85vh;">
        <div v-for="(item, index) in chartLeft" :key="index + item.title" style="height: 50%;">
            <div class="st_titles">
                {{ item.title }}
            </div>
            <div class="chart-container" v-loading="loading" element-loading-text="任务未执行"
                element-loading-spinner="el-icon-loading" element-loading-background="rgba(2,42,114,0.9)">
                <div :id=item.id style="height: 100%; width: 100%;"></div>
            </div>
        </div>
        <boxplot />
    </div>
</template>

<script>
import * as echarts from 'echarts'
import boxplot from './boxplot.vue';
export default {
    components: {
        boxplot
    },
    data() {
        return {
            loading: true,
            chartLeft: [
                {
                    id: 'leftsc1',
                    title: '数据降维(PCA)散点图',
                },
                {
                    id: 'leftsc2',
                    title: '数据降维(PCA)散点图-GAN',
                },
                // {
                //     id: 'leftsc3',
                //     title: 'TSNE 散点图',
                // },
                // {
                //     id: 'leftsc4',
                //     title: 'TSNE 散点图',
                // },
            ],
            colorLine: [
                ['#FFC22E', '#bfc', '#5EC2F2', '#FF4528', '#fff', '#dac', '#faa'],
                ['#bfc', '#5EC2F2', '#FF4528', '#fff', '#dac', '#faa', '#FFC22E'],
                // ['#5EC2F2', '#FF4528', '#fff', '#dac', '#faa', '#FFC22E', '#bfc'],
                // ['#dac', '#FF4528', '#fff', '#faa', '#FFC22E', '#bfc', '#5EC2F2']
            ],
            chartInstances: [] // 存储图表实例
        };
    },
    methods: {
        updateChart(leftData) {
            // 销毁之前的图表实例
            this.chartInstances.forEach(instance => {
                if (instance) {
                    window.removeEventListener('resize', instance.resize);//销毁图表监听事件
                    instance.dispose();
                }
            });
            this.chartInstances = [];

            for (let i = 0; i < leftData.length; i++) {
                let chartDom1 = document.getElementById(this.chartLeft[i].id);
                if (chartDom1) {
                    let chartInstance = echarts.init(chartDom1);
                    let option1 = this.getOption(leftData[i], this.colorLine[i]);
                    chartInstance.setOption(option1);
                    this.chartInstances.push(chartInstance); // 保存新的图表实例
                    window.addEventListener('resize', () => {
                        chartInstance.resize();
                    });
                }
            }
        },
        getOption(seriesData, colorLine) {
            return {
                tooltip: {
                    showDelay: 0,
                    formatter: function (params) {
                        const str = `
              <div style="background:#FFF;display: flex;justify-content: space-between; gap:10px">
                <div>
                  <p>X：</p>
                  <p>Y：</p>
                </div>
                <div style="text-align: right">
                  <p>${params.value[0]}</p>
                  <p>${params.value[1]}</p>
                </div>
              </div>`;
                        return str;
                    },
                    axisPointer: {
                        show: true,
                        type: 'cross',
                        lineStyle: {
                            type: 'dashed',
                            width: 4
                        }
                    }
                },
                // 直角坐标
                grid: {
                    show: true,
                    borderColor: "#fff",
                    borderWidth: 2
                },
                xAxis: {
                    axisLabel: {
                        // show: true,
                        color: '#fff',
                        fontSize: 12
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#fff',
                            width: 1,//这里是为了突出显示加上的
                        }
                    },
                    scale: true
                },
                yAxis: {
                    axisLabel: {
                        show: true,
                        color: '#fff',
                        fontSize: 12
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#fff',
                            width: 1,//这里是为了突出显示加上的
                        }
                    },
                    scale: true
                },
                series: [
                    {
                        type: 'scatter',
                        data: seriesData,
                        symbolSize: 4,
                        // 开启渐进式渲染
                        progressive: 500,
                        // 渲染阈值，大于此值则启动渐进渲染
                        progressiveThreshold: 500,
                        itemStyle: {
                            color: colorLine[0]
                        },
                    }
                ]
            };
        },
        openFalse() {
            this.$notify.error({
                title: '错误',
                message: '该日期间暂无数据'
            });
        },
        // 数据处理
        computerData1(dataArray) {
            if (dataArray) {
                // let wdSdArray = dataArray.map(data => [data.wd, data.sd]);
                // let sdYlArray = dataArray.map(data => [data.sd, data.yl]);
                // let YlFsArray = dataArray.map(data => [data.yl, data.fs]);
                // let fsWdArray = dataArray.map(data => [data.fs, data.wd]);
                let testData = [];
                testData.push(dataArray[0].data[0])
                testData.push(dataArray[0].data[1])
                // testData.push(dataArray[1].data[0])
                // testData.push(dataArray[1].data[1])
                this.loading = true
                this.updateChart(testData);
                this.loading = false
            } else {
                this.openFalse()
            }
        }
    },
    mounted() {
        this.$bus.$on('windData', (data) => {
            this.computerData1(data)
        })
    },
    activated() {
        // activated钩子执行resize()方法
        this.$nextTick(() => {
            this.chartInstances.forEach((item => {
                item.resize();
            }))
        });
        // this.throttledPostBegain(this.getWindData);
    },
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
