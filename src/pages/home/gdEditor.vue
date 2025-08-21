<template>
  <div class="main">
    <!-- <div>
      <div>
        <input type="number" v-model="newNum" />
        newNum
      </div>
      <div>
        <input type="number" v-model="buildingId" />
        building id
      </div>
    </div> -->
    <!-- <button @click="clearNum">clearNum</button>
    <button @click="clearBuffer">clearBuilding</button>
    <button @click="addNum">addNum</button>
    <button @click="sayNums">sayNums</button> -->
    <div class="cableButtons">
      <div>
        <input type="number" v-model="regionCenterId" />
        区域中心ID
      </div>
      <div>
        <input type="number" v-model="newPoint" />
        <button @click="addCablePoint">输入要新增电缆的端点建筑</button>
      </div>
      <div>
        电缆端点：
        <p nowrap v-for="item in cablePoints" :key=item>{{ item + " " }}</p>
        <button @click="clearCablePoints">清除电缆端点</button>
      </div>
      <div>
        <input type="number" v-model="newBuildingId" />
        <button @click="addBuildingId">输入要删除的建筑</button>
      </div>
      <div>
        已选建筑：
        <p nowrap v-for="item in selectedBuildingIds" :key=item>{{ item + " " }}</p>
        <button @click="clearBuildingIds">清除已选建筑</button>
      </div>
    </div>
    <div class="content">
      <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 2vh;">
        <el-radio-button :label="false">展开</el-radio-button>
        <el-radio-button :label="true">收起</el-radio-button>
      </el-radio-group> -->
      <el-menu default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
        :collapse="isCollapse" :unique-opened="true">
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span slot="title">{{ '当前模型: ' + modelSelected.fileName }}</span>
          </template>
          <el-menu-item v-for="(item, index) in modelsForSelect" :key="index" @click="changeModelSelected(item)">{{
            item.fileName
            }}
          </el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span slot="title">建筑</span>
          </template>
          <el-menu-item index="2-2" @click="addBuilding">添加建筑</el-menu-item>
          <el-menu-item index="2-3" @click="deleteBuilding">删除建筑</el-menu-item>
        </el-submenu>

        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="location">电缆</span>
          </template>
          <el-menu-item index="3-1" @click='addCableFunc'>添加电缆</el-menu-item>
        </el-submenu>

        <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="location">区域</span>
          </template>
          <el-menu-item index="4-1" @click='addLaserOut'>添加区域</el-menu-item>
          <!-- <el-menu-item index="4-2" @click=''>添加多条电缆</el-menu-item>
          <el-menu-item index="4-3" @click="clearBuffer">清除已选</el-menu-item> -->
        </el-submenu>
      </el-menu>
    </div>
    <div id="container" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  }
}
</script>
<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { modelBaseData as gaoDeModelBaseData } from '../../assets/gdDev/gaoDeModelData'
import { degToRad } from '../../assets/gdDev/utils'
import * as THREE from 'three'
import breathPointLightTexture from '../../assets/gdDev/breath_red.png'
import constantPointLightTexture from '../../assets/gdDev/blue.png'
import tagTexture from '../../assets/gdDev/prism_blue.png'
import { addBuildingposition, delBuildingposition, listBuildingposition } from '@/api/system/buildingposition';
import { listCabledata, addCabledata, delCabledata } from '@/api/system/cabledata';
import { Message } from 'element-ui';
import { deleteBuildingPositionByIds } from '@/assets/gdDev/sysBuildingPosition';
import { addLaserOutPoint } from '@/api/system/laseroutpoint';

// 模型异步加载完成的个数（用于判断模型是否已经加载完成
let modelLoadedNum = 0

const defaultZoomLevel = 22
let modelURL = 'models/gaoDe/'
let modelPos = [113.58317, 34.706543]
let modelScale = 0.4
let map
let camera
let renderer
let scene
let customCoords

let cablePoints = ref([])
let selectedBuildingIds = ref([])
let newPoint = ref(1)
let regionCenterId = ref(1)
let newBuildingId = ref(1)

