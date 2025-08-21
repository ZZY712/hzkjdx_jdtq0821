<template>
  <div>
    <div v-if="dialogVisible">
      <div class="dialog">
        <div class="dialog_body">
          <div class="dialog_title">
            极端天气下多能优化调度
          </div>
          <el-form ref="form3" :model="form3" :rules="rules" label-width="120px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="调度方案" prop="params1">
                  <el-select v-model="form3.params1" placeholder="请选择调度方案" :style="{ width: '80%' }">
                    <el-option v-for="(item) in electricity" :key="item.value" :value="item.label"
                      :label="item.label"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
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
  name: 'jiduan',
  components: {
  },
  props: {
    visiableParams2: Boolean
  },
  data() {
    return {
      form3: {
        params1: '调度方案1',
      },
      electricity: [
        {
          value: '1',
          label: '调度方案1'
        },
        {
          value: '2',
          label: '调度方案2'
        }
      ],
      dialogVisible: false,
      defaultFormData: {},
      rules: {
        params1: [{ required: true, message: '请导入电流', trigger: 'blur' }],
      },
    }
  },
  mounted() {
    this.defaultFormData = { ...this.form3 }; // 将表单的默认值保存到 defaultFormData
  },
  watch: {
    visiableParams2(newV, oldV) {
      console.log(oldV, newV, '122555554');
      this.dialogVisible = this.visiableParams2
      // if (!this.visiableParams1) { this.dialogVisible = true }
    },
  },
  methods: {
    confirmTrue() {
      this.$refs.form3.validate((valid) => {
        if (valid) {
          console.log('表单验证通过');
          this.openSuccess();
          this.$parent.visiableParams2 = false;
        } else {
          console.log('表单验证失败');
          this.openFalse();
        }
      });
    },
    openSuccess() {
      this.$notify({
        title: '成功',
        message: '提交成功',
        type: 'success'
      });
    },
    openFalse() {
      this.$notify.error({
        title: '错误',
        message: '提交失败'
      });
    }
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