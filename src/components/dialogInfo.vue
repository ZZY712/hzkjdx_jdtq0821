<template>
  <div>
    <div class="dialog" @click.self="closeDialog">
      <div class="dialog_body">
        <p class="closeicon" @click="closeDialog">
          <i style="color: #fff;font-size: 20px;" class="el-icon-circle-close"></i>
        </p>
        <div class="dialog_title">
          通知中心
        </div>
        <!-- 任务列表 -->
        <div class="task_list">
          <div class="fixed_tags">
            <el-tag @click.native="changeTask(1)" style="cursor: pointer;" :class="{ 'bgColor': flagNum === 1 }"
              type="success">紧急警报</el-tag>
            <el-tag @click.native="changeTask(2)" style="cursor: pointer;" :class="{ 'bgColor': flagNum === 2 }"
              type="success">预警信息</el-tag>
          </div>
          <div class="card_list">
            <el-card v-for="(task, index) in allTask" :key="index" class="task_card">
              <div v-if="task.name">编号：{{ task.name }}</div>
              <div v-if="task.status">状态：{{ task.status }}</div>
              <div v-if="task.value">RSME值：{{ task.value }}</div>
            </el-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { decryptData } from '@/utils/cryptoUtils';
export default {
  props: {
  },
  data() {
    return {
      flagNum: 1,
      allTask: [],
      task1: [],
      task2: [],
    }
  },
  methods: {
    closeDialog() {
      this.$parent.closeDialog()
    },
    changeTask(data) {
      this.flagNum = data
      switch (data) {
        case 1:
          this.allTask = []
          this.allTask = this.task1
          break;
        case 2:
          this.allTask = []
          this.allTask = this.task2
          break;
        default:
          break;
      }
    },
    changeShows() {
      let encryptedData = sessionStorage.getItem('colorsDATA');
      if (encryptedData) {
        let decryptedData = decryptData(encryptedData, process.env.VUE_APP_CRYPTO_KEY);
        this.task1 = []
        this.task2 = []
        decryptedData.colors.forEach((item, index) => {
          switch (item) {
            case '#ff0000':
              this.task1.push({
                name: "线路编号" + (index + 1),
                status: "紧急",
                value: decryptedData.RSME[index].toFixed(2)
              })
              break;
            case '#ffff00':
              this.task2.push({
                name: "线路编号" + (index + 1),
                status: "预警",
                value: decryptedData.RSME[index].toFixed(2)
              })
              break;
            default:
              break;
          }
        });
        this.allTask = this.task1
      }
    }
  },
  mounted() {
    this.changeShows()
  },
  activated() {
    this.changeShows()
  },
  deactivated() {
  }
};
</script>
<style lang="scss" scoped>
.dialog {
  position: fixed;
  right: 9vw;
  top: 1vh;
  z-index: 999;
  background: rgba(64, 160, 255, 0.73);
  border: 0.5vh solid #a534de77;
  border-radius: 1vh;
  padding-bottom: 2vh;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: moveDown 0.5s forwards;

  .dialog_body {
    position: relative;
    width: 8.5vw;
    height: 22vh;

    .closeicon {
      position: absolute;
      right: 10px;
      top: 2px;
      cursor: pointer;
    }

    .dialog_title {
      text-align: center;
      font-size: 2vh;
      font-weight: bold;
      color: #fff;
      margin-bottom: 1.2vh;
      border-bottom: 2px solid #a534de79;
    }

    .task_list {
      width: 100%;
      height: 20vh;
      /* 启用垂直滚动条 */
      overflow-y: auto;
      overflow-x: hidden;

      .fixed_tags {
        position: fixed;
        top: 3vh;
        left: 0vw;
        background-color: #2f8c90;
        margin-bottom: 0.5vh;
        margin-top: 0.5vh;
      }

      .card_list {
        margin-top: 3.1vh;
      }

      /deep/.el-card__body,
      .el-main {
        padding: 0.5vh;
      }

      /deep/.el-card {
        font-size: 1.45vh;
        color: #fff;
        font-weight: bold;
        background-color: #2f63909c;
      }

      /deep/.el-tag.el-tag--success {
        background-color: #2f3e9082;
        border-color: #e1f3d8;
        color: #ffffff;
      }

      /deep/.el-tag.el-tag--success:hover {
        background-color: #4bca1082;
      }

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

    .close {
      position: absolute;
      right: 0.5vw;
      top: 0vh;
      font-size: 2.2vh;
      color: #34b9dec6;
      cursor: pointer;
    }

    .close:hover {
      color: #d59318;
      cursor: pointer;
    }

    .infoAll {
      position: absolute;
      border-radius: 1vh;
      background: rgba(64, 160, 255, 0.99);
      width: 100%;
      height: auto;
      right: 0vw;
      bottom: -20%;
      font-size: 1.6vh;
      font-weight: bold;
      color: #fff;
    }
  }
}

@keyframes moveDown {
  0% {
    transform: translateY(-100%);
    /* 初始位置在上方，向上偏移 100% */
  }

  100% {
    transform: translateY(0);
    /* 最终位置在原始位置，不再偏移 */
  }
}

.bgColor {
  background-color: #4bca1082 !important;
}
</style>