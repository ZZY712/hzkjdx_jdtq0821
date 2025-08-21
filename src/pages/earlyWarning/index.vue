<template>
  <div class="home">
    <functionMenu @LABLENAME="changeLableName" />
    <el-container>
      <el-header>
        <div class="returnHome">
          <router-link to="/main">
            <img width="100%" height="100%" src="../../assets/img/ch/shouye.png" alt="">
          </router-link>
        </div>
        <div class="main_top">
          <div class="left">
            <img width="100%" height="90%" src="../../assets/img/ch/dingbubeijing_new.png" alt="">
            <img style="position: absolute;left: 5%;top: 29%;" width="90%" height="25%"
              src="../../assets/img/ch/ceshi.webp" alt="">
            <div class="alltitle">
              城市配电网智能态势评估和风险主动防御全景巡航平台
            </div>
            <div class="alltitleChild">
              {{ labelName }}
            </div>
          </div>
        </div>
        <div class="listStyle" @click="taskQueue">
          <a>
            任务进程
          </a>
        </div>
      </el-header>
      <el-container>
        <el-aside>
        </el-aside>
        <el-main>
          <!-- <keep-alive>
            <router-view></router-view>
          </keep-alive> -->
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive"></router-view>
        </el-main>
      </el-container>
    </el-container>
    <queue :visiableQueue="visiableQueue" :toolGroups="toolGroups" ref='queueData'></queue>
  </div>
</template>