let buildingBuffer = []
let _AMap
let buildingPositionData = []
let cables = []
let cableMaterial

const operationStatus = ref(null)
const modelSelected = reactive({ fileName: '未选择' })
function changeModelSelected(item) {
  modelSelected.fileName = item.fileName
  modelSelected.id = item.id
}
const modelsForSelect = ref(gaoDeModelBaseData)

onMounted(() => {
  AMapLoader.load({
    // 个人申请，仅临时用于测试
    key: 'b04ab5c5278bf151494fe3ccc38a0ed3', // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    Loca: {                // 是否加载 Loca， 缺省不加载
      version: '2.0.0'  // Loca 版本，缺省 1.3.2
    },
  })
    .then((AMap) => {
      _AMap = AMap
      createMap(AMap)
    })
    .catch((e) => {
      console.log(e)
    })
})

onUnmounted(() => {
  map?.destroy()
})
function clearBuildingBuffer() {
  buildingBuffer = []
}
function clearCablePoints() {
  cablePoints.value = []
}
function clearBuildingIds() {
  selectedBuildingIds.value = []
}
function addCablePoint() {
  cablePoints.value.push(Number(newPoint.value))
}
function addBuildingId() {
  selectedBuildingIds.value.push(newBuildingId.value)
}
// function sayNums() {
//   console.log('nums: ', nums)
// }
function addLaserOut() {
  let i = 1
  let delta = 600
  buildingBuffer.forEach(e => {
    console.log(e)
    e.laserOutId = Number(regionCenterId.value)
    setTimeout(() => {
      addLaserOutPoint(e)
    }, delta * i)
    i++
  })
  Message.success('添加围墙点成功')
}

function addBuilding() {
  let i = 1
  let delta = 600
  buildingBuffer.forEach(e => {
    // console.log(e)
    setTimeout(() => {
      addBuildingposition(e)
    }, delta * i)
    i++
  })
  Message.success('添加建筑成功')
}
function deleteRelatedCable(buildingId) {
  // console.log('bid:', buildingId)
  cables.forEach(e => {
    if (e[0].modelDataId == buildingId) {
      // console.log('e@@', e)
      delCabledata(e[0].id)
    }
    if (e[1].modelDataId == buildingId) {
      // console.log('e@@', e)
      delCabledata(e[1].id)
    }
  })
}

function deleteBuilding() {
  selectedBuildingIds.value.forEach(e => {
    delBuildingposition(e)
    // 删除建筑的同时，删除与之相连的电缆
    deleteRelatedCable(e)
  })
  Message.success('删除建筑成功')
}

// function addCableFuncStartToEnd() {
//   buildingPositionData.sort((a, b) => a.ID - b.ID)
//   let found = false
//   let pre = null
//   buildingPositionData.forEach(e => {
//     if (e.ID >= fromPoint.value && e.ID <= endPoint.value) {
//       if (!found) {
//         found = true
//       } else {
//         // createCableData({ pointId1: pre.ID, pointId2: e.ID, joinPointIndex1: 0, joinPointIndex2: 0 })
//         // createCableData({ pointId1: pre.ID, pointId2: e.ID, joinPointIndex1: 1, joinPointIndex2: 1 })
//       }
//     }
//     pre = e
//   })
// }

function addCableFunc() {
  let pre = null
  cablePoints.value.forEach(e => {
    // console.log('eee', e)
    if (pre != null) {
      addCabledata({ pointId1: pre, pointId2: e, joinPointIndex1: 0, joinPointIndex2: 0 })
      addCabledata({ pointId1: pre, pointId2: e, joinPointIndex1: 1, joinPointIndex2: 1 })
    }
    pre = e
  })
  Message.success("创建电缆成功")
}
// function deleteB() {
//   let ids = []
//   buildingPositionData.forEach(e => {
//     if (e.ID % 2 == 0) {
//       // deleteBuildingPositionByIds(ids.push(e.ID))
//     }
//   })
//   // deleteBuildingPositionByIds({ ids: ids })
// }

