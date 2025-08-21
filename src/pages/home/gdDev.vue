<template>
  <div class="main">
    <div class="content">
      <div class="btnOther">
        <el-dropdown>
          <el-button type="primary">
            切换主题
          </el-button>
          <el-dropdown-menu slot="dropdown"
            style="background-color: rgba(12,61,121, 0.69);border: 1px solid rgba(0,76,255, 0.08);
            border-radius: 2vh;width: 6.5vw;color: white;font-size:2vh ;font-weight: bold;text-align: center;cursor: pointer;z-index:9999">
            <div onmouseover="this.style.color='red'; " onmouseout="this.style.color='white'; " @click="switchStyle">
              切换主题</div>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown>
          <el-button type="primary">
            卫星地图
          </el-button>
          <el-dropdown-menu slot="dropdown"
            style="background-color: rgba(12,61,121, 0.69);border: 1px solid rgba(0,76,255, 0.08);
            border-radius: 2vh;width: 6.5vw;z-index:9999;color: white;font-size:2vh ;font-weight: bold;text-align: center;cursor: pointer;">
            <div onmouseover="this.style.color='red'; " onmouseout="this.style.color='white'; "
              @click="switchSatellite">卫星地图</div>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown>
          <el-button type="primary">
            天气
          </el-button>
          <el-dropdown-menu slot="dropdown"
            style="background-color: rgba(12,61,121, 0.69);border: 1px solid rgba(0,76,255, 0.08);
            border-radius: 2vh;width: 6.5vw;z-index:9999;color: white;font-size:2vh ;font-weight: bold;text-align: center;cursor: pointer;">
            <div onmouseover="this.style.color='red'; " onmouseout="this.style.color='white'; "
              @click='() => { switchWeather("rain"); switchCableState("normal") }'>下雨天气</div>
            <div onmouseover="this.style.color='red'; " onmouseout="this.style.color='white'; "
              @click='() => { switchWeather("snow"); switchCableState("ice") }'>下雪天气</div>
            <div onmouseover="this.style.color='red'; " onmouseout="this.style.color='white'; "
              @click='() => { switchWeather("normal"); switchCableState("normal") }'>正常天气</div>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown>
          <el-button type="primary">
            区域
          </el-button>
          <el-dropdown-menu slot="dropdown"
            style="background-color: rgba(12,61,121, 0.69);border: 1px solid rgba(0,76,255, 0.08);
            border-radius: 2vh;width: 6.5vw;z-index:9999;color: white;font-size:2vh ;font-weight: bold;text-align: center;cursor: pointer;">
            <div onmouseover="this.style.color='red'; " onmouseout="this.style.color='white'; "
              @click='switchCenter("老城区")'>老城区</div>
            <div onmouseover="this.style.color='red'; " onmouseout="this.style.color='white'; "
              @click='switchCenter("新农村")'>新农村</div>
            <div onmouseover="this.style.color='red'; " onmouseout="this.style.color='white'; "
              @click='switchCenter("市中心")'>市中心</div>
            <div onmouseover="this.style.color='red'; " onmouseout="this.style.color='white'; "
              @click='switchCenter("集中式光储")'>集中式光储</div>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown>
          <el-button type="primary">
            面板信息
          </el-button>
          <el-dropdown-menu slot="dropdown"
            style="background-color: rgba(12,61,121, 0.69);border: 1px solid rgba(0,76,255, 0.08);
            border-radius: 2vh;width: 6.5vw;z-index:9999;color: white;font-size:2vh ;font-weight: bold;text-align: center;cursor: pointer;">
            <div onmouseover="this.style.color='red'; " onmouseout="this.style.color='white'; " @click='changePopup()'>
              面板信息</div>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div id="container"></div>
    <cableTwin v-show="showCable" ref=cableState :cableId="cableClickedId" />
    <PopupComponent2 v-if="isShowPopup" />
  </div>
