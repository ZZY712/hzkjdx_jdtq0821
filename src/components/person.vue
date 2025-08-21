<template>
    <div class="person-info" @click.self="closeDialog">
        <p class="closeicon" @click="closeDialog">
            <i style="color:rgb(0, 0, 0);font-size: 20px;" class="el-icon-circle-close"></i>
        </p>
        <ul>
            <li><strong>账号:</strong> {{ account }}</li>
            <li><strong>登录时间:</strong> {{ loginTime }}</li>
        </ul>
    </div>
</template>

<script>
import Cookies from "js-cookie";
export default {
    data() {
        return {
            account: '', // 用户账号
            loginTime: '', // 登录时间
        };
    },
    created() {
        this.getUserInfo();
    },
    methods: {
        getUserInfo() {
            this.account = Cookies.get("username");
            this.loginTime = Cookies.get("loginTime")
        },
        closeDialog() {
            this.$parent.closeDialog()
        },
    },
};
</script>

<style lang="scss" scoped>
.person-info {
    position: fixed;
    right: 3vw;
    top: 6vh;
    z-index: 999;
    background: rgb(255, 255, 255);
    border: 0.5vh solid #a534de77;
    border-radius: 1vh;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: moveDown 0.5s forwards;
    color: rgb(0, 0, 0);

    .closeicon {
        position: absolute;
        right: 10px;
        top: 2px;
        cursor: pointer;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    strong {
        font-weight: bold;
    }
}
</style>
