<template>
    <div class="contain">
        <div class="title">
            <!-- 拓扑自动辨识 -->
        </div>
        <div class="bodyCharts">
            <div class="body_left">
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
                                        <!-- <el-option label="拓扑自动辨识(训练)" value="拓扑自动辨识(训练)"
                                    @click.native="changeModel('1')"></el-option>
                                <el-option label="拓扑自动辨识(预测)" value="拓扑自动辨识(预测)"
                                    @click.native="changeModel('2')"></el-option> -->
                                        <el-option label="拓扑自动辨识(训练)-CnnAttention" value="拓扑自动辨识(训练)-CnnAttention"
                                            @click.native="changeModel('3')"></el-option>
                                        <el-option label="拓扑自动辨识(预测)-CnnAttention" value="拓扑自动辨识(预测)-CnnAttention"
                                            @click.native="changeModel('4')"></el-option>
                                        <el-option label="拓扑自动辨识(训练)-Dnn" value="拓扑自动辨识(训练)-Dnn"
                                            @click.native="changeModel('5')"></el-option>
                                        <el-option label="拓扑自动辨识(预测)-Dnn" value="拓扑自动辨识(预测)-Dnn"
                                            @click.native="changeModel('6')"></el-option>
                                        <el-option label="特征重要性-LightGbm" value="特征重要性-LightGbm"
                                            @click.native="changeModel('7')"></el-option>
                                        <el-option label="特征重要性-Rf" value="特征重要性-Rf"
                                            @click.native="changeModel('8')"></el-option>
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
                                    <el-select v-model="formInline.town" placeholder="城区" @change="handleTownChange">
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
                                <el-form-item v-if="isShow">
                                    <el-select v-model="formInline.topology" placeholder="拓扑结构"
                                        @change="handleTopologyChange">
                                        <el-option v-for="(item, index) in topologyData" :key="item" :label="item"
                                            :value="item" @click.native="runFlag(item, index + 1)"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item v-if="isShow">
                                    <el-date-picker v-model="formInline.time" type="datetimerange" range-separator="至"
                                        start-placeholder="开始" end-placeholder="结束" align="right"
                                        value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions">
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
            <div class="body_center">
                <div class="tuopuChart">
                    <tuopu :topologyId="'topologyChart2'" />
                </div>
            </div>
            <div class="body_right">
                <topologyRight style="height: 100%;" />
                <topologyLeft2 style="height: 100%;" />
            </div>
        </div>
        <topologyModel :visiableParams="visiableParams" :modelName="modelName" @TOPOLOGYMODELDATA="computerData1" />
    </div>
</template>