function createMap(AMap) {
  map = new AMap.Map('container', {
    center: modelPos,
    zooms: [2, 26],
    zoom: 10,
    viewMode: '3D',
    // 隐藏默认楼块
    features: ['bg', 'road', 'point'],
    // mapStyle: 'amap://styles/whitesmoke',
    // mapStyle: 'amap://styles/light',
    mapStyle: 'amap://styles/dark',
    pitch: 50,
  })
  // 绑定点击事件
  map.on('click', clickOnBuilding)
  // 数据转换工具
  customCoords = map.customCoords
  // 创建 GL 图层
  let gllayer = new AMap.GLCustomLayer({
    // 图层的层级
    zIndex: 10,
    // 初始化的操作，创建图层过程中执行一次。
    init: (gl) => {
      // 这里我们的地图模式是 3D，所以创建一个透视相机，相机的参数初始化可以随意设置，因为在 render 函数中，每一帧都需要同步相机参数，因此这里变得不那么重要。
      // 如果你需要 2D 地图（viewMode: '2D'），那么你需要创建一个正交相机
      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 100, 1 << 30)

      renderer = new THREE.WebGLRenderer({
        context: gl,  // 地图的 gl 上下文
        // alpha: true,
        // antialias: true,
        // canvas: gl.canvas,
      })

      // 自动清空画布这里必须设置为 false，否则地图底图将无法显示
      renderer.autoClear = false
      scene = new THREE.Scene()

      // 环境光照和平行光
      // let aLight = new THREE.AmbientLight(0xffffff, 3);
      // let dLight1 = new THREE.DirectionalLight(0xffffff, 1)
      // let dLight2 = new THREE.DirectionalLight(0xffffff, 1)
      // let dLight3 = new THREE.DirectionalLight(0xffffff, 1)
      // let dLight4 = new THREE.DirectionalLight(0xffffff, 1)
      // dLight1.position.set(-900, 0, 100)
      // dLight2.position.set(0, 900, 100)
      // dLight3.position.set(900, 0, 100)
      // dLight4.position.set(0, -900, 100)
      // scene.add(dLight1)
      // scene.add(dLight2)
      // scene.add(dLight3)
      // scene.add(dLight4)
      // scene.add(aLight);
      prepareData()
    },
    render: () => {
      // 这里必须执行！！重新设置 three 的 gl 上下文状态。
      renderer.resetState()
      // 重新设置图层的渲染中心点，将模型等物体的渲染中心点重置
      // 否则和 LOCA 可视化等多个图层能力使用的时候会出现物体位置偏移的问题
      customCoords.setCenter(modelPos)
      let { near, far, fov, up, lookAt, position } = customCoords.getCameraParams()

      // 2D 地图下使用的正交相机
      // let { near, far, top, bottom, left, right, position, rotation } = customCoords.getCameraParams();

      // 这里的顺序不能颠倒，否则可能会出现绘制卡顿的效果。
      camera.near = near
      camera.far = far
      camera.fov = fov
      camera.position.set(...position)
      camera.up.set(...up)
      camera.lookAt(...lookAt)
      camera.updateProjectionMatrix()

      // 2D 地图使用的正交相机参数赋值
      // camera.top = top;
      // camera.bottom = bottom;
      // camera.left = left;
      // camera.right = right;
      // camera.position.set(...position);
      // camera.updateProjectionMatrix();

      renderer.render(scene, camera)

      // 这里必须执行！！重新设置 three 的 gl 上下文状态。
      renderer.resetState()
    },
  })
  // map.add(new AMap.Buildings({
  //   zooms: [10, 26],
  //   zIndex: 10,
  //   heightFactor: 0.4
  // }))
  map.add(gllayer)
  setTimeout(() => {
    test()
  }, 4000)
}

// 开始时从远处拉近镜头
function test() {
  map.setCenter(modelPos)
  map.setZoom(defaultZoomLevel)
}

