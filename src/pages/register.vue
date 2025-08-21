<template>
    <div class="login">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
            <div class="title">城市配电网智能态势评估和风险主动防御全景巡航平台</div>
            <el-form-item label="" prop="name"><el-input type="text" autocomplete="off" v-model="ruleForm.name"
                    prefix-icon="el-icon-user-solid" placeholder="请输入用户名"></el-input></el-form-item>
            <el-form-item label="" prop="pass"><el-input type="password" autocomplete="off" v-model="ruleForm.pass"
                    prefix-icon="el-icon-lock" placeholder="请输入密码"></el-input></el-form-item>
            <el-form-item label="" prop="checkPass"><el-input type="password" autocomplete="off"
                    v-model="ruleForm.checkPass" prefix-icon="el-icon-lock"
                    placeholder="请输入密码"></el-input></el-form-item>
            <el-form-item class="btns">
                <el-button type="primary" @click="submitForm('ruleForm')">注册</el-button>
                <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
            </el-form-item>
            <div style="float: right;">
                <router-link class="link-type" :to="'/login'">立即登录</router-link>
            </div>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入密码"));
            } else {
                if (this.ruleForm.checkPass !== "") {
                    this.$refs.ruleForm.validateField("checkPass");
                }
                callback();
            }
        };

        var validatePass2 = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请再次输入密码"));
            } else if (value !== this.ruleForm.pass) {
                callback(new Error("两次输入密码不一致!"));
            } else {
                callback();
            }
        };

        return {
            activeName: "second",
            ruleForm: {
                name: "",
                pass: "",
                checkPass: "",
            },
            rules: {
                name: [
                    { required: true, message: "请输入您的名称", trigger: "blur" },
                    { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" },
                ],
                pass: [{ required: true, validator: validatePass, trigger: "blur" }],
                checkPass: [
                    { required: true, validator: validatePass2, trigger: "blur" },
                ],
            },
        };
    },

    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$message({
                        type: "success",
                        message: "注册成功",
                    });
                    // this.activeName: 'first',
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },

        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
    },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    //background-image: url("../assets/images/login-background.jpg");
    background-image: url('../assets/img/jiduan/daping_bgimg.jpg');
    background-size: cover;

    .title {
        margin: 0px auto 30px auto;
        text-align: center;
        color: #707070;
        font-weight: bold;
        font-size: 16.5px;
    }

    /deep/.el-button--primary {
        width: 48%;
        font-size: 1.2vh;
        border-radius: 0.78125vw;
    }
}
</style>