<script>
import util from '@/api/generalFormat'
import tuopu from '@/pages/energyMulti/components/tuopu.vue'
import topologyModel from '@/pages/energyMulti/components/topologyModel.vue'
// import topologyLeft1 from '@/pages/energyMulti/components/topologyLeft1.vue'
import topologyLeft2 from '@/pages/energyMulti/components/topologyLeft2.vue'
import topologyRight from '@/pages/energyMulti/components/topologyRight.vue'
import mangeData from '@/components/mangeData'
export default {
    components: {
        tuopu,
        // topologyLeft1,
        topologyLeft2,
        topologyModel,
        topologyRight,
        mangeData
    },
    data() {
        return {
            loading: false,
            isShow: false,
            modelName: '',
            visiableParams: false,
            formInline: {
                modelState: '',
                model: "",
                level: '拓扑',
                province: '',
                cityId: '',
                town: '',
                topology: '',
                state: '拓扑结构',
                id: '',
                time: [],
            },
            levelData: [],
            provinceData: [],
            cityIdData: [],
            townData: [],
            levelName: '',
            provinceName: '',
            cityIdName: '',
            townName: '',
            topologyName: '',
            topologyData: [],
            topologyInfo: [],
            topologyNum: 1,
            modelStateNew: '',
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
                    const start = this.parseDate(this.validRange.start).getTime();
                    const end = this.parseDate(this.validRange.end).getTime();
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
        changeModel(data) {
            // 获取下拉框数据
            this.getSelect();
            switch (data) {
                case '1':
                    this.isShow = false
                    this.modelStateNew = 1
                    break;
                case '2':
                    break;
                case '3':
                    this.isShow = false
                    this.modelName = 'CnnAttention'
                    this.visiableParams = true
                    this.modelStateNew = 1
                    break;
                case '4':
                    this.isShow = true
                    this.modelStateNew = 2
                    break;
                case '5':
                    this.isShow = false
                    this.modelName = 'Dnn'
                    this.visiableParams = true
                    this.modelStateNew = 1
                    break;
                case '6':
                    this.isShow = true
                    this.modelStateNew = 2
                    break;
                case '7':
                    this.isShow = false
                    this.modelStateNew = 1
                    break;
                case '8':
                    this.isShow = false
                    this.modelStateNew = 1
                    break;
                default:
                    break;
            }
            this.formInline.level = '拓扑'
            this.handleLevelChange("拓扑")
        },
        // 获取模型数据参数
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
        },
        // 获取算法计算初始数据
        postBegain(data, flageNum, dataType) {
            util.post('/get/ac/data', data)
                .then(response => {
                    // 处理POST请求的响应
                    if (response && response.code === 200) {
                        // 请求成功的处理逻辑
                        console.log('请求成功');
                        if (flageNum === 1) {
                            this.$bus.$emit('sendTopologyData', {
                                data: response.rows,
                                dataType: dataType
                            })
                        } else {
                            this.$bus.$emit('sendTopology2Data', {
                                data: response.rows,
                                dataType: dataType
                            })
                        }
                        // this.$bus.$emit('RestorationDatas', response.rows)
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
            if ((this.modelStateNew === 1 &&
                this.formInline.model != '' &&
                this.formInline.level != '')) {
                // console.log(this.formInline);
                this.$message.success('已提交，算法正在运行')
                this.postWind(this.formInline)
            } else if (this.modelStateNew === 2 &&
                this.formInline.level != '' &&
                this.formInline.town != '' &&
                this.formInline.time != '' &&
                this.formInline.topology != '') {
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
        },
        runFlag(data, num) {
            this.$bus.$emit('sendTitles', data)
            this.topologyNum = num
        },
        begainCompute() {
            let getBegainData = {
                modelState: "特征重要性-LightGbm",
                // modelState: "台风模型线路故障概率",
            }
            util.post('/get/ac/newest/data', getBegainData)
                .then(response => {
                    if (response && response.code === 200) {
                        console.log('请求成功');
                        this.$bus.$emit('sendTopology2Data', {
                            data: response.rows,
                            dataType: '拓扑结构&特征重要性-LightGbm'
                        })
                    } else {
                        console.log('请求失败');
                    }
                })
                .catch(error => {
                    console.log('POST请求错误', error);
                });
            getBegainData = {
                modelState: "特征重要性-Rf",
            }
            util.post('/get/ac/newest/data', getBegainData)
                .then(response => {
                    if (response && response.code === 200) {
                        console.log('请求成功');
                        this.$bus.$emit('sendTopology2Data', {
                            data: response.rows,
                            dataType: '拓扑结构&特征重要性-Rf'
                        })
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
        this.$bus.$on('runQueueDataTopology', (allData) => {
            let getBegainData = {}
            getBegainData = {
                data_type: allData.data.data_type,
                columns: allData.data.columns,
                start_date: allData.data.start_date,
                end_date: allData.data.end_date,
                data_id: allData.data.data_id,
                basic_data_id: allData.data.basic_data_id,
                task_id: allData.data.task_id,
            }
            this.postBegain(getBegainData, allData.flagNum, allData.data.data_type)
        })
        this.begainCompute()
    },
    activated() {
        this.$bus.$emit('sendTitles', this.topologyNum)
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

        .body_left {
            width: 9%;
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
            width: 63%;
            height: 100%;
            position: relative;


            .tuopuChart {
                height: 84%;
                //top: 6vh;
                position: absolute;
            }

            .pup {
                height: 30%;
                border: 1px solid #ffa;
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
