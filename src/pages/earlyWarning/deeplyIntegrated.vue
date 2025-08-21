<template>
    <div class="contain">
        <div class="title">
            <!-- 多元数据融合挖掘 -->
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
                                            <el-option label="GAN模型(训练)" value="GAN模型(训练)"
                                                @click.native="selectModel(1)"></el-option>
                                            <!-- <el-option label="风速预测模型(训练)" value="风速预测模型(训练)"
                                    @click.native="selectModel(2)"></el-option> -->
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
                <div class="left_child2">
                    <scatterLeft />
                </div>
            </div>
            <div class="body_center">
                <div class="workflow">
                    <div v-for="(group, index) in workGroups" :key="index" class="workflow-node">
                        <div class="node">
                            <div>{{ group[0].label }}</div>
                        </div>
                        <div v-if="index < workGroups.length - 1"
                            :class="{ 'arrowAn': (index === workGroups.length - 2) && (workGroups.length != 6) }"
                            class="arrow"></div>
                    </div>
                </div>
                <div class="tuopuChart">
                    <titleInfo :titleInfoFlag="1" />
                </div>
                <div class="pup">
                    <div class="st_titles">
                        评估指标表
                    </div>
                    <el-table height="32vh" :header-cell-style="{ background: 'rgba(0,25,47,0.7)', color: '#fff' }"
                        :data="tableData" style="width: 90%;margin-left: 5%;margin-top: 0.5%;font-size: 1.4vh;"
                        v-loading="loading" element-loading-text="任务未执行" element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(2,42,114,0.9)" border ref="scrollTable"
                        @mouseenter.native="autoScroll(true)" @mouseleave.native="autoScroll()">
                        <el-table-column prop="CK" label="窗口期" align="center"></el-table-column>
                        <el-table-column prop="WD" label="Wasserstein距离" align="center"></el-table-column>
                        <el-table-column prop="FID" label="图像相似度的评价指标" align="center"></el-table-column>
                        <!-- <el-table-column prop="wd" label="温度(℃)" align="center"></el-table-column>
                        <el-table-column prop="sd" label="湿度(g/m³)" align="center"></el-table-column>
                        <el-table-column prop="yl" label="雨量(mm/㎡)" align="center"></el-table-column>
                        <el-table-column prop="fs" label="风速(m/s)" align="center"></el-table-column> -->
                    </el-table>
                </div>
            </div>
            <div class="body_right">
                <barRight />
            </div>
        </div>
        <GAN :visiableParams1="visiableParams1" @GANDATA="computerData1"></GAN>
        <yuCe :visiableParams2="visiableParams2" @YUCEDATA="computerData2"></yuCe>
    </div>
</template>