</template>
<script>
import PopupComponent2 from './PopupComponent2.vue'
export default {
  components: {
    PopupComponent2,
  },
  data() {
    return {
      isCollapse: false,
      isShowPopup: false
    };
  },
  methods: {
    changePopup() {
      this.isShowPopup = !this.isShowPopup
    }
  }
}
</script>
<script setup>
import cableTwin from '../cableTwin.vue'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { onMounted, onUnmounted, onUpdated, ref } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { modelBaseData as gaoDeModelBaseData, carsDataClass, carsModelFileNames } from '../../assets/gdDev/gaoDeModelData'
import { degToRad, setRotation, getFlatternDistance } from '../../assets/gdDev/utils'
import { addSnowCoverAnim, initRain, rainAnim, switchWeather } from '../../assets/gdDev/assets/effects'
// import { getBuildingPositionList } from '../../assets/gdDev/sysBuildingPosition'
import * as THREE from 'three'
import breathPointLightTexture from '../../assets/gdDev/breath_red.png'
import constantPointLightTexture from '../../assets/gdDev/blue.png'
import tagTexture from '../../assets/gdDev/prism_blue.png'
// import { getCableDataList } from '../../assets/gdDev/sysCableData'
import { initSnow } from '../../assets/gdDev/assets/effects'
import { snowAnim } from '../../assets/gdDev/assets/effects'
import { listBuildingposition } from '@/api/system/buildingposition';
import { listCabledata } from '@/api/system/cabledata';
import { getCircuitStatus } from '@/api/system/cabledata';
import { carKind, gridCarData } from '@/assets/gdDev/gridCar'

import { listLaserOut } from '@/api/system/laserout'
import { listLaserOutPoint } from '@/api/system/laseroutpoint'
import { listpolygon } from '@/api/system/polygondata'
const cableClickedId = ref(0)
// 模型异步加载完成的个数（用于判断模型是否已经加载完成
let modelLoadedNum = 0

const cableState = ref(null)
const showCable = ref(false)
const myReactiveData = ref('线路状态正常')
const defaultZoomLevel = 14
let regionCenter
let modelURL = 'models/gaoDe/'
let modelPos = [112.455181, 34.608669]
let modelScale = 0.4
let map
let camera
let renderer
let composer
let scene
let customCoords
let satelliteLayer
let enableSatelliteLayer = false
let loca

let buildingPositionData = []
let cables = []
let polygons = []
// 从后端获取的电缆数据
// let rawCableData
let cableMaterial
let errorMaterial
let highlightMaterial

// 线路
const circuits = new Map()
const raycaster = new THREE.Raycaster()
raycaster.params.Line.threshold = 3
let preCircuitId = -1
let preCircuitMat = null
// 小车
const carModels = []

const laserOut = {
  type: 'FeatureCollection',
  name: 'out',
  crs: {
    type: 'name',
    properties: {
      name: 'urn:ogc:def:crs:OGC:1.3:CRS84'
    }
  },
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          // 这里的数据在数据库里
        ]
      }
    }
  ]
}

let styles = {
  light: {
    styleName: 'amap://styles/fresh',
    cablecolor: 0x000000
  },
  dark: {
    styleName: 'amap://styles/dark',
    cablecolor: 0xe8cb6b
  },
  error: {
    cablecolor: 0xff0000
  },
  highlight: {
    cablecolor: 0x00d6b9
  }
}

let currentStyle = styles.dark
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
      createMap(AMap)
    })
    .catch((e) => {
      console.log(e)
    })
})


