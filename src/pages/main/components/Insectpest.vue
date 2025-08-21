<template>
  <div class="Insectpest">
    <div class="Insectpest_t">
      <!-- 左边数据 -->
      <div class="Insectpest_t_left">
        <div class="title_left">运行大数据全景巡航</div>
        <div class="returnHome">
          <router-link to="/login">登录</router-link>
        </div>
        <div class="scrollable-content">
          <left1 />
          <!-- <left3 style="height: 45%;margin-top: 2vh" /> -->
          <!-- <left1 style="height: 45%;" /> -->
          <mangeData style="height: 45%;margin-top: 2vh" />
        </div>
      </div>
      <!-- 中间地图 -->
      <div class="Insectpest_t_center">
        <!-- <tuopu v-if="isShowTuopu" /> -->
        <tuopu_change />
        <!-- <tuopuMap /> -->
        <!-- <gdDev /> -->
        <!-- <img src="../../../assets/img/home/xz.gif" width="auto" height="auto" alt=""> -->
      </div>
      <!-- 右边数据 -->
      <div class="Insectpest_t_right">
        <div class="box">
          <div class="title_right">配网故障研判和应急调度</div>
          <div class="nowTime">{{ currentTime }}</div>
        </div>
        <div class="content">
          <div class="top" style="height: 100%;">
            <!-- <chart1 /> -->
            <chart5 />
          </div>
          <!-- <div class="bot" style="height: 45%;">
            <chart2 />
          </div> -->
          <!-- <div class="bot" style="height: 45%;">
            <chart3 />
          </div> -->
        </div>
      </div>
    </div>
    <!-- <div style="position: relative;">
      <a style="position: absolute;top:-27vw;left:27vw" @click="onChangeTuopu">切换</a>
    </div> -->
    <!-- 底部 -->
    <div class="Insectpest_b">
      <div class="Insectpest_b_left">
        <!-- <switchData /> -->
      </div>
      <div class="Insectpest_b_center" style="margin-top: -27vh;">
        <switchData />
        <!-- <warningInformation /> -->
      </div>
      <div class="Insectpest_b_right">
        <!-- <greenServices /> -->
      </div>
    </div>
  </div>
</template>

<script>
import mangeData from './Insectpest/left/mangeData'
import left1 from './Insectpest/left/left1'
// import left2 from './Insectpest/left/left2'
// import left3 from './Insectpest/left/left3'
// import Map from '@/components/map'
// import gdDev from '@/pages/home/gdDev.vue'
// import tuopuMap from './Insectpest/tuopuMap'
import tuopu_change from './Insectpest/tuopu_change'
// import tuopu from './Insectpest/tuopu'
// import chart1 from './Insectpest/rightDate/chart1'
// import chart2 from './Insectpest/rightDate/chart2'
// import chart3 from './Insectpest/rightDate/chart3'
import chart5 from './Insectpest/rightDate/chart5'
// import warningInformation from './Insectpest/warningInformation'
// import greenServices from './Insectpest/greenServices'
import switchData from './Insectpest/switchData'
export default {
  components: {
    // tuopuMap,
    mangeData,
    tuopu_change,
    left1,
    // left2,
    // left3,
    // warningInformation,
    // gdDev,
    // greenServices,
    switchData,
    // chart1,
    // chart2,
    // chart3,
    chart5
  },
  data() {
    return {
      currentTime: this.getCurrentTime(),
      role: 'watcher',
      isShowTuopu: true,
      titleName: '多能协调优化调度'
    }
  },
  created() {
    this.role = 'production' // 生产者
    // 每隔一秒更新一次时间
    this.timer = setInterval(() => {
      this.currentTime = this.getCurrentTime();
    }, 1000);
  },
  beforeDestroy() {
    // 在组件销毁前清除定时器，防止内存泄漏
    clearInterval(this.timer);
  },
  methods: {
    getCurrentTime() {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentSecond = now.getSeconds();
      return `${this.padZero(currentHour)}:${this.padZero(currentMinute)}:${this.padZero(currentSecond)}`;
    },
    padZero(value) {
      // 辅助函数用于确保数字始终有两位，例如：2 -> "02"
      return value < 10 ? `0${value}` : value;
    },
    onChangeTuopu() {
      this.isShowTuopu = !this.isShowTuopu
    }
  }
}
</script>