// 初始化模型
function initGltf() {
  loadModels()
  // 最多等待模型加载5秒
  asyncProcesses(5000)
}

function asyncProcesses(timeOutInMiliSecond) {
  let modelTotalCount = gaoDeModelBaseData.length
  // 没加载完
  if (modelLoadedNum < modelTotalCount) {
    // 再等待0.05秒
    let waitTime = 50
    let newTimeOutInMilliSecond = timeOutInMiliSecond - waitTime
    // 没超过最大等待时间
    if (newTimeOutInMilliSecond > 0) {
      setTimeout(() => {
        asyncProcesses(newTimeOutInMilliSecond)
      }, waitTime)
      return
    } else {
      console.error('模型加载超时，直接开始后续操作')
    }
  }
  // 绘制电缆
  drawcables()
  // 放置呼吸灯、常亮灯
  // placePointLights()
  //放置指示牌
  placeSigns()
}
function setRotation(rotation, model) {
  let x = degToRad(rotation.x || 0)
  let y = degToRad(rotation.y || 0)
  let z = degToRad(rotation.z || 0)
  model.rotation.set(x, y, z)
}

function setPosition(lnglat, model) {
  // 对模型的经纬度进行转换
  let position = customCoords.lngLatToCoord(lnglat)
  // model.position.setX(position[0])
  // model.position.setY(position[1])
  return new THREE.Vector3(position[0], position[1], 0)
}

function setAngle(angle, model) {
  let x = model.rotation.x
  let z = model.rotation.z
  let y = degToRad(angle)
  model.rotation.set(x, y, z)
}
function placeModel(data, modelObj) {
  data.position = setPosition([data.lng, data.lat], modelObj)
  // setAngle(data.angle, modelObj)
  // scene.add(modelObj)
}
function loadModels() {
  gaoDeModelBaseData.forEach(data => {
    let models = buildingPositionData.filter(e => data.id === e.modelId)
    let loader = new GLTFLoader()
    loader.load(modelURL + data.fileName, (gltf) => {
      data.modelObj = gltf.scene
      data.modelObj.scale.set(modelScale, modelScale, modelScale)
      modelLoadedNum++
      setRotation({
        x: 90, y: 0, z: 0
      }, data.modelObj)
      models.forEach(e => {
        // 绑定data和baseData，方便以后使用
        e.baseData = data
        // let modelObjClone = data.modelObj.clone()
        let modelObjClone = null
        // e.modelObj = modelObjClone
        placeModel(e, modelObjClone)
      })
    })
  })
}

function drawcables() {
  cables.forEach(cable => {
    const points = []
    cable.forEach(pointData => {
      let model = buildingPositionData.find(e => e.id === pointData.modelDataId)
      if (model) {
        if (model.position) {
          let baseData = model.baseData
          if (baseData) {
            let point = new THREE.Vector3()
            point.copy(model.position)
            let joinPoint = baseData.cableJoinPoint[pointData.joinPointIndex]
            point.x += joinPoint.xOffset
            point.y += joinPoint.yOffset
            point.z += joinPoint.zOffset
            points.push(point)
          }
        } else {
          console.error('模型位置坐标未计算')
        }
      } else {
        console.error('找不到电缆连接点对应的模型')
      }
    })
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    if (!cableMaterial) {
      cableMaterial = new THREE.LineBasicMaterial({
        color: 0xe8cb6b,
      })
    }
    const line = new THREE.Line(geometry, cableMaterial)
    scene.add(line)
  })
}

