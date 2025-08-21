<template>
  <div class="main">
    <functionMenu />
    <div class="main_top">
      <div class="left">
        <img width="100%" height="90%" src="../../assets/img/ch/dingbubeijing_new.png" alt="">
        <img style="position: absolute;left: 5%;top: 29%;" width="90%" height="25%" src="../../assets/img/ch/ceshi.webp"
          alt="">
        <div class="alltitle">
          城市配电网智能态势评估和风险主动防御全景巡航平台
        </div>
      </div>
      <div class="user-info">
        <!-- 通知中心 -->
        <!-- <el-tooltip content="通知中心" placement="bottom">
          <div class="infoCenter" style="float: left; margin-right: 1vw;">
            <span @click="hiddendanger" style="cursor: pointer">
              <i class="el-icon-bell" style="color: white; font-size: 3vh; top: 0.6vh; position: relative;"></i>
              <div :style="{ opacity }" v-if="numInfo > 0"
                style="color: #ff0000; font-weight: bold; font-size: 1.6vh; top: -3.2vh;left: 1.45vw; position: relative;">
                {{ numInfo }}
              </div>
            </span>
          </div>
        </el-tooltip> -->
        <!-- 登录信息 -->
        <!-- <el-dropdown style="float: left;">
          <span class="el-dropdown-link" style="cursor: pointer">
            <i class="el-icon-user"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="openPerson">登录信息</el-dropdown-item>
            <el-dropdown-item @click.native="loginOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
      </div>
    </div>
    <div class="main_center">
      <Insectpest />
    </div>
    <DialogInfo v-if="dialogVisible" />
    <Person v-if="personVisible" />
  </div>