<style lang="scss" scoped>
.Insectpest {
  width: 100%;
  height: 100%;

  a {
    text-decoration: none;
    background-color: rgba(97, 115, 25, 0.5);
    color: #fff;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 1.2vh;
    font-weight: bold;
    transition: background-color 0.3s;
  }

  a:hover {
    background-color: #0073e6;
    cursor: pointer
  }

  .Insectpest_t {
    display: flex;
    justify-content: space-between;
    padding: 0 1vh;
    margin-top: 0.2vh;
  }

  .Insectpest_t_left {
    width: 27%;
    height: 85.5vh;
    position: relative;
    margin-top: 1.3%;

    .returnHome {
      width: 100%;
      position: absolute;
      left: 10%;
      top: -20%;
      z-index: 999;

      a {
        text-decoration: none;
        background-color: rgba(97, 115, 25, 0.5);
        color: #fff;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 1.8vh;
        transition: background-color 0.3s;
      }

      a:hover {
        background-color: #0073e6;
        cursor: pointer;
      }
    }

    .title_left {
      position: absolute;
      font-size: 1.25vw;
      color: red;
      font-weight: 600;
      top: -5%;
      left: 30%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 20vw;
    }

    .scrollable-content {
      width: 100%;
      height: 100%;
      /* 启用垂直滚动条 */
      overflow-y: auto;
      overflow-x: hidden;

      /* 自定义滚动条样式 */
      &::-webkit-scrollbar {
        width: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background: #4f668e;
        /* 滚动条滑块的颜色 */
        border-radius: 4px;
      }

      &::-webkit-scrollbar-track {
        background: #525579;
        /* 滚动条轨道的颜色 */
        border-radius: 4px;
      }
    }
  }

  .Insectpest_t_center {
    margin-top: 2vh;
    width: 45%;
    height: 58.5vh;
    position: relative;
    overflow: hidden;

  }

  .Insectpest_t_right {
    width: 27%;
    height: 85.5vh;
    position: relative;

    .box {
      display: flex;
      width: 100%;
      height: 40px;
      padding-bottom: 10px;
      color: #fff;
      // background: pink;
      font-size: 3vh;
      // text-align: center;
      // align-items: center;
      align-items: flex-end;
      justify-content: space-around;
      position: absolute;
      top: -30px;
      right: 0;
      font-weight: 600
    }

    .title_right {
      font-size: 1.25vw;
      color: red;
      padding-left: 16%;
      font-weight: 600 ma;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 20vw;
    }

    .nowTime {
      color: #fff;
      font-size: 2vh;
      // align-items: end;
    }

    .content {
      width: 100%;
      height: 100%;
      overflow-x: hidden;
      overflow-y: scroll;
      margin-top: 26px;
    }

    /* 定义滚动条的样式 */
    .content::-webkit-scrollbar {
      width: 4px;
    }

    .content::-webkit-scrollbar-track {
      background: #525579;
    }

    .content::-webkit-scrollbar-thumb {
      background: #4f668e;
      /* 滚动条滑块颜色 */
    }

    .top {
      width: 100%;
      height: 100%;
      // height: 34vh;
      // background-color: red;
    }

    .bot {
      margin-top: 2vh;
      width: 100%;
      height: 100%;
      // height: 34vh;
      // background-color: red;
    }
  }

  .Insectpest_b {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    margin-top: 0.5%;

    .Insectpest_b_left {
      width: 27%;
      // background-color: #fff;
      height: 26vh;
    }

    .Insectpest_b_center {
      width: 45%;
      height: 31.7vh;
      // background-color: #fff;
    }

    .Insectpest_b_right {
      width: 27%;
      height: 26vh;
      // background-color: #fff;
    }
  }

}
</style>