function prepareData() {
  let buildingPositionDataPromise = new Promise((resolve, reject) => {
    // getBuildingPositionList({ page: 1, pageSize: 999999 }).then(val => {
    listBuildingposition({ page: 1, pageSize: 999999 }).then(val => {
      if (val && val.code === 200) {
        buildingPositionData = val.rows
        // buildingPositionData.forEach(e => addMarker([e.lng, e.lat]))
        // console.log('positionData', buildingPositionData)
        resolve('加载建筑位置数据成功')
      } else {
        reject('获取建筑位置数据失败')
      }
    })
  })

  let getCableDataPromise = new Promise((resolve, reject) => {
    // getCableDataList({ page: 1, pageSize: 999999 }).then(val => {
    listCabledata({ page: 1, pageSize: 999999 }).then(val => {
      if (val && val.code === 200) {
        cables = val.rows
        let cablesFormatted = []
        cables.forEach(cable => {
          let cableFormatted = []
          cableFormatted.push({ modelDataId: cable.pointId1, joinPointIndex: cable.joinPointIndex1, id: cable.id })
          cableFormatted.push({ modelDataId: cable.pointId2, joinPointIndex: cable.joinPointIndex2, id: cable.id })
          cablesFormatted.push(cableFormatted)
        })
        cables = cablesFormatted
        resolve('获取电缆数据成功')
        // console.log('cables', cables)
      } else {
        reject('获取电缆数据失败')
      }
    })
  })

  Promise.all([buildingPositionDataPromise, getCableDataPromise]).then(() => {
    console.log('initGlTF')
    initGltf()
  }).catch(error => {
    console.log(error)
  })
}

// 放置呼吸点、常亮点
function placePointLights() {
  let loca = new Loca.Container({
    map: map
  })
  // 放置呼吸点
  // placeBreathPointLights(loca)
  // 放置常亮点
  placeConstantPointLights(loca)
}

function placeBreathPointLights(loca) {
  let features = []
  buildingPositionData.forEach(e => {
    if (e.baseData.breathPointLight) {
      features.push(createGeoPointFeature([e.lng, e.lat]))
    }
  })
  let breathPointsScatter = new Loca.ScatterLayer({ zindex: 121 })
  breathPointsScatter.setSource(new Loca.GeoJSONSource({
    data: {
      type: 'FeatureCollection',
      features: features
    }
  }))
  breathPointsScatter.setStyle({
    unit: 'px',
    size: [50, 50],
    texture: breathPointLightTexture,
    animate: true,
    duration: 1000,
  })
  loca.add(breathPointsScatter)
  loca.animate.start()
}

function placeConstantPointLights(loca) {
  let features = []
  buildingPositionData.forEach(e => {
    if (e.baseData.constantPointLight) {
      features.push(createGeoPointFeature([e.lng, e.lat]))
    }
  })
  let breathPointsScatter = new Loca.ScatterLayer({ zindex: 10 })
  breathPointsScatter.setSource(new Loca.GeoJSONSource({
    data: {
      type: 'FeatureCollection',
      features: features
    }
  }), {
    unit: 'px',
    size: [20, 20],
    texture: constantPointLightTexture,
    borderWidth: 0,
  })
  loca.add(breathPointsScatter)
}

// 放置指示牌
function placeSigns() {
  let loca = new Loca.Container({
    map: map
  })
  let features = []
  buildingPositionData.forEach(e => {
    // let baseData = e.baseData
    // if (baseData) {
    //   if (baseData.tagName) {
    features.push(createGeoPointFeature([e.lng, e.lat], { name: e.id + ' ' + e.baseData.fileName }))
    //   }

    // }
  })
  let geo = new Loca.GeoJSONSource({
    data: {
      'type': 'FeatureCollection',
      'features': features
    }
  })

  // 文字主体图层
  var zMarker = new Loca.ZMarkerLayer({
    loca: loca,
    zIndex: 120,
    depth: false,
  })
  zMarker.setSource(geo)
  zMarker.setStyle({
    content: (_i, feat) => {
      var props = feat.properties
      var leftColor = 'rgba(0, 28, 52, 0.6)'
      var rightColor = '#038684'
      var borderColor = '#038684'
      return (
        '<div style="width: 240px; height: 160px; padding: 0 0;">' +
        '<p style="display: block; height:80px; line-height:80px;font-size:28px;background-image: linear-gradient(to right, '
        + leftColor + ',' + leftColor + ',' + rightColor + ',rgba(0,0,0,0.4)); border:4px solid '
        + borderColor + '; color:#fff; border-radius: 15px; text-align:center; margin:0; padding:5px;">' +
        props['name'] +
        '</p><span style="width: 100px; height: 80px; margin: 0 auto; display: block;' +
        'background: url(' + tagTexture + ');"></span></div>'
      )
    },
    unit: 'meter',
    rotation: 0,
    alwaysFront: true,
    size: [12.5, 5.75],
    altitude: 0,
  })
}

