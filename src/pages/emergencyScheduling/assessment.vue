<template>
    <div class="contain">
        <div class="title">
            <!-- 可靠性韧性评估 -->
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
                                            <el-option label="awoa" value="awoa"
                                                @click.native="selectModel(1)"></el-option>
                                            <el-option label="nsga_two" value="nsga_two"
                                                @click.native="selectModel(2)"></el-option>
                                            <el-option label="mixture" value="mixture"
                                                @click.native="selectModel(3)"></el-option>
                                            <el-option label="goa" value="goa"
                                                @click.native="selectModel(4)"></el-option>
                                            <el-option label="maque" value="maque"
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
                                            <el-option v-for="(item, index) in topologyData" :key="item" :label="item"
                                                :value="item" @click.native="runFlag(item, index + 1)"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-date-picker v-model="formInline.time" type="datetimerange"
                                            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
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
                    <tuopu :topologyId="'topologyChartqw3'" />
                </div>
                <!-- <div class="pup">
                    <div class="st_titles">
                        配电网风险评估结果表
                    </div>
                    <el-table height="25vh" :header-cell-style="{ background: 'rgba(0,25,47,0.7)', color: '#fff' }"
                        :data="tableData" style="width: 90%;margin-left: 5%;margin-top: -0.5%;font-size: 1.4vh;" border>
                        <el-table-column prop="sceneData" label="场景" align="center"
                            v-if="tableData.some(item => item.sceneData ? item.sceneData : item.sceneData === 0 ? true : false)"></el-table-column>
                        <el-table-column prop="RDATA" label="R" align="center"
                            v-if="tableData.some(item => item.RDATA ? item.RDATA : item.RDATA === 0 ? true : false)"></el-table-column>
                        <el-table-column prop="FCXS" label="方差系数/%" align="center"
                            v-if="tableData.some(item => item.FCXS ? item.FCXS : item.FCXS === 0 ? true : false)"></el-table-column>
                    </el-table>
                </div> -->
            </div>
            <div class="body_right">
                <div v-if="isShowCharts" style="height: 100%;">
                    <assessmentLeft1 />
                </div>
                <div v-if="!isShowCharts" style="height: 100%;">
                    <assessmentRight1 />
                </div>
            </div>
        </div>
        <modelAssess :visiableParams1="visiableParams1" :agData="agData" @MODELASSESSDATA="computerData1"></modelAssess>
    </div>
</template>

<script>
import util from '@/api/generalFormat'
import assessmentLeft1 from '@/pages/emergencyScheduling/components/assessmentLeft1.vue'
import assessmentRight1 from '@/pages/emergencyScheduling/components/assessmentRight1.vue'
import modelAssess from '@/pages/emergencyScheduling/components/modelAssess.vue'
import tuopu from '@/pages/emergencyScheduling/components/tuopu.vue'
import mangeData from '@/components/mangeData'
export default {
    components: {
        tuopu,
        assessmentLeft1,
        assessmentRight1,
        modelAssess,
        mangeData
    },
    data() {
        return {
            titleName: '',
            visiableParams1: false,
            isShowCharts: true,
            formInline: {
                modelState: '',
                model: {
                },
                level: '拓扑',
                province: '',
                cityId: '',
                town: '',
                topology: '',
                id: '',
                state: '拓扑结构',
                time: [],
            },
            agData: {},
            levelData: [],
            stateData: [],
            provinceData: [],
            cityIdData: [],
            townData: [],
            topologyData: [],
            levelName: '',
            provinceName: '',
            cityIdName: '',
            townName: '',
            topologyName: '',
            LoadData: [],
            topologyInfo: [],
            AllTimes: [],
            validRange: {
                start: '', // 有效开始时间
                end: ''    // 有效结束时间
            },
            // 表格数据
            tableData: [
                {
                    sceneData: '场景1',
                    RDATA: '0.2763',
                    FCXS: '0.8',
                },
                {
                    sceneData: '场景2',
                    RDATA: '0.2153',
                    FCXS: '0.6',
                },
                {
                    sceneData: '场景3',
                    RDATA: '0.1044',
                    FCXS: '0.9',
                },
                {
                    sceneData: '场景4',
                    RDATA: '0.1469',
                    FCXS: '0.5',
                },
            ]
        };
    },
    computed: {
        pickerOptions() {
            return {
                disabledDate: (time) => {
                    const start = this.parseDate(this.validRange.start).getTime()-86400000;
                    const end = this.parseDate(this.validRange.end).getTime()+86400000;
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
        // 关闭模型参数选择界面
        closeDialog() {
            this.visiableParams1 = false
        },
        // 获取模型参数
        computerData1(data) {
            this.formInline.model = data
        },
        // 获取下拉框数据
        getSelect() {
            let arrSelect = []
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
            });

            this.selectData = {
                levelData,
                stateData,
                provinceData,
                cityIdData,
                townData,
                topologyData
            };
            // console.log(this.selectData);
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
            this.topologyName = this.townName + '-' + value;
            this.topologyData = this.selectData.topologyData[this.topologyName] || [];
            for (let i = 0; i < this.topologyInfo.length; i++) {
                if (value === this.topologyInfo[i].name) {
                    this.formInline.id = this.topologyInfo[i].basicDataId.split("&&")[0];
                    break;
                }
            }
            this.formInline.topology = '';
            this.formInline.time = [];
        },
        handleTopologyChange(value) {
            this.formInline.time = [];
            this.topologyInfo.forEach((item) => {
                if (this.formInline.level === item.acType &&
                    this.formInline.province === item.province &&
                    this.formInline.cityId === item.cityId &&
                    this.formInline.town === item.town &&
                    item.ip === value) {
                    this.formInline.id = item.basicDataId;
                    if (item.startDate) {
                        this.validRange.start = item.startDate
                        this.validRange.end = item.endDate
                        this.formInline.time = []
                        this.formInline.time = [item.startDate, item.endDate]
                    } else {
                        this.validRange.start = "1970-01-01 00:00:00"
                        this.validRange.end = "2099-12-31 23:59:59"
                        this.formInline.time = []
                        this.formInline.time = ["1970-01-01 00:00:00", "2099-12-31 23:59:59"]
                    }
                }
            })
        },
        selectModel(data) {
            // 获取下拉框数据
            this.getSelect();
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
                        pop: 100,
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
                this.formInline.level = '拓扑'
                this.visiableParams1 = !this.visiableParams1
                this.handleLevelChange("拓扑")
            }, 200);
        },
        runFlag(data) {
            this.$bus.$emit('sendTopolpys', data)
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
                model: "",
                level: '拓扑',
                province: '',
                cityId: '',
                town: '',
                state: '拓扑结构',
                topology: '',
                id: '',
                time: [],
            }
            this.topologyData = []
            // this.topologyInfo = []
            // this.AllTimes = []
        },
    },
    mounted() {
        this.$bus.$on('AssessmentDATA', (data) => {
            switch (data.flag) {
                case 1:
                    this.isShowCharts = true
                    setTimeout(() => {
                        this.$bus.$emit('AssessmentDATA0', data.allData)
                    }, 10)
                    break;
                case 2:
                    this.isShowCharts = false
                    setTimeout(() => {
                        this.$bus.$emit('AssessmentDATA1', data.allData)
                    }, 10)
                    break;
                default:
                    break;
            }
        })
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

            .pup {
                height: 30%;
                // border: 1px solid #ffa;
                margin-bottom: 1%;

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
        }

        .body_right {
            width: 27%;
            height: 100%;
            position: relative;
            /* 启用垂直滚动条 */
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
    }
}
</style>
