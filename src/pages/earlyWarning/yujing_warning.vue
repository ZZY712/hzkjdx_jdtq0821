<template>
    <div class="contain">
        <div class="title">
            <!-- 风险预警 -->
        </div>
        <div class="bodyCharts">
            <div class="body_left">
                <div class="left_child">
                    <div>
                        <div style="width: 100%;">
                            <!-- 模型选择 -->
                            <div class="st_titles">
                                模型选择
                            </div>
                            <div class="left_tuopu">
                                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                                    <el-form-item>
                                        <el-select v-model="formInline.modelState" placeholder="模型选择">
                                            <el-option label="基于电流的风险预警(训练)" value="基于电流的风险预警(训练)"
                                                @click.native="selectModel(1)"></el-option>
                                            <el-option label="基于电流的风险预警(预测)" value="基于电流的风险预警(预测)"
                                                @click.native="selectModel(2)"></el-option>
                                            <el-option label="基于电流的风险预警(pytorch训练)" value="基于电流的风险预警(pytorch训练)"
                                                @click.native="selectModel(3)"></el-option>
                                            <el-option label="基于电流的风险预警(pytorch预测)" value="基于电流的风险预警(pytorch预测)"
                                                @click.native="selectModel(4)"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                        <div style="width: 100%;">
                            <!-- 空间选择 -->
                            <div class="st_titles">
                                空间选择
                            </div>
                            <div class="left_tuopu">
                                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                                    <el-form-item>
                                        <el-select v-model="formInline.level" placeholder="行政等级"
                                            @change="handleLevelChange">
                                            <el-option v-for="item in levelData" :key="item" :label="item"
                                                :value="item"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <!-- <el-form-item>
                            <el-select v-model="formInline.state" placeholder="数据类型" @change="handleStateChange">
                                <el-option v-for="item in stateData" :key="item" :label="item"
                                    :value="item"></el-option>
                            </el-select>
                        </el-form-item> -->
                                    <el-form-item v-if="isShow">
                                        <el-select v-model="formInline.province" placeholder="省级"
                                            @change="handleProvinceChange">
                                            <el-option v-for="item in provinceData" :key="item" :label="item"
                                                :value="item"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item v-if="isShow">
                                        <el-select v-model="formInline.town" placeholder="区级"
                                            @change="handleTownChange">
                                            <el-option v-for="item in townData" :key="item" :label="item"
                                                :value="item"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item v-if="isShow">
                                        <el-select v-model="formInline.region" placeholder="站点"
                                            @change="handleRegionChange">
                                            <el-option v-for="item in regionData" :key="item" :label="item"
                                                :value="item"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button size="small" type="primary" @click="onSubmit">确定</el-button>
                                        <el-button size="small" type="primary" @click="onCancel">重置</el-button>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                    </div>
                    <mangeData />
                </div>
            </div>
            <div class="body_center">
                <div class="tuopuChart">
                    <!-- <tuopu /> -->
                    <tuopu :topologyId="'topologyChartywj3'" />
                </div>
                <!-- <div class="pup">
                    <div class="st_titles">
                        误差数据表
                    </div>
                    <el-table height="22vh" :header-cell-style="{ background: 'rgba(0,25,47,0.7)', color: '#fff' }"
                        :data="tableData" style="width: 95%;margin-left: 2.5%;margin-top: -0.5%;font-size: 1.4vh;"
                        v-loading="loading" element-loading-text="任务未执行" element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(2,42,114,0.9)" border>
                        <el-table-column prop="name" label="模型名称" align="center"
                            v-if="tableData.some(item => item.name ? item.name : item.name === 0 ? true : false)"></el-table-column>
                        <el-table-column prop="MAE" label="MAE" align="center"
                            v-if="tableData.some(item => item.MAE ? item.MAE : item.MAE === 0 ? true : false)"></el-table-column>
                        <el-table-column prop="RMSE" label="RMSE" align="center"
                            v-if="tableData.some(item => item.RMSE ? item.RMSE : item.RMSE === 0 ? true : false)"></el-table-column>
                        <el-table-column prop="SMAPE" label="SMAPE" align="center"
                            v-if="tableData.some(item => item.SMAPE ? item.SMAPE : item.SMAPE === 0 ? true : false)"></el-table-column>
                    </el-table>
                </div> -->
            </div>
            <div class="body_right">
                <div v-if="isShowCharts" style="height: 100%;">
                    <div v-for="(item, index) in chartRight" :key="index + item.title" style="height: 50%;">
                        <div class="st_titles">
                            {{ item.title ? item.title : '暂无' }}数据
                        </div>
                        <div class="chart-container" v-loading="index === 0 ? loading21 : loading22"
                            element-loading-text="任务未执行" element-loading-spinner="el-icon-loading"
                            element-loading-background="rgba(2,42,114,0.9)">
                            <div :id=item.id style="width:100%;height: 100%;"></div>
                        </div>
                    </div>
                </div>
                <div v-if="!isShowCharts" style="height: 100%;">
                    <div v-for="(item, index) in chartLeft" :key="index + item.title" style="height: 50%;">
                        <div class="st_titles">
                            {{ item.title ? item.title : '暂无' }}数据
                        </div>
                        <div class="chart-container" v-loading="index === 0 ? loading11 : loading12"
                            element-loading-text="任务未执行" element-loading-spinner="el-icon-loading"
                            element-loading-background="rgba(2,42,114,0.9)">
                            <div :id=item.id style="width:100%;height: 100%;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <jianCe :visiableParams1="visiableParams1" :jcData="jcData" @JICEDATA="computerData1"></jianCe>
    </div>
