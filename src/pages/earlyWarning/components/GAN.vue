<template>
    <div>
        <div v-if="dialogVisiable">
            <div class="maxdialog">
                <div class="dialog">
                    <div class="dialog_body">
                        <div class="dialog_title">GAN模型参数选择</div>
                        <div class="body_main">
                            <el-form ref="form" :model="form" :rules="formRules" label-width="6vw">
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="训练次数" prop="nEpochs">
                                            <el-input v-model="form.nEpochs" placeholder=""></el-input>
                                        </el-form-item>
                                        <el-form-item label="处理数据批次大小" prop="batchSize">
                                            <el-input v-model="form.batchSize" placeholder=""></el-input>
                                        </el-form-item>
                                        <el-form-item label="学习率" prop="lr">
                                            <el-input v-model="form.lr" placeholder=""></el-input>
                                        </el-form-item>
                                        <el-form-item label="Adam 优化器梯度的指数衰减率" prop="b1">
                                            <el-input v-model="form.b1" placeholder=""></el-input>
                                        </el-form-item>
                                        <el-form-item label="Adam 优化器梯度平方的指数衰减率" prop="b2">
                                            <el-input v-model="form.b2" placeholder=""></el-input>
                                        </el-form-item>
                                        <el-form-item label="潜在维度" prop="latentDim">
                                            <el-input v-model="form.latentDim" placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="特征维度" prop="featDim">
                                            <el-input v-model="form.featDim" placeholder=""></el-input>
                                        </el-form-item>
                                        <el-form-item label="图像维度大小" prop="lookback">
                                            <el-input v-model="form.lookback" placeholder=""></el-input>
                                        </el-form-item>
                                        <el-form-item label="判别器训练次数" prop="nCritic">
                                            <el-input v-model="form.nCritic" placeholder=""></el-input>
                                        </el-form-item>
                                        <el-form-item label="判别器的权重范围" prop="clipValue">
                                            <el-input v-model="form.clipValue" placeholder=""></el-input>
                                        </el-form-item>
                                        <el-form-item label="采样间隔" prop="sampleInterval">
                                            <el-input v-model="form.sampleInterval" placeholder=""></el-input>
                                        </el-form-item>
                                        <!-- <el-form-item label="多选框" prop="selectedExtraData">
                                            <el-select v-model="form.selectedExtraData" multiple placeholder="请选择">
                                                <el-option v-for="item in extraData" :key="item" :label="item"
                                                    :value="item"></el-option>
                                            </el-select>
                                        </el-form-item> -->
                                    </el-col>
                                </el-row>
                            </el-form>
                        </div>
                        <div class="dialog_buttons">
                            <el-button size="small" plain type="primary" @click="confirmTrue">确定</el-button>
                            <el-button size="small" plain type="primary" @click="resetForm">重置</el-button>
                            <el-button size="small" plain type="primary" @click="comExplain">说明</el-button>
                            <el-button size="small" plain type="primary" @click="closeDialog">退出</el-button>
                        </div>
                        <div v-if="isExplain">
                            <div class="explain">
                                <div v-for="(value, key, index) of form" :key="index">
                                    <p style="color: #fff">{{ key }}:{{ explains[index] }},默认值:{{ value }}</p>
                                </div>
                                <p
                                    style="color: #fff;font-size: 1.8vh;font-weight: bold;margin-top: 1vh;border-top: 2px solid red">
                                    GAN算法简介： GAN的全称是Generative
                                    adversarial
                                    network，即生成对抗网络。生成对抗网络是两个网络的组合：生成网络(Generator)负责生成模拟数据；判别网络(Discriminator)负责判断输入的数据是真实的还是生成的。生成网络要不断优化自己生成的数据让判别网络判断不出来，判别网络也要优化自己让自己判断得更准确。二者关系形成对抗，因此叫对抗网络。
                                </p>
                                <i class="el-icon-arrow-left"
                                    style="color: #00fdff;top: -1%;right: -4%;position: absolute;font-size: 3vh;border-radius: 0vh 1.2vh 1.2vh 0vh;"
                                    @click="close"></i>
                            </div>
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
        visiableParams1: Boolean,
    },
    data() {
        return {
            form: this.getDefaultFormData(),
            // extraData: [],
            formRules: {},
            isExplain: false,
            dialogVisiable: false,
            explains: [
                '所有样本训练次数',
                '表示单次传递给程序用以训练的数据（样本）个数',
                '学习率',
                'b1',
                'b2',
                '表示潜空间的维度',
                '特征向量的维度',
                '进行时间序列预测时，模型需要考虑多少个时间步之前的数据',
                '客观赋权法',
                '用于控制梯度裁剪',
                '采样间隔',
            ]
        }
    },
    mounted() {

    },
    watch: {
        visiableParams1(val) {
            this.dialogVisiable = val;
        },
    },
    created() {
        this.generateFormRules();
    },
    methods: {
        getDefaultFormData() {
            return {
                nEpochs: 200,
                batchSize: 64,
                lr: 0.0002,
                b1: 0.5,
                b2: 0.999,
                latentDim: 100,
                featDim: 4,
                lookback: 5,
                nCritic: 5,
                clipValue: 0.01,
                sampleInterval: 400,
                // selectedExtraData: [],
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
                if (key !== 'selectedExtraData') {
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
                        if (key !== 'selectedExtraData') {
                            this.form[key] = parseFloat(this.form[key])
                        }
                    });
                    this.$emit('GANDATA', this.form);
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
        sfExplain() {

        },
        comExplain() {
            if (this.isExplain) { this.isExplain = false }
            this.isExplain = !this.isExplain
        },
        close() {
            this.isExplain = false
        },
        closeDialog() {
            this.$parent.visiableParams1 = false;
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
                height: 49vh;
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
                    font-size: 1.1vh;
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

            .explain {
                position: absolute;
                top: 2.5vh;
                left: 100%;
                border: 2px solid #00ffbfab;
                width: 40%;
                height: 46vh;
                background: #49d2f1d9;
                cursor: pointer;
                overflow: auto;
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