onUnmounted(() => {
  map?.destroy()
})

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
    mapStyle: currentStyle.styleName,
    pitch: 50,
  })
  // 绑定点击事件
  map.on('click', clickOnBuilding)
  // 绑定鼠标移动事件，用于线路相关逻辑
  map.on('mousemove', (e) => mouseOnCircuit(e.originEvent))
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
      let dLight1 = new THREE.DirectionalLight(0xffffff, 1)
      let dLight2 = new THREE.DirectionalLight(0xffffff, 1)
      let dLight3 = new THREE.DirectionalLight(0xffffff, 1)
      let dLight4 = new THREE.DirectionalLight(0xffffff, 1)
      dLight1.position.set(-900, 0, 100)
      dLight2.position.set(0, 900, 100)
      dLight3.position.set(900, 0, 100)
      dLight4.position.set(0, -900, 100)
      scene.add(dLight1)
      scene.add(dLight2)
      scene.add(dLight3)
      scene.add(dLight4)
      // scene.add(aLight);
      initWeather()
      // renderFunc()
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
  satelliteLayer = new AMap.TileLayer.Satellite()
  map.add(new AMap.Buildings({
    zooms: [10, 26],
    zIndex: 10,
    heightFactor: 0.4
  }))
  map.add(gllayer)
  setTimeout(() => {
    test()
  }, 4000)
}

function initWeather() {
  composer = new EffectComposer(renderer)
  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)
  // 下雨 
  initRain(new THREE.Vector3(2000, 2000, 280), new THREE.Vector3(-800, -800, 0), scene, composer)
  requestAnimationFrame(rainAnim)
  // 下雪
  initSnow(scene)
  requestAnimationFrame(snowAnim)
}

// function renderFunc() {
//   composer.render()
//   requestAnimationFrame(renderFunc)
// }

// 开始时从远处拉近镜头
function test() {
  map.setCenter(modelPos)
  map.setZoom(defaultZoomLevel)
  setTimeout(() => {
    camera.beginCalc = true
  }, 5000)
}

function renderPolygonsLayer(polygonData = polygons) {
  if (window.polygonLayer) {
    map.remove(window.polygonLayer);
  }
  console.log(polygonData)

  const polygonsLayer = polygonData.map(item => {
    console.log('渲染多边形:', item.polygon_id, item.coordinates);
    return new AMap.Polygon({
      path: item.coordinates,
      strokeColor: '#FF33FF',
      strokeWeight: 2,
      fillColor: '#1791fc',
      fillOpacity: 0.4,
      zIndex: 100,
    });
  });

  window.polygonLayer = polygonsLayer;
  polygonsLayer.forEach(element => {
    map.add(element)

  });
  //map.add(polygonsLayer);
  // map.setFitView(polygonsLayer); // 自动调整视角
}
function loadPolygons() {
  renderPolygonsLayer(); // 调用之前定义的渲染函数
}



