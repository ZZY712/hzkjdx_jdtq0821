<template>
  <div style="position: relative;">
    <div class="returnHome">
      <el-dropdown>
        <span class="el-dropdown-link">
          <a>切换</a>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="changePup('1')">状态数据</el-dropdown-item>
          <el-dropdown-item @click.native="changePup('2')">天气数据</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div v-show="isShow" class="top" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.6)">
      <div class="st_titles">状态数据</div>
      <div class="dwasda">
        <el-button size="small" type="primary" @click="changeSwitch(1)" plain>支路状态总览</el-button>
        <el-button size="small" type="primary" @click="changeSwitch(2)" plain>节点状态总览</el-button>
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
    <div v-show="!isShow" class="body_Charts">
      <div v-for="(items, indexs) in carDisaster" :key="indexs">
        <div class="st_titles">
          {{ items.name }}
        </div>
        <div class="card">
          <el-table height="22vh" :header-cell-style="{ background: 'rgba(0,25,47,0)', color: '#fff' }"
            :data="items.data" style="width: 92%;margin-left: 2.5%;font-size: 1.4vh;" border>
            <el-table-column v-for="(item, index) in items.tableData" :key="index" :prop="item.name" :label="item.label"
              align="center"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import chat from '../../../../components/EChart.vue'
export default {
  components: { chat },
  data() {
    return {
      isShow: true,
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
            //花瓣图
            // roseType: 'radius',
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
      loadSum: [0, 0, 0, 0],
      nodeSum: [0, 0],
      carDisaster: [
        {
          name: '天气数据',
          tableData: [
            {
              name: 'dataType',
              label: '数据类型'
            },
            {
              name: 'date',
              label: '日期时间'
            },
            {
              name: 'sjData',
              label: '实际数据'
            },
            {
              name: 'ycData',
              label: '预测数据'
            },
            {
              name: 'weatherType',
              label: '天气类型'
            },
          ],
          data: []
        },
      ],
    }
  },
  methods: {
    changeSwitch() {

    },
    gethnoption(val) {
      let obj = JSON.parse(JSON.stringify(this.swoption))
      obj.tooltip = {
        // backgroundColor: 'rgba(0,0,0,0)',//背景颜色（此时为默认色）
        // borderRadius: 0,
        // borderWidth: 0,
        trigger: 'item',

        // formatter: function (params) {
        //   var res = ''
        //   res = `
        //       <div style="padding:0px 5px;background:rgba(0,0,0,0.6);border:1px solid #5EC3F3">
        //         <p style="font-size:14px;color:#37D1F9">状态：${params.name}</p>
        //         <p style="font-size:14px;color:#37D1F9">个数：${params.value}</p>
        //       </div>
        //     `
        //   return res
        // },
        // position: function (point, params, dom, rect, size) {
        //   // 获取可视区域的宽度和高度
        //   const viewWidth = size.viewSize[0];
        //   const viewHeight = size.viewSize[1];

        //   // 获取提示框内容的宽度和高度
        //   const tooltipWidth = dom.offsetWidth;
        //   const tooltipHeight = dom.offsetHeight;

        //   // 设置提示框的位置
        //   let left = point[0];
        //   let top = point[1];

        //   // 判断提示框是否超出可视范围，如果超出则调整位置
        //   if (left + tooltipWidth > viewWidth) {
        //     left = viewWidth - tooltipWidth;
        //   }
        //   if (top + tooltipHeight > viewHeight) {
        //     top = viewHeight - tooltipHeight;
        //   }
        //   return [left, top];
        // },
      }
      if (val == 1) {
        obj.series[0].data = [
          {
            value: this.loadSum[0],
            name: '正常',
            itemStyle: {
              color: "#12ff00",
            }
          },
          {
            value: this.loadSum[1],
            name: '蓝色预警',
            itemStyle: {
              color: "#0093ff"
            }
          },
          {
            value: this.loadSum[2],
            name: '橙色预警',
            itemStyle: {
              color: "#fdff00"
            }
          },
          {
            value: this.loadSum[3],
            name: '红色预警',
            itemStyle: {
              color: "#ff0000"
            }
          },
        ]
        return obj
      }
      if (val == 2) {
        obj.series[0].data = [
          {
            value: this.nodeSum[0],
            name: '正常',
            itemStyle: {
              color: "#00ff00",
            }
          },
          {
            value: this.nodeSum[1],
            name: '预警',
            itemStyle: {
              color: "#fdff00"
            }
          },
        ]
        return obj
      }
    },
    changePup(data) {
      switch (data) {
        case '1':
          this.isShow = true
          break;
        case '2':
          this.isShow = false
          break;
        default:
          break;
      }
    },
    computerData(alldata) {
      this.isShow = false
      let dataType = ''
      switch (alldata.dataname) {
        case 'WD':
          dataType = '温度数据'
          this.carDisaster[0].tableData[2].label = '实际数据-℃'
          this.carDisaster[0].tableData[3].label = '预测数据-℃'
          break;
        case 'SD':
          dataType = '湿度数据'
          this.carDisaster[0].tableData[2].label = '实际数据-g/m³'
          this.carDisaster[0].tableData[3].label = '预测数据-g/m³'
          break;
        case 'FS':
          dataType = '风速数据'
          this.carDisaster[0].tableData[2].label = '实际数据-m/s'
          this.carDisaster[0].tableData[3].label = '预测数据-m/s'
          break;
        case 'YL':
          dataType = '雨量数据'
          this.carDisaster[0].tableData[2].label = '实际数据-mm/㎡'
          this.carDisaster[0].tableData[3].label = '预测数据-mm/㎡'
          break;
        default:
          break;
      }
      this.carDisaster[0].data = []
      alldata.data.forEach((item) => {
        this.carDisaster[0].data.push({
          dataType: dataType,
          date: item[0],
          sjData: item[1],
          ycData: item[2],
          weatherType: item[3],
        })
      })
    }
  },
  mounted() {
    this.$bus.$on('loadSum', (loadSum) => {
      this.loadSum = loadSum
      this.gethnoption(1)
    })
    this.$bus.$on('nodeSum', (nodeSum) => {
      this.nodeSum = nodeSum
      this.gethnoption(2)
    })
    this.$bus.$on('allTableData', (allData) => {
      this.computerData(allData)
    })
  },
}
</script>

