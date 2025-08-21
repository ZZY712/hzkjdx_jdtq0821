<template>
    <div>
        <div class="st_titles">
            <!-- 数据导入及报告导出 -->
            数据导入
        </div>
        <div class="chart-container">
            <div class="ports">
                <div class="formStyle">
                    <el-form :inline="true" :model="formInline" class="demo-form-inline">
                        <el-form-item>
                            <el-select v-model="formInline.model" placeholder="数据模板">
                                <el-option v-for="item in modelData" :key="item.label" :label="item.label"
                                    :value="item.value" @click.native="closeAnther(item.num)"></el-option>
                                <!-- <el-option label="极端天气" value="极端天气" @click.native="closeAnther(1)"></el-option>
                                <el-option label="基础信息表" value="基础信息表" @click.native="closeAnther(2)"></el-option>
                                <el-option label="故障检测" value="故障检测" @click.native="closeAnther(3)"></el-option>
                                <el-option label="天气数据" value="天气数据" @click.native="closeAnther(4)"></el-option> -->
                            </el-select>
                        </el-form-item>
                        <el-button size="small" type="primary" @click="onCancel" plain>重置</el-button>
                        <!-- <el-button size="small" type="primary" @click="submitCom" :class="{ 'highLine': !isBigLoad }"
                            plain>普通文件上传</el-button> -->
                        <!-- <el-button size="small" type="primary" @click="submitBig" :class="{ 'highLine': isBigLoad }"
                            plain>上传文件夹</el-button> -->
                        <!-- <el-button size="small" type="primary" @click="exportbg" plain>报告导出</el-button> -->
                    </el-form>
                </div>
                <div v-if="!isBigLoad" style="display: flex;position: relative">
                    <el-upload ref="upload" style="margin-top: 2%;" class="upload-demo" :drag="true" submit action="#"
                        accept=".xlsx,.xls,.csv" :limit="parseInt('1')" :multiple="true" :before-remove="beforeRemove"
                        :auto-upload="false" :on-exceed="handleExceed" :file-list="fileList" :on-change="handleChange">
                        <!-- <i class="el-icon-upload"></i> -->
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em>
                            <div slot="tip" class="el-upload__text">只能上传xlsx或xls文件，且不超过200MB</div>
                        </div>
                        <div :file-list="fileList" :before-remove="beforeRemove">
                            <div v-for="(file, index) in fileList" :key="index" :file="file" :index="index">
                                <el-tooltip class="item" effect="dark" content="点击删除" placement="top">
                                    <el-icon class="el-icon-close" @click="handleRemove(file, fileList)"></el-icon>
                                </el-tooltip>
                                <img :src="file.url" class="el-upload-list-item-thumbnail" />
                            </div>
                        </div>
                    </el-upload>
                    <el-button size="small" type="primary" style="height: 4vh;position: absolute;top: -4vh;left: 4vw;"
                        @click="submit" plain>上传</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import util from '@/api/generalFormat'
export default {
    components: {
    },
    data() {
        return {
            upfilelist: [],
            fileList: [],
            formFlag: '',
            formNumber: 1,
            isShowFrom: false,
            isBigLoad: false,
            selectData: [],//总体数据
            modelData: [],//模板数据
            levelData: ["省属", "市属"],// 行政等级
            stateData: ["极端天气", "故障检测", "天气数据", "拓扑结构"],// 数据类型
            formInline: {
                model: ''
            },
        };
    },
    methods: {
        // 弹窗管理
        changeVisible() {
            this.fileList = []
            this.dialogVisible = true
            this.helpTipVisible = false
        },
        // 文件上传处理方法
        handleRemove(file, fileList) {
            console.log(file, fileList, '456');
        },
        handlePreview(file) {
            console.log(file, '123');
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file) {
            return this.$confirm(`确定移除 ${file.name}？`);
        },
        // 文件上传前的处理方法
        handleChange(file) {
            // console.log(file.raw, 'file');
            this.upfilelist = [];
            this.upfilelist.push(file.raw);
            const isLt5M = file.size / 1024 / 1024 < 200; // 判断文件大小是否小于2MB
            if (!isLt5M) {
                this.$message.error('文件大小不能超过200MB');
            }
            return isLt5M;
        },
        closeAnther(data) {
            if (data === 2) {
                this.formInline.level = 1
                this.formInline.state = 1
            } else {
                this.formInline.level = ''
                this.formInline.state = ''
            }
        },
        // 提交上传文件
        submit() {
            let formData = new FormData();
            formData.append('file', this.raw);
            let file = {
                file: this.upfilelist,
            }
            if (this.formInline.model != '' &&
                file.file != '') {
                if (this.formFlag || this.formNumber === 1) {
                    this.$message.success('正在上传中')
                    // 导入文件数据
                    util.postFormData('/system/weather/importExcel', file, this.formInline)
                        .then(response => {
                            // 处理POST请求的响应
                            if (response && response.code === 200) {
                                // 请求成功的处理逻辑
                                this.formFlag = response.code
                                console.log(response, '上传成功');
                                this.$message.success('上传成功')
                                // this.$refs.upload.submit();
                            } else {
                                // 请求失败的处理逻辑
                                this.$message.error('服务器错误')
                            }
                            this.formNumber = 1
                        })
                        .catch(error => {
                            // 处理POST请求的错误
                            this.formNumber = 1
                            this.$message.error('POST请求错误')
                            console.log('POST请求错误', error);
                        });
                } else {
                    this.$message.warning('数据处理中，请勿多次提交')
                }
            } else {
                this.$message.warning('传入的参数不能为空')
            }
            // 提交action中的selection接口
            this.$store.dispatch('fetchSelectOptions')
        },
        // 大文件上传
        submitBig() {
            this.isBigLoad = true
        },
        submitCom() {
            this.isBigLoad = false
        },
        // 获取下拉框数据
        getSelectData() {
            util.get('/get/basic_info/data')
                .then(response => {
                    // 处理POST请求的响应
                    if (response && response.code === 200) {
                        this.selectData = response.rows
                        this.modelData = []
                        this.stateData = []
                        this.levelData = []
                        this.selectData.forEach((item) => {
                            switch (item.type) {
                                case "数据类型":
                                    this.modelData.push(
                                        {
                                            label: item.name,
                                            value: item.name,
                                            num: item.label === 1 ? 1 : 2
                                        }
                                    )
                                    this.stateData.push(item.name)
                                    break;
                                case "行政等级":
                                    this.levelData.push(item.name)
                                    break;
                                default:
                                    break;
                            }
                        })
                        // 请求成功的处理逻辑
                    } else {
                        // 请求失败的处理逻辑
                        this.$message.error('服务器错误')
                    }
                })
                .catch(error => {
                    // 处理GET请求的错误
                    this.$message.error('GET请求错误')
                    console.log('GET请求错误', error);
                });
        },
        // 重置选择
        onCancel() {
            this.formInline = {
                model: ''
            }
        },
        // 导出按钮
        exportbg() {
            let obj = JSON.parse(localStorage.getItem('area'))
            // console.log(obj, '导出按钮')
            const url = `/api/pdf_send?region=${obj.region}&district=${obj.district}&datetimes1=${obj.datetimes1}&site=${obj.site}&datetimes_start=${obj.datetimes_start}&datetimes_end=${obj.datetimes_end}`
            this.downloadFile(url, '报告.docx')
        },
        downloadFile(filePath, name) {
            const link = document.createElement('a')
            link.style.display = 'none'
            link.href = filePath
            link.setAttribute('download', name)
            document.body.appendChild(link)
            link.click()
        },

    },
    mounted() {
        this.getSelectData()
    },
    beforeDestroy() {
    }
}
</script>