// 初始化模型
function initGltf() {
  loadModels()
  loadCarModels()
  // 最多等待模型加载5秒
  asyncProcesses(5000)
  loadPolygons()
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
  // 小车
  initCarsPath(carsDataClass.carsData)
  carsDataClass.init(carModels, scene)
  // 绘制电缆
  drawcables()
  getCircuitStatus().then((res) => {
    myReactiveData.value = res.rows
    myReactiveData.value.forEach(e => {
      if (e.normal === false) {
        switchCircuitMat(e.id, errorMaterial)
      } else {
        switchCircuitMat(e.id, cableMaterial)
      }
    })
  })
  setInterval(() => {
    getCircuitStatus().then((res) => {
      myReactiveData.value = res.rows
      myReactiveData.value.forEach(e => {
        if (e.normal === false) {
          switchCircuitMat(e.id, errorMaterial)
        } else {
          switchCircuitMat(e.id, cableMaterial)
        }
      })
    })
  }, 10000)
  loca = new Loca.Container({
    map: map
  })
  // 放置呼吸灯、常亮灯
  placePointLights()
  //放置指示牌
  placeSigns()
  //放置激光围栏
  placeLaserFence()
  // 雪层覆盖
  initSnowCover()
}
function initCarsPath(carsData) {
  carsData.forEach(carData => {
    carData.pathCoor = []
    console.log("pathLnglat:", carData.pathLngLat)
    carData.pathLngLat.forEach(lngLat => {
      carData.pathCoor.push(customCoords.lngLatToCoord(lngLat))
    })
  })
}
function setPosition(lnglat, model) {
  // 对模型的经纬度进行转换
  let position = customCoords.lngLatToCoord(lnglat)
  model.position.setX(position[0])
  model.position.setY(position[1])
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
  setAngle(data.angle, modelObj)
  scene.add(modelObj)
}
function loadCarModels() {
  carsModelFileNames.forEach(fileName => {
    let loader = new GLTFLoader()
    loader.load(modelURL + 'cars/' + fileName, (gltf) => {
      const modelObj = gltf.scene
      modelObj.children[0].name = 'Car'
      carModels.push(modelObj)
      modelObj.scale.set(modelScale * 4, modelScale * 4, modelScale * 4)
      // setRotation({
      //   x: 90, y: 0, z: 0
      // }, modelObj)
    })
  })
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
        let modelObjClone = data.modelObj.clone()
        e.modelObj = modelObjClone
        placeModel(e, modelObjClone)
      })
    })
  })
}
function generateFakeSnowCoverData() {
  let features = []
  const from = [113.524872, 34.673323], to = [113.661707, 34.770008]
  const num = 40
  const deltaX = (to[0] - from[0]) / num
  const deltaY = (to[1] - from[1]) / num
  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num; j++) {
      features.push(createGeoPointFeature([from[0] + i * deltaX, from[1] + j * deltaY], { count: getRandomInt(3000) }))
    }
  }

  const geo = new Loca.GeoJSONSource({
    data: {
      'type': 'FeatureCollection',
      'features': features
    }
  })
  return geo
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}
function initSnowCover() {
  const heatmap = new Loca.HeatMapLayer({
    // loca,
    zIndex: 10,
    opacity: 1,
    visible: true,
    zooms: [2, 22],
  })
  const geo = generateFakeSnowCoverData()
  console.log(geo)
  heatmap.setSource(geo, {
    radius: 300,
    unit: 'meter',
    height: 4,
    difference: true,
    gradient: {
      1: '#fff',
      0.8: '#ddd',
      0.6: '#ccc',
      0.5: '#bbb',
      0.4: '#aaa',
      0.2: '#999',
    },
    value: function (index, feature) {
      return feature.properties.count
    },
    opacity: [0, 1],
    heightBezier: [0, 0.53, 0.37, 0.98]
  })
  loca.add(heatmap)
  addSnowCoverAnim((animValue, disable) => snowCoverAnim(animValue, heatmap, disable))
  // 先关闭覆雪
  snowCoverAnim([1, 0], heatmap, true)
}
function drawcables() {
  cables.forEach(cable => {
    const points = []
    cable.points.forEach(pointData => {
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
        color: currentStyle.cablecolor,
      })
    }
    if (!errorMaterial) {
      errorMaterial = new THREE.LineBasicMaterial({
        color: styles.error.cablecolor,
      })
    }
    if (!highlightMaterial) {
      highlightMaterial = new THREE.LineBasicMaterial({
        color: styles.highlight.cablecolor,
      })
    }
    const line = new THREE.Line(geometry, cableMaterial)
    line.circuitId = cable.circuitId
    // 把line加入circuits数组
    const circuit = circuits.get(cable.circuitId)
    if (!circuit) {
      console.error('线路未初始化')
    } else {
      circuit.lines.push(line)
    }
    scene.add(line)
  })
}
function switchCircuitMat(circuitId, newMat) {
  if (!cableMaterial || !errorMaterial) {
    console.error('电缆材质未初始化')
    return
  }
  const circuit = circuits.get(circuitId)
  // console.log('c',circuit.lines[0].circuitId)
  if (!circuit) {
    //console.error('切换线路状态：未找到线路：' + circuitId)
  } else {
    circuit.lines.forEach(e => {
      // e.computeLineDistances();
      e.material = newMat
    })

    // if (dataMsgPanel) {
    //   dataMsgPanel.remove();
    // }
  }
}

