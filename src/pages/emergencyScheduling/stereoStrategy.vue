<template>
    <div class="contain">
        <div class="title">
            <!-- 保底生存策略 -->
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
                                            <el-option label="灾前" value="灾前" @click.native="changeShow(0)"></el-option>
                                            <el-option label="灾后" value="灾后" @click.native="changeShow(1)"></el-option>
                                            <el-option label="应急发电车配置" value="应急发电车配置"
                                                @click.native="changeShow(2)"></el-option>
                                            <el-option label="应急发电车规划" value="应急发电车规划"
                                                @click.native="changeShow(3)"></el-option>
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
                                                :value="item" @click.native="runFlag(item)"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item v-if="loadShow">
                                        <el-select v-model="formInline.loadLevel" placeholder="交通拥堵程度">
                                            <el-option v-for="(item, index) in LoadData" :key="item" :label="item"
                                                :value="item" @click.native="computerLoad(index)"></el-option>
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
                    <tuopu :topologyId="'topologyChartqw2'" />
                </div>
                <!-- <div class="pup">
                    <div class="st_titles">
                        移动储能的动态调度结果表
                    </div>
                    <el-table height="10vw" :header-cell-style="{ background: 'rgba(0,25,47,0.7)', color: '#fff' }"
                        :data="tableData" style="width: 95%;margin-left: 2.5%;margin-top: -0.5%;font-size: 1.4vh;"
                        v-loading="loading" element-loading-text="任务未执行" element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(2,42,114,0.6)" border>
                        <el-table-column prop="name" label="移动储能名称" align="center"
                            v-if="tableData.some(item => item.name ? item.name : item.name === 0 ? true : false)"></el-table-column>
                        <el-table-column prop="time" label="调度时间" align="center"
                            v-if="tableData.some(item => item.time ? item.time : item.time === 0 ? true : false)"></el-table-column>
                        <el-table-column prop="power" label="移动储能位置" align="center"
                            v-if="tableData.some(item => item.power ? item.power : item.power === 0 ? true : false)"></el-table-column>
                    </el-table>
                </div> -->
            </div>
            <div class="body_right">
                <div v-if="isShowCharts" style="height: 100%;">
                    <div class="title_child">
                        {{ titleNameLeft }}
                    </div>
                    <stereoLeft v-if="!changeShowCar" />
                    <stereoLeft2 v-if="changeShowCar" />
                </div>
                <div v-if="!isShowCharts" style="height: 100%;">
                    <div class=" title_child">
                        {{ titleNameRight }}
                    </div>
                    <stereoRight />
                </div>
            </div>
        </div>
        <stereoModel :visiableParams="visiableParams" :modelName="modelName" @STEREOMODELDATA="computerData1" />
    </div>
</template>

