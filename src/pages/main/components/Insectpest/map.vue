<template>
  <div>
    <div class="map">
      <img class="map_topleft" width="4%" height="auto" src="../../../../assets/img/map/1.png" alt="">
      <img class="map_topright" width="4%" height="auto" src="../../../../assets/img/map/2.png" alt="">
      <img class="map_bottomleft" width="4%" height="auto" src="../../../../assets/img/map/3.png" alt="">
      <img class="map_bottomright" width="4%" height="auto" src="../../../../assets/img/map/4.png" alt="">
      <div class="map_name_topleft">
        <div>
          {{ mapChartOption.geo[0].map == 'city' ? '平顶山市' : mapChartOption.geo[0].map }}
        </div>
      </div>
      <div @showSelect="false" class="chart-container" @contextmenu.prevent="show()">
        <div id="mapChart" :style="heightStyle"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
// import chinaMapJson from "@/assets/js/china.json";
import pingdingshan from "@/assets/js/平顶山市.json"
// import province from '@/assets/js/province'
import domImg from './../../../../assets/img/map/u=1800976779,620269057&fm=253&fmt=auto&app=138&f=JPEG.webp'
import axios from 'axios'
export default {
  components: {
  },
  data() {
    return {
      mapJson: [],
      province: [],//所有省
      city: [], //某个市
      area: [], //某个区
      provinceName: '',
      cityName: '',
      areaName: '',
      ishow: true,
      showSelect: false,
      heightStyle: {
        height: '58.5vh'
      },
      geoCoordMap: [
      ],
      mapChart: null, // 全国地区热力图实例
      nextDow: true, // 点击事件的终止条件
      nowType: 'city', // 现在的类型是市区
      mapChartOption: {
        tooltip: {
          trigger: "item",
        },
        geo: [
          {
            map: "city", // 表示中国地图
            roam: false,
            zoom: 1,
            selectedMode: false,
            label: {
              normal: {
                show: false, // 是否显示对应地名
              }
            },
            regions: [
              {
                name: "南海诸岛",
                itemStyle: {
                  // 隐藏地图
                  normal: {
                    opacity: 0, // 为 0 时不绘制该图形
                  }
                },
                label: {
                  show: false // 隐藏文字
                }
              }
            ],
            itemStyle: {
              // 图形上的地图区域
              normal: {
                borderColor: "#5EC2F3", //图形的描边颜色
                // areaColor: 'rgba(0,0,0,0)', //地图区域的颜色。
                borderWidth: 1.2,
                areaColor: {
                  type: "pattern",
                  image: domImg, //配置图片
                  repeat: "repeat", //可选值repeat、no-repeat、repeat-x、repeat-y
                },
              },
              emphasis: {
                // 高亮时
                areaColor: "#5EC2F3",
                show: false,
              }
            }
          },
          {
            map: "city", // 表示中国地图
            roam: false,
            zlevel: -1,
            zoom: 1, //当前视角的缩放比例
            selectedMode: false,
            label: {
              normal: {
                show: false, // 是否显示对应地名
              }
            },
            regions: [
              {
                name: "南海诸岛",
                itemStyle: {
                  // 隐藏地图
                  normal: {
                    opacity: 0, // 为 0 时不绘制该图形
                  }
                },
                label: {
                  show: false // 隐藏文字
                }
              }
            ],
            itemStyle: {
              // 图形上的地图区域
              normal: {
                borderJoin: "round",
                borderColor: "rgba(176,228,252,1)",
                borderWidth: 3,
                areaColor: "rgba(133,188,232,1)",
                shadowColor: "rgba(133,188,232,.7)",
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 25,
              },
              emphasis: {
                // 高亮时
                areaColor: "#5EC2F3",
                show: false,
              }
            }
          }
        ],
        series: [
          {
            type: "map",
            geoIndex: 0,
            data: [
            ],
            tooltip: {
              backgroundColor: 'rgba(0,0,0,0)',//背景颜色（此时为默认色）
              borderRadius: 0,
              borderWidth: 0,
              borderColor: '#333',
              formatter: function (params) {
                var res = ''
                res = `
                  <div style="padding:10px;background:rgba(0,0,0,0.6);border:1px solid #5EC3F3">
                  <p style="font-size:14px;color:#37D1F9">${params.name}</p>
                  </div>
                `
                return res
              }
            }
          },
          {
            geoIndex: 0,
            silent: true,
            type: 'effectScatter',
            name: "片区名称",
            coordinateSystem: 'geo',
            data: [
              { name: '平顶山市', value: [113.208, 33.7526] }
            ],
            symbolSize: 10,
            rippleEffect: {              //涟漪特效相关配置。
              period: 4,               //动画的时间。
              scale: 3,              //动画中波纹的最大缩放比例。
              brushType: 'fill',      //波纹的绘制方式，可选 'stroke' 和 'fill'。
            },
            itemStyle: {                 //图形样式，normal 是图形在默认状态下的样式；emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
              normal: {
                color: "#FFC22E",
              },
            },
          },
          {
            type: 'scatter',
            coordinateSystem: 'geo',
            name: "平顶山",
            symbolSize: [28, 32],
            data: [{
              name: '平顶山',
              value: [113.208, 33.7526],
            },
            {
              name: '平顶山',
              value: [113.4059, 33.7247],
            }],
            symbol: 'image://' + require('../../../../assets/img/map/火电.png'),
            label: {
              offsetCenter: ['50%', "-100%"],
              emphasis: {
                show: false
              }
            },
            tooltip: {
              show: true,
              backgroundColor: 'rgba(0,0,0,0)',//背景颜色（此时为默认色）
              borderRadius: 0,
              borderWidth: 0,
              formatter: function (params, ticket, callback) {
                var res = ''
                res = `<p style="color:#19D5FF;font-size:16px">${params.seriesName}</p>`
                // '<p style="color:#19D5FF;margin-top:10px">运行状态：' + params.data.datas[0].zhuangtai + '</p>' +
                // '<p style="color:#BBBBBB">设备编号:' + params.data.datas[0].bianhao + '</p>'
                res = '<div style="border:1px solid #FF53AAD8;background-color:rgba(0,25,47,0.7);padding:5px 10px;">' + res + '</div>'
                setTimeout(function () {
                  // 仅为了模拟异步回调
                  callback(ticket, res);
                }, 1000)
                return res
              }
            },
          },
        ],
      },
    }
  },
  created() {
  },
  mounted() {
    this.geoCoordMap = [
    ]
    this.mapChartOption.series[1].data = this.geoCoordMap.slice(0, 400)
    this.mapJson = pingdingshan
    this.initChart()
    axios.get('https://geo.datav.aliyun.com/areas_v3/bound/410400_full.json').then(res => {
      this.area = res.data
    });
  },
  methods: {
    //回退  右键
    show() {
      // 右键回退
      // if (this.nowType === 'province') {
      //   this.mapChart.dispose()
      //   // 回到全国
      //   this.heightStyle.height = '80vh'
      //   this.mapJson = this.province
      //   this.nowType = 'country'
      //   this.ishow = true // 彻底清除表格重绘
      //   this.nextDow = true
      //   this.mapChartOption.geo[0].map = 'china'
      //   this.mapChartOption.geo[1].map = 'china'
      //   this.mapChartOption.series[1].data = this.geoCoordMap
      //   this.$nextTick(() => {
      //     this.initChart()
      //   })
      // }
      // if (this.nowType === 'city') {
      //   this.mapChart.dispose()
      //   // 回到省
      //   this.mapJson = this.city
      //   this.nowType = 'province'
      //   this.ishow = true // 彻底清除表格重绘
      //   this.nextDow = true
      //   this.heightStyle.height = '65vh'
      //   // this.mapChartOption.geo.map = this.provinceName
      //   this.mapChartOption.geo[0].map = this.provinceName
      //   this.mapChartOption.geo[1].map = this.provinceName
      //   this.mapChartOption.series[1].data = this.geoCoordMap
      //   this.$nextTick(() => {
      //     this.initChart(this.provinceName)
      //   })
      // }
      if (this.nowType === 'area') {
        this.mapChart.dispose()
        // 回到市
        this.mapJson = this.area
        this.nowType = 'city'
        this.ishow = true // 彻底清除表格重绘
        this.nextDow = true
        // this.mapChartOption.geo.map = this.cityName
        // this.mapChartOption.geo[0].map = this.cityName
        // this.mapChartOption.geo[1].map = this.cityName
        this.mapChartOption.geo[0].map = 'city'
        this.mapChartOption.geo[1].map = 'city'
        this.mapChartOption.series[1].data = this.geoCoordMap
        // this.mapChartOption.series[2].data = []
        // this.mapChartOption.series[3].data = []
        // this.mapChartOption.series[4].data = []
        // this.mapChartOption.series[5].data = []
        // this.heightStyle.height = '65vh'
        this.$nextTick(() => {
          this.initChart()
        })
      }
      return false
    },
    //初始化地图
    initChart(name) {
      if (!this.nextDow) return // 地图到底了
      var that = this
      this.mapChart = echarts.init(document.getElementById("mapChart")); // 选中地图的容器
      echarts.registerMap(name || 'city', this.mapJson); // 这个地方是将国/省/市的json塞入到地图中进行绘画
      this.mapChart.setOption(this.mapChartOption); // 画图
      this.mapChart.on('click', function (params) {
        that.clickMap(params);
      })
    },
    clickMap(data) {
      // const that = this
      // return
      this.nextDow = false
      if (this.nowType === 'country') {
        this.mapChart.dispose() // 销毁地图
        this.getProvince(data)
      }
      if (this.nowType === 'province') {
        this.mapChart.dispose() // 销毁地图
        this.getCity(data)
      }
      if (this.nowType === 'city') {
        this.mapChart.dispose() // 销毁地图
        this.getArea(data)
      }
      if (this.nowType === 'area') {
        this.ishow = true
        this.nextDow = false
        return false
      }
    },
    getProvince(data) {
      // console.log(data);
      var a = ''
      this.province.features.map(val => {
        if (val.properties.name === data.name) {
          // console.log(22222)
          if (val.properties.childrenNum > 0) {
            a = '_full'
          }
          // 如果现在是全国的话 则去选中的省份
          this.city = []
          axios.get(`https://geo.datav.aliyun.com/areas_v2/bound/${val.properties.adcode}${a}.json`).then(res => {
            this.mapJson = res.data
            this.city = res.data
            this.nowType = 'province'
            this.nextDow = true
            this.mapChartOption.geo[0].map = data.name
            this.mapChartOption.geo[1].map = data.name
            this.provinceName = data.name
            this.heightStyle.height = '65vh'
            this.$nextTick(() => {
              this.initChart(data.name)
            })
          })
        }
      })
      return
    },
    getCity(data) {
      var a = ''
      this.city.features.map(val => {
        if (val.properties.name === data.name) {
          this.area = []
          if (val.properties.childrenNum > 0) {
            a = '_full'
          }
          // 如果现在是全国的话 则去选中的省份
          axios.get(`https://geo.datav.aliyun.com/areas_v2/bound/${val.properties.adcode}${a}.json`).then(res => {
            this.mapJson = res.data
            this.area = res.data
            this.nowType = 'city'
            this.nextDow = true
            // this.mapChartOption.geo.zoom = 1.5
            // this.mapChartOption.geo.map = data.name
            this.mapChartOption.geo[0].map = data.name
            this.mapChartOption.geo[1].map = data.name
            this.cityName = data.name
            this.heightStyle.height = '65vh'
            this.$nextTick(() => {
              this.initChart(data.name)
            })
          })
        }
      })
      return
    },
    getArea(data) {
      var a = ''
      this.area.features.map(val => {
        if (val.properties.name === data.name) {
          if (val.properties.childrenNum > 0) {
            a = '_full'
          }
          // 如果现在是全国的话 则去选中的省份
          axios.get(`https://geo.datav.aliyun.com/areas_v2/bound/${val.properties.adcode}${a}.json`).then(res => {
            this.mapJson = res.data
            // this.area = res.data
            this.nowType = 'area'
            this.nextDow = true
            // this.mapChartOption.geo.zoom = 1.5
            // this.mapChartOption.geo.map = data.name
            this.mapChartOption.geo[0].map = data.name
            this.mapChartOption.geo[1].map = data.name
            this.areaName = data.name
            this.heightStyle.height = '65vh'
            this.$nextTick(() => {
              this.initChart(data.name)
            })
          })
        }
      })
      return
    },
  },
  beforeDestroy() {
  },
}
</script>

<style lang="scss" scoped>
.map {

  .map_topleft {
    position: absolute;
    top: 0;
    left: 0;
  }

  .map_topright {
    position: absolute;
    top: 0;
    right: 0;
  }

  .map_bottomleft {
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: flex-end;
  }

  .map_bottomright {
    position: absolute;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: flex-end;
  }

  .chart-container {
    #mapChart {
      width: 100%;
      // margin-top: 8vh;
      transform: scale(1, 1);
      z-index: 1;
    }
  }

  .map_name_topleft {
    position: absolute;
    top: 10px;
    z-index: 999;
    left: 10px;
    font-size: 18px;
    color: #37D1F9;

  }
}
</style>