function initCircuits(circuitId) {
  if (circuitId == undefined || circuitId == null) {
    console.warn('初始化线路：线路id不存在')
    return
  }
  let circuit = circuits.get(circuitId)
  if (!circuit) {
    // 创建电缆材质
    circuits.set(circuitId,
      {
        lines: []
      }
    )
  }
}

function prepareData() {
  let buildingPositionDataPromise = new Promise((resolve, reject) => {
    // getBuildingPositionList({ page: 1, pageSize: 999999 }).then(val => {
    listBuildingposition({ page: 1, pageSize: 999999 }).then(val => {
      if (val && val.code === 200) {
        buildingPositionData = val.rows
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
        // rawCableData = cables
        // console.log('raw:', rawCableData)
        let cablesFormatted = []
        cables.forEach(cable => {
          // 初始化线路
          initCircuits(cable.circuitId)
          let cableFormatted = []
          cableFormatted.push({ modelDataId: cable.pointId1, joinPointIndex: cable.joinPointIndex1 })
          cableFormatted.push({ modelDataId: cable.pointId2, joinPointIndex: cable.joinPointIndex2 })
          cablesFormatted.push({ circuitId: cable.circuitId, points: cableFormatted })
        })
        cables = cablesFormatted
        resolve('获取电缆数据成功')
        // console.log('cables', cables)
      } else {
        reject('获取电缆数据失败')
      }
    })
  })
  let getRegionCenterDataPromise = new Promise((resolve, reject) => {
    listLaserOut({ page: 1, pageSize: 999999 }).then(val => {
      if (val && val.code === 200) {
        regionCenter = val.rows
        regionCenter.forEach(e => {
          e.lnglat = [e.centerLng, e.centerLat]
        })
        console.log('围墙中心数据', regionCenter)
        resolve('获取围墙中心数据成功')
      } else {
        reject('获取围墙中心数据失败')
      }
    })
  })
  let getLaserOutPointDataPromise = new Promise((resolve, reject) => {
    listLaserOutPoint({ page: 1, pageSize: 999999 }).then(val => {
      if (val && val.code === 200) {
        const collected = Object.groupBy(val.rows, ({ laserOutId }) => laserOutId)
        laserOut.features[0].geometry.coordinates = Object.values(collected)
        laserOut.features[0].geometry.coordinates.forEach(e => {
          e.forEach(point => {
            e.push([point.lng, point.lat])
          })
        })
        console.log('围墙点数据: ', laserOut.features[0].geometry.coordinates)
        resolve('获取围墙点数据成功')
      } else {
        reject('获取围墙点数据失败')
      }
    })
  })
  let getPolygonDataPromise = new Promise((resolve, reject) => {
    listpolygon({ page: 1, pageSize: 999999 }).then(val => {
      if (val && val.code === 200) {
        const groupedPolygons = val.rows.reduce((acc, row) => {
          const key = row.polygon_id;
          if (!acc[key]) {
            acc[key] = { polygon_id: key, coordinates: [] };
          }
          acc[key].coordinates.push([row.lng, row.lat]);
          return acc;
        }, {});
        polygons = Object.values(groupedPolygons);
        console.log('处理后的多边形数据:', polygons);
        resolve('获取多边形数据成功');
      } else {
        reject('获取多边形数据失败');
      }
    }).catch(error => {
      console.error('请求失败:', error);
      reject(error);
    });
  });

  Promise.all([buildingPositionDataPromise, getCableDataPromise, getRegionCenterDataPromise, getLaserOutPointDataPromise, getPolygonDataPromise]).then(() => {
    console.log('initGlTF')
    initGltf()
  }).catch(error => {
    console.log(error)
  })
}

// 放置呼吸点、常亮点
function placePointLights() {
  // 放置呼吸点
  placeBreathPointLights(loca)
  // 放置常亮点
  placeConstantPointLights(loca)
}