<script>
import queue from '@/pages/earlyWarning/components/queue.vue'
import functionMenu from '@/components/functionMenu.vue'
export default {
  components: {
    queue,
    functionMenu
  },
  data() {
    return {
      labelName: '',
      toolGroups: [
        [{ imgSrc: require("@/assets/img/jiduan/yujing1.png"), show: false, label: "极端天气识别预警", path: '/yujing' },],
        [{ imgSrc: require("@/assets/img/jiduan/zhuangtaipinggu.png"), show: false, label: "风险评估", path: '/pingu' },],
        [{ imgSrc: require("@/assets/img/jiduan/fengxianyujing.png"), show: false, label: "风险预警", path: '/yujing_warning' },],
        [{ imgSrc: require("@/assets/img/jiduan/guzhangzhenduan.png"), show: false, label: "故障诊断", path: '/zhenduan' },],
        [{ imgSrc: require("@/assets/img/jiduan/shenduronghe.png"), show: false, label: "小样本增广", path: '/deeplyIntegrated' },],
        [{ imgSrc: require("@/assets/img/jiduan/shenduronghe.png"), show: false, label: "下一任务-应急调度", path: '/topology' },],
        [{ imgSrc: require("@/assets/img/jiduan/shenduronghe.png"), show: false, label: "主 界 面", path: '/main' },],
      ],
      visiableQueue: false,
    }
  },
  computed: {
  },
  methods: {
    changeLableName(value) {
      this.visiableQueue = false
      switch (value) {
        case '/yujing':
          this.labelName = '极端天气灾害智能临近识别与预测预警'
          break;
        case '/pingu':
          this.labelName = '极端天气灾害与配电网风险的态势智能评估'
          break;
        case '/yujing_warning':
          this.labelName = '配电网停电风险智能预警'
          break;
        case '/zhenduan':
          this.labelName = '基于FTU信号丢失的有源配电网故障诊断'
          break;
        case '/deeplyIntegrated':
          this.labelName = '小  样  本  增  广'
          break;
        default:
          break;
      }
    },
    taskQueue() {
      this.visiableQueue = !this.visiableQueue
      // 确保在下一个 DOM 更新周期结束后运行代码
      this.$nextTick(() => {
        this.$refs.queueData.computerTasks();
      });
    },
  },
  created() {
  },
  mounted() {
    this.changeLableName(this.$route.path)
  },
  activated() {
  },
  deactivated() {
  }
}
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  background-image: url('../../assets/img/jiduan/daping_bgimg.jpg');
  background-size: 100% auto;
  background-position-y: 100%;

  /deep/ .el-header {
    // background-color: #496eee;
    color: #333;
    width: 100vw;
    height: 10vh !important;
  }

  .returnHome {
    height: 4vh;
    width: 4vh;
    position: absolute;
    right: 2vw;
    top: 8vh;
    border: 2px solid #98b01d;
    padding: 0.2vh;
    border-radius: 6px;
    z-index: 99;
  }

  .returnHome:hover {
    background-color: #04ff00ae;
  }

  .listStyle {
    position: absolute;
    right: 5vw;
    top: 9vh;
    z-index: 99;

    a {
      text-decoration: none;
      background-color: rgba(14, 39, 84, 0.68);
      border: 1px solid rgba(31, 91, 193, 1);
      color: #fff;
      border-radius: 0.5vw;
      padding: 0.5vh 1.2vh;
      font-size: 2.2vh;
      font-weight: bold;
      transition: background-color 0.3s;
    }

    a:hover {
      cursor: pointer;
      border: 1px solid rgb(0, 255, 251);
      font-weight: bold;
      border: 1px solid rgb(0, 255, 251);
      border-radius: 0.5vw;
      background-color: rgba(21, 255, 0, 0.61);
    }
  }

  .main_top {
    display: flex;

    .left {
      position: relative;
      padding: 0.1875rem 0 0 0.25rem;
    }

    .alltitle {
      font-size: 1.9vw;
      /* color: rgb(226 236 255 / 0%); */
      font-weight: bold;
      position: absolute;
      top: 6%;
      left: 28%;
      color: #fff;
      //-webkit-text-stroke: 1px #413c47;
      //-webkit-text-fill-color: #fff;
      //animation: shine 2.4s infinite;
      /*设置动画*/
    }

    .alltitleChild {
      font-size: 4vh;
      font-weight: bold;
      color: #ff9900;
      position: absolute;
      width: 100%;
      text-align: center;
      top: 8vh;
      // -webkit-text-stroke: 1px #413c47;
      // -webkit-text-fill-color: #fff;
      // animation: shine 2.4s infinite;
      /*设置动画*/
    }

    @keyframes shine {

      /*创建动画*/
      0%,
      100% {
        color: #fff;
        text-shadow: 0 0 10px #0000FF, 0 0 10px #0000FF;
      }

      50% {
        text-shadow: 0 0 10px #0000FF, 0 0 40px #0000FF;
      }
    }
  }

  /deep/ .el-aside {
    // background-color: #fff;
    color: #333;
    text-align: center;
    width: 0vw !important;
    height: 90vh;
    // padding: 15px;
  }

  /deep/ .el-main {
    // background-color: #fff;
    color: #333;
    width: 84vw;
    height: 90vh;
  }

  .aside {
    height: 86vh;
    color: white;
    // background-color: #ebf0fd;
    border: 2px solid rgb(153, 196, 248);
    border-radius: 1.2vh;
  }

  .tools {
    font-size: 2vh;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 4vh;
  }

  .tip {
    margin-left: 0.6vw;
    width: 10vh;
    // height: 10vh;
    padding-top: 1vh;
    cursor: pointer;
    // background-color: blue;
  }

  .tip:hover {
    background-color: rgba(0, 255, 251, 0.61);
    border-radius: 2vh;
    color: #fff;
  }

  .tipBackground {
    background-color: rgba(0, 255, 251, 0.61);
    border-radius: 2vh;
    color: #fff;
  }

  .selected {
    background-color: rgba(0, 255, 251, 0.61);
    border-radius: 2vh;
    color: #fff;
  }

  .btnOther {
    position: absolute;
    left: 2vh;
    top: 9vh;

    /deep/ .el-button--primary {
      font-size: 2.2vh;
      font-weight: bold;
      width: 9vw;
      border: 1px solid rgba(31, 91, 193, 1);
      border-radius: 0.5vw;
      background-color: rgba(14, 39, 84, 0.68);
    }

    /deep/.el-button--primary:focus,
    .el-button--primary:hover {
      font-weight: bold;
      border: 1px solid rgb(0, 255, 251);
      border-radius: 0.5vw;
      background-color: rgba(21, 255, 0, 0.61);
    }
  }
}
</style>