function createGeoPointFeature(coordinates, properties = {}) {
  return {
    'type': 'Feature',
    'geometry': {
      'type': 'Point',
      'coordinates': coordinates
    },
    'properties': properties
  }
}

function clickOnBuilding(event) {
  let clickLngLat = [event.lnglat.getLng(), event.lnglat.getLat()]
  console.log(clickLngLat)
  if (!modelSelected.id) {
    Message.error('模型未选择')
    return
  }
  buildingBuffer.push({ modelId: modelSelected.id, lng: event.lnglat.getLng(), lat: event.lnglat.getLat(), angle: 0 })
  // 实例化点标记
  addMarker(clickLngLat)
}
function addMarker(lnglat) {
  console.log('lnglat:', lnglat)
  let marker = new _AMap.Marker({
    icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
    position: lnglat,
    offset: new _AMap.Pixel(-19, -58)
  })
  marker.setMap(map)
}
// for (let i = 0; i < buildingPositionData.length; i++) {
//   let baseData = buildingPositionData[i].baseData
//   if (baseData != undefined
//     && baseData.clickRadius != undefined
//     && getFlatternDistance(clickLngLat, [buildingPositionData[i].lng, buildingPositionData[i].lat]) <= baseData.clickRadius
//   ) {
//     map.setCenter([buildingPositionData[i].lng, buildingPositionData[i].lat])
//     if (baseData.clickZoom) {
//       map.setZoom(baseData.clickZoom)
//     }
//     return
//   }
// }
// 未点击任何建筑
//   map.setZoom(defaultZoomLevel)
// }
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  position: relative;

  .cableButtons {
    background-color: rgba(61, 232, 244, 0.4);
    border: 2px solid rgba(255, 187, 187, 0.4);
    color: white;
    font-weight: bold;
    border-radius: 2vh;
    position: absolute;
    z-index: 9999;
    top: 0%;
    left: 10%;
    padding: 0.1vh;

    input,
    button {
      background-color: rgba(244, 226, 61, 0.371);
      border: 2px solid rgba(255, 187, 187, 0);
      color: white;
      font-weight: bold;
      border-radius: 2vh;
      margin: 0.1vh;
    }

    input {
      height: 3vh;
    }

    button {
      height: 3vh;
    }
  }

  .content {
    width: 50vw;
    height: 5%;
    display: flex;
    flex-direction: column;

    /deep/.el-menu {
      background-color: rgba(61, 232, 244, 0.4);
      border: 2px solid rgba(255, 187, 187, 0.4);
      border-radius: 2vh;
      z-index: 9999;
    }

    /deep/.el-menu-item:focus,
    .el-menu-item:hover {
      background-color: rgba(61, 244, 223, 0.6);
      border-radius: 2vh;
      margin-left: -1.2vw;
      text-align: center
    }

    /deep/.el-submenu__title:hover {
      background-color: rgba(61, 244, 223, 0.6);
      border-radius: 2vh;
    }

    .el-menu-vertical-demo:not(.el-menu--collapse) {
      width: 8vw;
    }

    /deep/.el-radio-button__inner {
      width: 4vw;
      border-radius: 2vh;
      z-index: 9999;
    }

    /deep/.el-radio-button__orig-radio:checked+.el-radio-button__inner {
      z-index: 9999;
      width: 4vw;
    }
  }

  #container {
    top: -5vh;
    width: 99.9vw;
    left: -1vw;
    height: 100vh;
    position: relative;
  }
}
</style>