</template>

<script>
import util from '@/api/generalFormat'
import { getSelectDatas } from '@/utils/getSelectData'
import * as echarts from 'echarts'
import tuopu from '@/pages/earlyWarning/components/tuopu.vue'
// import titleInfo from '@/components/titleInfo.vue'
// import switchData from '@/pages/energyMulti/components/switchData.vue'
import mangeData from '@/components/mangeData'
import jianCe from '@/pages/earlyWarning/components/jiance.vue'
import { encryptData } from '@/utils/cryptoUtils';
export default {
    components: {
        // titleInfo,
        tuopu,
        // switchData,
        jianCe,
        mangeData
    },
    data() {
        return {
            loading: true,
            loading11: true,
            loading12: true,
            loading21: true,
            loading22: true,
            isShowCharts: false,
            isShow: true,
            visiableParams1: false,
            titleName: '',
            jcData: {},
            // 左侧
            chartLeft: [
                {
                    id: 'leftzdzd1',
                    title: '训练损失',
                    seriesType: 'line',
                    ainterval: '',
                    yAxisName: '',
                    time: ''
                },
                {
                    id: 'leftzdzd2',
                    title: '残差图',
                    seriesType: 'line',
                    ainterval: 259,
                    yAxisName: '',
                    time: []
                },
                {
                    id: 'leftzdzd3',
                    title: '预警分析图',
                    seriesType: 'line',
                    ainterval: 259,
                    yAxisName: '',
                    time: []
                }
            ],
            leftData: [
                // 左一
                [
                    {
                        name: '',
                        data: []
                    },
                ],
                // 左二
                [
                    {
                        name: '实际值',
                        data: []
                    },
                    {
                        name: '预测值',
                        data: []
                    },
                    {
                        name: '残差',
                        data: []
                    }
                ],
                // 左三
                [
                    {
                        name: 'RSME',
                        data: []
                    },
                    {
                        name: '预警',
                        data: []
                    },
                    {
                        name: '报警',
                        data: []
                    }
                ],
            ],
            colorLine: ['#7cd6cf', '#ebe12a', '#ce2626', '#ffc076', '#05f8d6', '#7cd6cf', '#7898e1', '#efa666'],
            // 右侧
            chartRight: [
                {
                    id: 'rightzdzd1',
                    title: '训练损失',
                    seriesType: 'line',
                    ainterval: '',
                    yAxisName: '',
                    time: ''
                },
                {
                    id: 'rightzdzd2',
                    title: '残差图(模型2)',
                    seriesType: 'line',
                    ainterval: 259,
                    yAxisName: '',
                    time: []
                },
                {
                    id: 'rightzdzd3',
                    title: '预警分析图(模型2)',
                    seriesType: 'line',
                    ainterval: 259,
                    yAxisName: '',
                    time: []
                }
            ],
            rightData: [
                // 右一
                [
                    {
                        name: '',
                        data: []
                    },
                ],
                // 右二
                [
                    {
                        name: '实际值',
                        data: []
                    },
                    {
                        name: '预测值',
                        data: []
                    },
                    {
                        name: '残差',
                        data: []
                    }
                ],
                // 右三
                [
                    {
                        name: 'RSME',
                        data: []
                    },
                    {
                        name: '预警',
                        data: []
                    },
                    {
                        name: '报警',
                        data: []
                    }
                ],
            ],
            begainData: [],//接受数据
            selectData: [],//总体数据
            levelData: [],// 行政等级
            provinceData: [],
            townData: [],
            regionData: [],// 区域
            stateData: [],// 数据类型
            extraData: [],
            levelName: '',
            provinceName: '',
            townName: '',
            regionName: '',
            formInline: {
                level: '',
                province: '',
                town: '',
                region: '',
                iP: '',
                id: '',
                state: '',
                modelState: '',
            },
            // 表格数据
            tableData: [],
            getBegainData: {},
            chartInstances: [],
        };
    },
    methods: {
        updateChart(char, charData) {
            // 销毁之前的图表实例
            this.chartInstances.forEach(instance => {
                if (instance) {
                    window.removeEventListener('resize', instance.resize);//销毁图表监听事件
                    instance.dispose();
                }
            });
            this.chartInstances = [];
            // 左侧
            for (let i = 0; i < char.length; i++) {
                var chartDom1 = document.getElementById(char[i].id);
                let chartInstance = echarts.init(chartDom1);
                var option1 = this.getOption(charData[i], char[i].seriesType, char[i].yAxisName, char[i].ainterval, char[i].time);
                chartInstance.setOption(option1);
                window.addEventListener('resize', () => {
                    chartInstance.resize();
                });
                this.chartInstances.push(chartInstance);
            }
        },
        getOption(data, seriesType, yAxisName, ainterval, xAxisData) {
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
                    nameTextStyle: {
                        fontWeight: 'bold',
                        color: '#fff'
                    },
                    data: xAxisData != '' ? xAxisData : Array.from({ length: data[0].data.length + 1 }, (_, i) => i),
                    // data: Array.from({ length: data[0].data.length + 1 }, (_, i) => i),
                    // data: [
                    //     '6:00', '6:15', '6:30', '6:45', '7:00', '7:15', '7:30', '7:45', '8:00', '8:15', '8:30', '8:45', '9:00', '9:15', '9:30', '9:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30'
                    // ],
                    axisLabel: {
                        show: false,
                        interval: ainterval,
                        // textStyle: {
                        fontWeight: 'bold',
                        color: '#fff'
                        // },

                    },
                },
                yAxis: [
                    {
                        name: yAxisName,
                        type: 'value',
                        nameTextStyle: {
                            fontWeight: 'bold',
                            color: '#fff'
                        },
                        axisLabel: {
                            show: true,
                            // textStyle: {
                            fontWeight: 'bold',
                            color: '#fff'
                            // }
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
                    // areaStyle: {
                    //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    //         {
                    //             offset: 0,
                    //             color: '#FFC22E'
                    //         },
                    //         {
                    //             offset: 1,
                    //             color: 'rgb(255, 70, 131)'
                    //         }
                    //     ])
                    // },
                    // 开启渐进式渲染
                    progressive: 200,
                    // 渲染阈值，大于此值则启动渐进渲染
                    progressiveThreshold: 200,
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
        // 获取模型数据参数
        computerData1(data) {
            this.formInline.model = data
        },
        // 处理下拉框接口数据
        getSelectData(data) {
            this.begainData = data
            this.selectData = {};
            this.selectData = getSelectDatas(data, '天气数据');
            this.levelData = this.selectData.levelData;
        },
        handleLevelChange(value) {
            this.stateData = this.selectData.stateData[value] || [];
            this.formInline.state = '';
            this.formInline.iP = '';
            this.provinceData = [];
            this.formInline.province = '';
            this.townData = [];
            this.formInline.town = '';
            this.regionData = [];
            this.formInline.region = '';
            this.levelName = value
            this.handleStateChange('天气数据')
        },
        handleStateChange(value) {
            this.formInline.state = '天气数据'
            this.provinceName = this.levelName + '-' + value;
            this.provinceData = this.selectData.provinceData[this.provinceName] || [];
            this.formInline.province = '';
            this.townData = [];
            this.formInline.town = '';
            this.formInline.iP = '';
            this.regionData = [];
            this.formInline.region = '';
        },
        handleProvinceChange(value) {
            this.townName = this.provinceName + '-' + value;
            this.townData = this.selectData.townData[this.townName] || [];
            this.formInline.town = '';
            this.formInline.iP = '';
            this.regionData = [];
            this.formInline.region = '';
        },
        handleTownChange(value) {
            this.regionName = this.townName + '-' + value;
            this.regionData = this.selectData.regionData[this.regionName] || [];
            this.formInline.region = '';
            this.formInline.iP = '';
        },
        handleRegionChange() {
            let begain = this.begainData;
            for (let i = 0; i < begain.length; i++) {
                if ((this.formInline.level === begain[i].acType) &&
                    (this.formInline.region === begain[i].name) &&
                    (this.formInline.province === begain[i].province) &&
                    (this.formInline.town === begain[i].town) &&
                    (this.formInline.state === begain[i].dataType)) {
                    // 更新id
                    this.formInline.id = begain[i].basicDataId;
                    this.formInline.iP = begain[i].ip;
                    break; // 找到匹配项后跳出循环
                }
            }
        },
        selectModel(data) {
            // 获取下拉框数据
            this.getSelect();
            this.visiableParams1 = false
            this.onCancel()
            if (data === 1) {
                this.isShow = false
                setTimeout(() => {
                    this.visiableParams1 = !this.visiableParams1
                    this.jcData = {
                        lr: 0.00005,
                        // MSE: 'MSE',
                        batchSize: 64,
                        epoch: 50,
                    }
                }, 200);
                this.formInline.modelState = '基于电流的风险预警(训练)'
            } else if (data === 2) {
                this.isShow = true
                this.formInline.modelState = '基于电流的风险预警(预测)'
            } else if (data === 3) {
                this.isShow = false
                setTimeout(() => {
                    this.visiableParams1 = !this.visiableParams1
                    this.jcData = {
                        lr: 0.0002,
                        // MSE: 'MSE',
                        batchSize: 512,
                        epoch: 500,
                    }
                }, 200);
                this.formInline.modelState = '基于电流的风险预警(pytorch训练)'
            } else if (data === 4) {
                this.isShow = true
                this.formInline.modelState = '基于电流的风险预警(pytorch预测)'
            }
        },
        // 获取下拉框数据
        getSelect() {
            let arrSelect = []
            arrSelect = this.$store.state.select.selectOptions
            this.getSelectData(arrSelect.selectOptions)
        },
        // 故障预测模型算法执行
        postWind() {
            util.post('/system/measurement/windMeasurementAlgorithm', this.formInline)
                .then(response => {
                    // 处理POST请求的响应
                    if (response && response.code === 200) {
                        // 请求成功的处理逻辑
                        console.log('请求成功');
                        this.$message.success('已提交，算法正在运行')
                    } else {
                        // 请求失败的处理逻辑
                        console.log('请求失败');
                        // this.$message.error('服务器错误')
                    }
                })
                .catch(error => {
                    // 处理POST请求的错误
                    // this.$message.error('POST请求错误')
                    console.log('POST请求错误', error);
                });
            setTimeout(() => {
                this.titleName = this.formInline.modelState + '-' + this.formInline.level + '-' + this.formInline.state
            }, 2000);
        },
        // 获取算法计算初始数据
        postBegain(data, flag) {
            util.post('/get/ac/data', data)
                .then(response => {
                    // 处理POST请求的响应
                    if (response && response.code === 200) {
                        // 请求成功的处理逻辑
                        console.log('请求成功');
                        if (flag === 1 || flag === 2) {
                            this.isShowCharts = false
                            // this.loading21 = true
                            // this.loading22 = true
                        } else {
                            this.isShowCharts = true
                            // this.loading11 = true
                            // this.loading12 = true
                        }
                        this.computerChartS(response.rows, flag)
                        // this.$message.success('请求成功')
                    } else {
                        // 请求失败的处理逻辑
                        console.log('请求失败');
                        // this.$message.error('服务器错误')
                    }
                })
                .catch(error => {
                    // 处理POST请求的错误
                    // this.$message.error('POST请求错误')
                    console.log('POST请求错误', error);
                });
        },
        // 计算echarts数据
        computerChartS(data, flag) {
            if (flag === 1) {
                this.tableData.push({
                    name: data[3].dataname + '(故障检测)',
                    MAE: data[0].data,
                    RMSE: data[1].data,
                    SMAPE: data[2].data,
                },)
                this.chartLeft[0].ainterval = data[3].data.length / 8
                // this.chartLeft[0].title = data[3].dataname + '' + '训练'
                this.leftData[0][0].data = []
                this.leftData[0][0].data = data[3].data
                this.leftData[0][0].name = data[3].dataname
                this.loading11 = false;
                this.loading = false;
                this.$nextTick(() => {
                    this.updateChart(this.chartLeft, this.leftData)
                })
            } else if (flag === 2) {
                this.leftData.forEach((items, index) => {
                    this.chartLeft[index].time = []
                    if (index > 0) {
                        items.forEach((item) => {
                            item.data = []
                        })
                    }
                })
                let arr1 = data[0].data.slice(0, 800)
                let arr2 = data[1].data.slice(0, 100)
                this.chartLeft[1].ainterval = arr1.length / 8
                this.chartLeft[2].ainterval = arr2.length / 8
                arr1.forEach((item) => {
                    if (item[0]) { this.leftData[1][0].data.push(item[0]) }
                    if (item[1]) { this.leftData[1][1].data.push(item[1]) }
                    if (item[2]) { this.leftData[1][2].data.push(item[2]) }
                    if (item[3]) { this.chartLeft[1].time.push(item[3]) }
                })
                arr2.forEach((item) => {
                    if (item[0]) { this.leftData[2][0].data.push(item[0]) }
                    if (item[1]) { this.leftData[2][1].data.push(item[1]) }
                    if (item[2]) { this.leftData[2][2].data.push(item[2]) }
                    if (item[3]) { this.chartLeft[2].time.push(item[3]) }
                })
                this.loading12 = false;
                this.$nextTick(() => {
                    this.updateChart(this.chartLeft, this.leftData)
                })
            } else if (flag === 3) {
                this.tableData.push({
                    name: data[3].dataname + '(pytorch)',
                    MAE: data[0].data,
                    RMSE: data[1].data,
                    SMAPE: data[2].data,
                },)
                this.chartRight[0].ainterval = data[3].data.length / 8
                // this.chartRight[0].title = data[3].dataname + '' + '训练'
                this.rightData[0][0].data = []
                this.rightData[0][0].data = data[3].data
                this.rightData[0][0].name = data[3].dataname
                this.loading21 = false;
                this.loading = false;
                this.$nextTick(() => {
                    this.updateChart(this.chartRight, this.rightData)
                })
            } else if (flag === 4) {
                this.rightData.forEach((items, index) => {
                    if (index > 0) {
                        items.forEach((item) => {
                            item.data = []
                        })
                    }
                })
                let arr1 = data[0].data.slice(0, 800)
                let arr2 = data[1].data.slice(0, 100)
                this.chartRight[1].ainterval = arr1.length / 8
                this.chartRight[2].ainterval = arr2.length / 8
                arr1.forEach((item) => {
                    if (item[0]) { this.rightData[1][0].data.push(item[0]) }
                    if (item[1]) { this.rightData[1][1].data.push(item[1]) }
                    if (item[2]) { this.rightData[1][2].data.push(item[2]) }
                    if (item[3]) { this.chartRight[1].time.push(item[3]) }
                })
                arr2.forEach((item) => {
                    if (item[0]) { this.rightData[2][0].data.push(item[0]) }
                    if (item[1]) { this.rightData[2][1].data.push(item[1]) }
                    if (item[2]) { this.rightData[2][2].data.push(item[2]) }
                    if (item[3]) { this.chartRight[2].time.push(item[3]) }
                })
                let encryptedData = encryptData({ data: this.rightData[2], time: this.chartRight[2].time, ainterval: this.chartRight[2].ainterval }, process.env.VUE_APP_CRYPTO_KEY);
                sessionStorage.setItem("PYTORCHDATA", encryptedData);
                this.loading22 = false;
                this.$nextTick(() => {
                    this.updateChart(this.chartRight, this.rightData)
                })
            }
            // console.log(this.tableData, 'this.tableData');
            // console.log(data, 'data');
            // console.log(this.rightData, 'this.RightData');
        },
        // 确定提交
        onSubmit() {
            if (this.formInline.level != '' &&
                // this.formInline.region != '' &&
                this.formInline.modelState != '' &&
                // this.formInline.time != '' &&
                // this.formInline.iP != '' &&
                // this.formInline.region != '' &&
                this.formInline.state != '') {
                if (this.formInline.modelState === '基于电流的风险预警(训练)' || this.formInline.modelState === '基于电流的风险预警(pytorch训练)') {
                    this.formInline = {
                        level: this.formInline.level,
                        modelState: this.formInline.modelState,
                        state: this.formInline.state,
                        model: this.formInline.model,
                    }
                    this.$message.success('已提交，算法正在运行')
                    this.postWind()
                } else if (this.formInline.region != '') {
                    this.formInline = {
                        iP: this.formInline.iP,
                        id: this.formInline.id,
                        level: this.formInline.level,
                        modelState: this.formInline.modelState,
                        province: this.formInline.province,
                        region: this.formInline.region,
                        cityId: this.formInline.town,
                        town: this.formInline.region,
                        state: this.formInline.state,
                    }
                    this.$message.success('已提交，算法正在运行')
                    this.postWind()
                }
                // console.log(this.formInline, 'this.formInline');
            } else {
                this.$message.warning('传入的参数不能为空')
            }
        },
        // 重置
        onCancel() {
            this.formInline = {
                level: '',
                province: '',
                town: '',
                region: '',
                iP: '',
                id: '',
                state: '',
                modelState: '',
            }
            this.provinceData = []
            this.townData = []
            this.regionData = []
            this.stateData = []
        },
        begainCompute() {
            let getBegainData = {
                modelState: "基于电流的风险预警(训练)",
                // modelState: "台风模型线路故障概率",
            }
            util.post('/get/ac/newest/data', getBegainData)
                .then(response => {
                    if (response && response.code === 200) {
                        console.log('请求成功');
                        this.computerChartS(response.rows, 1)
                    } else {
                        console.log('请求失败');
                    }
                })
                .catch(error => {
                    console.log('POST请求错误', error);
                });
            getBegainData = {
                modelState: "基于电流的风险预警(预测)",
            }
            util.post('/get/ac/newest/data', getBegainData)
                .then(response => {
                    if (response && response.code === 200) {
                        console.log('请求成功');
                        this.computerChartS(response.rows, 2)
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
        this.$bus.$on('runQueueDataGZ', (allDatas) => {
            let data = allDatas.allData
            this.getBegainData = {}
            this.getBegainData = {
                data_type: data.data_type,
                columns: data.columns,
                start_date: data.start_date,
                end_date: data.end_date,
                data_id: data.data_id,
                basic_data_id: data.basic_data_id,
                task_id: data.task_id,
            }
            this.titleName = data.data_type
            this.postBegain(this.getBegainData, allDatas.flag)
        })
        this.begainCompute()
    },
    beforeDestroy() {
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
    deactivated() {
    }
}
</script>

<style lang="scss" scoped>
.contain {
    height: 85vh;
    // border: 2px solid rgb(153, 196, 248);

    /deep/.el-loading-spinner i {
        color: #40f3ff00;
        // font-size: 8vh;
    }

    /deep/.el-loading-spinner {
        // top: 36%;
    }

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
            width: 9%;
            height: 100%;
            position: relative;
            /* 启用垂直滚动条 */
            overflow-y: hidden;
            overflow-x: hidden;
            display: flex;

            .st_titles {
                background-size: 100% 107%;
                background-repeat: no-repeat;
                background-image: url('../../assets/img/ch/item_new.png');
            }

            .left_child {
                width: 100%;
                overflow-y: auto;
                overflow-x: hidden;

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

                .left_tuopu {
                    height: 50%;

                    /deep/.el-form--inline .el-form-item {
                        width: 100%;
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

                    /deep/.el-form--inline .el-form-item__content {
                        z-index: 1000;
                    }

                    /deep/::placeholder {
                        color: rgb(255, 255, 255);
                        font-weight: bold;
                    }

                    /deep/.el-button--primary {
                        margin-left: 1vw;
                        font-weight: bold;
                        border: 1px solid rgba(31, 91, 193, 1);
                        background-color: rgba(14, 39, 84, 0.68);
                    }

                    /deep/.el-button--primary:focus,
                    .el-button--primary:hover {
                        font-weight: bold;
                        border: 1px solid rgb(0, 255, 251);
                        background-color: rgba(21, 255, 0, 0.61);
                    }

                    /deep/.el-date-editor.el-input,
                    .el-date-editor.el-input__inner {
                        width: 100%;
                    }

                    /deep/.el-range-editor.el-input__inner {
                        color: #fff;
                        border: 1px solid rgba(31, 91, 193, 1);
                        background-color: rgba(14, 39, 84, 0.68);
                        width: 100%;
                    }

                    /deep/.el-date-editor .el-range__icon {
                        color: #fff;
                    }

                    /deep/.el-date-editor .el-range-separator {
                        color: #fff;
                    }

                    /deep/.el-date-editor .el-range-input {
                        color: #fff;
                        font-weight: bold;
                        background-color: rgba(17, 182, 152, 0);
                    }
                }
            }

            .left_child2 {
                width: 71.4%;
                overflow-y: auto;
                overflow-x: hidden;

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
            width: 64%;
            height: 100%;
            position: relative;

            .workflow {
                position: absolute;
                top: -5.5%;
                left: -1%;
                display: flex;
                font-size: 1.65vh;
                font-weight: bold;
                color: #fff;
                height: 7vh;
                // align-items: center;
                // justify-content: center;
            }

            .workflow-node {
                display: flex;
                align-items: center;
            }

            .mapChart {
                height: 6%;

                /deep/.el-form--inline .el-form-item {
                    width: 18%;
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

                /deep/.el-form--inline .el-form-item__content {
                    z-index: 1000;
                }

                /deep/::placeholder {
                    color: rgb(255, 255, 255);
                    font-weight: bold;
                }

                /deep/.el-button--primary {
                    font-weight: bold;
                    border: 1px solid rgba(31, 91, 193, 1);
                    background-color: rgba(14, 39, 84, 0.68);
                }

                /deep/.el-button--primary:focus,
                .el-button--primary:hover {
                    font-weight: bold;
                    border: 1px solid rgb(0, 255, 251);
                    background-color: rgba(21, 255, 0, 0.61);
                }
            }

            .tuopuChart {
                height: 54%;
            }

            .pup {
                // border: 1px solid #ffa;
                height: 33%;
                position: relative;
                z-index: 1000;
                top: 14%;
            }

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
</style>
