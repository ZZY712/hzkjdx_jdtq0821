<template>
    <div class="contain">
        <div class="title">
            <!-- 停电风险态势评估 -->
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
                                            <el-option label="故障预测模型(训练)" value="故障预测模型(训练)"
                                                @click.native="selectModel(1)"></el-option>
                                            <!-- <el-option label="故障预测模型(微调)" value="故障预测模型(微调)"
                                    @click.native="selectModel(2)"></el-option> -->
                                            <el-option label="故障预测模型(预测)" value="故障预测模型(预测)"
                                                @click.native="selectModel(3)"></el-option>
                                            <el-option label="台风模型线路故障概率" value="台风模型线路故障概率"
                                                @click.native="selectModel(4)"></el-option>
                                            <el-option label="故障预测数学模型" value="故障预测数学模型"
                                                @click.native="selectModel(5)"></el-option>
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
                                </el-form>
                            </div>
                        </div>
                        <div style="width: 100%;">
                            <div class="st_titles">
                                拓扑-时间选择
                            </div>
                            <div class="left_tuopu">
                                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                                    <el-form-item v-if="isWeather">
                                        <el-date-picker v-model="formInline.weatherTime" type="datetimerange"
                                            range-separator="至" start-placeholder="开始" end-placeholder="结束"
                                            align="right" value-format="yyyy-MM-dd HH:mm:ss"
                                            :picker-options="pickerWeatherOptions">
                                        </el-date-picker>
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
                    <tuopu :topologyId="'topologyChartpg23'" />
                </div>
            </div>
            <div class="body_right">
                <!-- <pinguRight1 style="height: 50%;" /> -->
                <div v-if="isShowCharts" style="height: 100%;">
                    <pinguRight2 style="height: 50%;" />
                    <div v-for="(item, index) in chartRight" :key="index + item.title" style="height: 50%;">
                        <div class="st_titles">
                            {{ item.title }}
                        </div>
                        <div class="chart-container" v-loading="loading22" element-loading-text="任务未执行"
                            element-loading-spinner="el-icon-loading" element-loading-background="rgba(2,42,114,0.9)">
                            <div :id=item.id style="width:100%;height: 100%;"></div>
                        </div>
                    </div>
                </div>
                <div v-if="!isShowCharts" style="height: 100%;">
                    <pinguLeft1 style="height: 50%;" />
                    <div v-for="(item, index) in chartLeft" :key="index + item.title" style="height: 50%;">
                        <div class="st_titles">
                            {{ item.title }}
                        </div>
                        <div class="chart-container" v-loading="loading11" element-loading-text="任务未执行"
                            element-loading-spinner="el-icon-loading" element-loading-background="rgba(2,42,114,0.9)">
                            <div :id=item.id style="width:100%;height: 100%;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <argument :visiableParams1="visiableParams1" :agData="agData" @AGDATA="computerData1"></argument>
    </div>
</template>

