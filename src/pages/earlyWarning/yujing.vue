<template>
    <div class="contain">
        <div class="title">
            <!-- 极端天气识别预警 -->
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
                                        <el-select v-model="formInline.modelState" placeholder="算法类别">
                                            <!-- <el-option label="风速预测模型(预测)" value="风速预测模型(预测)"
                                    @click.native="selectModel(1)"></el-option> -->
                                            <!-- <el-option label="风速预测模型(训练)" value="风速预测模型(训练)"
                                    @click.native="selectModel(2)"></el-option> -->
                                            <el-option label="极端天气灾害下的配电网停电风险智能预警" value="极端天气灾害下的配电网停电风险智能预警"
                                                @click.native="selectModel(3)"></el-option>
                                            <el-option label="天气预测模型(预测)" value="天气预测模型(预测)"
                                                @click.native="selectModel(4)"></el-option>
                                            <el-option label="天气预测模型(训练)" value="天气预测模型(训练)"
                                                @click.native="selectModel(5)"></el-option>
                                            <el-option label="覆冰预测模型(预测)" value="覆冰预测模型(预测)"
                                                @click.native="selectModel(7)"></el-option>
                                            <el-option label="覆冰预测模型(训练)" value="覆冰预测模型(训练)"
                                                @click.native="selectModel(6)"></el-option>
                                            <el-option label="新能源预测模型(训练)" value="新能源预测模型(训练)"
                                                @click.native="selectModel(8)"></el-option>
                                            <el-option label="雷击环境下故障概率" value="雷击环境下故障概率"
                                                @click.native="selectModel(9)"></el-option>
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
                                    <el-form-item v-if="isShowLevel">
                                        <el-select v-model="formInline.level" placeholder="行政等级"
                                            @change="handleLevelChange">
                                            <el-option v-for="item in levelData" :key="item" :label="item"
                                                :value="item"></el-option>
                                        </el-select>
                                    </el-form-item>
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
                                    <el-form-item v-if="isShow && !isShowBar">
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
                                    <el-form-item v-if="!isShowBar && isShowFB">
                                        <el-select v-model="formInline.predictionClass" placeholder="预测类别">
                                            <el-option label="风速预测" value="FS"></el-option>
                                            <el-option label="温度预测" value="WD"></el-option>
                                            <el-option label="雨量预测" value="YL"></el-option>
                                            <el-option label="湿度预测" value="SD"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item v-if="isShowBar">
                                        <el-select v-model="formInline.region" placeholder="拓扑结构"
                                            @change="handleTopologyChange">
                                            <el-option v-for="(item) in regionData" :key="item" :label="item"
                                                :value="item" @click.native="changeTopology(item)"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <!-- <el-form-item v-if="isShowBar">
                                        <el-date-picker v-model="formInline.time" type="datetimerange"
                                            range-separator="至" start-placeholder="开始" end-placeholder="结束"
                                            align="right" value-format="yyyy-MM-dd HH:mm:ss"
                                            :picker-options="pickerOptionsTime">
                                        </el-date-picker>
                                    </el-form-item> -->
                                    <el-form-item v-if="isWeather && isShowFB">
                                        <el-select v-model="formInline.BranchRiskProbabilityType" placeholder="故障概率数据"
                                            @change="handleweatherTypeDataChange">
                                            <el-option v-for="(item) in weatherTypeData" :key="item" :label="item"
                                                :value="item"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item v-if="isWeather">
                                        <el-date-picker v-model="formInline.weatherTime" type="datetimerange"
                                            range-separator="至" start-placeholder="开始" end-placeholder="结束"
                                            align="right" value-format="yyyy-MM-dd HH:mm:ss"
                                            :picker-options="pickerWeatherOptions">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item v-if="isShow && !isShowBar && isShowFB">
                                        <el-date-picker v-model="formInline.time" type="datetime" placeholder="选择日期时间"
                                            align="right" value-format="yyyy-MM-dd HH:mm:ss"
                                            :picker-options="pickerOptions">
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
                    <tuopu :topologyId="'topologyChartyj3'" />
                    <!-- <tuopu v-if="isShowTopology" :topologyId="'topologyChartyj3'" /> -->
                    <!-- <tuopuZD v-if="!isShowTopology" :topologyId="'tuopuZD112'" :isShowTuoPu="false" /> -->
                </div>
            </div>
            <div class="body_right">
                <div v-if="isShowCharts" style="height: 100%;">
                    <div v-for="(item, index) in chartLeft" :key="index + item.title" style="height: 50%;">
                        <div class="st_titles">
                            {{ item.title }}
                        </div>
                        <div class="chart-container" v-loading="loading" element-loading-text="任务未执行"
                            element-loading-spinner="el-icon-loading" element-loading-background="rgba(2,42,114,0.9)">
                            <div :id=item.id style="width:100%;height: 100%;"></div>
                        </div>
                    </div>
                    <yujingLeft2 />
                </div>
                <div v-if="!isShowCharts" style="height: 100%;">
                    <div class="mapButtonSelect">
                        <el-select v-model="timeDate" placeholder="时间">
                            <el-option v-for="(item) in allDataTime" :key="item[0]" :label="item[0]" :value="item[0]"
                                @click.native="computerChartBar(item)"></el-option>
                        </el-select>
                    </div>
                    <div v-for="(item, index) in chartRight" :key="index + item.title" style="height: 50%;">
                        <div class="st_titles">
                            {{ item.title }}
                        </div>
                        <div class="chart-container" v-loading="item.loading" element-loading-text="任务未执行"
                            element-loading-spinner="el-icon-loading" element-loading-background="rgba(2,42,114,0.9)">
                            <div :id=item.id style="width:100%;height: 100%;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <fubingModel :visiableParams3="visiableParams3" :fubingData="fubingData" @FUBINGDATA="computerData2">
        </fubingModel>
        <yuCe :visiableParams2="visiableParams2" @YUCEDATA="computerData2"></yuCe>
        <jiduantianqi :visiableParams1="visiableParams1" :jiduanData="jiduanData" @JIDUANTIANQIDATA="computerData2">
        </jiduantianqi>
        <jiduantianqi2 :visiableParams4="visiableParams4" :jiduanData4="jiduanData4" @JIDUANTIANQIDATA4="computerData2">
        </jiduantianqi2>
    </div>
