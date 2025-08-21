<template>
    <div class="contain">
        <div class="title">
            <!-- 故障诊断 -->
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
                                            <el-option label="故障诊断(训练)" value="故障诊断(训练)"
                                                @click.native="selectModel(1)"></el-option>
                                            <el-option label="故障诊断(预测)" value="故障诊断(预测)"
                                                @click.native="selectModel(2)"></el-option>
                                            <el-option label="故障定位" value="故障定位"
                                                @click.native="selectModel(3)"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item v-if="isShowSum">
                                        <el-select v-model="GZDWTestData" placeholder="故障定位测试类型">
                                            <!-- <el-option label="大规模配电网测试" value="大规模配电网测试"
                                    @click.native="changeShow('1')"></el-option> -->
                                            <!-- <el-option label="容错性测试" value="容错性测试"
                                                @click.native="changeShow('2')"></el-option> -->
                                            <el-option label="极端天气灾害下基于FTU信号丢失的有源配电网故障区段定位方法"
                                                value="极端天气灾害下基于FTU信号丢失的有源配电网故障区段定位方法"
                                                @click.native="changeShow('2')"></el-option>
                                            <el-option label="故障分类" value="故障分类"
                                                @click.native="changeShow('8')"></el-option>
                                            <!-- <el-option label="性能比较" value="性能比较" @click.native="changeShow('3')"></el-option> -->
                                            <el-option label="基于ftu信息的故障定位" value="基于ftu信息的故障定位"
                                                @click.native="changeShow('4')"></el-option>
                                            <!-- <el-option label="性能比较(容错)" value="性能比较(容错)"
                                    @click.native="changeShow('5')"></el-option> -->
                                            <el-option label="基于attention-lstm的故障定位(训练)"
                                                value="基于attention-lstm的故障定位(训练)"
                                                @click.native="changeShow('6')"></el-option>
                                            <el-option label="基于attention-lstm的故障定位(预测)"
                                                value="基于attention-lstm的故障定位(预测)"
                                                @click.native="changeShow('7')"></el-option>
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
                                    <el-form-item v-if="isShow">
                                        <el-select v-model="formInline.province" placeholder="省级"
                                            @change="handleProvinceChange">
                                            <el-option v-for="item in provinceData" :key="item" :label="item"
                                                :value="item"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item v-if="isShow">
                                        <el-select v-model="formInline.town" placeholder="区域"
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
                                    <el-form-item v-if="isShowSum && isShowTime">
                                        <el-date-picker :key="'性能比较'" v-model="FTU.time" type="datetimerange"
                                            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                            align="right" value-format="yyyy-MM-dd HH:mm:ss"
                                            :picker-options="pickerOptions">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item v-if="isShowTimeRe">
                                        <el-select v-model="formInline.BranchTypeState" placeholder="数据类型"
                                            @change="handletypeStateChange">
                                            <el-option v-for="(item) in typeData" :key="item" :label="item"
                                                :value="item"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item v-if="isShowTimeRe">
                                        <el-date-picker :key="'故障分类'" v-model="formInline.time" type="datetimerange"
                                            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                            align="right" value-format="yyyy-MM-dd HH:mm:ss"
                                            :picker-options="pickerOptionsRestoration">
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
                    <tuopuZD :topologyId="'tuopuZD11'" />
                </div>
            </div>
            <div class="body_right">
                <div class="pup">
                    <div class="st_titles">
                        {{ pupTitleName }}
                    </div>
                    <el-table v-if="isChangeShow === '1'" height="90%" :key="'Confusion Matrix'"
                        :header-cell-style="{ background: 'rgba(0,25,47,0.7)', color: '#fff' }" :data="tableData"
                        style="width: 100%;font-size: 1.4vh;" v-loading="loading" element-loading-text="任务未执行"
                        element-loading-spinner="el-icon-loading" element-loading-background="rgba(2,42,114,0.9)"
                        border>
                        <el-table-column prop="predictedLabel" label="Predicted label" align="center"
                            v-if="tableData.some(item => item.predictedLabel ? item.predictedLabel : item.predictedLabel === 0 ? true : false)"></el-table-column>
                        <el-table-column prop="trueLabel" label="True label" align="center"
                            v-if="tableData.some(item => item.trueLabel ? item.trueLabel : item.trueLabel === 0 ? true : false)"></el-table-column>
                        <el-table-column prop="nums" label="nums" align="center"
                            v-if="tableData.some(item => item.nums ? item.nums : item.nums === 0 ? true : false)"></el-table-column>
                    </el-table>
                    <el-table v-if="isChangeShow === '2'" height="90%" :key="'故障定位结果表'"
                        :header-cell-style="{ background: 'rgba(0,25,47,0.7)', color: '#fff' }" :data="tableData"
                        style="width: 100%;font-size: 1.4vh;" v-loading="loading" element-loading-text="任务未执行"
                        element-loading-spinner="el-icon-loading" element-loading-background="rgba(2,42,114,0.9)"
                        border>
                        <el-table-column prop="nodeNums" label="节点规模" align="center"
                            v-if="tableData.some(item => item.nodeNums ? item.nodeNums : item.nodeNums === 0 ? true : false)"></el-table-column>
                        <el-table-column prop="trueNumsYC" label="定位正确次数(遗传算法)" align="center"
                            v-if="tableData.some(item => item.trueNumsYC ? item.trueNumsYC : item.trueNumsYC === 0 ? true : false)"></el-table-column>
                        <el-table-column prop="timeNumsYC" label="平均定位时间/s(遗传算法)" align="center"
                            v-if="tableData.some(item => item.timeNumsYC ? item.timeNumsYC : item.timeNumsYC === 0 ? true : false)"></el-table-column>
                        <el-table-column prop="trueNumsGH" label="定位正确次数(整数线性规划)" align="center"
                            v-if="tableData.some(item => item.trueNumsGH ? item.trueNumsGH : item.trueNumsGH === 0 ? true : false)"></el-table-column>
                        <el-table-column prop="timeNumsGH" label="平均定位时间/s(整数线性规划)" align="center"
                            v-if="tableData.some(item => item.timeNumsGH ? item.timeNumsGH : item.timeNumsGH === 0 ? true : false)"></el-table-column>
                    </el-table>
                    <!-- <el-table v-if="isChangeShow === '3'" height="11vw" :key="'故障场景算法测试结果表(容错性测试)'"
                        :header-cell-style="{ background: 'rgba(0,25,47,0.7)', color: '#fff' }" :data="tableData"
                        style="width: 95%;font-size: 1.4vh;" v-loading="loading"
                        element-loading-text="任务未执行" element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(2,42,114,0.9)" border>
                        <el-table-column prop="indexFTU" label="序号" align="center"
                            v-if="tableData.some(item => item.indexFTU ? item.indexFTU : item.indexFTU === 0 ? true : false)"></el-table-column>
                        <el-table-column prop="GZQDTFU" label="故障区段" align="center"
                            v-if="tableData.some(item => item.GZQDTFU ? item.GZQDTFU : item.GZQDTFU === 0 ? true : false)"></el-table-column>
                        <el-table-column prop="LBJDFTU" label="漏报节点" align="center"
                            v-if="tableData.some(item => item.LBJDFTU ? item.LBJDFTU : item.LBJDFTU === 0 ? true : false)"></el-table-column>
                        <el-table-column prop="MBHSFTU" label="目标函数" align="center"
                            v-if="tableData.some(item => item.MBHSFTU ? item.MBHSFTU : item.MBHSFTU === 0 ? true : false)"></el-table-column>
                        <el-table-column prop="DWJGFTU" label="定位结果" align="center"
                            v-if="tableData.some(item => item.DWJGFTU ? item.DWJGFTU : item.DWJGFTU === 0 ? true : false)"></el-table-column>
                    </el-table> -->
                    <el-table v-if="isChangeShow === '4'" height="90%" :key="'故障场景算法测试结果表(基于ftu信息的故障定位)'"
                        :header-cell-style="{ background: 'rgba(0,25,47,0.7)', color: '#fff' }" :data="tableData"
                        style="width: 100%;font-size: 1.4vh;" v-loading="loading" element-loading-text="任务未执行"
                        element-loading-spinner="el-icon-loading" element-loading-background="rgba(2,42,114,0.9)"
                        border>
                        <el-table-column prop="indexFTU" label="序号" align="center"
                            v-if="tableData.some(item => item.indexFTU ? item.indexFTU : item.indexFTU === 0 ? true : false)"></el-table-column>
                        <el-table-column prop="GZQDTFU" label="故障区段" align="center"
                            v-if="tableData.some(item => item.GZQDTFU ? item.GZQDTFU : item.GZQDTFU === 0 ? true : false)"></el-table-column>
                        <el-table-column prop="FTUSBXL" label="FTU上报信息序列" align="center"
                            v-if="tableData.some(item => item.FTUSBXL ? item.FTUSBXL : item.FTUSBXL === 0 ? true : false)"></el-table-column>
                        <el-table-column prop="MBHSFTU" label="目标函数" align="center"
                            v-if="tableData.some(item => item.MBHSFTU ? item.MBHSFTU : item.MBHSFTU === 0 ? true : false)"></el-table-column>
                        <el-table-column prop="DWJGFTU" label="定位结果" align="center"
                            v-if="tableData.some(item => item.DWJGFTU ? item.DWJGFTU : item.DWJGFTU === 0 ? true : false)"></el-table-column>
                    </el-table>
                    <div class="returnHome">
                        <el-dropdown>
                            <span class="el-dropdown-link">
                                <a>切换</a>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="changePup('1')">Confusion Matrix</el-dropdown-item>
                                <el-dropdown-item @click.native="changePup('2')">故障定位结果表</el-dropdown-item>
                                <!-- <el-dropdown-item @click.native="changePup('3')">故障场景算法测试结果表(容错性测试)</el-dropdown-item> -->
                                <el-dropdown-item
                                    @click.native="changePup('4')">故障场景算法测试结果表(基于ftu信息的故障定位)</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
                <div style="height: 150%;">
                    <zhenduanLeft2 style="height: 33.33%;" />
                </div>
                <div style="height: 200%;">
                    <div v-for="(item, index) in chartLeft" :key="index + item.title" style="height:  25%;">
                        <div class="st_titles">
                            {{ item.title ? item.title : '暂无' }}
                        </div>
                        <div class="chart-container" v-loading="loading11" element-loading-text="任务未执行"
                            element-loading-spinner="el-icon-loading" element-loading-background="rgba(2,42,114,0.9)">
                            <div :id=item.id style=" width: 100%;height: 100%;"></div>
                        </div>
                    </div>
                    <zhenduanLeft11 style="height:  25%;" />
                    <zhenduanLeft1 style="height:  25%;" />
                </div>
            </div>
        </div>
        <jianCe :visiableParams1="visiableParams1" :jcData="jcData" @JICEDATA="computerData1"></jianCe>
        <maxJiance :visiableParams2="visiableParams2" :maxJcData="maxJcData" @MAXJICEDATA="computerData2"></maxJiance>
    </div>
