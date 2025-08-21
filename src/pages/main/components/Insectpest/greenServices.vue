<template>
  <div class="top" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.6)">
    <div class="st_titles">调度方案</div>
    <div class="st_tops">
    </div>
    <div class="dwasda">
      <el-button size="small" @click="changeModle(2)" type="primary" plain>极端天气下多能协调优化调度</el-button>
      <el-button size="small" @click="changeModle(3)" type="primary" plain>电网-路网联合应急优化调度</el-button>
    </div>
    <div style="display: flex; align-items:center;justify-content:space-around;margin-top: 20px; ">
      <div class="titleStyle">
        <!-- <chat :id="`hnchat1`" :option="gethnoption(1)"></chat> -->
        <div class="titleChild">
          <span>调度方案一</span>
          <el-divider direction="vertical"></el-divider>
          <span>调度方案二</span>
        </div>
      </div>
      <div class="titleStyle">
        <!-- <chat :id="`hnchat2`" :option="gethnoption(2)"></chat> -->
        <div class="titleChild">
          <span>市中心</span>
          <el-divider direction="vertical"></el-divider>
          <span>高新园区</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import chat from '../../../../components/EChart.vue'
export default {
  components: {
    // chat 
  },
  props: {
  },
  data() {
    return {
      loading: false,
      // hnoption: {
      //   tooltip: {
      //   },
      //   series: [
      //     {
      //       type: 'pie',
      //       radius: '50%',
      //       center: ['50%', '40%'],
      //       radius: ['2%', '70%'],
      //       roseType: 'radius',
      //       itemStyle: {
      //         // borderRadius: 2
      //       },
      //       label: {
      //         show: false
      //       },
      //       emphasis: {
      //         label: {
      //           show: true
      //         }
      //       },
      //       data: [
      //       ]
      //     },
      //   ]
      // },
    }
  },
  methods: {
    changeModle(data) {
      this.$bus.$emit('modle', data)
    },
    gethnoption(val) {
      let obj = JSON.parse(JSON.stringify(this.hnoption))
      obj.tooltip = {
        backgroundColor: 'rgba(0,0,0,0)',//背景颜色（此时为默认色）
        borderRadius: 0,
        borderWidth: 0,
        trigger: 'item',

        formatter: function (params) {
          var res = ''
          res = `
              <div style="padding:0px 5px;background:rgba(0,0,0,0.6);border:1px solid #5EC3F3">
                <p style="font-size:14px;color:#37D1F9">${params.name}</p>
                <p style="font-size:14px;color:#37D1F9">${params.value}(P/MW)</p>
              </div>
            `
          return res
        }
      }
      if (val == 1) {
        obj.tooltip = {
          backgroundColor: 'rgba(0,0,0,0)',//背景颜色（此时为默认色）
          borderRadius: 0,
          borderWidth: 0,
          trigger: 'item',

          formatter: function (params) {
            var res = ''
            res = `
              <div style="padding:0px 5px;background:rgba(0,0,0,0.6);border:1px solid #5EC3F3">
                <p style="font-size:14px;color:#37D1F9">${params.name}</p>
                <p style="font-size:14px;color:#37D1F9">${params.value}(P/MW)</p>
              </div>
            `
            return res
          },
          position: function (point, params, dom, rect, size) {
            // 获取可视区域的宽度和高度
            const viewWidth = size.viewSize[0];
            const viewHeight = size.viewSize[1];

            // 获取提示框内容的宽度和高度
            const tooltipWidth = dom.offsetWidth;
            const tooltipHeight = dom.offsetHeight;

            // 设置提示框的位置
            let left = point[0];
            let top = point[1];

            // 判断提示框是否超出可视范围，如果超出则调整位置
            if (left + tooltipWidth > viewWidth) {
              left = viewWidth - tooltipWidth;
            }
            if (top + tooltipHeight > viewHeight) {
              top = viewHeight - tooltipHeight;
            }
            return [left, top];
          },
        }
        obj.series[0].data = [
          { value: 11, name: '' },
          { value: 22, name: '' },
          { value: 33, name: '' },
          { value: 44, name: '' },
          { value: 55, name: '' }]
        return obj
      }
      if (val == 2) {
        obj.series[0].data = [
          { value: 99, name: '' },
          { value: 33, name: '' },
          { value: 44, name: '' },
          { value: 55, name: '' },
          { value: 66, name: '' }]
        return obj
      }
    }
  },
  mounted() {
    // 处理数据
  },
}
</script>

<style lang="scss" scoped>
.top {
  width: 100%;
  z-index: 999;
  height: 26vh;
  // height: 100%;
  background-image: url("../../../../assets/img/ch/绿色服务/绿色服务.png");
  background-size: 100% 107%;
  background-repeat: no-repeat;


  .dwasda {
    max-height: 20vh;
    overflow: hidden;
    overflow-y: scroll;
    display: flex;
    justify-content: space-around;

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

  .dwasda::-webkit-scrollbar {
    width: 4px;
  }

  .dwasda::-webkit-scrollbar-track {
    background: #525579;
  }

  .dwasda::-webkit-scrollbar-thumb {
    background: #4f668e;
    /* 滚动条滑块颜色 */
  }

  .titleStyle {
    border: 2px solid #04f2f9;
    width: 10vw;
    height: 12vh;
    color: #fff;

    .titleChild {
      width: 100%;
      height: 20%;
      display: flex;
      justify-content: space-around;
      border-bottom: 2px solid #04f2f9;
    }

    span:hover {
      background: #04f2f9;
      cursor: pointer
    }
  }
}
</style>
