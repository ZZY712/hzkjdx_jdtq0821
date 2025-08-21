<template>
    <div>
        <div class="returnHome">
            <!-- <div @click="openTopology()" class="topology">
                <img src="@/assets/img/jiduan/tuopu1.png" alt="" style="height: 3vh;width: 3vh;">
            </div> -->
            <div class="buttonHome" @click="returnHome()"><i class="el-icon-close"></i></div>
        </div>
        <!-- <suspensionTopology :topologyId="'suspensionTopology'" :isShow="isShow" /> -->
        <iframe :src="'unity/index.html' + anchorVal" class="unityContainer" />
    </div>
</template>
<script>
// import suspensionTopology from '@/pages/home/suspensionTopology.vue'
export default {
    components: {
        // suspensionTopology
    },
    data() {
        return {
            isShow: false,
            anchorVal: '#?default'
        }
    },
    created() {
        this.anchorVal = window.location.hash || this.anchorVal
    },
    methods: {
        openTopology() {
            this.isShow = !this.isShow
        },
        returnHome() {
            this.$bus.$emit('returnHome')
        }
    },
    mounted() {
    },
    beforeDestroy() {
    },
}
</script>

<style lang="scss" scoped>
.returnHome {
    // width: 100%;
    display: flex;
    position: absolute;
    right: 1%;
    top: 1%;
    z-index: 99999;

    .topology {
        padding: 0.5vh 1.2vh;
        background-color: rgb(2, 80, 74);
        border-radius: 1vh;
    }

    .topology:hover {
        cursor: pointer;
        background-color: rgb(23, 252, 126);
    }

    .buttonHome {
        text-decoration: none;
        background-color: rgb(2, 80, 74);
        color: #fff;
        border-radius: 1vh;
        padding: 0.5vh 1.2vh;
        font-size: 2.8vh;
        font-weight: bold;
        transition: background-color 0.3s;
    }

    .buttonHome:hover {
        cursor: pointer;
        background-color: rgb(23, 252, 126);
    }
}

.unityContainer {
    position: fixed;
    top: 0.5%;
    left: 0.5%;
    height: 99%;
    width: 99%;
    z-index: 9999;
    // margin-left: 50vw;
    // transform: translateX(-50%);
    // margin-top: 12vh;
    // width: 48vw;
    // height: 62vh;
}
</style>