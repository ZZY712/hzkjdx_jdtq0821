<template>
    <div>
        <div v-if="dialogVisiable">
            <div class="maxdialog">
                <div class="dialog">
                    <div class="dialog_body">
                        <div class="dialog_title">风速预测模型参数选择</div>
                        <div class="body_main">
                            <el-form ref="form" :model="form" :rules="formRules" label-width="6.5vw">
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="TCN时间步长" prop="tcn_time_steps">
                                            <el-input v-model="form.tcn_time_steps" placeholder=""></el-input>
                                        </el-form-item>
                                        <el-form-item label="TCN训练集划分比例" prop="tcn_train_ratio">
                                            <el-input v-model="form.tcn_train_ratio" placeholder=""></el-input>
                                        </el-form-item>
                                        <el-form-item label="TCN验证集划分比例" prop="tcn_vaild_ratio">
                                            <el-input v-model="form.tcn_vaild_ratio" placeholder=""></el-input>
                                        </el-form-item>
                                        <el-form-item label="TCN通道数" prop="tcn_num_channels">
                                            <el-input v-model="form.tcn_num_channels" placeholder=""></el-input>
                                        </el-form-item>
                                        <el-form-item label="TCN处理数据批次大小" prop="tcn_batch_size">
                                            <el-input v-model="form.tcn_batch_size" placeholder=""></el-input>
                                        </el-form-item>
                                        <el-form-item label="TCN学习率" prop="tcn_lr">
                                            <el-input v-model="form.tcn_lr" placeholder=""></el-input>
                                        </el-form-item>
                                        <el-form-item label="TCN训练次数" prop="tcn_epoch">
                                            <el-input v-model="form.tcn_epoch" placeholder=""></el-input>
                                        </el-form-item>
                                        <el-form-item label="LSTM隐藏层" prop="lstm_units">
                                            <el-input v-model="form.lstm_units" placeholder=""></el-input>
                                        </el-form-item>
                                        <el-form-item label="LSTM训练次数" prop="lstm_epochs">
                                            <el-input v-model="form.lstm_epochs" placeholder=""></el-input>
                                        </el-form-item>
                                        <el-form-item label="LSTM处理数据批次大小" prop="lstm_batch_size">
                                            <el-input v-model="form.lstm_batch_size" placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="LSTM训练集划分比例" prop="lstm_train_ratio">
                                            <el-input v-model="form.lstm_train_ratio" placeholder=""></el-input>
                                        </el-form-item>
                                        <el-form-item label="LSTM序列长度" prop="lstm_seq">
                                            <el-input v-model="form.lstm_seq" placeholder=""></el-input>
                                        </el-form-item>
                                        <el-form-item label="LSTM Dropout层随机设置" prop=" lstm_Dropout">
                                            <el-input v-model="form.lstm_Dropout" placeholder=""></el-input>
                                        </el-form-item>
                                        <el-form-item label="VDM惩罚因子" prop="vdm_alpha">
                                            <el-input v-model="form.vdm_alpha" placeholder=""></el-input>
                                        </el-form-item>
                                        <el-form-item label="VDM保真系数" prop="vdm_tau">
                                            <el-input v-model="form.vdm_tau" placeholder=""></el-input>
                                        </el-form-item>
                                        <el-form-item label="VDM序列分解个数" prop="vdm_K">
                                            <el-input v-model="form.vdm_K" placeholder=""></el-input>
                                        </el-form-item>
                                        <el-form-item label="VDM 是否强制移除信号中的直流分量" prop="vdm_DC">
                                            <el-select v-model="form.vdm_DC" placeholder="">
                                                <el-option label="0-不强制移除信号中的直流分量" value="0"></el-option>
                                                <el-option label="1-强制移除信号中的直流分量" value="1"></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="VDM 模态频率的初始值" prop="vdm_init">
                                            <el-select v-model="form.vdm_init" placeholder="">
                                                <el-option label="0-所有模态的初始频率都设置为零" value="0"></el-option>
                                                <el-option label="1-模态频率在均匀分布中随机初始化" value="1"></el-option>
                                                <el-option label="2-模态频率在随机分布中随机初始化" value="2"></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="停止收敛条件" prop="vdm_tol">
                                            <el-input v-model="form.vdm_tol" placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </div>
                        <div class="dialog_buttons">
                            <el-button size="small" plain type="primary" @click="confirmTrue">确定</el-button>
                            <el-button size="small" plain type="primary" @click="resetForm">重置</el-button>
                            <el-button size="small" plain type="primary" @click="closeDialog">退出</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        visiableParams2: Boolean,
    },
    data() {
        return {
            form: this.getDefaultFormData(),
            extraData: [],
            formRules: {},
            dialogVisiable: false,
        }
    },
    mounted() {
    },
    watch: {
        visiableParams2(val) {
            this.dialogVisiable = val;
        },
    },
    created() {
        this.generateFormRules();
    },
    methods: {
        getDefaultFormData() {
            return {
                tcn_time_steps: 16,
                tcn_train_ratio: 0.7,
                tcn_vaild_ratio: 0.1,
                tcn_batch_size: 128,
                tcn_num_channels: '[16, 16, 16]',
                tcn_lr: 0.001,
                tcn_epoch: 2,

                lstm_units: 128,
                lstm_epochs: 1,
                lstm_batch_size: 32,
                lstm_train_ratio: 0.8,
                lstm_seq: 16,
                lstm_Dropout: 0.5,

                vdm_alpha: 2000,
                vdm_tau: 0.0,
                vdm_K: 6,
                vdm_DC: 0,
                vdm_init: 1,
                vdm_tol: '0.0000001', // 将 tol 初始化为字符串
                selectedExtraData: [],
            };
        },
        generateFormRules() {
            var valiNumberPass1 = (rule, value, callback) => {//包含小数的数字
                let reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g;
                if (value === '') {
                    callback(new Error('请输入内容'));
                } else if (!reg.test(value)) {
                    callback(new Error('请输入数字'));
                } else {
                    callback();
                }
            };
            Object.keys(this.form).forEach(key => {
                if (key !== 'selectedExtraData' && key !== 'tcn_num_channels') {
                    const requiredRule = { required: true, message: `请输入${key}`, trigger: 'blur' };
                    const numberRule = { validator: valiNumberPass1, message: `${key}必须为数字值`, trigger: 'blur' };
                    this.$set(this.formRules, key, [requiredRule, numberRule]);
                }
            });
        },
        confirmTrue() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    Object.keys(this.form).forEach(key => {
                        if (key !== 'selectedExtraData' && key !== 'tcn_num_channels') {
                            this.form[key] = parseFloat(this.form[key])
                        }
                    });
                    let form = {
                        tcn_time_steps: this.form.tcn_time_steps,
                        tcn_train_ratio: this.form.tcn_train_ratio,
                        tcn_vaild_ratio: this.form.tcn_vaild_ratio,
                        tcn_batch_size: this.form.tcn_batch_size,
                        tcn_num_channels: this.form.tcn_num_channels,
                        tcn_lr: this.form.tcn_lr,
                        tcn_epoch: this.form.tcn_epoch,
                        lstm_units: this.form.lstm_units,
                        lstm_epochs: this.form.lstm_epochs,
                        lstm_batch_size: this.form.lstm_batch_size,
                        lstm_train_ratio: this.form.lstm_train_ratio,
                        lstm_seq: this.form.lstm_seq,
                        lstm_Dropout: this.form.lstm_Dropout,
                        vdm_alpha: this.form.vdm_alpha,
                        vdm_tau: this.form.vdm_tau,
                        vdm_K: this.form.vdm_K,
                        vdm_DC: this.form.vdm_DC,
                        vdm_init: this.form.vdm_init,
                        vdm_tol: parseFloat(this.form.vdm_tol),
                        selectedExtraData: this.form.selectedExtraData,
                    }
                    this.$emit('YUCEDATA', form);
                    this.form.vdm_tol = this.scientificNotationToString(this.form.vdm_tol); // 将 tol 转换为字符串
                    this.$notify({ title: '成功', message: '模型参数保存成功', type: 'success' });
                    this.closeDialog();
                } else {
                    this.$notify.error({ title: '错误', message: '提交失败' });
                }
            });
        },
        // 定义一个函数来处理科学计数法
        scientificNotationToString(param) {
            let strParam = String(param);
            let flag = /e/.test(strParam);
            if (!flag) return param;

            // 检查指数符号是正还是负
            let sysbol = true;
            if (/e-/.test(strParam)) {
                sysbol = false;
            }

            // 获取指数和基数
            let index = Number(strParam.match(/\d+$/)[0]);
            let basis = strParam.match(/^[\d\\.]+/)[0].replace(/\./, '');

            // 根据指数符号转换
            if (sysbol) {
                return basis.padEnd(index + 1, '0');
            } else {
                return basis.padStart(index + basis.length, '0').replace(/^0/, '0.');
            }
        },
        resetForm() {
            this.form = this.getDefaultFormData();
        },
        closeDialog() {
            this.$parent.visiableParams2 = false;
        },
    },
};
</script>

