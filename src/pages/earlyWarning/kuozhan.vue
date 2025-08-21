<template>
    <div class="contain">
        <div class="title">
            <!-- 数据扩展 -->
        </div>
        <div class="bodyCharts">
            <div class="body_left">
                <scatterLeft />
            </div>
            <div class="body_center">
                <div class="mapChart">
                    <el-form :inline="true" :model="formInline" class="demo-form-inline">
                        <el-form-item>
                            <el-select v-model="formInline.modelState" placeholder="模型选择">
                                <el-option label="GAN模型(训练)" value="GAN模型(训练)"
                                    @click.native="selectModel(1)"></el-option>
                                <!-- <el-option label="风速预测模型(训练)" value="风速预测模型(训练)"
                                    @click.native="selectModel(2)"></el-option> -->
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-select v-model="formInline.level" placeholder="行政等级" @change="handleLevelChange">
                                <el-option v-for="item in levelData" :key="item" :label="item"
                                    :value="item"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-select v-model="formInline.state" placeholder="数据类型">
                                <el-option v-for="item in stateData" :key="item" :label="item"
                                    :value="item"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-select v-model="formInline.selectedExtraData" multiple placeholder="计算数据">
                                <el-option v-for="item in extraData" :key="item" :label="item"
                                    :value="item"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button size="small" type="primary" @click="onSubmit">确定</el-button>
                            <el-button size="small" type="primary" @click="onCancel">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="tuopuChart">
                    <Maps />
                </div>
                <div class="pup">
                    <div class="st_titles">
                        GAN模型结果表
                    </div>
                    <el-table height="10vw" :header-cell-style="{ background: 'rgba(0,25,47,0.7)', color: '#fff' }"
                        :data="tableData" style="width: 90%;margin-left: 5%;margin-top: -0.5%;font-size: 1.4vh;"
                        v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(2,42,114,0.9)" border ref="scrollTable"
                        @mouseenter.native="autoScroll(true)" @mouseleave.native="autoScroll()">
                        <el-table-column prop="wd" label="温度(℃)" align="center"></el-table-column>
                        <el-table-column prop="sd" label="湿度(g/m³)" align="center"></el-table-column>
                        <el-table-column prop="yl" label="雨量(mm/㎡)" align="center"></el-table-column>
                        <el-table-column prop="fs" label="风速(m/s)" align="center"></el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="body_right">
                <barRight />
            </div>
        </div>
        <GAN :visiableParams1="visiableParams1" @GANDATA="computerData1"></GAN>
        <yuCe :visiableParams2="visiableParams2" @YUCEDATA="computerData1"></yuCe>
    </div>
</template>

<script>
import util from '@/api/generalFormat'
import Maps from '@/components/map.vue'
import barRight from '@/pages/earlyWarning/components/barRight.vue'
import scatterLeft from '@/pages/earlyWarning/components/scatterLeft.vue'
import yuCe from '@/pages/earlyWarning/components/yuce.vue'
import GAN from '@/pages/earlyWarning/components/GAN.vue'
import { throttle } from 'lodash';
export default {
    components: {
        Maps,
        barRight,
        scatterLeft,
        GAN,
        yuCe,
    },
    data() {
        return {
            loading: true,
            visiableParams1: false,
            extraData: ['WD', 'SD', 'YL', 'FS'],
            visiableParams2: false,
            formInline: {
                level: '',
                state: '',
                model: '',
                modelState: '',
                selectedExtraData: [],
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
                data_id: "D000001",
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
            });

            this.selectData = {
                levelData,
                stateData
            };
            this.levelData = this.selectData.levelData;
        },
        handleLevelChange(value) {
            this.stateData = this.selectData.stateData[value] || [];
        },
        handleTableData(data) {
            this.tableData = []
            this.loading = true
            data[0][1].forEach((item, index) => {
                this.tableData.push({ wd: data[0][1][index], sd: data[1][1][index], yl: data[2][1][index], fs: data[3][1][index] })
            })
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
            util.post('/system/measurement/windMeasurementAlgorithm', this.formInline)
                .then(response => {
                    // 处理POST请求的响应
                    if (response && response.code === 200) {
                        // 请求成功的处理逻辑
                        console.log('请求成功');
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
        },
        // 获取算法计算初始数据
        postBegain(data) {
            util.post('/get/ac/data', data)
                .then(response => {
                    // 处理POST请求的响应
                    if (response && response.code === 200) {
                        // 请求成功的处理逻辑
                        console.log('请求成功');
                        // 发送数据给左右两边进行渲染
                        this.$bus.$emit('windData', response.rows)
                        this.handleTableData(response.rows[2].data)
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
        // 获取下拉框数据
        getSelect() {
            util.get('/system/data/info/list')
                .then(response => {
                    // 处理POST请求的响应
                    if (response && response.code === 200) {
                        // 请求成功的处理逻辑
                        console.log('请求成功');
                        // this.$message.success('请求成功')
                        this.getSelectData(response.rows)
                    } else {
                        // 请求失败的处理逻辑
                        console.log('请求失败');
                        // this.$message.error('服务器错误')
                    }
                })
                .catch(error => {
                    // 处理POST请求的错误
                    // this.$message.error('GET请求错误')
                    console.log('GET请求错误', error);
                });
        },
        // 确定提交
        onSubmit() {
            if (this.formInline.level != '' &&
                // this.formInline.region != '' &&
                // this.formInline.iP != '' &&
                this.formInline.selectedExtraData != '' &&
                this.formInline.state != '' &&
                this.formInline.model != '') {
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
                selectedExtraData: [],
            }
            this.stateData = []
            this.visiableParams1 = false
            this.visiableParams2 = false
        },
        // 模型选择
        selectModel(data) {
            if (data === 1) {
                this.visiableParams1 = !this.visiableParams1
                this.formInline.modelState = 'GAN模型(训练)'
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
            this.throttledPostBegain(this.getBegainData);
        })
        // 获取下拉框数据
        this.getSelect();
        this.throttledPostBegain(this.getBegainData);
        // this.autoScroll();
    },
    beforeDestroy() {
        // this.autoScroll(true)
    }
}
</script>

<style lang="scss" scoped>
.contain {
    height: 85vh;
    border: 2px solid rgb(153, 196, 248);

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

        .body_center {
            width: 45%;
            height: 100%;
            position: relative;

            .mapChart {
                height: 6%;

                /deep/.el-form--inline .el-form-item {
                    width: 20%;
                }

                /deep/.el-form--inline .el-form-item__content {
                    z-index: 1000;
                }

                /deep/.el-input input {
                    font-size: 1.6vh;
                    border: 1px solid rgb(0, 255, 251);
                    background-color: rgba(0, 255, 251, 0.61);
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
                    border: 1px solid rgb(0, 255, 251);
                    background-color: rgba(0, 255, 251, 0.61);
                }

                /deep/.el-button--primary:focus,
                .el-button--primary:hover {
                    font-weight: bold;
                    border: 1px solid rgb(0, 255, 251);
                    background-color: rgba(21, 255, 0, 0.61);
                }

                /deep/.el-range-editor.el-input__inner {
                    color: #fff;
                    border: 1px solid rgb(0, 255, 251);
                    background-color: rgba(17, 182, 152, 0.671);
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
                height: 64%;
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