</template>
<script>
import Insectpest from './components/Insectpest'
import DialogInfo from '@/components/dialogInfo.vue'
import functionMenu from '@/components/functionMenu.vue'
import Person from '@/components/person.vue'
import { encryptData, decryptData } from '@/utils/cryptoUtils';
export default {
  components: {
    Insectpest,
    DialogInfo,
    Person,
    functionMenu,
    // helpTip,
  },
  data() {
    return {
      opacity: 1,
      numInfo: 0,
      helpTipVisible: false,
      dialogVisible: false,
      personVisible: false,
      tabList: [
        {
          title: '态势感知',
          show: false,
          path: '/pingu'
        },
        // {
        //   title: '故障诊断',
        //   show: false,
        //   path: '/zhenduan'
        // },
        // {
        //   title: '供电恢复',
        //   show: false,
        //   path: '/restoration'
        // },
        {
          title: '应急调度',
          show: false,
          path: '/topology'
        },
        {
          title: '实时响应',
          show: false,
          path: '/stereoStrategy'
        },
        {
          title: '数字孪生',
          show: false,
          path: '/gdDev'
        },
      ],
      upfilelist: [],
      fileList: [],
      formFlag: '',
      formNumber: 1,
      isShowFrom: false,
      formInline: {
        level: '',
        state: '',
        model: ''
      },
      colorData: [],
    }
  },
  created() {

  },
  methods: {
    openPerson() {
      this.personVisible = true
    },
    loginOut() {
      this.$router.replace('/login');
    },
    hiddendanger() {
      this.dialogVisible = true
    },
    change() {
      setInterval(() => {
        this.opacity -= 0.01
        if (this.opacity <= 0) this.opacity = 1
      }, 16)
    },
    openPDF() {

    },
    helpTip() {
      var newWindow = window.open("", "_blank");
      newWindow.document.write('<embed src="/pdf/shiyongshuoming.pdf" type="application/pdf" width="100%" height="100%" />');
      setTimeout(function () { newWindow.document.title = "帮助" }, 300);
      //if (this.helpTipVisible) { this.helpTipVisible = false }
      //this.helpTipVisible = !this.helpTipVisible
    },
    changeTab(item) {
      this.helpTipVisible = false
      this.tabList.map(val => {
        val.show = false
      })
      let encryptedData = encryptData({ title: item.title }, process.env.VUE_APP_CRYPTO_KEY);
      sessionStorage.setItem("changeTabDATA", encryptedData);
      this.$router.push(item.path);
    },
    changeImg(index, num) {
      if (num) {
        this.tabList[index].show = true
      } else {
        this.tabList[index].show = false
      }
    },
    closeDialog() {
      this.dialogVisible = false
      this.personVisible = false
    },
    changeShow() {
      let encryptedData = sessionStorage.getItem('colorsDATA');
      if (encryptedData && this.colorData.length === 0) {
        let decryptedData = decryptData(encryptedData, process.env.VUE_APP_CRYPTO_KEY);
        decryptedData.colors.forEach((item) => {
          switch (item) {
            // 紧急
            case '#ff0000':
              this.numInfo += 1
              break;
            // 预警
            case '#ffff00':
              this.numInfo += 1
              break;
            default:
              break;
          }
        });
      }
    }
  },
  mounted() {
    // this.change()
    this.changeShow()
  },
  activated() {
    this.changeShow()
  },
  deactivated() {
  }
}
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;

  .main_top {
    display: flex;

    .left {
      position: relative;
      padding: 0.1875rem 0 0 0.25rem;

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

      .btnOther {
        position: absolute;
        left: 1vh;
        top: 7vh;

        /deep/ .el-button--primary {
          font-size: 1.6vh;
          font-weight: bold;
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


      .right {
        position: absolute;
        color: #fff;
        display: flex;
        width: 34%;
        justify-content: space-around;
        right: 35.5vw;
        top: 6vw;
        z-index: 99;

        .tabs {
          width: 100%;
          position: relative;

          .tabitem {
            cursor: pointer;
            font-size: 1vmax;
            font-weight: bold;
            // margin-top: -0.8vmax;
            position: relative;
            width: 6.5vw;
            height: 2.8vw;
            border-radius: 1vw;
            z-index: 999;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            // box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff;
          }

          .bg {
            position: absolute;
            top: -1px;
            left: 5px;
            width: 8.5vw;
            height: 2.7vw;
            z-index: 2;
            backdrop-filter: blur(24px);
            border-radius: 10px;
            overflow: hidden;
            // outline: 2px solid white;
          }

          .blob {
            position: absolute;
            z-index: 1;
            top: 50%;
            left: 50%;
            width: 4.8vw;
            height: 1.7vw;
            border-radius: 50%;
            // background-color: #ff0000;
            background-color: rgba(252, 215, 7, 0.648);
            opacity: 1;
            filter: blur(12px);
            animation: blob-bounce 5s infinite ease;
          }

          @keyframes blob-bounce {
            0% {
              transform: translate(-100%, -100%) translate3d(0, 0, 0);
            }

            25% {
              transform: translate(-100%, -100%) translate3d(100%, 0, 0);
            }

            50% {
              transform: translate(-100%, -100%) translate3d(100%, 100%, 0);
            }

            75% {
              transform: translate(-100%, -100%) translate3d(0, 100%, 0);
            }

            100% {
              transform: translate(-100%, -100%) translate3d(0, 0, 0);
            }
          }

          .newImg {
            position: absolute;
            margin-top: -0.4vmax;
            z-index: 99;
            cursor: pointer;
            // right: 32%;
            right: 0;
            top: 11px;
          }

        }

        .iconfont {
          position: absolute;
          top: 29%;
          right: -14%;
          font-size: 1.3vw;
        }

        .iconfont:hover {
          color: rgba(0, 255, 255, 1);
        }
      }

    }

    .user-info {
      position: absolute;
      top: 1vh;
      right: 3vw;

      .infoCenter {
        background-color: rgba(31, 193, 123, 0.68);
        height: 2vw;
        width: 2vw;
        padding-left: 0.4vw;
      }

      .infoCenter:hover {
        background-color: rgb(23, 147, 252);
      }

      /deep/.el-dropdown-link {
        font-size: 3vh;
        color: #fff;
        background-color: rgba(31, 193, 123, 0.68);
        height: 2vw;
        width: 2vw;
        padding: 0 0.4vw;
      }

      /deep/.el-dropdown-link:hover {
        background-color: rgb(23, 147, 252);
      }
    }

  }
}

.main::before {
  width: 100%;
  height: 100%;
  background-image: url('../../assets/img/jiduan/daping_bgimg.jpg');
  background-size: 100% auto;
  background-position-y: 100%;
  position: absolute;
  /*图片定位*/
  top: 0;
  left: 0;
  content: "";
  z-index: -1;
  /*设置该标签等级，让其始终位于最底层*/
  -webkit-filter: opacity(100%);
  /*设置透明度   blur还可以改变照片的模糊度*/
  filter: opacity(100%);
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
</style>