function placeBreathPointLights(loca) {
  let features = []
  buildingPositionData.forEach(e => {
    if (!e.baseData) {
      console.log("wwww", e)
    }
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

function placeLaserFence() {
  // 围栏
  let outLayer = new Loca.PolygonLayer({
    zIndex: 120,
    cullface: 'none',
    shininess: 1,
    hasBottom: false,
    blockHide: false,
    hasSide: true,
    hasTop: false,
    depth: true,
  })

  let outGeo = new Loca.GeoJSONSource({
    data: laserOut
  })
  outLayer.setSource(outGeo)
  outLayer.setStyle({
    topColor: function (_index, _feature) {
      return 'rgba(217,104,104,0.1)'
    },
    sideTopColor: function (_index, _feature) {
      return 'rgba(217,104,104,0.1)'
    },
    sideBottomColor: function (_index, _feature) {
      return 'rgba(237,87,87,1)'
    },
    height: 100,
    altitude: 0,
  })
  loca.add(outLayer)
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
    size: [8, 8],
    texture: constantPointLightTexture,
    borderWidth: 0,
  })
  loca.add(breathPointsScatter)
}
function getWindSpeed() {
  let threshold = 7
  let realSpeed = Math.ceil(Math.random() * threshold)
  let predictedSpeed = realSpeed + Math.ceil(Math.random() * 3)
  return [realSpeed, predictedSpeed]
}
// 放置指示牌
function placeSigns() {
  let features = []
  buildingPositionData.forEach(e => {
    let baseData = e.baseData
    if (baseData) {
      if (baseData.tagName) {
        features.push(createGeoPointFeature([e.lng, e.lat], { name: baseData.tagName, level: e.status, windSpeed: getWindSpeed() }))
      }

    }
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
      let props = feat.properties
      let leftColor = 'rgba(0, 28, 52, 0.6)'
      let rightColor = '#038684'
      let borderColor = '#038684'
      let level1Color = '#c52d37'
      let level2Color = '#f17e2f'
      let level3Color = '#2cb15a'
      let levelColors = [level1Color, level2Color, level3Color]
      let levelTexts = ['一', '二', '三']
      let levelText = ''
      if (props['level'] > 0 && props.level < 4) {
        levelText = '<p style=" font-size:35px; margin: 0;text-align:center;color: ' + levelColors[props['level'] - 1] + ';">' +
          levelTexts[props['level'] - 1] + '级负荷</p>'
      }
      return (
        '<div style="width: 240px; padding: 0; height:100%;display:flex;flex-direction:column;background-image: linear-gradient(to right, ' + leftColor + ',' + leftColor + ',' + rightColor + ',rgba(0,0,0,0.4)); border:4px solid ' + borderColor + '; border-radius:15px;">' +

        '<p style="font-size:35px; color:#fff; text-align:center; margin:0;">' +
        props['name'] +
        '</p>' + levelText +
        '<p style="font-size:35px; color:#fff; text-align:center; margin:0;">' +
        '实际风速: ' + props['windSpeed'][0] +
        '</p>' + levelText +
        '<p style="font-size:35px; color:#fff; text-align:center; margin:0;">' +
        '预测风速: ' + props['windSpeed'][1] +
        '</p>' + levelText +
        '<span style = "width: 240px; margin: 0 auto; display: block;' +
        'background: url(' + tagTexture + ');"/>' +
        '</div >'
      )
    },
    unit: 'meter',
    rotation: 0,
    alwaysFront: true,
    size: [57.5, 18],
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
function getRESM() {
  //从1，2，3中随机选取一个
  const type = Math.floor(Math.random() * 3) + 1
  switch (type) {
    case 1:
      const voltageElement = document.createElement('p');
      voltageElement.innerText = '电流残差RSME超过危险阈值';
      voltageElement.style.color = 'red'; // 错误
      return voltageElement;
    case 2:
      const currentElement = document.createElement('p');
      currentElement.innerText = '电流残差RSME过大';
      currentElement.style.color = 'orange';       //警告
      return currentElement;
    case 3:
      const temperatureElement = document.createElement('p');
      temperatureElement.innerText = '电流残差RSME正常';
      temperatureElement.style.color = 'green'; // 正常
      return temperatureElement;
  }
}

function addCircuitStatePanel(circuitId) {
  // 创建数据信息面板div
  const dataMsgPanel = document.createElement('div');
  // 设置div的id为datamsgpanel
  dataMsgPanel.id = 'datamsgpanel';

  // 获取Vue实例中的响应式数据
  const reactiveData = {
    data: myReactiveData.value
  };
  if (reactiveData.data[circuitId].normal === true) {
    dataMsgPanel.innerHTML = `
        <p>${circuitId}号线路: 正常</p>
        <p>故障概率：${(reactiveData.data[circuitId].faultProbability * 100).toFixed(2)}%</p>
      `;
    dataMsgPanel.appendChild(getRESM());
  } else {
    dataMsgPanel.innerHTML = `
        <p>${circuitId}号线路: 故障</p>
      `;
    dataMsgPanel.appendChild(getRESM());
  }
  // 添加响应式数据到div中
  // dataMsgPanel.innerHTML = `
  //       <p>${circuitId}号线路: ${reactiveData.data[circuitId].faultProbability}</p>
  //     `;
  // 设置div的样式
  dataMsgPanel.style.position = 'absolute';
  dataMsgPanel.style.top = `${event.clientY + 10}px`; // 10px offset from cursor vertically
  dataMsgPanel.style.left = `${event.clientX + 10}px`; // 10px offset from cursor horizontally
  dataMsgPanel.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
  dataMsgPanel.style.padding = '10px';
  dataMsgPanel.style.borderRadius = '5px';
  dataMsgPanel.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
  // 将div添加到文档中
  document.body.appendChild(dataMsgPanel);
}
function removeCircuitStatePanel() {
  const dataMsgPanel = document.getElementById('datamsgpanel');
  if (dataMsgPanel) {
    dataMsgPanel.remove();
  }
}
function addMeshPanel(carId) {
  // 创建数据信息面板div
  const dataMsgPanel = document.createElement('div');
  // 设置div的id为datamsgpanel
  dataMsgPanel.id = 'datamsgpanel';
  console.log("carId===>", carId)
  console.log("carking===>", carKind[carId])
  console.log("gridCarData===>", gridCarData[carKind[carId]])
  const reactiveData = {
    data: gridCarData[carKind[carId]]
  };
  console.log("reactiveData===>", reactiveData.data?.grid, reactiveData.data?.power)
  dataMsgPanel.innerHTML = `
  <p>储能：${reactiveData.data?.grid}kwh</p>
  <p>放电功率: ${reactiveData.data?.power}kw</p>
  `
  // 设置div的样式
  dataMsgPanel.style.position = 'absolute';
  dataMsgPanel.style.top = `${event.clientY + 10}px`; // 10px offset from cursor vertically
  dataMsgPanel.style.left = `${event.clientX + 10}px`; // 10px offset from cursor horizontally
  dataMsgPanel.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
  dataMsgPanel.style.padding = '10px';
  dataMsgPanel.style.borderRadius = '5px';
  dataMsgPanel.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
  // 将div添加到文档中
  document.body.appendChild(dataMsgPanel);
}
// 查看鼠标是否悬停于电缆上面，并触发相应事件
function mouseOnCircuit(event) {
  const mapWindow = event.srcElement
  if (!mapWindow) {
    console.error('未找到container')
    return
  }
  const pointer = new THREE.Vector2(event.layerX / mapWindow.width, event.layerY / mapWindow.height)
  pointer.x = pointer.x * 2 - 1
  pointer.y = -pointer.y * 2 + 1
  if (!camera) return
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children, true)

  if (intersects.length == 0) {
    if (preCircuitId != -1) {
      switchCircuitMat(preCircuitId, preCircuitMat)
      preCircuitId = -1
    }
    removeCircuitStatePanel()
    return
  }

  for (let i = 0; i < intersects.length; i++) {
    const ob = intersects[i].object
    if (ob.isLine && ob.circuitId != preCircuitId) {
      if (preCircuitId != -1) {
        switchCircuitMat(preCircuitId, preCircuitMat)
      }
      removeCircuitStatePanel()
      preCircuitId = ob.circuitId
      preCircuitMat = ob.material
      if (myReactiveData.value[preCircuitId].normal === true) {
        switchCircuitMat(ob.circuitId, highlightMaterial)
      } else {
        switchCircuitMat(ob.circuitId, errorMaterial)
      }
      addCircuitStatePanel(ob.circuitId)
      break
    }
    else if (ob.isMesh && !ob.circuitId && ob.name === "Car") {
      console.log("mesh===>", ob, ob.name)
      removeCircuitStatePanel()
      addMeshPanel(ob.carId)
    }
  }
}

function clickOnBuilding(event) {
  let clickLngLat = [event.lnglat.getLng(), event.lnglat.getLat()]
  console.log(clickLngLat)
  for (let i = 0; i < buildingPositionData.length; i++) {
    let baseData = buildingPositionData[i].baseData
    if (baseData != undefined && baseData.fileName === 'tower.glb') {
      cableClickedId.value = buildingPositionData[i].id;
      showCable.value = true
    } else {
      showCable.value = false
    }

    if (baseData != undefined
      && baseData.clickRadius != undefined
      && getFlatternDistance(clickLngLat, [buildingPositionData[i].lng, buildingPositionData[i].lat]) <= baseData.clickRadius
    ) {
      // switchCableState("ice")
      map.setCenter([buildingPositionData[i].lng, buildingPositionData[i].lat])
      if (baseData.clickZoom) {
        map.setZoom(baseData.clickZoom)
      }
      return
    }
  }
  // 未点击任何建筑
  map.setZoom(defaultZoomLevel)
  showCable.value = false
  // switchCableState("normal")
}

function switchSatellite() {
  if (satelliteLayer) {
    if (!enableSatelliteLayer) {
      map.add(satelliteLayer)
    } else {
      map.remove(satelliteLayer)
    }
    enableSatelliteLayer = !enableSatelliteLayer
  }
}

function switchStyle() {
  let nextStyle = currentStyle == styles.light ? styles.dark : styles.light
  currentStyle = nextStyle
  map.setMapStyle(nextStyle.styleName)
  cableMaterial.color.setHex(nextStyle.cablecolor)
}

function switchCenter(name) {
  let region = regionCenter.find(e => e.name === name)
  if (region) {
    map.setCenter(region.lnglat)
  }
}

function snowCoverAnim(animValue, heatmap, disable) {
  console.log(heatmap)
  let delay = 30000, transform = 5000
  if (disable) {
    heatmap.hide()
  } else {
    heatmap.addAnimate({
      key: 'radius',
      value: animValue,
      random: true,
      transform: transform,
      delay: delay,
      easing: 'Linear' //https://redmed.github.io/chito/example/easing.html
    })
    heatmap.show()
  }
}
const switchCableState = (stateName) => {
  cableState.value.switchCableState(stateName)
}

</script>
<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;

  // .cableTwin {
  //   width: 100px;
  //   height: 100px;
  // }

  .content {
    width: 50vw;
    height: 5%;
    display: flex;
    flex-direction: column;

    .btnOther {
      position: absolute;
      left: 1vh;
      bottom: 4vh;
      z-index: 9999;

      /deep/ .el-button--primary {
        font-size: 1.6vh;
        font-weight: bold;
        border: 1px solid rgba(31, 91, 193, 1);
        border-radius: 0.5vw;
        background-color: rgba(13, 24, 45, 0.2);
      }

      /deep/.el-button--primary:focus,
      .el-button--primary:hover {
        font-weight: bold;
        border: 1px solid rgb(0, 255, 251);
        border-radius: 0.5vw;
        background-color: rgba(21, 255, 0, 0.61);
      }
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
