<template>
  <div class="top">
    <div class="st_titles">
      {{ pupTitleName }}
    </div>
    <el-table v-if="isChangeShow === '1'" height="13.5vw" :key="'风储系统参数'"
      :header-cell-style="{ background: 'rgba(0,25,47,0.7)', color: '#fff' }" :data="tableData"
      style="width: 90%;margin-left: 5%;margin-top: -0.5%;font-size: 1.4vh;" border v-loading="loading"
      element-loading-text="任务未执行" element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(2,42,114,0.9)">
      <el-table-column prop="classA" label="类型" align="center"
        v-if="tableData.some(item => item.classA ? item.classA : item.classA === 0 ? true : false)"></el-table-column>
      <el-table-column prop="maxPower" label="最大输出有功功率/KW " align="center"
        v-if="tableData.some(item => item.maxPower ? item.maxPower : item.maxPower === 0 ? true : false)"></el-table-column>
      <el-table-column prop="maxPowerIndex" label="最大功率因数" align="center"
        v-if="tableData.some(item => item.maxPowerIndex ? item.maxPowerIndex : item.maxPowerIndex === 0 ? true : false)"></el-table-column>
      <el-table-column prop="RL" label="容量/kW·h" align="center"
        v-if="tableData.some(item => item.RL ? item.RL : item.RL === 0 ? true : false)"></el-table-column>
      <el-table-column prop="CFDXL" label="充放电效率" align="center"
        v-if="tableData.some(item => item.CFDXL ? item.CFDXL : item.CFDXL === 0 ? true : false)"></el-table-column>
      <el-table-column prop="ZDZXZT" label="最小/最大荷电状态/p.u." align="center"
        v-if="tableData.some(item => item.ZDZXZT ? item.ZDZXZT : item.ZDZXZT === 0 ? true : false)"></el-table-column>
    </el-table>
    <el-table v-if="isChangeShow === '2'" height="13.5vw" :key="'三种方案的负荷恢复情况'"
      :header-cell-style="{ background: 'rgba(0,25,47,0.7)', color: '#fff' }" :data="tableData"
      style="width: 90%;margin-left: 5%;margin-top: -0.5%;font-size: 1.4vh;" border v-loading="loading"
      element-loading-text="任务未执行" element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(2,42,114,0.9)">
      <el-table-column prop="FFS" label="方法" align="center"
        v-if="tableData.some(item => item.FFS ? item.FFS : item.FFS === 0 ? true : false)"></el-table-column>
      <el-table-column prop="YJFH" label="供电恢复比例(一级负荷)" align="center"
        v-if="tableData.some(item => item.YJFH ? item.YJFH : item.YJFH === 0 ? true : false)"></el-table-column>
      <el-table-column prop="EJFH" label="供电恢复比例(二级负荷)" align="center"
        v-if="tableData.some(item => item.EJFH ? item.EJFH : item.EJFH === 0 ? true : false)"></el-table-column>
      <el-table-column prop="SJFH" label="供电恢复比例(三级负荷)" align="center"
        v-if="tableData.some(item => item.SJFH ? item.SJFH : item.SJFH === 0 ? true : false)"></el-table-column>
      <el-table-column prop="TDSS" label="停电损失(KW·h)x权重)" align="center"
        v-if="tableData.some(item => item.TDSS ? item.TDSS : item.TDSS === 0 ? true : false)"></el-table-column>
      <el-table-column prop="QFL" label="弃风率" align="center"
        v-if="tableData.some(item => item.QFL ? item.QFL : item.QFL === 0 ? true : false)"></el-table-column>
    </el-table>
    <div class="returnHome">
      <el-dropdown>
        <span class="el-dropdown-link">
          <a>切换</a>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="changePup('1')">风储系统参数</el-dropdown-item>
          <el-dropdown-item @click.native="changePup('2')">三种方案的负荷恢复情况</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      isChangeShow: '2',
      pupTitleName: '风储系统参数',
      tableData: [],
    };
  },
  methods: {
    changePup(data) {
      switch (data) {
        case '1':
          this.isChangeShow = '1'
          this.pupTitleName = '风储系统参数'
          this.tableData = []
          this.tableData = [
            {
              classA: '风机',
              maxPower: '1200',
              maxPowerIndex: '0.9',
              RL: '/',
              CFDXL: '/',
              ZDZXZT: '/',
            },
            {
              classA: '储能',
              maxPower: '400',
              maxPowerIndex: '/',
              RL: '800',
              CFDXL: '95%',
              ZDZXZT: '0.05/0.95',
            }]
          this.loading = false
          break;
        case '2':
          this.isChangeShow = '2'
          this.pupTitleName = '三种方案的负荷恢复情况'
          this.tableData = []
          this.tableData = [
            {
              FFS: '方案1',
              YJFH: '100',
              EJFH: '100',
              SJFH: '36.2',
              TDSS: '9263.2',
              QFL: '7.26',
            },
            {
              FFS: '方案2',
              YJFH: '100',
              EJFH: '91.5',
              SJFH: '49.9',
              TDSS: '11376.8',
              QFL: '0',
            },
            {
              FFS: '方案3',
              YJFH: '100',
              EJFH: '92.5',
              SJFH: '38.7',
              TDSS: '12496.9',
              QFL: '11.7',
            },
          ]
          this.loading = false
          break;
        default:
          break;
      }
    },

  },
  mounted() {
    this.changePup('2');
  },
};
</script>

<style lang="scss" scoped>
.top {
  width: 100%;
  z-index: 999;
  // height: 20vh;
  height: 100%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-image: url('../../../../assets/img/ch/chbg_new.png');
  position: relative;

  .returnHome {
    // width: 100%;
    position: absolute;
    left: 0%;
    top: 0%;
    z-index: 999;

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

  /deep/.el-table--border,
  .el-table--group {
    border-color: 4187B3;
  }

  ::v-deep .el-table--scrollable-x .el-table__body-wrapper {
    overflow-x: hidden;
  }

  ::-webkit-scrollbar {
    width: 6px;
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
</style>
