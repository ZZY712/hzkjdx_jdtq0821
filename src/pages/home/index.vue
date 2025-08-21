<template>
  <div class="home">
    <el-container>
      <el-header>
        <!-- <div class="returnHome">
          <router-link to="/main">
            <img width="100%" height="100%" src="../../assets/img/ch/shouye.png" alt="">
          </router-link>
        </div> -->
        <div class="main_top">
          <div class="left">
            <img width="100%" height="90%" src="../../assets/img/ch/dingbubeijing_new.png" alt="">
            <img style="position: absolute;left: 5%;top: 29%;" width="90%" height="25%"
              src="../../assets/img/ch/ceshi.webp" alt="">
            <div class="alltitle">
              城市配电网智能态势评估和风险主动防御全景巡航平台
            </div>
            <div class="alltitleChild">
              {{ selectedTool.label }}
            </div>
          </div>
        </div>
      </el-header>
      <el-container>
        <el-aside>
          <!-- <div class="aside">
            <div style="text-align: center; font-size: 2.4vh ;font-weight: bold; margin-top: 2vh; margin-bottom: 4vh;">
            </div>
            <div v-for="(group, index) in toolGroups" :key="index" class="tools">
              <div v-for="(item, itemIndex) in group" :key="itemIndex" class="tip"
                :class="{ 'tip': true, 'tipBackground': item.label === selectedTool, 'selected': item.label === selectedTool }"
                @click="toRunMain(item)">
                <img :src="item.imgSrc" alt=""
                  style="width: 4vh; height: 4vh;padding: 1vh;border-radius: 1.5vh;background-color: white;">
                <div style="font-size: 1.8vh ;font-weight: bold;">{{ item.label }}</div>
              </div>
            </div>
          </div> -->
          <div class="btnOther">
            <el-dropdown>
              <el-button type="primary">
                数字孪生
              </el-button>
              <el-dropdown-menu slot="dropdown" style="background-color: rgba(12,61,121, 0.69);border: 1px solid rgba(0,76,255, 0.08);
            border-radius: 2vh;width: 6.5vw;z-index:2005">
                <div v-for="(item, index) in toolGroups" :key="index" style="height: 2.8vw;">
                  <div style="cursor: pointer;" @click="toRunMain(item[0])" @mouseover="changeImg(index, 1)"
                    @mouseleave="changeImg(index, 0)">
                    <img width="100%" v-if="item[0].show" height="48vh" src="../../assets/img/ch/tabhover.png" alt="">
                    <img width="100%" v-else height="48vh" src="../../assets/img/ch/tabbg.png" alt="">
                    <div
                      style="font-size: 2.2vh;font-weight: bold;width: 5.54vw;color: #fff;margin-top: -5vh;margin-left: 2vh;position: absolute;z-index: 9999;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                      onmouseover="this.style.overflow='visible'; this.style.textOverflow='inherit'; "
                      onmouseout="this.style.overflow='hidden'; this.style.textOverflow='ellipsis'; ">
                      {{ item[0].label }}
                    </div>
                  </div>
                </div>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      toolGroups: [
        [
          { imgSrc: require("@/assets/img/jiduan/luansheng.png"), show: false, label: "数字孪生", path: '/digitalTwin' },
        ],
        [
          { imgSrc: require("@/assets/img/jiduan/wltp.png"), show: false, label: "城市电网", path: '/gdDev' },
        ],
        [
          { imgSrc: require("@/assets/img/jiduan/wltp.png"), show: false, label: "快速重构", path: '/gdEditor' },
        ],
        [
          { imgSrc: require("@/assets/img/jiduan/shenduronghe.png"), show: false, label: "主 界 面", path: '/main' },
        ],

      ],
      autoFlag: 1,
      value: new Date(),
      selectedTool: {},
    }
  },
  created() {

  },
  methods: {
    toRunMain(item) {
      this.toolGroups.map(val => {
        val[0].show = false
      })
      this.selectedTool = item
      this.$nextTick(() => {
        this.$router.push(item.path);
      });
    },
    changeImg(index, num) {
      if (num) {
        this.toolGroups[index][0].show = true
      } else {
        this.toolGroups[index][0].show = false
      }
    },
    changeSelect() {
      switch (this.$route.path) {
        case '/digitalTwin':
          this.selectedTool = this.toolGroups[0][0]
          break;
        case '/gdDev':
          this.selectedTool = this.toolGroups[1][0]
          break;
        case '/gdEditor':
          this.selectedTool = this.toolGroups[2][0]
          break;
        default:
          break;
      }
    },
  },
  mounted() {
    if (!Object.prototype.hasOwnProperty.call(this.$route.query, 'default')) {
      this.toRunMain(this.selectedTool)
    }
    this.changeSelect()
    this.$bus.$on('returnHome', () => {
      this.selectedTool = { imgSrc: require("@/assets/img/jiduan/shenduronghe.png"), show: false, label: "主 界 面", path: '/main' },
        this.toRunMain(this.selectedTool)
    })
  },
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
    height: 0vh !important;
  }

  .returnHome {
    height: 4vh;
    width: 4vh;
    position: absolute;
    left: 2.8%;
    top: 6%;
    border: 2px solid #98b01d;
    padding: 0.2vh;
    border-radius: 6px;
    z-index: 99;
  }

  .returnHome:hover {
    background-color: #04ff00ae;
  }

  .main_top {
    display: flex;
    height: 10vh;
    top: -1vh;
    position: absolute;
    z-index: 9999;

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
      // -webkit-text-stroke: 1px #413c47;
      // -webkit-text-fill-color: #fff;
      // animation: shine 2.4s infinite;
      /*设置动画*/
    }

    .alltitleChild {
      font-size: 3vh;
      font-weight: bold;
      color: red;
      position: absolute;
      top: 5vh;
      right: 0vh;
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
    // width: 100vw;
    // height: 100vh;
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
    height: 10vh;
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
    right: 1vh;
    top: 4vh;
    z-index: 9999;

    /deep/ .el-button--primary {
      font-size: 1.6vh;
      font-weight: bold;
      border: 1px solid rgba(31, 91, 193, 1);
      border-radius: 0.5vw;
      background-color: rgba(13, 24, 45, 0.2);
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
