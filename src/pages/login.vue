<template>
    <div class="login">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
            <div class="title">城市配电网智能态势评估和风险主动防御全景巡航平台</div>
            <el-form-item prop="username">
                <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号"
                    prefix-icon="el-icon-user">
                    <!-- <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" /> -->
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码"
                    prefix-icon="el-icon-lock" show-password @keyup.enter.native="handleLogin">
                    <!-- <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" /> -->
                </el-input>
            </el-form-item>
            <el-form-item prop="code" v-if="captchaEnabled">
                <el-input v-model="loginForm.code" auto-complete="off" placeholder="验证码" style="width: 63%"
                    @keyup.enter.native="handleLogin">
                    <!-- <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" /> -->
                </el-input>
                <div class="login-code">
                    <img :src="codeUrl" @click="getCode" class="login-code-img" />
                </div>
            </el-form-item>
            <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
            <el-form-item style="width:100%;">
                <el-button :loading="loading" size="medium" type="primary" style="width:100%;"
                    @click.native.prevent="handleLogin">
                    <span v-if="!loading">登 录</span>
                    <span v-else>登 录 中...</span>
                </el-button>
                <div style="float: right;" v-if="register">
                    <router-link class="link-type" :to="'/register'">立即注册</router-link>
                </div>
            </el-form-item>
        </el-form>
        <!--  底部  -->
        <div class="el-login-footer">
            <!-- <span>Copyright © 2018-2024 ruoyi.vip All Rights Reserved.</span> -->
        </div>
    </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'
export default {
    name: "Login",
    data() {
        var validatePassword = (rule, value, callback) => {
            if (value !== '') {
                if (value.length < 8) {
                    callback(new Error('请输入至少8位的密码'))
                    return false
                } else {
                    callback()
                }
            }
        }
        return {
            codeUrl: "",
            loginForm: {
                username: "",
                password: "",
                rememberMe: false,
                code: "",
                uuid: ""
            },
            loginRules: {
                username: [
                    { required: true, trigger: "blur", message: "请输入您的账号" }
                ],
                password: [
                    { required: true, message: '请输入您的密码', trigger: 'blur' },
                    { validator: validatePassword, trigger: 'blur' }
                ],
                code: [{ required: true, trigger: "change", message: "请输入验证码" }]
            },
            loading: false,
            // 验证码开关
            captchaEnabled: true,
            // 注册开关
            register: false,
            redirect: undefined
        };
    },
    watch: {
        $route: {
            handler: function (route) {
                this.redirect = route.query && route.query.redirect;
            },
            immediate: true
        }
    },
    created() {
        this.getCode();
        this.getCookie();
    },
    methods: {
        getCurrentTime() {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            const strDate = now.getDate();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const currentSecond = now.getSeconds();
            return `${year}-${this.padZero(month)}-${this.padZero(strDate)} ${this.padZero(currentHour)}:${this.padZero(currentMinute)}:${this.padZero(currentSecond)}`;
        },
        padZero(value) {
            // 辅助函数用于确保数字始终有两位，例如：2 -> "02"
            return value < 10 ? `0${value}` : value;
        },
        getCode() {
            getCodeImg().then(res => {
                this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled;
                if (this.captchaEnabled) {
                    this.codeUrl = "data:image/gif;base64," + res.img;
                    this.loginForm.uuid = res.uuid;
                }
            });
        },
        getCookie() {
            const username = Cookies.get("username");
            const password = Cookies.get("password");
            const rememberMe = Cookies.get('rememberMe')
            this.loginForm = {
                username: username === undefined ? this.loginForm.username : username,
                password: password === undefined ? this.loginForm.password : decrypt(password),
                rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
            };
        },
        handleLogin() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.loading = true;
                    if (this.loginForm.rememberMe) {
                        Cookies.set("username", this.loginForm.username, { expires: 30 });
                        Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
                        Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
                        Cookies.set('loginTime', this.getCurrentTime(), { expires: 30 });
                    } else {
                        Cookies.remove("username");
                        Cookies.remove("password");
                        Cookies.remove('rememberMe');
                    }
                    if (this.loginForm.username === 'admin' && this.loginForm.password === 'admin123') {
                        this.$store.dispatch("Login", this.loginForm).then(() => {
                            this.$router.push("/main").catch(() => { });
                        }).catch(() => {
                            this.loading = false;
                            if (this.captchaEnabled) {
                                this.getCode();
                            }
                        });
                    } else {
                        this.loading = false;
                        this.$message.error("账号或密码错误")
                    }
                }
            });
        }
    }
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
}

.title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #707070;
    font-weight: bold;
    font-size: 16.5px;
}

.login-form {
    border-radius: 12px;
    background: #ffffff;
    width: 400px;
    padding: 25px 25px 5px 25px;
    box-shadow: 0 0 1.302vw #f885ff;

    .el-input {
        height: 38px;

        input {
            height: 38px;
        }
    }

    .input-icon {
        height: 39px;
        width: 14px;
        margin-left: 2px;
    }
}

.login-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
}

.login-code {
    width: 33%;
    height: 38px;
    float: right;

    img {
        cursor: pointer;
        vertical-align: middle;
    }
}

.el-login-footer {
    height: 40px;
    line-height: 40px;
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #fff;
    font-family: Arial;
    font-size: 12px;
    letter-spacing: 1px;
}

.login-code-img {
    height: 38px;
}
</style>