<style lang="scss" scoped>
.maxdialog {
    width: 100vw;
    height: 100vh;
    background: #333333db;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1001;
    display: flex;
    align-items: center;
    justify-content: center;

    .dialog {
        position: fixed;
        left: 38vw;
        top: 28vh;
        z-index: 2001;
        background: rgba(64, 160, 255, 0.73);
        border: 0.5vh solid #74d518;
        border-radius: 1vh;
        padding-bottom: 2vh;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: moveDown 0.5s forwards;

        .dialog_body {
            position: relative;
            width: 32vw;
            height: 60vh;

            .dialog_title {
                text-align: center;
                font-size: 2vh;
                font-weight: bold;
                color: #fff;
                margin-bottom: 1.2vh;
                border-bottom: 2px solid #74d518;
            }

            .body_main {
                width: 100%;
                height: 50vh;
                overflow-y: auto;
                overflow-x: hidden;

                &::-webkit-scrollbar {
                    width: 4px;
                }

                &::-webkit-scrollbar-thumb {
                    background: #4f668e;
                    border-radius: 4px;
                }

                &::-webkit-scrollbar-track {
                    background: #525579;
                    border-radius: 4px;
                }

                /deep/.el-input input {
                    font-size: 1.4vh;
                    border: 1px solid rgb(0, 255, 251);
                    background-color: rgba(17, 182, 152, 0.671);
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

                /deep/.el-form-item {
                    width: 90%;
                }

                /deep/.el-form-item__label {
                    color: #fff;
                }

                /deep/.el-form-item__error {
                    font-weight: bold;
                    z-index: 1000;
                }
            }

            .dialog_buttons {
                position: absolute;
                right: 2vw;
                bottom: 0vh;

                .el-button--primary {
                    color: #fff;
                    font-weight: bold;
                    border: 1px solid rgb(0, 255, 251);
                    background-color: rgba(0, 255, 251, 0.61);

                    &:focus,
                    &:hover {
                        font-weight: bold;
                        border: 1px solid rgb(0, 255, 251);
                        background-color: rgba(21, 255, 0, 0.61);
                    }
                }
            }
        }
    }
}

@keyframes moveDown {
    0% {
        transform: translateY(-100%);
    }

    100% {
        transform: translateY(0);
    }
}
</style>