<script>
import util from '@/api/generalFormat'
import tuopu from '@/pages/emergencyScheduling/components/tuopu.vue'
import stereoLeft from '@/pages/emergencyScheduling/components/stereoLeft.vue'
import stereoLeft2 from '@/pages/emergencyScheduling/components/stereoLeft2.vue'
import stereoRight from '@/pages/emergencyScheduling/components/stereoRight.vue'
import stereoModel from '@/pages/emergencyScheduling/components/stereoModel.vue'
import mangeData from '@/components/mangeData'
import { encryptData } from '@/utils/cryptoUtils';
export default {
    components: {
        tuopu,
        stereoLeft,
        stereoLeft2,
        stereoRight,
        stereoModel,
        mangeData
    },
    data() {
        return {
            loadShow: false,
            visiableParams: false,
            changeShowCar: false,
            isShowCharts: false,
            loading: true,
            modelName: '',
            titleNameLeft: '灾前防御',
            titleNameRight: '灾后恢复',
            formInline: {
                modelState: '',
                model: {
                    it_max: 5,
                    e_value: 0.00001,
                    z_value: 10000,
                },
                level: '',
                province: '',
                cityId: '',
                town: '',
                topology: '',
                loadLevel: '',
                loadId: '',
                id: '',
                state: '拓扑结构',
                time: [],
            },
            levelData: [],
            stateData: [],
            provinceData: [],
            cityIdData: [],
            townData: [],
            topologyData: [],
            LoadData: [],
            levelName: '',
            provinceName: '',
            cityIdName: '',
            townName: '',
            topologyName: '',
            topologyInfo: [],
            AllTimes: [],
            LoadLevel: [],
            // 表格数据
            tableData: [],
            validRange: {
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
                if (item.dataType === "支路实时数据") {
                    this.AllTimes.push(item)
                }
                if (item.dataType === "交通拥堵程度") {
                    this.LoadLevel.push(item)
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
        changeShow(data) {
            this.formInline.level = '拓扑'
            if (data == 1) {
                this.loadShow = true
            } else if (data == 0) {
                this.loadShow = false
            } else if (data == 2) {
                this.loadShow = false
                this.modelName = '应急发电车配置'
                this.visiableParams = true
            } else if (data == 3) {
                this.loadShow = false
                this.modelName = '应急发电车规划'
                this.visiableParams = true
            }
            this.handleLevelChange("拓扑")
        },
        // 获取模型数据参数
        computerData1(data) {
            this.formInline.model = data
        },
        computerLoad(data) {
            this.formInline.model = {
                it_max: 5,
                z_value: 10000,
            }
            this.formInline.loadId = this.LoadLevel[data].basicDataId
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
            this.LoadLevel.forEach((item) => {
                if (this.formInline.level === item.acType &&
                    this.formInline.province === item.province &&
                    this.formInline.cityId === item.cityId &&
                    this.formInline.town === item.town) {
                    this.LoadData.push(item.ip)
                }
            })
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
                        this.AllTimes.forEach((item) => {
                            if (item.name === this.formInline.topology) {
                                this.validRange.start = item.startDate
                                this.validRange.end = item.endDate
                                this.formInline.time = []
                                this.formInline.time = [item.startDate, item.endDate]
                            }
                        })
                    } else {
                        this.validRange.start = "1970-01-01 00:00:00"
                        this.validRange.end = "2099-12-31 23:59:59"
                        this.formInline.time = []
                        this.formInline.time = ["1970-01-01 00:00:00", "2099-12-31 23:59:59"]
                    }
                }
            })
        },
        // 获取下拉框数据
        getSelect() {
            let arrSelect = []
            arrSelect = this.$store.state.select.selectOptions
            this.getSelectData(arrSelect.selectOptions)
        },
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
        },
        // 获取算法计算初始数据
        postBegain(data, name) {
            util.post('/get/ac/data', data)
                .then(response => {
                    // 处理POST请求的响应
                    if (response && response.code === 200) {
                        // 请求成功的处理逻辑
                        console.log('请求成功');
                        let encryptedData = encryptData({ data: response.rows }, process.env.VUE_APP_CRYPTO_KEY);
                        sessionStorage.setItem("YINGJIFADIANCHEDATA", encryptedData);
                        this.computerChartS(response.rows, name, data.data_type)
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
        computerChartS(data, name, data_type) {
            let topolopyName = []
            switch (name) {
                case '灾前':
                    this.isShowCharts = true
                    topolopyName = data_type.split('&')
                    setTimeout(() => {
                        this.$bus.$emit('PreData', { data: data, topolopyName: topolopyName[1] })
                    }, 10)
                    break;
                case '灾后':
                    this.isShowCharts = false
                    topolopyName = data_type.split('&')
                    setTimeout(() => {
                        this.runFlag(topolopyName[1])
                        this.computerTable(data[0].date, data[7].date, topolopyName[1])
                        this.$bus.$emit('LastData', { data: data, topolopyName: topolopyName[1] })
                    }, 10)
                    break;
                case '应急发电车':
                    this.isShowCharts = true
                    topolopyName = data_type.split('&')
                    setTimeout(() => {
                        switch (topolopyName[1]) {
                            case '应急发电车配置':
                                topolopyName[1] = '应急发电车配置策略33节点'
                                break;
                            case '应急发电车规划':
                                topolopyName[1] = '应急发电车配置策略33节点-规划'
                                break;
                            default:
                                break;
                        }
                        this.$bus.$emit('sendTopolpys', topolopyName[1])
                        this.$nextTick(() => {
                            this.$bus.$emit('carData', { data: data, topolopyName: topolopyName[1] })
                        })
                    }, 10)
                    break;
                default:
                    break;
            }
        },
        computerTable(allData, date7, topolopyName) {
            let allDatas = []
            allData.forEach((item) => {
                allDatas = allDatas.concat(item);
            })
            this.tableData = []
            allDatas.forEach((item) => {
                this.tableData.push({
                    name: item[0],
                    time: item[1],
                    power: item[2],
                })
            })
            this.loading = false
            this.$bus.$emit('LastTopolpyData', { topolpyData: this.tableData, loadData: date7, topolopyName: topolopyName })
        },
        runFlag(data) {
            this.$bus.$emit('sendTopolpys', data)
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
                level: '',
                province: '',
                cityId: '',
                town: '',
                topology: '',
                model: {
                    it_max: 5,
                    e_value: 0.00001,
                    z_value: 10000,
                },
                loadLevel: '',
                loadId: '',
                id: '',
                state: '拓扑结构',
                time: [],
            }
            this.topologyData = []
            // this.topologyInfo = []
            // this.AllTimes = []
        },
        begainCompute() {
            let getBegainData = {
                modelState: "灾后",
                // modelState: "台风模型线路故障概率",
            }
            util.post('/get/ac/newest/data', getBegainData)
                .then(response => {
                    if (response && response.code === 200) {
                        console.log('请求成功');
                        this.computerChartS(response.rows, '灾后', '拓扑结构&灾后')
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
        // 获取下拉框数据
        this.getSelect();
        // 接收任务进程的算法计算
        this.$bus.$on('FirstTopologyDATA', (data) => {
            let getWindData = {}
            getWindData = {
                data_type: data.data_type,
                start_date: data.start_date,
                end_date: data.end_date,
                data_id: data.data_id,
                basic_data_id: data.basic_data_id,
                task_id: data.task_id,
            }
            this.changeShowCar = false
            this.titleNameLeft = '灾前防御'
            this.postBegain(getWindData, '灾前');
        })
        this.$bus.$on('LastTopologyDATA', (data) => {
            let getWindData = {}
            getWindData = {
                data_type: data.data_type,
                start_date: data.start_date,
                end_date: data.end_date,
                data_id: data.data_id,
                basic_data_id: data.basic_data_id,
                task_id: data.task_id,
            }
            this.changeShowCar = false
            this.titleNameRight = '灾后恢复'
            this.postBegain(getWindData, '灾后');
        })
        this.$bus.$on('carTopologyDATA', (data) => {
            let getWindData = {}
            getWindData = {
                data_type: data.data_type,
                start_date: data.start_date,
                end_date: data.end_date,
                data_id: data.data_id,
                basic_data_id: data.basic_data_id,
                task_id: data.task_id,
            }
            this.changeShowCar = true
            this.titleNameLeft = '应急发电车'
            this.postBegain(getWindData, '应急发电车');
        })
        this.begainCompute()
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
            display: flex;
            /* 启用垂直滚动条 */
            overflow-y: hidden;
            overflow-x: hidden;

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

            .title_child {
                font-size: 1.2vw;
                text-align: center;
                font-weight: bold;
                -webkit-text-stroke: 1px #413c47;
                -webkit-text-fill-color: #fff;
                animation: shine 2.4s infinite;
                height: 5%;
            }

            .title_main {
                width: 100%;
                height: 95%;
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

                .card {
                    border: 1px solid #14c0d3de;
                    font-size: 1.6vh;
                    border-radius: 2vh;
                    margin-left: 10%;
                    margin-bottom: 5%;
                    height: 20%;
                    width: 80%;
                    color: #fff;
                    background-color: rgba(7, 185, 225, 0.664);
                    cursor: pointer;
                }

                .card:hover {
                    width: 84%;
                    margin-left: 8%;
                }

            }
        }

        .body_center {
            width: 64%;
            height: 100%;
            position: relative;

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
                // margin-top: 4vh;
            }

            .pup {
                height: 30%;
                margin-top: 1%;

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

            .title_child {
                font-size: 1.2vw;
                text-align: center;
                font-weight: bold;
                color: #fff;
                // -webkit-text-stroke: 1px #413c47;
                // -webkit-text-fill-color: #fff;
                // animation: shine 2.4s infinite;
                // height: 5%;
                background-size: 100% 107%;
                background-repeat: no-repeat;
                background-image: url('../../assets/img/ch/item_new.png');
            }

            .title_main {
                width: 100%;
                height: 95%;
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

                .card {
                    border: 1px solid #14c0d3de;
                    font-size: 1.6vh;
                    border-radius: 2vh;
                    margin-left: 10%;
                    margin-bottom: 5%;
                    height: 20%;
                    width: 80%;
                    color: #fff;
                    background-color: rgba(7, 185, 225, 0.664);
                    cursor: pointer;
                }

                .card:hover {
                    width: 84%;
                    margin-left: 8%;
                }

            }
        }
    }
}
</style>