<style lang="scss" scoped>
.returnHome {
  // width: 100%;
  position: absolute;
  left: 0%;
  top: 0%;
  z-index: 9999;

  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }

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
}

.top {
  width: 100%;
  z-index: 9999;
  height: 26vh;
  // height: 100%;
  background-image: url("../../../../assets/img/ch/chbg_new.png");
  background-size: 100% 107%;
  background-repeat: no-repeat;

  .st_titles {
    background-size: 100% 107%;
    background-repeat: no-repeat;
    background-image: url('../../../../assets/img/ch/item_new.png');
  }

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
      border: 0px solid red;
      //border-radius: 0.2vw;
    }

    /deep/.el-button--primary.is-plain {
      color: #fff;
      background: #fff0;
      // border-color: #04f2f9;
    }

    /deep/.el-button--primary.is-plain:hover {
      //background: #04f2f9;
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

.body_Charts {
  width: 100%;
  height: 95%;
  /* 启用垂直滚动条 */
  overflow-y: auto;
  overflow-x: hidden;

  /deep/.el-loading-spinner i {
    color: #40f3ff00;
    // font-size: 8vh;
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

  .body_left {
    height: 36vh;
    position: relative;

  }

  .st_titles {
    background-size: 100% 107%;
    background-repeat: no-repeat;
    background-image: url('../../../../assets/img/ch/item_new.png');
  }

  .card {
    width: 98%;
    cursor: pointer;
    position: relative;
    height: calc(100% - 4vh);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-image: url('../../../../assets/img/ch/chbg_new.png');
    transform: translateX(-50%);
    animation-name: moveRight;
    animation-duration: 1.5s;
    animation-fill-mode: forwards;

    /deep/.el-table tr {
      height: 2vh;
      background-color: rgba(18, 39, 101, 0.7);
    }

    /deep/ .el-table,
    .el-table__expanded-cell {
      background-color: rgba(0, 0, 0, 0);
      color: #fff;
    }

    /deep/.el-table thead {
      background-color: rgba(0, 47, 38, 0.7);
    }

    /deep/.el-table tbody tr:hover>td {
      background-color: rgba(67, 145, 228, 0.2);
    }

    /deep/.el-table--scrollable-y .el-table__body-wrapper:-webkit-scrollbar {
      /*隐藏滚轮*/
      // display: none;
    }

    ::v-deep .el-table--scrollable-x .el-table__body-wrapper {
      overflow-x: auto;
    }

    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
      background-color: rgba(32, 86, 131, 0.3);
    }

    //里面滑块
    ::-webkit-scrollbar-thumb {
      box-shadow: inset 0 0 2px rgba(0, 0, 0, .3);
      -webkit-box-shadow: inset 0 0 wpx rgba(0, 0, 0, .3);
      background-color: #205683;
      border-radius: 3px;
    }

    ::-webkit-scrollbar-track {
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 3px;
      background: rgba(0, 0, 0, 0.2);
    }

    /deep/.el-table--border th.el-table__cell.gutter:last-of-type {
      display: none;
    }
  }

  .card:hover {
    // background-color: rgba(7, 185, 225, 0.5);
  }
}
</style>