<script>
import * as echarts from 'echarts'
import util from '@/api/generalFormat'
import tuopu from '@/pages/earlyWarning/components/tuopu.vue'
import pinguLeft1 from '@/pages/earlyWarning/components/pinguLeft1.vue'
// import pinguRight1 from '@/pages/earlyWarning/components/pinguRight1.vue'
import pinguRight2 from '@/pages/earlyWarning/components/pinguRight2.vue'
// import titleInfo from '@/components/titleInfo.vue'
import argument from '@/pages/earlyWarning/components/argument.vue'
import mangeData from '@/components/mangeData'
import { getSelectDatas } from '@/utils/getSelectData'
import { encryptData } from '@/utils/cryptoUtils';
export default {
    components: {
        // titleInfo,
        argument,
        pinguLeft1,
        // pinguRight1,
        pinguRight2,
        mangeData,
        tuopu
    },
    data() {
        return {
            loading: true,
            loading11: true,
            loading22: true,
            visiableParams1: false,
            isWeather: false,
            isShowCharts: false,
            isShow: true,
            isShowTQ: false,
            titleName: '',
            agData: {},
            extraData: [],
            gtColumn: [],
            groupCol: [],
            // 左侧
            chartLeft: [
                {
                    id: 'leftpg1',
                    title: '残差图(训练)',
                    seriesType: 'line',
                    yAxisName: '',
                    time: []
                },
                {
                    id: 'leftpg2',
                    title: '分析图(训练)',
                    seriesType: 'line',
                    yAxisName: '',
                    time: []
                },
            ],
            leftData: [
                // 左一
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
                    // {
                    //     name: '残差',
                    //     data: []
                    // },
                ],
            ],
            colorLine: ['#7cd6cf', '#ebe12a', '#ce2626', '#ffc076', '#05f8d6', '#7cd6cf', '#7898e1', '#efa666'],
            // 右侧
            chartRight: [
                {
                    id: 'rightpg1',
                    title: '残差图(预测)',
                    seriesType: 'line',
                    yAxisName: '',
                    time: []
                },
                {
                    id: 'rightpg2',
                    title: '预警分析图(预测)',
                    seriesType: 'line',
                    yAxisName: '',
                    time: []
                }
            ],
            rightData: [
                // 右一
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
                    // {
                    //     name: '残差',
                    //     data: []
                    // },
                ]
            ],
            formInline: {
                level: '',
                province: '',
                town: '',
                region: '',
                iP: '',
                id: '',
                state: '',
                gt_column: '',
                weatherTime: '',
                group_col: '',
                modelState: '',
                selectedExtraData: '',
            },
            levelName: "",
            provinceName: '',
            townName: '',
            regionName: '',
            begainData: [],//接受数据
            selectData: [],//总体数据
            selectOldData: [],
            levelData: [],// 行政等级
            provinceData: [],
            townData: [],
            regionData: [],// 区域
            stateData: [],// 数据类型
            // 表格数据
            getBegainData: {},
            tableData: [],
            chartInstances: [],
            validWeatherRanges: {
                start: '', // 有效开始时间
                end: ''    // 有效结束时间
            },
        };
    },
    computed: {
        pickerWeatherOptions() {
            return {
                disabledDate: (time) => {
                    const start = this.parseDate(this.validWeatherRanges.start).getTime() - 86400000;
                    const end = this.parseDate(this.validWeatherRanges.end).getTime() + 86400000;
                    return time.getTime() < start || time.getTime() > end;
                }
            };
        },
    },
    methods: {
        parseDate(dateString) {
            // 将日期字符串拆分为各个部分
            const [datePart, timePart] = dateString.split(' ');
            const [year, month, day] = datePart.split('-').map(Number);
            const [hours, minutes, seconds] = timePart.split(':').map(Number);

            // 创建一个新的 Date 对象
            return new Date(year, month - 1, day, hours, minutes, seconds);
        },
        updateChart(char, charData) {
            // 销毁之前的图表实例
            this.chartInstances.forEach(instance => {
                if (instance) {
                    window.removeEventListener('resize', instance.resize);//销毁图表监听事件
                    instance.dispose();
                }
            });
            this.chartInstances = [];
            for (let i = 0; i < char.length; i++) {
                var chartDom1 = document.getElementById(char[i].id);
                let chartInstance = echarts.init(chartDom1);
                var option1 = this.getOption(charData[i], char[i].seriesType, char[i].yAxisName, char[i].time);
                chartInstance.setOption(option1);
                window.addEventListener('resize', () => {
                    chartInstance.resize();
                });
                this.chartInstances.push(chartInstance);
            }
        },
        getOption(data, seriesType, yAxisName, xAxisData) {
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
                    data: xAxisData != '' ? xAxisData : Array.from({ length: data[0].data.length + 1 }, (_, i) => i),
                    // data: Array.from({ length: data[0].data.length + 1 }, (_, i) => i),
                    // data: [
                    //     '6:00', '6:15', '6:30', '6:45', '7:00', '7:15', '7:30', '7:45', '8:00', '8:15', '8:30', '8:45', '9:00', '9:15', '9:30', '9:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30'
                    // ],
                    nameTextStyle: {
                        fontWeight: 'bold',
                        color: '#fff'
                    },
                    axisLabel: {
                        show: false,
                        // interval: 9,
                        fontWeight: 'bold',
                        color: '#fff'
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
                            fontWeight: 'bold',
                            color: '#fff'
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
        // 关闭模型参数选择界面
        closeDialog() {
            this.visiableParams1 = false
            this.visiableParams2 = false
        },
        computerTopology(data) {
            this.selectData = {};
            this.selectData = getSelectDatas(data, '拓扑结构');
            this.levelData = this.selectData.levelData;
            console.log(this.selectData);

            this.levelData = ['拓扑'];
        },
        // 处理下拉框接口数据
        getSelectData(data) {
            this.begainData = data
            this.selectData = {};
            this.selectOldData = getSelectDatas(data, '天气数据');
            this.selectData = this.selectOldData
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
            switch (this.formInline.modelState) {
                case "故障预测模型(训练)":
                case "故障预测模型(预测)":
                case "故障预测模型(微调)":
                case "故障预测数学模型":
                    this.handleStateChange('天气数据')
                    break;
                case "台风模型线路故障概率":
                    this.handleStateChange('拓扑结构')
                    break;
                default:
                    break;
            }
        },
        handleStateChange(value) {
            this.formInline.state = value
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
                    this.formInline.cityId = begain[i].cityId
                    this.validWeatherRanges.start = begain[i].weather_start_date
                    this.validWeatherRanges.end = begain[i].weather_end_date
                    this.formInline.weatherTime = []
                    this.formInline.weatherTime = [begain[i].weather_start_date, begain[i].weather_end_date]
                    break; // 找到匹配项后跳出循环
                }
            }
        },
        // 获取模型数据参数
        computerData1(data) {
            this.formInline.model = data
        },
        // 模型选择
        selectModel(data) {
            // 获取下拉框数据
            this.getSelect();
            this.isShow = false
            this.isShowTQ = false
            this.isWeather = false
            this.visiableParams1 = false
            this.onCancel()
            if (data === 1) {
                setTimeout(() => {
                    this.visiableParams1 = !this.visiableParams1
                    this.agData = {
                        windowSize: 5,
                        inputSize: 6,
                        hiddenSize: 256,
                        layerNum: 2,
                        batchSize: 32,
                        lr: 0.0001,
                        // gt_column: ['WD', 'SD', 'YL', 'FX', 'FS', 'FX_MAX', 'FS_MAX', 'PRESSURE', 'GROUP_ID', 'PROBABILITY', 'CLASS_TYPE'],
                        // group_col: ['WD', 'SD', 'YL', 'FX', 'FS', 'FX_MAX', 'FS_MAX', 'PRESSURE', 'GROUP_ID', 'PROBABILITY', 'CLASS_TYPE'],
                    }
                }, 200);
                this.selectData = this.selectOldData
                this.levelData = this.selectData.levelData;
                this.formInline.modelState = '故障预测模型(训练)'
            } else if (data === 2) {
                this.isShow = true
                this.selectData = this.selectOldData
                this.levelData = this.selectData.levelData;
                this.formInline.modelState = '故障预测模型(微调)'
            } else if (data === 3) {
                this.isShow = true
                this.selectData = this.selectOldData
                this.levelData = this.selectData.levelData;
                this.formInline.modelState = '故障预测模型(预测)'
            } else if (data === 4) {
                this.isShow = true
                this.isWeather = true
                this.computerTopology(this.begainData)
                this.formInline.modelState = '台风模型线路故障概率'
            } else if (data === 5) {
                this.isShow = true
                this.selectData = this.selectOldData
                this.levelData = this.selectData.levelData;
                this.formInline.modelState = '故障预测数学模型'
            }
        },
        // 获取下拉框数据
        getSelect() {
            let arrSelect = []
            arrSelect = this.$store.state.select.selectOptions
            this.getSelectData(arrSelect.selectOptions)
        },
        // 获取算法计算初始数据
        postBegain(data, flag) {
            util.post('/get/ac/data', data)
                .then(response => {
                    // 处理POST请求的响应
                    if (response && response.code === 200) {
                        // 请求成功的处理逻辑
                        console.log('请求成功');
                        switch (flag) {
                            case 1:
                                this.isShowCharts = false
                                this.loading22 = true
                                setTimeout(() => {
                                    this.computerChartS(response.rows, flag)
                                }, 10)
                                break;
                            case 2:
                                this.isShowCharts = true
                                this.loading11 = true
                                setTimeout(() => {
                                    this.computerChartS(response.rows, flag)
                                }, 10)
                                // this.$bus.$emit('PINGURIGHT1DATA', response.rows[1])
                                break;
                            case 3:
                                this.isShowCharts = false
                                this.loading22 = true
                                setTimeout(() => {
                                    sessionStorage.setItem("FXGZGLDATA", encryptData({ data: response.rows }, process.env.VUE_APP_CRYPTO_KEY));
                                    this.$bus.$emit('PINGULEEFT1DATA1', response.rows)
                                }, 10)
                                break;
                            case 4:
                                this.isShowCharts = true
                                this.loading11 = true
                                setTimeout(() => {
                                    this.$bus.$emit('PINGURIGHT2DATA', response.rows[0])
                                }, 10)
                                break;
                            default:
                                break;
                        }
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
        computerChartS(data, flag) {
            if (flag === 1) {
                this.leftData.forEach((items, index) => {
                    this.chartLeft[index].time = []
                    items.forEach((item) => {
                        item.data = []
                    })
                })
                let arr1 = []
                let arr2 = []
                if (data[4].data.length >= 800) {
                    arr1 = data[4].data.slice(0, 800)
                    arr2 = data[4].data.slice(0, 100)
                } else if (data[4].data.length >= 100) {
                    arr1 = data[4].data
                    arr2 = data[4].data.slice(0, 100)
                } else {
                    arr1 = data[4].data
                    arr2 = data[4].data
                }
                this.tableData.push({
                    name: 'ARG模型(训练)',
                    AdjustedR2: data[0].data,
                    R2: data[1].data,
                    MSE: data[2].data,
                    MAPE: data[3].data,
                },)
                this.loading = false
                arr1.forEach((item) => {
                    if (item[0]) { this.leftData[0][0].data.push(item[0]) }
                    if (item[1]) { this.leftData[0][1].data.push(item[1]) }
                    if (item[2]) { this.leftData[0][2].data.push(item[2]) }
                    if (item[3]) { this.chartLeft[0].time.push(item[3]) }
                })
                arr2.forEach((item) => {
                    if (item[0]) { this.leftData[1][0].data.push(item[0]) }
                    if (item[1]) { this.leftData[1][1].data.push(item[1]) }
                    // if (item[2]) { this.leftData[1][2].data.push(item[2]) }
                    if (item[3]) { this.chartLeft[1].time.push(item[3]) }
                })
                this.loading11 = false;
                this.$nextTick(() => {
                    this.updateChart(this.chartLeft, this.leftData)
                })
            } else if (flag === 2) {
                this.rightData.forEach((items, index) => {
                    this.chartRight[index].time = []
                    items.forEach((item) => {
                        item.data = []
                    })
                })
                let arr1 = []
                let arr2 = []
                if (data[0].data.length >= 800) {
                    arr1 = data[0].data.slice(0, 800)
                    arr2 = data[0].data.slice(0, 100)
                } else if (data[0].data.length >= 100) {
                    arr1 = data[0].data
                    arr2 = data[0].data.slice(0, 100)
                } else {
                    arr1 = data[0].data
                    arr2 = data[0].data
                }
                arr1.forEach((item) => {
                    if (item[0]) { this.rightData[0][0].data.push(item[0]) }
                    if (item[1]) { this.rightData[0][1].data.push(item[1]) }
                    if (item[2]) { this.rightData[0][2].data.push(item[2]) }
                    if (item[3]) { this.chartRight[0].time.push(item[3]) }
                })
                arr2.forEach((item) => {
                    if (item[0]) { this.rightData[1][0].data.push(item[0]) }
                    if (item[1]) { this.rightData[1][1].data.push(item[1]) }
                    // if (item[2]) { this.rightData[1][2].data.push(item[2]) }
                    if (item[3]) { this.chartRight[1].time.push(item[3]) }
                })
                this.loading22 = false;
                this.$nextTick(() => {
                    this.updateChart(this.chartRight, this.rightData)
                })
            }
        },
        // ARG模型算法执行
        postARG() {
            util.post('/system/measurement/windMeasurementAlgorithm', this.formInline)
                .then(response => {
                    // 处理POST请求的响应
                    if (response && response.code === 200) {
                        // 请求成功的处理逻辑
                        console.log('请求成功');
                        this.$message.success('已提交，算法正在运行')
                        // 发送任务队列请求
                        this.$bus.$emit('queueData', response.code)
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
        onSubmit() {
            if ((this.formInline.level != '' &&
                this.formInline.region != '' &&
                // this.formInline.iP != '' &&
                this.formInline.state != '' &&
                this.formInline.model != '') || (this.formInline.modelState === '故障预测模型(训练)' && this.formInline.level != '')) {
                this.formInline.group_col = ["GROUP_ID"]
                this.formInline.gt_column = ["PROBABILITY"]
                this.formInline.selectedExtraData = ["WD", "SD", 'YL', 'FX', 'FS', 'FS_MAX']
                if (this.formInline.modelState === '故障预测模型(训练)') {
                    this.formInline = {
                        level: this.formInline.level,
                        modelState: this.formInline.modelState,
                        selectedExtraData: this.formInline.selectedExtraData,
                        state: this.formInline.state,
                        model: this.formInline.model,
                        gt_column: this.formInline.gt_column,
                        group_col: this.formInline.group_col,
                    }
                } else if (this.formInline.modelState === '故障预测模型(预测)') {
                    this.formInline = {
                        iP: this.formInline.iP,
                        id: this.formInline.id,
                        level: this.formInline.level,
                        province: this.formInline.province,
                        cityId: this.formInline.town,
                        town: this.formInline.region,
                        region: this.formInline.region,
                        modelState: this.formInline.modelState,
                        selectedExtraData: this.formInline.selectedExtraData,
                        state: this.formInline.state,
                        gt_column: this.formInline.gt_column,
                        group_col: this.formInline.group_col,
                    }
                } else if (this.formInline.modelState === "故障预测数学模型") {
                    this.formInline = {
                        iP: this.formInline.iP,
                        id: this.formInline.id,
                        level: this.formInline.level,
                        province: this.formInline.province,
                        cityId: this.formInline.town,
                        town: this.formInline.region,
                        modelState: this.formInline.modelState,
                        region: this.formInline.region,
                        state: this.formInline.state,
                    }
                } else if (this.formInline.modelState === '台风模型线路故障概率') {
                    this.formInline = {
                        iP: this.formInline.iP,
                        id: this.formInline.id,
                        level: this.formInline.level,
                        province: this.formInline.province,
                        cityId: this.formInline.cityId,
                        town: this.formInline.town,
                        modelState: this.formInline.modelState,
                        region: this.formInline.region,
                        state: this.formInline.state,
                        weatherTime: this.formInline.weatherTime,
                    }
                }
                // console.log(this.formInline);
                this.$message.success('已提交，算法正在运行')
                this.postARG();
            } else {
                this.$message.warning('传入的参数不能为空')
            }
        },
        onCancel() {
            this.formInline = {
                level: '',
                province: '',
                town: '',
                region: '',
                iP: '',
                weatherTime: '',
                id: '',
                state: '',
                gt_column: '',
                group_col: '',
                modelState: '',
                selectedExtraData: '',
            }
            this.visiableParams1 = false
            this.isShowTQ = false
        },
        begainCompute() {
            let getBegainData = {
                modelState: "故障预测模型(训练)",
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
                modelState: "极端天气灾害下的配电网停电风险智能预警",
            }
            util.post('/get/ac/newest/data', getBegainData)
                .then(response => {
                    if (response && response.code === 200) {
                        console.log('请求成功');
                        this.$bus.$emit('PINGULEEFT1DATA', response.rows)
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
        // 接收任务进程的算法计算
        this.$bus.$on('runQueueDataARG', (allDatas) => {
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
                //height: 50%;
            }

            .pup {
                height: 33%;
                // border: 1px solid #ffa;
                position: relative;
                z-index: 1000;
                top: 18%;

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
}
</style>