<script>
import util from '@/api/generalFormat'
// import Maps from '@/components/map.vue'
import titleInfo from '@/components/titleInfo.vue'
import barRight from '@/pages/earlyWarning/components/barRight.vue'
import scatterLeft from '@/pages/earlyWarning/components/scatterLeft.vue'
import yuCe from '@/pages/earlyWarning/components/yuce.vue'
import GAN from '@/pages/earlyWarning/components/GAN.vue'
import mangeData from '@/components/mangeData'
import { throttle } from 'lodash';
import { encryptData, decryptData } from '@/utils/cryptoUtils';
export default {
    components: {
        titleInfo,
        barRight,
        scatterLeft,
        GAN,
        yuCe,
        mangeData
    },
    data() {
        return {
            timer: '',
            autoFlage: 1,
            titleName: '',
            statusFlage: false,
            loading: true,
            visiableParams1: false,
            extraData: [],
            visiableParams2: false,
            newWorkGroups: [[{
                label: '数据清洗'
            }],
            [{
                label: '原始统计分析'
            }],
            [{
                label: '对抗生成网络模型训练与数据生成'
            }]],
            allWorkGroups: [[{
                label: '数据清洗'
            }],
            [{
                label: '原始统计分析'
            }],
            [{
                label: '对抗生成网络模型训练与数据生成'
            }],
            [{
                label: '生成数据评估指标'
            }],
            [{
                label: '生成数据统计分析'
            }],
            [{
                label: '原始与生成数据对比'
            }],],
            workGroups: [[{
                label: '数据清洗'
            }],
            [{
                label: '原始统计分析'
            }]],
            formInline: {
                level: '',
                state: '',
                model: '',
                modelState: '',
                // selectedExtraData: [],
            },
            begainData: [],//接受数据
            selectData: [],//总体数据
            levelData: [],// 行政等级
            stateData: [],// 数据类型
            scrolltimer: '', // 自动滚动的定时任务
            // 表格数据
            tableData: [],
            isAutoCreate: 1,
            getBegainData: {
                data_type: "天气数据&GAN模型(训练)",
                columns: "WD,SD,YL,FS",
                start_date: "2021-01-06 00:00:00",
                end_date: "2021-11-23 23:00:00",
                data_id: "D000003",
                basic_data_id: "X0001T0001AT0001",
            }
        };
    },
    methods: {
        // 关闭模型参数选择界面
        closeDialog() {
            this.visiableParams1 = false
            this.visiableParams2 = false
        },
        // 处理下拉框接口数据
        getSelectData(data) {
            this.begainData = data
            let levelData = [];
            let stateData = {};
            data.forEach(item => {
                if (item.dataType === "天气数据") {
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
                }
            });

            this.selectData = {
                levelData,
                stateData
            };
            this.levelData = this.selectData.levelData;
        },
        handleLevelChange(value) {
            this.stateData = this.selectData.stateData[value] || [];
            this.handleStateChange()
        },
        handleStateChange(value) {
            this.formInline.state = '天气数据'
            value = '天气数据'
            if (value === '天气数据') {
                // let begain = this.begainData;
                // for (let i = 0; i < begain.length; i++) {
                //     if ((this.formInline.level === begain[i].acType) &&
                //         (this.formInline.state === begain[i].dataType)) {
                //         this.extraData = begain[i].columns.split(',')
                //         this.formInline.selectedExtraData = this.extraData || []
                //         break; // 找到匹配项后跳出循环
                //     }
                // }
            } else if (value === '故障检测') {
                let begain = this.begainData;
                for (let i = 0; i < begain.length; i++) {
                    if ((this.formInline.level === begain[i].acType) &&
                        (this.formInline.state === begain[i].dataType)) {
                        this.extraData = begain[i].columns.split(',')
                        break; // 找到匹配项后跳出循环
                    }
                }
            }
        },
        handleTableData(data) {
            this.tableData = []
            this.loading = true
            data[0].forEach((item) => {
                this.tableData.push({
                    CK: item[0],
                    WD: item[1],
                    FID: item[2]
                })
            })
            let encryptedData = encryptData({ tableData: this.tableData, }, process.env.VUE_APP_CRYPTO_KEY);
            sessionStorage.setItem("BOXTABLEDATA", encryptedData);
            this.loading = false
        },
        // 获取模型数据参数
        computerData1(data) {
            this.formInline.model = data
        },
        computerData2(data) {
            this.formInline.model = data
        },
        // GAN模型算法执行
        postGAN() {
            let encryptedData = encryptData(this.formInline, process.env.VUE_APP_CRYPTO_KEY);
            sessionStorage.setItem("windDataOld", encryptedData);
            this.statusFlage = true
            // 获取原始数据
            this.throttledPostBegain(this.formInline)
            util.post('/system/measurement/windMeasurementAlgorithm', this.formInline)
                .then(response => {
                    // 处理POST请求的响应
                    this.$message.success('已提交，算法正在运行')
                    if (response && response.code === 200) {
                        // 请求成功的处理逻辑
                        console.log('请求成功');
                        this.$message.success('已提交，算法正在运行')
                        // 发送任务队列请求
                        this.$bus.$emit('queueData', response.code)
                        this.tableData = []
                        this.tableData = response.data
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
                this.workGroups = []
                this.workGroups = this.newWorkGroups
                this.titleName = this.formInline.modelState + '-' + this.formInline.level + '-' + this.formInline.state
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
                        // 存储ID
                        // let encryptedData = encryptData({ basic_data_id: response.rows[5].data[0] }, process.env.VUE_APP_CRYPTO_KEY);
                        // sessionStorage.setItem("windDataOldID", encryptedData);
                        // 发送数据给左右两边进行渲染
                        this.$bus.$emit('windData', response.rows)
                        this.handleTableData(response.rows[4].data)
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
        // 使用节流函数
        throttledPostBegain: throttle(function (data) {
            this.postBegain(data);
        }, 2000),
        // 自动执行
        autoPostBegain() {
            this.timer = setInterval(() => {
                let data = JSON.parse(sessionStorage.getItem("windDataOld"))
                let id = decryptData(sessionStorage.getItem('windDataOldID'), process.env.VUE_APP_CRYPTO_KEY)
                if (data) { this.statusFlage = true }
                let statusData = { ...data, ...id }
                // console.log(statusData, 'statusData');
                if (this.statusFlage && this.autoFlage === 1) {
                    util.post('/get/task/status', statusData)
                        .then(response => {
                            // 处理POST请求的响应
                            if (response && response.code === 200) {
                                // 请求成功的处理逻辑
                                console.log('请求成功');
                                // 发送数据给左右两边进行渲染
                                if (response.status === 'S') {
                                    this.$bus.$emit('windData', response.rows)
                                    this.handleTableData(response.rows[4].data)
                                    this.workGroups = []
                                    this.workGroups = this.allWorkGroups
                                    this.autoFlage = 2
                                } else if (response.status === 'F') {
                                    this.autoFlage = 2
                                    this.$message.error('GAN训练执行错误')
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
                            console.log('POST请求错误', error);
                        });
                }
                if (this.autoFlage === 2) {
                    clearInterval(this.timer);
                }
                // console.log('每隔5分钟执行一次')
            }, 1000 * 60)
        },
        // 获取下拉框数据
        getSelect() {
            let arrSelect = []
            arrSelect = this.$store.state.select.selectOptions
            this.getSelectData(arrSelect.selectOptions)
        },
        // 确定提交
        onSubmit() {
            if (this.formInline.level != '' &&
                // this.formInline.region != '' &&
                // this.formInline.iP != '' &&
                // this.formInline.selectedExtraData != '' &&
                this.formInline.state != '' &&
                this.formInline.model != '') {
                this.autoFlage = 1
                this.$message.success('已提交，算法正在运行')
                this.postGAN();
            } else {
                this.$message.warning('传入的参数不能为空')
            }
        },
        // 重置
        onCancel() {
            this.formInline = {
                level: '',
                state: '',
                model: '',
                modelState: '',
                // selectedExtraData: [],
            }
            this.stateData = []
            this.visiableParams1 = false
            this.visiableParams2 = false
        },
        // 模型选择
        selectModel(data) {
            // 获取下拉框数据
            this.getSelect();
            this.visiableParams1 = false
            this.visiableParams2 = false
            this.onCancel()
            if (data === 1) {
                this.visiableParams1 = !this.visiableParams1
                this.formInline.modelState = 'GAN模型(训练)'
                // this.formInline.boolStart = 'False'
            } else {
                this.visiableParams2 = !this.visiableParams2
                this.formInline.modelState = '风速预测模型(训练)'
            }
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
        }
    },
    created() {
    },
    mounted() {
        // 接收任务进程的算法计算
        this.$bus.$on('runQueueDataGAN', (data) => {
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
            this.autoFlage = 2
            clearInterval(this.timer);
            this.throttledPostBegain(this.getBegainData);
            setTimeout(() => {
                this.workGroups = []
                this.workGroups = this.allWorkGroups
            }, 2000);
        })
        // 
        // setTimeout(() => {
        //     if (this.autoFlage === 1) {
        //         this.autoPostBegain()
        //     }
        // }, 1000);
        // this.autoScroll();
    },
    beforeDestroy() {
        // clearInterval(this.timer);
        // this.autoScroll(true)
    },
    activated() {
        // setTimeout(() => {
        //     if (this.autoFlage === 1) {
        //         this.autoPostBegain()
        //     }
        // }, 1000);
    },
    deactivated() {
        // clearInterval(this.timer);
        // this.autoScroll(true)
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
            width: 31.5%;
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
                width: 28.6%;
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
            width: 45%;
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

            .arrow {
                width: 2rem;
                height: 2rem;
                background: linear-gradient(90deg, rgb(255, 149, 0), rgb(149, 255, 0));
                transform: rotate(180deg);
                mask: url('data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="red" d="M5 12l7-8v6h10v4h-10v6z" /></svg>') center/contain no-repeat;
                -webkit-mask: url('data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="red" d="M5 12l7-8v6h10v4h-10v6z" /></svg>') center/contain no-repeat;
            }

            .arrowAn {
                animation: scrollBackground 0.5s linear infinite;
            }

            @keyframes scrollBackground {
                from {
                    background: linear-gradient(90deg, rgb(255, 72, 0), rgb(255, 140, 0));
                }

                to {
                    background: linear-gradient(90deg, rgb(149, 255, 0), rgb(174, 255, 0));
                }
            }

            .node {
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                cursor: pointer;
                max-width: 9.5vw;
                padding: 0.5rem;
            }

            .mapChart {
                height: 6%;
                margin-top: 2%;
                // position: absolute;
                // top: 0%;
                // left: 0%;

                /deep/.el-form--inline .el-form-item {
                    width: 18%;
                }

                /deep/.el-form--inline .el-form-item__content {
                    z-index: 1000;
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


                /deep/.el-button--primary {
                    color: #fff;
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

                /deep/.el-range-editor.el-input__inner {
                    color: #fff;
                    border: 1px solid rgba(31, 91, 193, 1);
                    background-color: rgba(14, 39, 84, 0.68);
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
                height: 50%;
            }

            .pup {
                position: relative;
                z-index: 1000;

                /deep/.el-loading-spinner i {
                    color: #40f3ff00;
                    font-size: 8vh;
                }

                /deep/.el-loading-spinner {
                    top: 36%;
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
            width: 22.5%;
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
