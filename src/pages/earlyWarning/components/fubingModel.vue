<template>
    <div>
        <div v-if="dialogVisiable">
            <div class="maxdialog">
                <div class="dialog">
                    <div class="dialog_body">
                        <div class="dialog_title">覆冰预测模型</div>
                        <div class="body_main">
                            <el-form ref="form" :model="form" :rules="formRules" label-width="6vw">
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label=" 嵌入维度" prop="embed_dim">
                                            <el-input v-model="form.embed_dim" placeholder=""></el-input>
                                        </el-form-item>
                                        <el-form-item label="多头注意力头数" prop="num_heads">
                                            <el-input v-model="form.num_heads" placeholder=""></el-input>
                                        </el-form-item>
                                        <el-form-item label="前馈网络维度" prop="ff_dim">
                                            <el-input v-model="form.ff_dim" placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="训练集占比" prop="train_ratio">
                                            <el-input v-model="form.train_ratio" placeholder=""></el-input>
                                        </el-form-item>
                                        <el-form-item label="学习率" prop="lr">
                                            <el-input v-model="form.lr" placeholder=""></el-input>
                                        </el-form-item>
                                        <el-form-item label=" 训练次数" prop="epochs">
                                            <el-input v-model="form.epochs" placeholder=""></el-input>
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
        visiableParams3: Boolean,
        fubingData: Object,
    },
    data() {
        return {
            form: {},
            // extraData: [],
            formRules: {},
            dialogVisiable: false,
        }
    },
    mounted() {

    },
    watch: {
        visiableParams3(val) {
            this.dialogVisiable = val;
        },
        fubingData(data) {
            this.form = data
            this.generateFormRules()
        }
    },
    created() {
    },
    methods: {
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
                if (key !== 'MSE') {
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
                        if (key !== 'MSE') {
                            this.form[key] = parseFloat(this.form[key])
                        }
                    });
                    this.$emit('FUBINGDATA', this.form);
                    this.$notify({ title: '成功', message: '模型参数保存成功', type: 'success' });
                    this.closeDialog();
                } else {
                    this.$notify.error({ title: '错误', message: '提交失败' });
                }
            });
        },
        resetForm() {
            this.form = this.getDefaultFormData();
        },
        closeDialog() {
            this.$parent.visiableParams3 = false;
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
    z-index: 2001;
    display: flex;
    align-items: center;
    justify-content: center;

    .dialog {
        position: fixed;
        left: 38vw;
        top: 28vh;
        z-index: 999;
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
            height: 50vh;

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
                    font-size: 1.6vh;
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