<style lang="scss" scoped>
.bot {
    width: 100%;
    /* height: 100%; */
    z-index: 999;
    height: 34vh;
    /* padding-bottom: 5.5vh; */
    /* height: 28vh; */
}

.st_titles {
    background-size: 100% 107%;
    background-repeat: no-repeat;
    background-image: url('../assets/img/ch/item_new.png');
}

.chart-container {
    position: relative;
    height: calc(100% - 4vh);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-image: url('../assets/img/ch/chbg_new.png');
    transform: translateX(-50%);
    animation-name: moveRight;
    animation-duration: 1.5s;
    animation-fill-mode: forwards;

    .ports {
        position: absolute;
        color: #fff;
        cursor: pointer;
        top: 0vw;
        left: 0vw;
        width: 100%;

        .formStyle {
            .highLine {
                background: #009aff !important;
            }

            /deep/.el-form--inline .el-form-item {
                width: 100%;
            }

            /deep/.el-input input {
                font-size: 1.6vh;
                border: 1px solid rgba(31, 91, 193, 1);
                background-color: rgba(14, 39, 84, 0.68);
            }

            /deep/.el-input input:hover {
                font-size: 1.6vh;
                border: 1px solid rgba(31, 91, 193, 1);
                background-color: #04f956d8;
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
        }

        /deep/ .el-upload-dragger {
            background-color: rgba(32, 86, 131, 0.8);
            border-radius: 0.6vw;
            width: 8vw;
            height: 10vh;
        }

        /deep/ .el-upload-dragger .el-upload__text {
            color: #fff;
            font-size: 0.68vw;
        }

        /deep/ .el-upload-list__item {
            // font-size: 0.8vw;
            // font-weight: bold;
            line-height: 1vw;
            background-color: rgba(32, 86, 131, 0.3);
            margin-left: 0vw;
            margin-top: 0.5vw;
            width: 8vw;
            border: 1px solid rgba(31, 91, 193, 1);
        }

        /deep/ .el-icon-close {
            display: inline-block;
            color: #04f2f9;
            top: 0.1vw;
            right: 0.1vw;
        }


        /deep/ .el-upload-list__item-name [class^=el-icon] {
            color: #fff;
        }

        /deep/ .el-upload-list__item {
            color: #fff;
        }

        /deep/ .el-upload-list__item-name {
            color: #fff;
        }

        /deep/ .el-button--small {
            font-size: 0.8vw;
            font-weight: bold;
            margin-left: 2vh;
            padding: 1vh;
            border-radius: 0.2vw;
        }

        /deep/.el-button--primary.is-plain {
            color: #fff;
            background: #fff0;
            border: 1px solid rgba(31, 91, 193, 1);
        }

        /deep/.el-button--primary.is-plain:hover {
            background: #04f2f9;
        }

        /deep/.el-radio {
            margin-right: 1.2vw;
            color: #fff;
            background-color: rgba(32, 86, 131, 0.3);
        }

        /deep/ .el-radio__label {
            padding-left: -0.2vw;
            font-size: 0.8vw;
        }

        /deep/ .el-radio.is-bordered {
            padding: 0.6vw 0.6vw 0 0.6vw;
            border-radius: 0.6vw;
            font-size: 0.8vw;
            height: 4vh;
            // width: 8vw;
        }

        /deep/.el-radio.is-bordered.is-checked {
            border-color: #04f2f9;
        }


        /deep/.el-radio__input.is-checked+.el-radio__label {
            color: #04f2f9;
        }

        /deep/.el-radio__input.is-checked .el-radio__inner {
            background-color: #04f2f9;
            background: #04f2f9;
        }

    }
}

/* .chartclass{

} */
</style>