</template>

<script>
import util from '@/api/generalFormat'
import * as echarts from 'echarts'
import tuopuZD from '@/pages/earlyWarning/components/tuopuZD.vue'
// import switchData from '@/pages/energyMulti/components/switchData.vue'
import jianCe from '@/pages/earlyWarning/components/jiance.vue'
import maxJiance from '@/pages/earlyWarning/components/maxJiance.vue'
import zhenduanLeft1 from '@/pages/earlyWarning/components/zhenduanLeft1.vue'
import zhenduanLeft11 from '@/pages/earlyWarning/components/zhenduanLeft11.vue'
import zhenduanLeft2 from '@/pages/earlyWarning/components/zhenduanLeft2.vue'
import mangeData from '@/components/mangeData'

export default {
    components: {
        tuopuZD,
        // switchData,
        jianCe,
        maxJiance,
        zhenduanLeft1,
        zhenduanLeft11,
        zhenduanLeft2,
        mangeData
    },
    data() {
        return {
            loading: true,
            loading11: true,
            isShow: true,
            isShowFtu: false,
            isShowSum: false,
            isShowTimeRe: false,
            isShowTime: false,
            visiableParams1: false,
            visiableParams2: false,
            isChangeShow: '1',
            titleName: '',
            pupTitleName: 'Confusion Matrix',
            jcData: {},
            maxJcData: {},
            // 左侧
            chartLeft: [
                {
                    id: 'leftzd1',
                    title: '热力图',
                },
            ],
            leftData: [
                // 左一
                {
                    name: '',
                    data: []
                },
            ],
            begainData: [],//接受数据
            selectData: [],//总体数据
            levelData: [],// 行政等级
            levelTopolpyData: [],
            levelGZMNData: [],
            levelOldData: [],// 行政等级
            provinceData: [],
            townData: [],
            regionData: [],// 区域
            stateData: [],// 数据类型
            AllTimes: [],
            typeData: [],
            levelName: "",
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
                BranchTypeState: '',
                time: [],
                modelState: '',
            },
            FTU: {
                state: '',
                level: '',
                province: '',
                town: '',
                region: '',
                iP: '',
                id: '',
                time: '',
                model: '',
            },
            validRange: {
                start: '', // 有效开始时间
                end: ''    // 有效结束时间
            },
            validRangeRestoration: {
                start: '', // 有效开始时间
                end: ''    // 有效结束时间
            },
            GZDWTestData: '',
            // 表格数据
            tableData: [],
            CMPUPData: [],
            GZDWData: [],
            GZCJSFData: [],
            GZYXXCSData: [],
            getBegainData: {},
            chartInstances: [],
            begainDatas: [
                {
                    modelState: "故障定位-性能比较",
                },
                // {
                //     modelState: "故障定位-容错性测试",
                // },
                {
                    modelState: "故障定位-性能比较(容错)",
                },
                {
                    modelState: "故障定位-大规模配电网测试",
                }
            ],
        };
    },
    computed: {
        // 日期限制
        pickerOptions() {
            return {
                disabledDate: (time) => {
                    const start = this.parseDate(this.validRange.start).getTime() - 86400000;
                    const end = this.parseDate(this.validRange.end).getTime() + 86400000;
                    return time.getTime() < start || time.getTime() > end;
                }
            };
        },
        pickerOptionsRestoration() {
            return {
                disabledDate: (time) => {
                    const start = this.parseDate(this.validRangeRestoration.start).getTime() - 86400000;
                    const end = this.parseDate(this.validRangeRestoration.end).getTime() + 86400000;
                    return time.getTime() < start || time.getTime() > end;
                }
            };
        }
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
        updateChart() {
            // 销毁之前的图表实例
            this.chartInstances.forEach(instance => {
                if (instance) {
                    window.removeEventListener('resize', instance.resize); // 销毁图表监听事件
                    instance.dispose();
                }
            });
            this.chartInstances = [];

            // 生成 xAxisData 和 yAxisData
            let xAxisData = this.generateAxisData(this.leftData[0].data, 0);
            let yAxisData = this.generateAxisData(this.leftData[0].data, 1);

            // 左侧
            for (let i = 0; i < this.chartLeft.length; i++) {
                let chartDom1 = document.getElementById(this.chartLeft[i].id);
                let chartInstance = echarts.init(chartDom1);
                let option1 = this.getOption(chartDom1, this.leftData[0].data, xAxisData, yAxisData);
                chartInstance.setOption(option1);
                window.addEventListener('resize', () => {
                    chartInstance.resize();
                });
                this.chartInstances.push(chartInstance);
            }
        },
        generateAxisData(data, index) {
            let axisData = Array.from(new Set(data.map(item => item[index])));
            axisData.sort((a, b) => a - b); // 对轴数据进行排序
            return axisData;
        },
        getOption(domName, seriesData, xAxisData, yAxisData) {
            return {
                toolbox: {
                    feature: {
                        // dataZoom: { yAxisIndex: 'none' }, // 数据区域缩放
                        // restore: { show: true }, // 重置
                        // saveAsImage: { show: true }, // 导出图片
                        myFull: { // 全屏
                            show: true,
                            title: '全屏',
                            icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
                            onclick: () => {
                                // 全屏查看
                                if (domName.requestFullScreen) { // HTML W3C 提议
                                    domName.requestFullScreen()
                                } else if (domName.msRequestFullscreen) { // IE11
                                    domName.msRequestFullScreen()
                                } else if (domName.webkitRequestFullScreen) { // Webkit
                                    domName.webkitRequestFullScreen()
                                } else if (domName.mozRequestFullScreen) { // Firefox
                                    domName.mozRequestFullScreen()
                                }
                                // 退出全屏
                                if (domName.requestFullScreen) {
                                    document.exitFullscreen()
                                } else if (domName.msRequestFullScreen) {
                                    document.msExitFullscreen()
                                } else if (domName.webkitRequestFullScreen) {
                                    document.webkitCancelFullScreen()
                                } else if (domName.mozRequestFullScreen) {
                                    document.mozCancelFullScreen()
                                }
                            },
                            iconStyle: {
                                color: "#fff"
                            }
                        }
                    }
                },
                title: {
                    text: 'Confusion Matrix',
                    left: 'center',
                    textStyle: {
                        color: '#fff'
                    }
                },
                tooltip: {
                    position: 'top'
                },
                grid: {
                    height: '75%',
                    top: '10%',
                },
                xAxis: {
                    name: 'Predicted label',
                    nameLocation: 'middle',
                    nameGap: 30,
                    type: 'category',
                    data: xAxisData,
                    splitArea: {
                        show: true
                    },
                    nameTextStyle: {
                        fontWeight: 'bold',
                        color: '#fff'
                    },
                    axisLabel: {
                        show: true,
                        fontWeight: 'bold',
                        color: '#fff'
                    }
                },
                yAxis: {
                    name: 'True label',
                    nameLocation: 'middle',
                    nameGap: 30,
                    type: 'category',
                    data: yAxisData.reverse(), // 使行从上往下增大
                    splitArea: {
                        show: true
                    },
                    nameTextStyle: {
                        fontWeight: 'bold',
                        color: '#fff'
                    },
                    axisLabel: {
                        show: true,
                        fontWeight: 'bold',
                        color: '#fff'
                    }
                },
                visualMap: {
                    min: 0,
                    // max: 15,
                    calculable: true,
                    orient: 'vertical',
                    right: '0%',
                    top: '10%',
                    textStyle: {
                        color: '#fff'
                    },
                    color: ['rgba(8,48,107,1)', 'rgb(123,182,217)', 'rgba(245,245,244,0.5)']
                },
                series: [
                    {
                        name: '热力图',
                        type: 'heatmap',
                        data: seriesData.map((item) => {
                            return [item[1], yAxisData.length - 1 - item[0], item[2] || '0'];
                        }),
                        label: {
                            show: true
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
        },
        // 获取模型数据参数
        computerData1(data) {
            this.formInline.model = data
        },
        computerData2(data) {
            this.FTU.model = data
        },
        // 处理下拉框接口数据
        getSelectData(data) {
            this.begainData = data
            this.typeData = []
            let levelData = [];
            let provinceData = {};
            let townData = {};
            let regionData = {};
            let stateData = {};

            data.forEach(item => {
                if (item.dataType === "故障模拟数据" || item.dataType === "拓扑结构" || item.dataType === "配网结构数据" || item.dataType === "配网FTU数据") {
                    //处理 levelData
                    if (!levelData.includes(item.acType)) {
                        levelData.push(item.acType);
                        if (item.dataType === "拓扑结构") {
                            this.levelTopolpyData.push(item.acType)
                        }
                        if (item.dataType === "故障模拟数据") {
                            this.levelGZMNData.push(item.acType)
                        }
                    }
                    // 处理 stateData
                    if (!stateData[item.acType]) {
                        stateData[item.acType] = [];
                    }
                    if (!stateData[item.acType].includes(item.dataType)) {
                        stateData[item.acType].push(item.dataType);
                    }
                    let provinceName = item.acType + '-' + item.dataType;
                    let townName = item.acType + '-' + item.dataType + '-' + item.province;
                    let regionName = item.acType + '-' + item.dataType + '-' + item.province + '-' + item.town;

                    // 处理 provinceData
                    if (!provinceData[provinceName]) {
                        provinceData[provinceName] = [];
                    }
                    if (!provinceData[provinceName].includes(item.province)) {
                        provinceData[provinceName].push(item.province);
                    }

                    // 处理 townData
                    if (!townData[townName]) {
                        townData[townName] = [];
                    }
                    if (!townData[townName].includes(item.town)) {
                        townData[townName].push(item.town);
                    }

                    // 处理 regionData
                    if (!regionData[regionName]) {
                        regionData[regionName] = [];
                    }
                    if (!regionData[regionName].includes(item.name)) {
                        regionData[regionName].push(item.name);
                    }
                }
                if (item.dataType === '支路实时数据' || item.dataType === 'FTU-故障支路') {
                    this.AllTimes.push(item)
                    if (!this.typeData.includes(item.dataType)) {
                        this.typeData.push(item.dataType)
                    }
                }
            });

            this.selectData = {
                levelData,
                regionData,
                provinceData,
                townData,
                stateData
            };
            // console.log(this.selectData);
            // console.log(this.levelGZMNData);
            // console.log(this.levelTopolpyData);
            this.levelData = this.selectData.levelData;
            this.levelOldData = this.selectData.levelData;
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
            this.formInline.time = []; // 确保 time 是一个空数组
            if (this.formInline.modelState === '故障定位') {
                if (this.GZDWTestData === "基于ftu信息的故障定位" || this.GZDWTestData === '极端天气灾害下基于FTU信号丢失的有源配电网故障区段定位方法' || this.GZDWTestData === '故障分类') {
                    this.formInline.state = '拓扑结构'
                    this.FTU.state = '拓扑结构'
                    this.handleStateChange('拓扑结构')
                } else {
                    this.formInline.state = '故障模拟数据'
                    this.handleStateChange('故障模拟数据')
                }
            } else {
                this.formInline.state = '故障模拟数据'
                this.handleStateChange('故障模拟数据')
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
            this.formInline.region = '';
            this.formInline.iP = '';
            this.formInline.time = []; // 确保 time 是一个空数组
        },
        handleRegionChange(value) {
            if (this.GZDWTestData === "基于ftu信息的故障定位" || this.GZDWTestData === '极端天气灾害下基于FTU信号丢失的有源配电网故障区段定位方法') {
                this.$bus.$emit('ZDTUOPUDatas', value)
            }
            this.formInline.time = []; // 确保 time 是一个空数组
            this.formInline.iP = '';
            this.handleIPChange()
        },
        handleIPChange() {
            let begain = this.begainData;
            for (let i = 0; i < begain.length; i++) {
                if ((this.formInline.level === begain[i].acType) &&
                    (this.formInline.region === begain[i].name) &&
                    (this.formInline.state === begain[i].dataType)) {
                    this.formInline.time = []; // 确保 time 是一个空数组
                    // 更新id
                    this.formInline.iP = begain[i].ip;
                    this.formInline.id = begain[i].basicDataId;
                    break; // 找到匹配项后跳出循环
                }
            }
            // if (this.GZDWTestData === "基于ftu信息的故障定位") { this.formInline.state = "配网FTU数据" }
            this.handleFTUChange()
        },
        handleFTUChange() {
            let begain = this.begainData;
            for (let i = 0; i < begain.length; i++) {
                if ((this.formInline.level === begain[i].acType) &&
                    (this.formInline.region === begain[i].name) &&
                    (this.formInline.iP === begain[i].ip) &&
                    (this.FTU.state === begain[i].dataType)) {
                    this.FTU.time = []; // 确保 time 是一个空数组
                    // this.FTU.time = begain[i].startDate;
                    // 开始时间
                    this.validRange.start = begain[i].startDate;
                    // 结束时间
                    this.validRange.end = begain[i].endDate;
                    // 更新id
                    this.FTU.time = [this.validRange.start, this.validRange.end]
                    this.FTU.id = begain[i].basicDataId;
                    this.FTU.region = begain[i].cityId;
                    break; // 找到匹配项后跳出循环
                }
            }
        },
        handletypeStateChange() {
            this.formInline.time = [];
            console.log(this.AllTimes);
            this.begainData.forEach((item) => {
                if (this.formInline.level === item.acType &&
                    this.formInline.province === item.province &&
                    this.formInline.town === item.town) {
                    this.formInline.id = item.basicDataId;
                    if (item.startDate) {
                        this.AllTimes.forEach((item) => {
                            if (item.name === this.formInline.region) {
                                this.validRangeRestoration.start = item.startDate
                                this.validRangeRestoration.end = item.endDate
                                this.formInline.time = [item.startDate, item.endDate]
                            }
                        })
                    } else {
                        this.validRangeRestoration.start = "1970-01-01 00:00:00"
                        this.validRangeRestoration.end = "2099-12-31 23:59:59"
                        this.formInline.time = ["1970-01-01 00:00:00", "2099-12-31 23:59:59"]
                    }
                }
            })
        },
        selectModel(data) {
            // 获取下拉框数据
            this.getSelect();
            this.visiableParams1 = false
            this.onCancel()
            if (data === 1) {
                this.isShow = false
                this.isShowSum = false
                this.isShowTimeRe = false
                setTimeout(() => {
                    this.visiableParams1 = !this.visiableParams1
                    this.jcData = {
                        lr: 0.00005,
                        MSE: 'MSE',
                        batchSize: 64,
                        epoch: 50,
                    }
                }, 200);
                this.formInline.modelState = '故障诊断(训练)'
                this.levelData = []
                this.handleLevelChange('测试')
                this.formInline.level = '测试'
            } else if (data === 2) {
                this.isShow = true
                this.isShowSum = false
                this.isShowTimeRe = false
                this.formInline.modelState = '故障诊断(预测)'
                this.levelData = []
                this.handleLevelChange('测试')
                this.levelData = this.levelGZMNData
                this.formInline.level = '测试'
            } else if (data === 3) {
                this.isShow = true
                this.isShowSum = true
                this.GZDWTestData = ''
                this.formInline.modelState = '故障定位'
                // this.levelData = this.levelOldData
            }
        },
        changeShow(data) {
            switch (data) {
                case '1':
                    this.isShowTimeRe = false
                    this.visiableParams2 = true
                    this.isShowTime = false
                    this.FTU.time = ''
                    this.FTU.time = this.validRange.start
                    this.maxJcData = {
                        nums: 2,
                        sums: 100,
                        node: 33,
                        load: 33,
                    }
                    break;
                case '2':
                    this.isShowTimeRe = false
                    this.isShowTime = true
                    this.isShow = true
                    this.isShowFtu = true
                    this.formInline.level = '';
                    this.formInline.time = '';
                    this.levelData = []
                    this.handleLevelChange('拓扑')
                    this.formInline.level = "拓扑"
                    this.levelData = this.levelTopolpyData
                    this.FTU.time = [this.validRange.start, this.validRange.end]
                    break;
                case '3':
                    this.isShowTimeRe = false
                    this.isShowTime = true
                    this.FTU.time = [this.validRange.start, this.validRange.end]
                    break;
                case '4':
                    this.isShowTime = true
                    this.isShowTimeRe = false
                    this.isShow = true
                    this.isShowFtu = true
                    this.formInline.level = '';
                    this.formInline.time = '';
                    this.formInline.region = '';
                    this.levelData = []
                    this.handleLevelChange('拓扑')
                    this.formInline.level = "拓扑"
                    this.levelData = this.levelTopolpyData
                    this.FTU.time = [this.validRange.start, this.validRange.end]
                    // this.regionData = ["课题一"]
                    break;
                case '5':
                    this.isShowTimeRe = false
                    this.FTU.time = ''
                    this.FTU.time = this.validRange.start
                    this.isShowTime = false
                    break;
                case '6':
                    this.isShowTimeRe = false
                    this.isShowTime = false
                    this.isShowFtu = false
                    this.visiableParams1 = !this.visiableParams1
                    this.jcData = {
                        lr: 0.00005,
                        batchSize: 64,
                        epoch: 50,
                    }
                    this.formInline.level = ""
                    this.formInline.time = '';
                    this.formInline.region = '';
                    this.levelData = []
                    this.levelData = this.levelGZMNData
                    // this.formInline.state = "故障模拟数据"
                    this.isShow = false
                    break;
                case '7':
                    this.isShowTimeRe = false
                    this.isShowTime = false
                    this.isShowFtu = false
                    // this.formInline.region = "故障模拟数据"
                    // this.regionData = []
                    this.formInline.level = ""
                    this.formInline.time = '';
                    this.formInline.region = '';
                    this.levelData = []
                    this.levelData = this.levelGZMNData
                    // this.handleStateChange('故障模拟数据')
                    this.isShow = true
                    break;
                case '8':
                    this.isShowTime = false
                    this.isShowTimeRe = true
                    this.isShow = true
                    this.isShowFtu = true
                    this.formInline.level = '';
                    this.formInline.time = '';
                    this.levelData = []
                    this.handleLevelChange('拓扑')
                    this.formInline.level = "拓扑"
                    this.levelData = this.levelTopolpyData
                    this.FTU.time = [this.validRange.start, this.validRange.end]
                    break;
                default:
                    break;
            }
        },
        changePup(data) {
            switch (data) {
                case '1':
                    this.isChangeShow = '1'
                    this.pupTitleName = 'Confusion Matrix'
                    this.tableData = []
                    if (this.CMPUPData.length > 0) {
                        this.tableData = this.CMPUPData
                        this.loading = false
                    } else {
                        this.loading = true
                    }
                    break;
                case '2':
                    this.isChangeShow = '2'
                    this.pupTitleName = '故障定位结果表-大规模配电网测试'
                    this.tableData = []
                    if (this.GZDWData.length > 0) {
                        this.tableData = this.GZDWData
                        this.loading = false
                    } else {
                        this.loading = true
                    }
                    break;
                case '3':
                    this.isChangeShow = '3'
                    this.pupTitleName = '故障场景算法测试结果表-容错性测试'
                    this.tableData = []
                    if (this.GZCJSFData.length > 0) {
                        this.tableData = this.GZCJSFData
                        this.loading = false
                    } else {
                        this.loading = true
                    }
                    break;
                case '4':
                    this.isChangeShow = '4'
                    this.pupTitleName = '故障场景算法测试结果表-基于ftu信息的故障定位'
                    this.tableData = []
                    if (this.GZYXXCSData.length > 0) {
                        this.tableData = this.GZYXXCSData
                        let trueNum = 0
                        this.tableData.forEach((item) => {
                            if (item.GZQDTFU === item.DWJGFTU) trueNum++
                        })
                        let rote = ((trueNum * 100) / this.tableData.length).toFixed(2) + '%'
                        this.pupTitleName = '基于ftu信息的故障定位-定位准确率：' + rote
                        this.loading = false
                    } else {
                        this.loading = true
                    }
                    break;
                default:
                    break;
            }
        },
        // 获取下拉框数据
        getSelect() {
            let arrSelect = []
            arrSelect = this.$store.state.select.selectOptions
            this.getSelectData(arrSelect.selectOptions)
        },
        // 故障预测模型算法执行
        postWind(data) {
            util.post('/system/measurement/windMeasurementAlgorithm', data)
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
        computerChartS(data, flag) {
            if (flag === 2) {
                this.leftData[0].data = []
                this.leftData[0].data = data[0].data
                data[0].data.forEach((item) => {
                    this.CMPUPData.push({
                        predictedLabel: item[1],
                        trueLabel: item[0],
                        nums: item[2],
                    })
                })
                this.changePup('1')
                this.loading11 = true
                this.updateChart()
                this.loading11 = false
            } else if (flag === 3) {
                switch (data[0].dataname) {
                    case "故障定位-容错性测试":
                        this.GZCJSFData = []
                        data[0].data.forEach((item) => {
                            this.GZCJSFData.push({
                                indexFTU: item[0],
                                GZQDTFU: item[1],
                                LBJDFTU: item[2],
                                MBHSFTU: item[3],
                                DWJGFTU: item[4],
                            })
                        })
                        this.changePup('3')
                        break;
                    case '故障定位-大规模配电网测试':
                        this.GZDWData = []
                        data[0].data.forEach((itme) => {
                            this.GZDWData.push({
                                nodeNums: itme[0],
                                trueNumsYC: itme[0] === '100' ? '7' : '-',
                                timeNumsYC: itme[0] === '100' ? '12.8' : '-',
                                trueNumsGH: itme[1],
                                timeNumsGH: itme[2],
                            })
                        })
                        this.changePup('2')
                        break;
                    case '故障定位-基于ftu信息的故障定位':
                        this.GZYXXCSData = []
                        data[0].data.forEach((item) => {
                            this.GZYXXCSData.push({
                                indexFTU: item[0],
                                GZQDTFU: item[1],
                                FTUSBXL: item[2],
                                MBHSFTU: item[3],
                                DWJGFTU: item[4],
                            })
                        })
                        this.changePup('4')
                        break;
                    case '正确定位次数':
                        this.$bus.$emit('zd3dData', data)
                        break;
                    case '故障定位-性能比较(容错)':
                        this.$bus.$emit('ZDFTUData', data[0].data)
                        break;
                    case '故障定位-极端天气灾害下基于FTU信号丢失的有源配电网故障区段定位方法':
                        this.$bus.$emit('ZDRestorationDatas', data)
                        break;
                    case '故障分类':
                        this.$bus.$emit('ZDRestorationDatasFL', data)
                        break;
                    default:
                        break;
                }
            } else if (flag === 4) {
                // case '故障定位-基于attention-lstm的故障定位(训练)':
                // case '故障定位-基于attention-lstm的故障定位(预测)':
                // console.log(data);
                this.$bus.$emit('ZDLSTMData', data)
            }
        },
        // 确定提交
        onSubmit() {
            if ((this.formInline.level != '' &&
                // this.formInline.region != '' &&
                this.formInline.modelState != '' &&
                // this.formInline.time != '' &&
                // this.formInline.iP != '' &&
                this.formInline.state != '') || this.formInline.modelState === '故障诊断(训练)') {
                let formInlineData = {}
                switch (this.formInline.modelState) {
                    case '故障诊断(训练)':
                        formInlineData = {
                            level: this.formInline.level,
                            modelState: this.formInline.modelState,
                            state: this.formInline.state,
                            model: this.formInline.model,
                        }
                        break;
                    case '故障定位':
                        // if (this.GZDWTestData === "基于ftu信息的故障定位") { this.formInline.state = "配网结构数据" }
                        formInlineData = {
                            level: this.formInline.level,
                            province: this.formInline.province,
                            town: this.formInline.town,
                            modelState: this.formInline.modelState + '-' + this.GZDWTestData,
                            state: this.formInline.state,
                            BranchTypeState: this.formInline.BranchTypeState,
                            time: this.formInline.time,
                            cityId: this.FTU.region,
                            iP: this.formInline.iP,
                            id: this.formInline.id,
                            model: {
                                state: this.FTU.state,
                                level: this.formInline.level,
                                province: this.formInline.province,
                                town: this.formInline.town,
                                region: this.formInline.region,
                                iP: this.formInline.iP,
                                id: this.FTU.id,
                                time: this.FTU.time,
                                model: this.FTU.model
                            },
                        }
                        break;
                    case '故障诊断(预测)':
                        formInlineData = this.formInline
                        break;
                    default:
                        break;
                }
                if (formInlineData.modelState === '故障定位-基于attention-lstm的故障定位(训练)') {
                    formInlineData = {
                        level: formInlineData.level,
                        town: this.formInline.town,
                        modelState: formInlineData.modelState,
                        state: formInlineData.state,
                        model: this.formInline.model,
                    }
                } else if (formInlineData.modelState === '故障定位-基于attention-lstm的故障定位(预测)') {
                    formInlineData = {
                        level: formInlineData.level,
                        province: this.formInline.province,
                        town: this.formInline.town,
                        modelState: formInlineData.modelState,
                        state: formInlineData.state,
                        cityId: this.FTU.region,
                        iP: this.formInline.iP,
                        id: this.formInline.id,
                    }
                } else if (formInlineData.modelState === '故障定位-故障分类') {
                    formInlineData = {
                        level: this.formInline.level,
                        province: this.formInline.province,
                        town: this.formInline.town,
                        modelState: formInlineData.modelState,
                        state: this.formInline.state,
                        BranchTypeState: this.formInline.BranchTypeState,
                        time: this.formInline.time,
                        cityId: this.FTU.region,
                        iP: this.formInline.iP,
                        id: this.formInline.id,
                    }
                }
                if (this.formInline.modelState === '故障定位-故障分类' && this.formInline.time.length === 0) {
                    this.$message.warning('传入的参数不能为空')
                } else {
                    // console.log(formInlineData);
                    this.$message.success('已提交，算法正在运行')
                    this.postWind(formInlineData)
                }
            } else {
                // console.log(this.formInline);
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
                BranchTypeState: '',
                time: [],
                state: '',
                modelState: '',
            }
            this.FTU = {
                state: '',
                level: '',
                province: '',
                town: '',
                region: '',
                iP: '',
                id: '',
                time: '',
                model: '',
            }
            this.GZDWTestData = ''
            this.regionData = []
            this.iPData = []
            this.stateData = []
        },
        autoBegainData() {
            this.begainDatas.forEach((item) => {
                this.getBegainData = {}
                this.getBegainData = item
                util.post('/get/ac/data', this.getBegainData)
                    .then(response => {
                        if (response && response.code === 200) {
                            this.computerChartS(response.rows, 3)
                        } else {
                            console.log('请求失败');
                        }
                    })
                    .catch(error => {
                        console.log('POST请求错误', error);
                    });
            })
        }
    },
    mounted() {
        this.$bus.$on('runQueueDataZD', (allDatas) => {
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
            if (data.data_type === '配网结构数据&故障定位-基于ftu信息的故障定位') {
                this.getBegainData = {}
                this.getBegainData = {
                    data_type: data.data_type,
                    columns: data.columns,
                    start_date: data.start_date,
                    end_date: data.end_date,
                    data_id: data.data_id,
                    basic_data_id: data.basic_data_id,
                    task_id: data.task_id,
                    remark: data.remark
                }
            }
            this.titleName = data.data_type
            this.postBegain(this.getBegainData, allDatas.flag)
        })
        this.autoBegainData()
    },
    beforeDestroy() {
    },
    activated() {
        // activated钩子执行resize()方法
        // this.$nextTick(() => {
        //     this.chartInstances.forEach((item => {
        //         item.resize();
        //     }))
        // });
        // this.throttledPostBegain(this.getWindData);
        // this.autoBegainData()
    },
    deactivated() {
    }
}
</script>

<style lang="scss" scoped>
.contain {
    height: 85vh;
    // border: 2px solid rgb(153, 196, 248);

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

                /deep/.el-loading-spinner i {
                    color: #40f3ff00;
                    // font-size: 8vh;
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
                // height: 50%;
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

            .pup {
                position: relative;
                z-index: 100;
                height: 50%;

                .returnHome {
                    // width: 100%;
                    position: absolute;
                    left: 0%;
                    top: 0%;
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

            /deep/.el-loading-spinner i {
                color: #40f3ff00;
                // font-size: 8vh;
            }
        }
    }
}
</style>