</template>

<script>
import * as echarts from 'echarts'
import util from '@/api/generalFormat'
import tuopu from '@/pages/earlyWarning/components/tuopu.vue'
// import tuopuZD from '@/pages/earlyWarning/components/tuopuZD.vue'
import mangeData from '@/components/mangeData'
import yuCe from '@/pages/earlyWarning/components/yuce.vue'
import jiduantianqi from '@/pages/earlyWarning/components/jiduantianqi.vue'
import jiduantianqi2 from '@/pages/earlyWarning/components/jiduantianqi2.vue'
import fubingModel from '@/pages/earlyWarning/components/fubingModel.vue'
import yujingLeft2 from "@/pages/earlyWarning/components/yujingLeft2.vue";
import { getSelectDatas } from '@/utils/getSelectData'
import { encryptData, decryptData } from '@/utils/cryptoUtils';
export default {
    components: {
        yuCe,
        jiduantianqi,
        jiduantianqi2,
        fubingModel,
        tuopu,
        mangeData,
        yujingLeft2,
        // tuopuZD
    },
    data() {
        return {
            tableKey: 0,
            isShowCharts: true,
            isShowLevel: true,
            loading: true,
            visiableParams1: false,
            visiableParams2: false,
            visiableParams3: false,
            visiableParams4: false,
            isShowTopology: true,
            isShow: true,
            isShowBar: false,
            isShowFB: true,
            isWeather: false,
            titleName: '极端天气&风速预测模型(预测)',
            levelName: "",
            provinceName: '',
            townName: '',
            regionName: '',
            jiduanData: {},
            jiduanData4: {},
            fubingData: {},
            timeDate: [],
            allDataTime: [],
            // 左侧
            chartLeft: [
                {
                    id: 'leftdeep1',
                    title: '温度数据',
                    seriesType: 'line',
                    yAxisName: '℃'
                },
                {
                    id: 'leftdeep2',
                    title: '湿度数据',
                    seriesType: 'line',
                    yAxisName: 'g/m³'
                },
                {
                    id: 'rightdeep1',
                    title: '风速数据',
                    seriesType: 'line',
                    yAxisName: 'm/s'
                },
                {
                    id: 'rightdeep2',
                    title: '雨量数据',
                    seriesType: 'line',
                    yAxisName: 'mm/㎡'
                }
            ],
            leftData: [
                // 左一
                [
                    {
                        name: '温度',
                        data: []
                    },
                    {
                        name: '温度预测',
                        data: []
                    },
                ],
                // 左二
                [
                    {
                        name: '湿度',
                        data: []
                    },
                    {
                        name: '湿度预测',
                        data: []
                    },
                ],
                // 右一
                [
                    {
                        name: '风速',
                        data: []
                    },
                    {
                        name: '风速预测',
                        data: []
                    },
                ],
                // 右二
                [
                    {
                        name: '雨量',
                        data: []
                    },
                    {
                        name: '雨量预测',
                        data: []
                    },
                ],
            ],
            colorLine: [
                ['#14c8d4', '#faa', '#5EC2F2', '#FF4528', '#fff', '#dac', '#faa'],
                ['#14c8d4', '#faa', '#5EC2F2', '#FF4528', '#fff', '#dac', '#faa'],
                ['#14c8d4', '#faa', '#5EC2F2', '#FF4528', '#fff', '#dac', '#faa'],
                ['#14c8d4', '#faa', '#5EC2F2', '#FF4528', '#fff', '#dac', '#faa'],
                ['#FFC22E', '#FF4528', '#FF4528', '#fff', '#dac', '#faa', '#FFC22E'],
                ['#dac', '#43eec6', '#fff', '#dac', '#faa', '#FFC22E', '#bfc'],
                ['#ccffaa', '#FFC22E', '#fff', '#faa', '#FFC22E', '#bfc', '#5EC2F2'],
            ],
            // 右侧
            chartRight: [
                {
                    id: 'leftdeep0',
                    title: '各节点的期望停电时长指标',
                    seriesType: 'bar',
                    yAxisName: '停电时长/h',
                    loading: true
                },
                {
                    id: 'leftdeep01',
                    title: '覆冰厚度-故障概率',
                    seriesType: 'bar',
                    yAxisName: '故障概率/%',
                    loading: true
                },
            ],
            rightData: [
                // 左三
                [
                    {
                        name: '停电时长',
                        data: []
                    },
                ],
                // 左四
                [
                    {
                        name: '覆冰厚度-故障概率',
                        data: []
                    },
                ],
            ],
            formInline: {
                level: '',
                province: '',
                region: '',
                town: '',
                iP: '',
                id: '',
                state: '',
                modelState: '',
                predictionClass: '',
                time: '',
                BranchRiskProbabilityType: '',
                weatherTime: ''
            },
            validRange: {
                start: '', // 有效开始时间
                end: ''    // 有效结束时间
            },
            allTimes: [],
            allTimesFB: [],
            begainData: [],//接受数据
            selectData: [],//总体数据
            selectOldData: [],//总体数据
            selectAllData: [],//总体数据
            levelData: [],// 行政等级
            provinceData: [],
            townData: [],
            regionData: [],// 区域
            stateData: [],// 数据类型
            weatherTypeData: [],
            topologyAllData: [],
            topologyDataTime: [],
            nodeAll: [],
            validRanges: {
                start: '', // 有效开始时间
                end: ''    // 有效结束时间
            },
            validWeatherRanges: {
                start: '', // 有效开始时间
                end: ''    // 有效结束时间
            },
            topologyInfo: [],
            // 表格数据
            tableData: [],
            chartInstances: [] // 存储图表实例
        };
    },
    computed: {
        pickerOptions() {
            return {
                disabledDate: (time) => {
                    const start = this.parseDate(this.validRange.start).getTime() - 86400000;
                    const end = this.parseDate(this.validRange.end).getTime() + 86400000;
                    return time.getTime() < start || time.getTime() > end;
                }
            };
        },
        pickerWeatherOptions() {
            return {
                disabledDate: (time) => {
                    const start = this.parseDate(this.validWeatherRanges.start).getTime() - 86400000;
                    const end = this.parseDate(this.validWeatherRanges.end).getTime() + 86400000;
                    return time.getTime() < start || time.getTime() > end;
                }
            };
        },
        pickerOptionsTime() {
            return {
                disabledDate: (time) => {
                    const start = this.parseDate(this.validRanges.start).getTime() - 86400000;
                    const end = this.parseDate(this.validRanges.end).getTime() + 86400000;
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
                var option1 = this.getOption(charData[i], char[i].seriesType, char[i].yAxisName, this.colorLine[i],);
                chartInstance.setOption(option1);
                window.addEventListener('resize', () => {
                    chartInstance.resize();
                });
                this.chartInstances.push(chartInstance);
            }
        },
        getOption(data, seriesType, yAxisName, colorLine) {
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
                    // showDelay: 0,
                    // formatter: function (params) {
                    //     //             let str = `
                    //     //   <div style="background:#FFF;display: flex;justify-content: space-between; gap:10px">
                    //     //     <div>
                    //     //       <p>X：</p>
                    //     //       <p>Y：</p>
                    //     //     </div>
                    //     //     <div style="text-align: right">
                    //     //       <p>${params.value[0]}</p>
                    //     //       <p>${params.value[1]}</p>
                    //     //     </div>
                    //     //   </div>`;
                    //     //             return str;
                    // },
                },
                xAxis: {
                    name: yAxisName === '停电时长/h' ? '节点' : yAxisName === '故障概率/%' ? '节点' : 't/h',
                    nameTextStyle: {
                        color: '#fff',
                    },
                    // data: Array.from({ length: data[0].data.length + 1 }, (_, i) => i),  
                    data: yAxisName === '停电时长/h' ? this.nodeAll : yAxisName === '故障概率/%' ? this.allTimesFB : this.allTimes,
                    // data: [
                    //     '6:00', '6:15', '6:30', '6:45', '7:00', '7:15', '7:30', '7:45', '8:00', '8:15', '8:30', '8:45', '9:00', '9:15', '9:30', '9:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30'
                    // ],
                    axisLabel: {
                        show: yAxisName === '停电时长/h' ? true : yAxisName === '故障概率/%' ? true : true,
                        // interval: 159,
                        fontWeight: 'bold',
                        color: '#fff',
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#fff',
                            width: 1,//这里是为了突出显示加上的
                        }
                    },
                },
                yAxis: [
                    {
                        name: yAxisName,
                        nameTextStyle: {
                            fontWeight: 'bold',
                            color: '#fff',
                        },
                        type: 'value',
                        axisLabel: {
                            show: true,
                            color: '#fff',
                            fontWeight: 'bold'
                        },
                        axisPointer: {
                            snap: true,
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#fff',
                                width: 1,//这里是为了突出显示加上的
                            }
                        },
                    },
                ],
                series: data.map((item, index) => ({
                    name: item.name,
                    type: seriesType,
                    data: item.data,
                    showSymbol: true,//是否默认展示圆点
                    symbol: 'circle',     //设定为实心点
                    symbolSize: 0,
                    smooth: true,
                    emphasis: {
                        focus: 'series'
                    },
                    itemStyle: {
                        color: colorLine[index], // 设置单独的颜色
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
            this.visiableParams2 = false
        },
        computerData2(data) {
            this.formInline.model = data
        },
        changeTopology(dataName) {
            if (dataName === '课题一') {
                this.isShowTopology = true
            } else {
                this.isShowTopology = false
                this.$nextTick(() => {
                    this.$bus.$emit('ZDTUOPUDatas', dataName)
                })
            }
        },
        selectModel(data) {
            // 获取下拉框数据
            this.getSelect();
            this.visiableParams2 = false
            this.isShowFB = true
            this.onCancel()
            if (data === 1) {
                this.isShow = true
                this.isShowBar = false
                this.isWeather = false
                this.isShowLevel = true
                this.selectData = this.selectOldData
                this.levelData = this.selectData.levelData;
                this.formInline.modelState = '风速预测模型(预测)'
            } else if (data === 2) {
                this.isShow = false
                this.isShowBar = false
                this.isWeather = false
                this.isShowLevel = true
                this.selectData = this.selectOldData
                this.levelData = this.selectData.levelData;
                this.visiableParams2 = !this.visiableParams2
                this.formInline.modelState = '风速预测模型(训练)'
            } else if (data === 3) {
                this.isShowBar = true
                this.isShow = true
                this.isWeather = true
                this.isShowLevel = false
                setTimeout(() => {
                    this.visiableParams1 = !this.visiableParams1
                    this.jiduanData = {
                        n_ori: 1000,
                        tstep: 30,
                        n_cut: 20
                    }
                }, 200);
                this.formInline.modelState = '极端天气灾害下的配电网停电风险智能预警'
                this.computerTopology(this.begainData)
            } else if (data === 9) {
                this.isShowBar = true
                this.isShow = true
                this.isWeather = true
                this.isShowLevel = false
                setTimeout(() => {
                    this.visiableParams4 = !this.visiableParams4
                    this.jiduanData4 = {
                        Imin: 5,
                        Imax: 20,
                        N0: 40,
                        T0: 1,
                        T1: 1,
                        bg: 10,
                        hg: 15,
                        Kh: 4,
                        Lline: 5,
                        S: 9,
                        gt: 0.2,
                        Palpha: 0.2,
                        I_0: 10,
                        I_1: 15,
                        eta: 0.8,
                        a: 0.9,
                        b: 0.05
                    }
                }, 200);
                this.formInline.modelState = '雷击环境下故障概率'
                this.computerTopology(this.begainData)
            } else if (data === 4) {
                this.isShow = true
                this.isShowBar = false
                this.isWeather = false
                this.isShowLevel = true
                this.selectData = this.selectOldData
                this.levelData = this.selectData.levelData;
                this.formInline.modelState = '天气预测模型(预测)'
            } else if (data === 5) {
                this.isShow = false
                this.isShowBar = false
                this.isWeather = false
                this.isShowLevel = true
                this.selectData = this.selectOldData
                this.levelData = this.selectData.levelData;
                this.visiableParams2 = !this.visiableParams2
                this.formInline.modelState = '天气预测模型(训练)'
            } else if (data === 6) {
                this.isShow = false
                this.isShowBar = false
                this.isWeather = false
                this.isShowLevel = true
                this.isShowFB = false
                this.selectData = this.selectOldData
                this.levelData = this.selectData.levelData;
                setTimeout(() => {
                    this.visiableParams3 = !this.visiableParams3
                    this.fubingData = {
                        embed_dim: 64,
                        num_heads: 2,
                        ff_dim: 32,
                        train_ratio: 0.8,
                        lr: 0.001,
                        epochs: 2000
                    }
                }, 200);
                this.formInline.modelState = '覆冰预测模型(训练)'
            } else if (data === 7) {
                this.isShow = true
                this.isShowBar = false
                this.isWeather = true
                this.isShowLevel = false
                this.isShowFB = false
                this.formInline.modelState = '覆冰预测模型(预测)'
                this.computerTopology(this.begainData)
            } else if (data === 8) {
                this.isShow = false
                this.isShowBar = false
                this.isWeather = false
                this.isShowLevel = true
                this.isShowFB = false
                this.selectData = this.selectOldData
                this.levelData = this.selectData.levelData;
                this.visiableParams2 = !this.visiableParams2
                this.formInline.modelState = '新能源预测模型(训练)'
            }
        },
        computerTopology(data) {
            this.selectData = {};
            this.selectData = getSelectDatas(data, '拓扑结构');
            this.levelData = ['拓扑'];
            this.formInline.level = '拓扑'
            this.handleLevelChange('拓扑')
        },
        // 处理下拉框接口数据
        getSelectData(data) {
            this.begainData = data
            this.selectData = {};
            console.log(data);
            data.forEach(item => {
                if (item.parentType === '支路风险概率') {
                    if (!this.weatherTypeData.includes(item.dataType)) {
                        this.weatherTypeData.push(item.dataType);
                    }
                }
            })
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
            if (this.formInline.modelState === '极端天气灾害下的配电网停电风险智能预警' ||
                this.formInline.modelState === '覆冰预测模型(预测)' ||
                this.formInline.modelState === '雷击环境下故障概率') {
                this.handleStateChange('拓扑结构')
            }
            else { this.handleStateChange('天气数据') }
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
            this.formInline.time = []; // 确保 time 是一个空数组
        },
        handleProvinceChange(value) {
            this.townName = this.provinceName + '-' + value;
            this.townData = this.selectData.townData[this.townName] || [];
            this.formInline.town = '';
            this.formInline.iP = '';
            this.regionData = [];
            this.formInline.region = '';
            this.formInline.time = []; // 确保 time 是一个空数组
        },
        handleTownChange(value) {
            this.regionName = this.townName + '-' + value;
            this.regionData = this.selectData.regionData[this.regionName] || [];
            // if (this.formInline.modelState === '极端天气灾害下的配电网停电风险智能预警') {
            //     this.regionData = ['课题一']
            // }
            this.formInline.region = '';
            this.formInline.iP = '';
            this.formInline.time = []; // 确保 time 是一个空数组
        },
        handleRegionChange() {
            let begain = this.begainData;
            for (let i = 0; i < begain.length; i++) {
                if ((this.formInline.level === begain[i].acType) &&
                    (this.formInline.region === begain[i].name) &&
                    (this.formInline.province === begain[i].province) &&
                    (this.formInline.town === begain[i].town) &&
                    (this.formInline.state === begain[i].dataType)) {
                    this.formInline.time = ''; // 确保 time 是一个空数组
                    // let timestamp = new Date(begain[i].endDate).getTime() + 86400000 * 2
                    // const date = new Date(timestamp); // 根据时间戳创建Date对象
                    // const year = date.getFullYear(); // 获取年份
                    // const month = date.getMonth() + 1; // 获取月份，需要加1
                    // const day = date.getDate(); // 获取日期
                    // const hour = date.getHours(); // 获取小时
                    // const minute = date.getMinutes(); // 获取分钟
                    // const second = date.getSeconds(); // 获取秒数
                    // const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`; // 拼接成格式化后的日期字符串
                    // console.log(formattedDate);

                    this.formInline.time = begain[i].endDate;
                    // 开始时间
                    this.validRange.start = begain[i].endDate;
                    // 结束时间
                    this.validRange.end = '2099-12-30 23:59:59';
                    // 更新id
                    this.formInline.id = begain[i].basicDataId;
                    this.formInline.iP = begain[i].ip;
                    if (this.formInline.modelState === '覆冰预测模型(预测)') {
                        this.formInline.cityId = begain[i].cityId
                        this.validWeatherRanges.start = begain[i].weather_start_date
                        this.validWeatherRanges.end = begain[i].weather_end_date
                        this.formInline.weatherTime = []
                        this.formInline.weatherTime = [begain[i].weather_start_date, begain[i].weather_end_date]
                    }
                    // console.log(this.validWeatherRanges, 'this.formInline');
                    // console.log(this.formInline.weatherTime, 'this.formInline');
                    // console.log(this.formInline, 'this.formInline');
                    // console.log(this.autoModelData, 'this.autoModelData');
                    break; // 找到匹配项后跳出循环
                }
            }
        },
        handleTopologyChange(region) {
            this.formInline.time = [];
            this.begainData.forEach((item) => {
                if (item.name === region && this.formInline.level === item.acType && this.formInline.province === item.province && this.formInline.town === item.town) {
                    this.formInline.id = item.basicDataId;
                    this.formInline.iP = item.ip;
                    this.formInline.cityId = item.cityId;
                    if (item.startDate) {
                        this.validRanges.start = item.startDate
                        this.validRanges.end = item.endDate
                        this.formInline.time = []
                        this.formInline.time = [item.startDate, item.endDate]
                    } else {
                        this.validRanges.start = "1970-01-01 00:00:00"
                        this.validRanges.end = "2099-12-31 23:59:59"
                        this.formInline.time = []
                        this.formInline.time = ["1970-01-01 00:00:00", "2099-12-31 23:59:59"]
                    }
                }
            })
        },
        handleweatherTypeDataChange(dataType) {
            console.log(dataType);
            this.begainData.forEach((item) => {
                if (item.name === this.formInline.region &&
                    this.formInline.level === item.acType &&
                    this.formInline.province === item.province &&
                    this.formInline.town === item.town &&
                    dataType === item.dataType) {
                    if (item.startDate) {
                        this.validWeatherRanges.start = item.startDate
                        this.validWeatherRanges.end = item.endDate
                        this.formInline.weatherTime = []
                        this.formInline.weatherTime = [item.startDate, item.endDate]
                    } else {
                        this.validWeatherRanges.start = "1970-01-01 00:00:00"
                        this.validWeatherRanges.end = "2099-12-31 23:59:59"
                        this.formInline.weatherTime = []
                        this.formInline.weatherTime = ["1970-01-01 00:00:00", "2099-12-31 23:59:59"]
                    }
                }
            })
        },
        // 设置自动滚动
        autoScroll(stop) {
            let table = this.$refs.scrollTable
            // 拿到表格中承载数据的div元素
            let divData = table.$refs.bodyWrapper
            // 拿到元素后，对元素进行定时增加距离顶部距离，实现滚动效果(此配置为每100毫秒移动1像素)
            if (stop) {
                //再通过事件监听，监听到 组件销毁 后，再执行关闭计时器。
                window.clearInterval(this.scrolltimer)
            } else {
                this.scrolltimer = window.setInterval(() => {
                    // 元素自增距离顶部1像素
                    divData.scrollTop += 1
                    // 判断元素是否滚动到底部(可视高度+距离顶部=整个高度)
                    if (divData.clientHeight + divData.scrollTop == divData.scrollHeight) {
                        // 重置table距离顶部距离
                        divData.scrollTop = 0
                        // 重置table距离顶部距离。值=(滚动到底部时，距离顶部的大小) - 整个高度/2
                        // divData.scrollTop = divData.scrollTop - divData.scrollHeight / 2
                    }
                }, 50) // 滚动速度
            }
        },
        // 风速预测模型算法执行
        postWind(formInline) {
            util.post('/system/measurement/windMeasurementAlgorithm', formInline)
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
        // 计算echarts数据
        computerChartS(data) {
            this.leftData.forEach((items, index) => {
                items.forEach((item) => {
                    if (index != 2) {
                        item.data = []
                    }
                })
            })
            this.allTimes = []
            data[0].data.forEach((item, index) => {
                let record = {
                    time: item[0],
                    WD: item[1],
                    WDYC: item[2]
                };
                this.leftData[0][0].data.push(item[1]);
                this.leftData[0][1].data.push(item[2]);
                this.allTimes.push(item[0])
                if (data[1].data[index]) {
                    record.SD = data[1].data[index][1];
                    this.leftData[1][0].data.push(data[1].data[index][1]);
                    record.SDYC = data[1].data[index][2];
                    this.leftData[1][1].data.push(data[1].data[index][2]);
                }

                if (data[2].data[index]) {
                    record.YL = data[2].data[index][1];
                    this.leftData[2][0].data.push(data[2].data[index][1]);
                    record.YLYC = data[2].data[index][2];
                    this.leftData[2][1].data.push(data[2].data[index][2]);
                }

                if (data[3].data[index]) {
                    record.FS = data[3].data[index][1];
                    this.leftData[3][0].data.push(data[3].data[index][1]);
                    record.FSYC = data[3].data[index][2];
                    this.leftData[3][1].data.push(data[3].data[index][2]);
                }

                this.tableData.push(record);
                this.tableKey++

            });

            // console.log(this.tableData, 'this.tableData');
            // console.log(this.leftData, 'this.leftData');
            // 取预测结果后20条数据
            let lens = this.tableData.length
            let encryptedData = encryptData({ data: this.rightData, time: this.allTimes, tableData: this.tableData.slice(lens - 21, lens - 1) }, process.env.VUE_APP_CRYPTO_KEY);
            sessionStorage.setItem("YLFSDATA", encryptedData);
            this.loading = false;
            this.$nextTick(() => {
                this.updateChart(this.chartLeft, this.leftData)
            })
        },
        computerChartBar(data) {
            this.rightData[0][0].data = []
            this.nodeAll = []
            this.timeDate = data[0]
            data[1].forEach((item) => {
                this.nodeAll.push(item[0])
                this.rightData[0][0].data.push(item[1])
            })
            this.chartRight[0].loading = false;
            this.$nextTick(() => {
                this.updateChart(this.chartRight, this.rightData)
            })
        },
        computerChartHD(data) {
            this.rightData[1][0].data = []
            this.allTimesFB = []
            data[1].forEach((item) => {
                this.allTimesFB.push(item[0])
                this.rightData[1][0].data.push(item[1]);
            });
            this.chartRight[1].loading = false;
            this.$nextTick(() => {
                this.updateChart(this.chartRight, this.rightData)
            })
        },
        // 确定提交
        onSubmit() {
            switch (this.formInline.predictionClass) {
                case "FS":
                    this.formInline.predictionClass = []
                    this.formInline.predictionClass = ["FS", "WD", "YL", "SD"]
                    break;
                case "WD":
                    this.formInline.predictionClass = []
                    this.formInline.predictionClass = ["WD", "FS", "YL", "SD"]
                    break;
                case "YL":
                    this.formInline.predictionClass = []
                    this.formInline.predictionClass = ["YL", "FS", "WD", "SD"]
                    break;
                case "SD":
                    this.formInline.predictionClass = []
                    this.formInline.predictionClass = ["SD", "FS", "WD", "YL"]
                    break;
            }
            if (this.formInline.modelState === '极端天气灾害下的配电网停电风险智能预警' ||
                this.formInline.modelState === '"雷击环境下故障概率') {
                if (
                    // this.formInline.time != '' &&
                    this.formInline.weatherTime != '' &&
                    this.formInline.region != ''
                ) {
                    let formInline = {}
                    formInline = {
                        level: this.formInline.level,
                        // time: this.formInline.time,
                        weatherTime: this.formInline.weatherTime,
                        region: this.formInline.region,
                        province: this.formInline.province,
                        town: this.formInline.town,
                        iP: this.formInline.iP,
                        BranchRiskProbabilityType: this.formInline.BranchRiskProbabilityType,
                        cityId: this.formInline.cityId,
                        modelState: this.formInline.modelState,
                        id: this.formInline.id,
                        model: this.formInline.model,
                        state: '拓扑结构',
                    }
                    // console.log(this.formInline);
                    this.postWind(formInline)
                } else {
                    this.$message.warning('传入的参数不能为空')
                }
            } else {
                if ((this.formInline.level != '' &&
                    this.formInline.province != '' &&
                    this.formInline.town != '' &&
                    this.formInline.region != '' &&
                    this.formInline.iP != '' &&
                    this.formInline.predictionClass != '' &&
                    this.formInline.state != '') || (this.formInline.level != '' && this.formInline.modelState === "天气预测模型(训练)" &&
                        this.formInline.predictionClass != '') || (this.formInline.level != '' && this.formInline.modelState === "覆冰预测模型(训练)") ||
                    (this.formInline.level != '' && this.formInline.modelState === "新能源预测模型(训练)")) {
                    let formInline = {}
                    if (this.formInline.modelState === "天气预测模型(训练)") {
                        formInline = {
                            level: this.formInline.level,
                            model: this.formInline.model,
                            modelState: this.formInline.modelState,
                            selectedExtraData: this.formInline.predictionClass,
                            state: "天气数据",
                        }
                    } else if (this.formInline.modelState === "覆冰预测模型(训练)") {
                        formInline = {
                            level: this.formInline.level,
                            model: this.formInline.model,
                            modelState: this.formInline.modelState,
                            state: "天气数据",
                        }
                    } else if (this.formInline.modelState === "新能源预测模型(训练)") {
                        formInline = {
                            level: this.formInline.level,
                            model: this.formInline.model,
                            modelState: this.formInline.modelState,
                            state: "天气数据",
                        }
                    } else {
                        formInline = {
                            level: this.formInline.level,
                            time: this.formInline.time,
                            predictionClass: this.formInline.predictionClass,
                            region: this.formInline.region,
                            province: this.formInline.province,
                            town: this.formInline.region,
                            iP: this.formInline.iP,
                            cityId: this.formInline.town,
                            modelState: this.formInline.modelState,
                            id: this.formInline.id,
                            state: "天气数据",
                        }
                    }
                    this.$message.success('已提交，算法正在运行')
                    // console.log(this.formInline);
                    this.postWind(formInline)
                } else if (this.formInline.level != '' &&
                    this.formInline.province != '' &&
                    this.formInline.town != '' &&
                    this.formInline.region != '' &&
                    this.formInline.iP != '' &&
                    this.formInline.weatherTime != '' &&
                    this.formInline.modelState === "覆冰预测模型(预测)" &&
                    this.formInline.state != '') {
                    let formInline = {}
                    formInline = {
                        level: this.formInline.level,
                        time: this.formInline.weatherTime,
                        region: this.formInline.region,
                        province: this.formInline.province,
                        town: this.formInline.town,
                        iP: this.formInline.iP,
                        cityId: this.formInline.cityId,
                        modelState: this.formInline.modelState,
                        id: this.formInline.id,
                        state: "拓扑结构",
                    }
                    this.$message.success('已提交，算法正在运行')
                    // console.log(this.formInline);
                    this.postWind(formInline)
                }
                else {
                    this.$message.warning('传入的参数不能为空')
                }
            }
        },
        // 重置
        onCancel() {
            this.formInline = {
                level: '',
                province: '',
                region: '',
                town: '',
                iP: '',
                id: '',
                state: '',
                modelState: '',
                predictionClass: '',
                BranchRiskProbabilityType: '',
                time: '',
                weatherTime: []
            }
            this.regionData = []
            this.stateData = []
            this.isShowBar = false
            this.isShow = true
        },
        // 获取算法计算初始数据
        postBegain(data) {
            util.post('/get/ac/data', data)
                .then(response => {
                    // 处理POST请求的响应
                    if (response && response.code === 200) {
                        // 请求成功的处理逻辑
                        console.log('请求成功');
                        if (data.data_type === '拓扑结构&极端天气灾害下的配电网停电风险智能预警') {
                            this.isShowCharts = false
                            setTimeout(() => {
                                this.allDataTime = response.rows[0].data
                                this.computerChartBar(response.rows[0].data[0])
                            }, 10)
                        } else if (data.data_type === '拓扑结构&雷击环境下故障概率') {
                            this.isShowCharts = false
                            setTimeout(() => {
                                this.allDataTime = response.rows[0].data
                                this.computerChartBar(response.rows[0].data[0])
                            }, 10)
                        } else if (data.data_type === "拓扑结构&覆冰预测模型(预测)") {
                            //时间 实际 预测
                            this.isShowCharts = false
                            setTimeout(() => {
                                this.computerChartHD(response.rows[0].data[0])
                            }, 10)
                        } else if (data.data_type === "天气数据&新能源预测模型(训练)") {
                            console.log(data, '天气数据&新能源预测模型(训练)');
                        } else {
                            this.isShowCharts = true
                            let encryptedData = encryptData({ data: response.rows }, process.env.VUE_APP_CRYPTO_KEY);
                            sessionStorage.setItem("YUJINGBEGINDATA", encryptedData);
                            this.$bus.$emit('YUJINGHUNXIAODATA', response.rows)
                            setTimeout(() => {
                                this.computerChartS(response.rows)
                            }, 10)
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
        computerData() {
            const encryptedData = sessionStorage.getItem('YUJINGBEGINDATA');
            if (encryptedData) {
                const decryptedData = decryptData(encryptedData, process.env.VUE_APP_CRYPTO_KEY);
                let allData = decryptedData.data;
                this.$nextTick(() => {
                    this.computerChartS(allData)
                })
            }
        },
        // 获取下拉框数据
        getSelect() {
            let arrSelect = []
            arrSelect = this.$store.state.select.selectOptions
            this.getSelectData(arrSelect.selectOptions)
        },
    },
    mounted() {
        this.$store.dispatch('fetchSelectOptions')
        // 接收任务进程的算法计算
        this.$bus.$on('runQueueDataWind', (data) => {
            let getWindData = []
            getWindData = {
                data_type: data.data_type,
                columns: data.columns,
                start_date: data.start_date,
                end_date: data.end_date,
                data_id: data.data_id,
                basic_data_id: data.basic_data_id,
                task_id: data.task_id,
            }
            this.titleName = data.data_type
            this.postBegain(getWindData);
        })
        this.computerData();
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
        this.computerData();
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

                /deep/::placeholder {
                    color: rgb(255, 255, 255);
                    font-weight: bold;
                }

                /deep/.el-form--inline .el-form-item__content {
                    z-index: 1000;
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

                /deep/.el-date-editor.el-input,
                .el-date-editor.el-input__inner {
                    width: 7vw;
                }

                /deep/.el-range-editor.el-input__inner {
                    color: #fff;
                    border: 1px solid rgba(31, 91, 193, 1);
                    background-color: rgba(14, 39, 84, 0.68);
                    width: 7.8vw;
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

            .tuopuChart {
                // height: 64%;
            }

            .pup {
                // height: 40%;
                // border: 1px solid #ffa;
                position: relative;
                z-index: 1000;
                // top: -12%;

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
                    overflow-x: auto
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
                    width: 10.5vw;
                    color: rgb(255, 255, 255);
                }
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
