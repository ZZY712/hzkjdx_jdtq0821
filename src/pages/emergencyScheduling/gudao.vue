<template>
  <div>
    <div v-if="dialogVisible">
      <div class="dialog">
        <div class="dialog_body">
          <div class="dialog_title">
            孤岛划分
          </div>
          <el-button size="small" plain type="primary" style="margin-top: 10px;"
            @click="changeImg('原始网络')">原始网络</el-button>
          <el-button size="small" plain type="primary" style="margin-top: 10px;"
            @click="changeImg('孤岛划分')">孤岛划分</el-button>
          <div class="dialog_title">
            {{ this.imgSrc }}
          </div>
          <div>
            <img style="width: 25vw;height: 24vh;" :src="require('../../assets/img/jiduan/' + this.imgSrc + '.png')"
              alt="">
          </div>
          <div style="position: absolute;right: 2vw;bottom: 0vh;">
            <el-button size="small" plain type="primary" @click="confirmTrue">确定</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'gudao',
  components: {
  },
  props: {
    visiableParams1: Boolean
  },
  data() {
    return {
      dialogVisible: false,
      imgSrc: '原始网络'
    }
  },
  mounted() {
  },
  methods: {
    changeImg(data) {
      this.imgSrc = data
    },
    confirmTrue() {
    },
  },
  watch: {
    visiableParams1(newV, oldV) {
      console.log(oldV, newV, '122555554');
      this.dialogVisible = this.visiableParams1
      // if (!this.visiableParams1) { this.dialogVisible = true }
    },
  },
};
</script>
<style lang="scss" scoped>
.dialog {
  position: fixed;
  left: 35vw;
  top: 36vh;
  z-index: 999;
  background: rgba(64, 158, 255, 0.5);
  border: 0.5vh solid #4a9ccf;
  border-radius: 1vh;
  padding-bottom: 2vh;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: moveDown 0.5s forwards;

  .dialog_body {
    position: relative;
    width: 30vw;
    min-height: 40vh;

    .dialog_title {
      font-size: 2vh;
      font-weight: bold;
      color: #fff;
      padding-top: 1.2vh;
      margin-bottom: 1.2vh;
      border-bottom: 2px solid #4a9ccf;
    }

    /deep/ .el-button--small {
      font-size: 0.8vw;
      font-weight: bold;
      padding: 1vh;
      border-radius: 0.2vw;
    }

    /deep/.el-button--primary.is-plain {
      color: #fff;
      background: #fff0;
      border-color: #04f2f9;
    }

    /deep/.el-button--primary.is-plain:hover {
      background: #04f2f9;
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
</style>