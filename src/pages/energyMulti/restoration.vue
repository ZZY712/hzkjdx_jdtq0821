<template>
    <div class="contain">
        <div class="title">
            <!-- 应急供电恢复 -->
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
                                            <el-option label="故障恢复" value="故障恢复"
                                                @click.native="selectModels(1)"></el-option>
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
                                        <el-select v-model="formInline.province" placeholder="省级"
                                            @change="handleProvinceChange">
                                            <el-option v-for="item in provinceData" :key="item" :label="item"
                                                :value="item"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-select v-model="formInline.cityId" placeholder="市级"
                                            @change="handleCityIdChange">
                                            <el-option v-for="item in cityIdData" :key="item" :label="item"
                                                :value="item"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-select v-model="formInline.town" placeholder="城区"
                                            @change="handleTownChange">
                                            <el-option v-for="(item) in townData" :key="item" :label="item"
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
                                    <el-form-item>
                                        <el-select v-model="formInline.topology" placeholder="拓扑结构"
                                            @change="handleTopologyChange">
                                            <el-option v-for="(item) in topologyData" :key="item" :label="item"
                                                :value="item" @click.native="changeTopology(item)"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-date-picker v-model="formInline.time" type="datetimerange"
                                            range-separator="至" start-placeholder="计算开始" end-placeholder="结束日期"
                                            align="right" value-format="yyyy-MM-dd HH:mm:ss"
                                            :picker-options="pickerOptions">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-time-picker is-range v-model="formInline.allSceneDate" range-separator="至"
                                            start-placeholder="每天开始" end-placeholder="结束时间" value-format="HH:mm:ss">
                                        </el-time-picker>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-date-picker v-model="formInline.restorationSceneDate" type="datetimerange"
                                            range-separator="至" start-placeholder="恢复开始" end-placeholder="结束日期"
                                            align="right" value-format="yyyy-MM-dd HH:mm:ss"
                                            :picker-options="pickerOptions">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-select v-model="formInline.BranchTypeState" placeholder="数据类型"
                                            @change="handletypeStateChange">
                                            <el-option v-for="(item) in typeData" :key="item" :label="item"
                                                :value="item"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-date-picker v-model="formInline.restorationSceneTime" type="datetime"
                                            placeholder="恢复时间点" value-format="yyyy-MM-dd HH:mm:ss"
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
                    <tuopu :topologyId="'topologyChart3'" />
                </div>
            </div>
            <div class="body_right">
                <div class="pup">
                    <div class="st_titles">
                        {{ pupTitleName }}
                    </div>
                    <el-table v-if="isChangeShow === '1'" height="90%" :key="'风储系统参数'"
                        :header-cell-style="{ background: 'rgba(0,25,47,0.7)', color: '#fff' }" :data="tableData"
                        style="width: 100%;font-size: 1.4vh;" border v-loading="loading" element-loading-text="任务未执行"
                        element-loading-spinner="el-icon-loading" element-loading-background="rgba(2,42,114,0.9)">
                        <el-table-column prop="classA" label="类型" align="center"
                            v-if="tableData.some(item => item.classA ? item.classA : item.classA === 0 ? true : false)"></el-table-column>
                        <el-table-column prop="maxPower" label="最大输出有功功率/KW " align="center"
                            v-if="tableData.some(item => item.maxPower ? item.maxPower : item.maxPower === 0 ? true : false)"></el-table-column>
                        <el-table-column prop="maxPowerIndex" label="最大功率因数" align="center"
                            v-if="tableData.some(item => item.maxPowerIndex ? item.maxPowerIndex : item.maxPowerIndex === 0 ? true : false)"></el-table-column>
                        <el-table-column prop="RL" label="容量/kW·h" align="center"
                            v-if="tableData.some(item => item.RL ? item.RL : item.RL === 0 ? true : false)"></el-table-column>
                        <el-table-column prop="CFDXL" label="充放电效率" align="center"
                            v-if="tableData.some(item => item.CFDXL ? item.CFDXL : item.CFDXL === 0 ? true : false)"></el-table-column>
                        <el-table-column prop="ZDZXZT" label="最小/最大荷电状态/p.u." align="center"
                            v-if="tableData.some(item => item.ZDZXZT ? item.ZDZXZT : item.ZDZXZT === 0 ? true : false)"></el-table-column>
                    </el-table>
                    <el-table v-if="isChangeShow === '2'" height="90%" :key="'负荷类型及参数'"
                        :header-cell-style="{ background: 'rgba(0,25,47,0.7)', color: '#fff' }" :data="tableData"
                        style="width: 100%;font-size: 1.4vh;" border v-loading="loading" element-loading-text="任务未执行"
                        element-loading-spinner="el-icon-loading" element-loading-background="rgba(2,42,114,0.9)">
                        <el-table-column prop="FHLX" label="负荷类型" align="center"
                            v-if="tableData.some(item => item.FHLX ? item.FHLX : item.FHLX === 0 ? true : false)"></el-table-column>
                        <el-table-column prop="FHJD" label="负荷节点" align="center"
                            v-if="tableData.some(item => item.FHJD ? item.FHJD : item.FHJD === 0 ? true : false)"></el-table-column>
                        <el-table-column prop="QZXS" label="权重系数" align="center"
                            v-if="tableData.some(item => item.QZXS ? item.QZXS : item.QZXS === 0 ? true : false)"></el-table-column>
                    </el-table>
                    <el-table v-if="isChangeShow === '3'" height="90%" :key="'三种方案的负荷恢复情况'"
                        :header-cell-style="{ background: 'rgba(0,25,47,0.7)', color: '#fff' }" :data="tableData"
                        style="width: 100%;font-size: 1.4vh;" border v-loading="loading" element-loading-text="任务未执行"
                        element-loading-spinner="el-icon-loading" element-loading-background="rgba(2,42,114,0.9)">
                        <el-table-column prop="FFS" label="方法" align="center"
                            v-if="tableData.some(item => item.FFS ? item.FFS : item.FFS === 0 ? true : false)"></el-table-column>
                        <el-table-column prop="YJFH" label="供电恢复比例(一级负荷)" align="center"
                            v-if="tableData.some(item => item.YJFH ? item.YJFH : item.YJFH === 0 ? true : false)"></el-table-column>
                        <el-table-column prop="EJFH" label="供电恢复比例(二级负荷)" align="center"
                            v-if="tableData.some(item => item.EJFH ? item.EJFH : item.EJFH === 0 ? true : false)"></el-table-column>
                        <el-table-column prop="SJFH" label="供电恢复比例(三级负荷)" align="center"
                            v-if="tableData.some(item => item.SJFH ? item.SJFH : item.SJFH === 0 ? true : false)"></el-table-column>
                        <el-table-column prop="TDSS" label="停电损失(KW·h)x权重)" align="center"
                            v-if="tableData.some(item => item.TDSS ? item.TDSS : item.TDSS === 0 ? true : false)"></el-table-column>
                        <el-table-column prop="QFL" label="弃风率" align="center"
                            v-if="tableData.some(item => item.QFL ? item.QFL : item.QFL === 0 ? true : false)"></el-table-column>
                    </el-table>
                    <div class="returnHome">
                        <el-dropdown>
                            <span class="el-dropdown-link">
                                <a>切换</a>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="changePup('1')">风储系统参数</el-dropdown-item>
                                <el-dropdown-item @click.native="changePup('2')">负荷类型及参数</el-dropdown-item>
                                <el-dropdown-item @click.native="changePup('3')">三种方案的负荷恢复情况</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
                <div style="height: 100%;">
                    <limitRight1 />
                    <limitRight />
                </div>
                <div style="height: 100%;">
                    <limitLeft />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import util from '@/api/generalFormat'
