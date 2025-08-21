<template>
  <div class="top" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.6)">
    <div class="st_titles">开关数据</div>
    <div class="dwasda">
      <el-button size="small" type="primary" @click="changeSwitch(1)" plain>支路开关状态</el-button>
      <el-button size="small" type="primary" @click="changeSwitch(2)" plain>节点荷电状态</el-button>
      <!-- <el-button size="small" type="primary" @click="changeSwitch(3)" plain>分布式能源的运行状态及出力</el-button> -->
    </div>
    <div class="switchBody">
      <div style="display: flex; align-items:center;justify-content:space-around;margin-top: 12px;">
        <div>
          <chat :id="`swchat1`" :option="gethnoption(1)"></chat>
        </div>
        <div>
          <chat :id="`swchat2`" :option="gethnoption(2)"></chat>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import chat from '@/components/EChart.vue'
export default {
  components: { chat },
  data() {
    return {
      loading: false,
      tableData: [],
      flagSwitch: 1,
      swoption: {
        tooltip: {
        },
        legend: {
          // right: '-10',
          bottom: '0',
          textStyle: {
            color: 'white',
            fontSize: '10'
          }
        },
        series: [
          {
            type: 'pie',
            radius: '80%',
            center: ['50%', '40%'],
            roseType: 'radius',
            label: {
              show: false
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            data: [
            ]
          },
        ]
      },
    }
  },
  methods: {
    gethnoption(val) {
      let obj = JSON.parse(JSON.stringify(this.swoption))
      obj.tooltip = {
        backgroundColor: 'rgba(0,0,0,0)',//背景颜色（此时为默认色）
        borderRadius: 0,
        borderWidth: 0,
        trigger: 'item',

        formatter: function (params) {
          var res = ''
          res = `
              <div style="padding:0px 5px;background:rgba(0,0,0,0.6);border:1px solid #5EC3F3">
                <p style="font-size:14px;color:#37D1F9">状态：${params.name}</p>
                <p style="font-size:14px;color:#37D1F9">个数：${params.value}</p>
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
      if (val == 1) {
        obj.series[0].data = [
          {
            value: 33,
            name: '正常',
            itemStyle: {
              color: 'green',
            }
          },
          {
            value: 0,
            name: '预警',
            itemStyle: {
              color: 'yellow'
            }
          },
          {
            value: 0,
            name: '危险',
            itemStyle: {
              color: 'red'
            }
          },
        ]
        return obj
      }
      if (val == 2) {
        obj.series[0].data = [
          {
            value: 33,
            name: '正常',
            itemStyle: {
              color: 'green',
            }
          },
          {
            value: 0,
            name: '预警',
            itemStyle: {
              color: 'yellow'
            }
          },
          {
            value: 0,
            name: '危险',
            itemStyle: {
              color: 'red'
            }
          },
        ]
        return obj
      }
    }
  },
  mounted() {
    // this.computerData()
  },
}
</script>

<style lang="scss" scoped>
.top {
  width: 100%;
  z-index: 9999;
  height: 26vh;
  // height: 100%;
  background-image: url("../../../assets/img/ch/绿色服务/绿色服务.png");
  background-size: 100% 107%;
  background-repeat: no-repeat;


  .dwasda {
    max-height: 20vh;
    width: 100%;
    overflow: none;
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

  .switchBody {
    width: 100%;
    height: 60%;
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
}
</style>