import limitLeft from '@/pages/energyMulti/components/limitLeft.vue'
import limitRight from '@/pages/energyMulti/components/limitRight.vue'
import limitRight1 from '@/pages/energyMulti/components/limitRight1.vue'
import tuopu from '@/pages/energyMulti/components/tuopu.vue'
import { encryptData } from '@/utils/cryptoUtils';
import mangeData from '@/components/mangeData'
export default {
    components: {
        tuopu,
        limitLeft,
        limitRight,
        limitRight1,
        mangeData
    },
    data() {
        return {
            loading: true,
            visiableParams1: false,
            titleName: '',
            pupTitleName: '风储系统参数',
            isChangeShow: '1',
            topologyNum: 0,
            topologyName: [],
            nodeData: [],
            branchData: [],
            sceneData: [],
            selectData: [],//总体数据
            formInline: {
                modelState: '',
                model: {
                },
                level: '',
                province: '',
                cityId: '',
                town: '',
                topology: '',
                iP: '',
                BranchTypeState: '',
                id: '',
                state: '拓扑结构',
                allSceneDate: ["", ""],
                restorationSceneTime: '',
                restorationSceneDate: [" ", " "],
                time: '',
            },
            agData: {},
            levelData: [],
            provinceData: [],
            cityIdData: [],
            townData: [],
            levelName: '',
            provinceName: '',
            cityIdName: '',
            townName: '',
            topologyNames: '',
            stateData: [],
            topologyData: [],
            LoadData: [],
            topologyInfo: [],
            typeData: [],
            AllTimes: [],
            // 表格数据
            tableData: [],
            tableDataFHLX: [],
            getBegainData: {},
            chartInstances: [],
            validRange: {
                start: '', // 有效开始时间
                end: ''    // 有效结束时间
            },
            validRangeRestoration: {
                start: '', // 有效开始时间
                end: ''    // 有效结束时间
            },
        };
    },
    computed: {
        pickerOptions() {
            return {
                disabledDate: (time) => {
                    const start = this.parseDate(this.validRange.start).getTime() - 86400000;
                    const end = this.parseDate(this.validRange.end).getTime() + 86400000;
                    return time.getTime() <= start || time.getTime() >= end;
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
        getDatas() {
            let getPathDatas = [
                {
                    name: '/get/topology/data',
                },
                // {
                //     name: '/get/bus_load/data',
                // },
                // {
                //     name: '/get/branch_ohms/data',
                // },
                // {
                //     name: '/get/scene/data',
                // },
            ]
            getPathDatas.forEach((items, indexs) => {
                // 请求接口
                util.get(items.name)
                    .then(response => {
                        if (response && response.code === 200) {
                            console.log('请求成功');
                            switch (indexs) {
                                case 0:
                                    this.tableDataFHLX = []
                                    this.topologyName = []
                                    response.rows.forEach((item) => {
                                        this.topologyName.push(item.name)
                                        this.tableDataFHLX.push(
                                            [{
                                                FHLX: '一级负荷',
                                                FHJD: item.load ? item.load[0][0] + '' : '',
                                                QZXS: '100',
                                            },
                                            {
                                                FHLX: '二级负荷',
                                                FHJD: item.load ? item.load[1][0] + '' : '',
                                                QZXS: '10',
                                            },
                                            {
                                                FHLX: '三级负荷',
                                                FHJD: item.load ? item.load[2][0] + '' : '',
                                                QZXS: '1',
                                            },
                                            {
                                                FHLX: '可控负荷',
                                                FHJD: item.control ? item.control + '' : '',
                                                QZXS: '/',
                                            },
                                            {
                                                FHLX: '不可控负荷',
                                                FHJD: '其余节点',
                                                QZXS: '/',
                                            },]
                                        )
                                    });
                                    break;
                                case 1:
                                    this.nodeData = []
                                    response.rows.forEach((item, index) => {
                                        this.nodeData.push({
                                            key: index + 1 + '',
                                            label: item.name,
                                            value: item.name,
                                        })
                                    });
                                    break;
                                case 2:
                                    this.branchData = []
                                    response.rows.forEach((item, index) => {
                                        this.branchData.push({
                                            key: index + 1 + '',
                                            label: item.name,
                                            value: item.name,
                                        })
                                    });
                                    break;
                                case 3:
                                    this.sceneData = []
                                    response.rows.forEach((item, index) => {
                                        this.sceneData.push({
                                            key: index + 1 + '',
                                            label: item.name,
                                            value: index + 1,
                                        })
                                    });
                                    break;
                                default:
                                    break;
                            }
                        } else {
                            console.log('请求失败');
                        }
                    })
                    .catch(error => {
                        console.log('GET请求错误', error);
                    });
            })
            this.changePup('1')
            this.loading = false
        },
        changePup(data) {
            switch (data) {
                case '1':
                    this.isChangeShow = '1'
                    this.pupTitleName = '风储系统参数'
                    this.tableData = []
                    this.tableData = [
                        {
                            classA: '风机',
                            maxPower: '1200',
                            maxPowerIndex: '0.9',
                            RL: '/',
                            CFDXL: '/',
                            ZDZXZT: '/',
                        },
                        {
                            classA: '储能',
                            maxPower: '400',
                            maxPowerIndex: '/',
                            RL: '800',
                            CFDXL: '95%',
                            ZDZXZT: '0.05/0.95',
                        }]
                    break;
                case '2':
                    this.isChangeShow = '2'
                    this.pupTitleName = '负荷类型及参数-' + this.topologyName[this.topologyNum]
                    this.tableData = []
                    this.tableData = this.tableDataFHLX[this.topologyNum]
                    break;
                case '3':
                    this.isChangeShow = '3'
                    this.pupTitleName = '三种方案的负荷恢复情况'
                    this.tableData = []
                    this.tableData = [
                        {
                            FFS: '方案1',
                            YJFH: '100',
                            EJFH: '100',
                            SJFH: '36.2',
                            TDSS: '9263.2',
                            QFL: '7.26',
                        },
                        {
                            FFS: '方案2',
                            YJFH: '100',
                            EJFH: '91.5',
                            SJFH: '49.9',
                            TDSS: '11376.8',
                            QFL: '0',
                        },
                        {
                            FFS: '方案3',
                            YJFH: '100',
                            EJFH: '92.5',
                            SJFH: '38.7',
                            TDSS: '12496.9',
                            QFL: '11.7',
                        },
                    ]
                    break;
                default:
                    break;
            }
        },
        selectModels() {
            // 获取下拉框数据
            this.getSelect();
            this.formInline.level = '拓扑'
            this.handleLevelChange("拓扑")
        },
        // 获取下拉框数据
        getSelect() {
            let arrSelect = []
            console.log(111);
            arrSelect = this.$store.state.select.selectOptions
            this.getSelectData(arrSelect.selectOptions)
        },
        // 处理下拉框接口数据
        getSelectData(data) {
            let levelData = [];
            let provinceData = {};
            let cityIdData = {};
            let townData = {};
            let stateData = {};
            let topologyData = {};
            data.forEach(item => {
                if (item.dataType === '拓扑结构') {
                    // 处理 levelData
                    if (!levelData.includes(item.acType)) {
                        levelData.push(item.acType);
                    }
                    // 处理 stateData
                    if (!stateData[item.acType]) {
                        stateData[item.acType] = [];
                    }
                    if (!stateData[item.acType].includes(item.dataType)) {
                        stateData[item.acType].push(item.dataType);
                    }
                    let provinceName = item.acType + '-' + item.dataType;
                    let cityIdName = item.acType + '-' + item.dataType + '-' + item.province;
                    let townName = item.acType + '-' + item.dataType + '-' + item.province + '-' + item.cityId;
                    let topologyName = item.acType + '-' + item.dataType + '-' + item.province + '-' + item.cityId + '-' + item.town;
                    // 处理 provinceData
                    if (!provinceData[provinceName]) {
                        provinceData[provinceName] = [];
                    }
                    if (!provinceData[provinceName].includes(item.province)) {
                        provinceData[provinceName].push(item.province);
                    }

                    // 处理 cityIdData
                    if (!cityIdData[cityIdName]) {
                        cityIdData[cityIdName] = [];
                    }
                    if (!cityIdData[cityIdName].includes(item.cityId)) {
                        cityIdData[cityIdName].push(item.cityId);
                    }

                    // 处理 townData
                    if (!townData[townName]) {
                        townData[townName] = [];
                    }
                    if (!townData[townName].includes(item.town)) {
                        townData[townName].push(item.town);
                    }

                    // 处理 topologyData
                    if (!topologyData[topologyName]) {
                        topologyData[topologyName] = [];
                    }
                    if (!topologyData[topologyName].includes(item.ip)) {
                        topologyData[topologyName].push(item.ip);
                        this.topologyInfo.push(item)
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
                stateData,
                provinceData,
                cityIdData,
                townData,
                topologyData
            };
            // console.log(this.AllTimes);
            this.levelData = this.selectData.levelData;
        },
        handleLevelChange(value) {
            this.levelName = value
            this.stateData = this.selectData.stateData[value] || [];
            this.formInline.state = '';
            this.provinceData = [];
            this.formInline.province = '';
            this.cityIdData = [];
            this.formInline.cityId = '';
            this.townData = [];
            this.formInline.town = '';
            this.topologyData = [];
            this.formInline.time = [];
            this.formInline.topology = '';
            this.handleStateChange('拓扑结构')
        },
        handleStateChange(value) {
            this.formInline.state = value
            this.provinceName = this.levelName + '-' + value;
            this.provinceData = this.selectData.provinceData[this.provinceName] || [];
            this.formInline.province = '';
            this.cityIdData = [];
            this.formInline.cityId = '';
            this.townData = [];
            this.formInline.town = '';
            this.topologyData = [];
            this.formInline.time = [];
            this.formInline.topology = '';
        },
        handleProvinceChange(value) {
            this.cityIdName = this.provinceName + '-' + value;
            this.cityIdData = this.selectData.cityIdData[this.cityIdName] || [];
            this.formInline.cityId = '';
            this.townData = [];
            this.formInline.town = '';
            this.topologyData = [];
            this.formInline.time = [];
            this.formInline.topology = '';
        },
        handleCityIdChange(value) {
            this.townName = this.cityIdName + '-' + value;
            this.townData = this.selectData.townData[this.townName] || [];
            this.formInline.town = '';
            this.topologyData = [];
            this.formInline.time = [];
            this.formInline.topology = '';
        },
        handleTownChange(value) {
            this.topologyNames = this.townName + '-' + value;
            this.topologyData = this.selectData.topologyData[this.topologyNames] || [];
            for (let i = 0; i < this.topologyInfo.length; i++) {
                if (value === this.topologyInfo[i].name) {
                    this.formInline.id = this.topologyInfo[i].basicDataId.split("&&")[0];
                    break;
                }
            }
            this.formInline.topology = '';
            this.formInline.time = [];
        },
        handleTopologyChange() {
            this.formInline.time = [];
            this.formInline.allSceneDate = [];
            this.formInline.restorationSceneDate = [];
            this.formInline.restorationSceneTime = '';
            this.topologyInfo.forEach((item) => {
                if (this.formInline.level === item.acType &&
                    this.formInline.province === item.province &&
                    this.formInline.cityId === item.cityId &&
                    this.formInline.town === item.town) {
                    this.formInline.id = item.basicDataId;
                    if (item.startDate) {
                        this.AllTimes.forEach((item) => {
                            if (item.name === '故障恢复 33节点') {
                                this.validRangeRestoration.start = item.startDate
                                this.validRangeRestoration.end = item.endDate
                            }
                        })
                        this.validRange.start = item.startDate
                        this.validRange.end = item.endDate
                        this.formInline.time = []
                        this.formInline.time = [item.startDate, item.endDate]
                        this.formInline.restorationSceneDate = []
                        this.formInline.restorationSceneDate = [item.startDate, item.endDate]
                    } else {
                        this.validRange.start = "1970-01-01 00:00:00"
                        this.validRange.end = "2099-12-31 23:59:59"
                        this.validRangeRestoration.start = "1970-01-01 00:00:00"
                        this.validRangeRestoration.end = "2099-12-31 23:59:59"
                        this.formInline.time = []
                        this.formInline.time = ["1970-01-01 00:00:00", "2099-12-31 23:59:59"]
                        this.formInline.restorationSceneDate = []
                        this.formInline.restorationSceneDate = ["1970-01-01 00:00:00", "2099-12-31 23:59:59"]
                    }
                }
            })
        },
        handletypeStateChange(value) {
            this.topologyInfo.forEach((item) => {
                if (this.formInline.level === item.acType &&
                    this.formInline.province === item.province &&
                    this.formInline.cityId === item.cityId &&
                    this.formInline.town === item.town) {
                    this.formInline.id = item.basicDataId;
                    if (item.startDate) {
                        this.AllTimes.forEach((item) => {
                            if ((value === item.dataType && item.name === '故障恢复 33节点')
                                || value === item.dataType) {
                                this.formInline.restorationSceneTime = item.startDate
                            }
                        })
                    } else {
                        this.formInline.restorationSceneTime = "2022-04-06 14:45:00"
                    }
                }
            })
        },
        selectModel(data) {
            switch (data) {
                case 1:
                    this.agData = {
                        SearchAgents_no: 150,
                        Max_iteration: 20,
                        pen: 3,
                    }
                    break;
                case 2:
                    this.agData = {
                        pop: 200,
                        max_iteration: 200,
                        M: 2,
                        pen: 3,
                        mu: 5,
                        mum: 5,
                    }
                    break;
                case 3:
                    this.agData = {
                        SearchAgents_no: 100,
                        Max_iteration: 20,
                        M: 2,
                        pen: 3,
                        mu: 5,
                        mum: 5,
                    }

                    break;
                case 4:
                    this.agData = {
                        SearchAgents_no: 30,
                        Max_iteration: 5,
                        pen: 3,
                        f: 0.5,
                        l: 1.5,
                    }
                    break;
                case 5:
                    this.agData = {
                        N: 200,
                        Max_iter: 200,
                        ST: 0.6,
                    }
                    break;
                default:
                    break;
            }
            setTimeout(() => {
                this.visiableParams1 = !this.visiableParams1
            }, 200);
        },
        changeTopology(data) {
            for (let index = 0; index < this.topologyName.length; index++) {
                if (data === this.topologyName[index]) {
                    this.topologyNum = index
                    break;
                }
            }
            this.changePup('2')
            this.$bus.$emit('sendTitles', data)
        },
        postWind() {
            util.post('/system/measurement/windMeasurementAlgorithm', this.formInline)
                .then(response => {
                    // 处理POST请求的响应
                    if (response && response.code === 200) {
                        // 请求成功的处理逻辑
                        console.log('请求成功');
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
            setTimeout(() => {
                this.titleName = this.formInline.modelState + '-' + this.formInline.level + '-' + this.formInline.state + '-' + this.formInline.selectedExtraData
            }, 2000);
        },
        // 获取算法计算初始数据
        postBegain(data) {
            util.post('/get/ac/data', data)
                .then(response => {
                    // 处理POST请求的响应
                    if (response && response.code === 200) {
                        // 请求成功的处理逻辑
                        console.log('请求成功');
                        sessionStorage.setItem("ReGZHFDATA", encryptData({ data: response.rows }, process.env.VUE_APP_CRYPTO_KEY));
                        this.$bus.$emit('RestorationDatas', response.rows)
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
        onSubmit() {
            if ((this.formInline.modelState != '' &&
                this.formInline.level != '' &&
                this.formInline.topology != '')) {
                this.$message.success('已提交，算法正在运行')
                this.postWind(this.formInline)
            } else {
                this.$message.warning('传入的参数不能为空')
            }
        },
        onCancel() {
            this.formInline = {
                modelState: '',
                model: {
                },
                level: '',
                province: '',
                town: '',
                region: '',
                topology: '',
                iP: '',
                BranchTypeState: '',
                id: '',
                state: '拓扑结构',
                allSceneDate: [],
                restorationSceneTime: '',
                restorationSceneDate: [],
                time: '',
            }
            this.topologyData = []
            // this.topologyInfo = []
            // this.AllTimes = []
        },
        begainCompute() {
            let getBegainData = {
                modelState: "故障恢复",
                // modelState: "台风模型线路故障概率",
            }
            util.post('/get/ac/newest/data', getBegainData)
                .then(response => {
                    if (response && response.code === 200) {
                        console.log('请求成功');
                        this.$bus.$emit('RestorationDatas', response.rows)
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
        this.getDatas()
        // 接收任务进程的算法计算
        this.$bus.$on('runQueueDataResto', (data) => {
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
            this.titleName = data.data_type + '-' + data.columns
            this.postBegain(this.getBegainData)
        })
        this.begainCompute()
    },
    activated() {
    },
    deactivated() {
    },
    beforeDestroy() {
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

            .mapChart {
                height: 6%;

                /deep/.el-form--inline .el-form-item {
                    width: 17%;
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

                /deep/.el-date-editor.el-input,
                .el-date-editor.el-input__inner {
                    width: 8vw;
                }

                /deep/.el-range-editor.el-input__inner {
                    color: #fff;
                    border: 1px solid rgba(31, 91, 193, 1);
                    background-color: rgba(14, 39, 84, 0.68);
                    width: 7.5vw;
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

                /deep/.el-table--scrollable-y .el-table__body-wrapper:-webkit-scrollbar {
                    /*隐藏滚轮*/
                    // display: none;
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
        }
    }
}
</style>
