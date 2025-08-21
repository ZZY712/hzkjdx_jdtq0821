<template>
    <div>
        <div id="containerCable">
            <div id="discription">{{ "编号：" + props.cableId + " " + " " + " 状态：" + cableStateDiscription }}</div>
            <!-- <button @click="BeginWind" class="windBtnL">有风</button>
    <button @click="EndWind" class="windBtnR">无风</button> -->
        </div>
    </div>
</template>
<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { onMounted, ref, defineProps } from "vue";
import { IceShader } from "@/assets/gdDev/assets/shaders/iceShader";

defineExpose({ switchCableState })
const props = defineProps(['cableId'])
const cableStateDiscription = ref("正常")
// 用于射线检测
// let models = null;
const scene = new THREE.Scene();
const clock = new THREE.Clock();

// // 坐标辅助线
// const axesHelper = new THREE.AxesHelper(1001);
// scene.add(axesHelper);

// 相机
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
);
camera.position.set(50, 30, 0);
scene.add(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth / 4, window.innerHeight / 4);

// 后处理(轮廓线)
// const composer = new EffectComposer(renderer);
// const renderPass = new RenderPass(scene, camera);
// composer.addPass(renderPass);
// const outlinePass = new OutlinePass(
//   new THREE.Vector2(window.innerWidth, window.innerHeight),
//   scene,
//   camera
// );
// composer.addPass(outlinePass);

// let smokeParams = JSON.parse(localStorage.getItem("smokeParams"));
// if (!smokeParams) {
//   smokeParams = { rgb: [100, 100, 100], a: 0.8, speed: 3 };
// }
// const params = {
//   color: '#7c8f9c',
//   // color: '#ffffff',
//   scale: 1,
//   flowX: 1,
//   flowY: 1,
//   reflectivity: 0.02,
// };
// let water = new Water(new THREE.PlaneGeometry(100, 100), {
//   color: params.color,
//   scale: params.scale,
//   flowDirection: new THREE.Vector2(params.flowX, params.flowY),
//   textureWidth: 1024,
//   textureHeight: 1024,
//   reflectivity: params.reflectivity,
// });
// water.position.y = 0.1;
// water.rotateX(-Math.PI / 2)
// scene.add(water)

// 大风淡入淡出(用亮度代替透明度)
// let windFadeTime = JSON.parse(localStorage.getItem("windFadeTime"));
// if (!windFadeTime) {
//   windFadeTime = 5;
// }
// let windFadeParams = { ...smokeParams, windFadeTime: windFadeTime };

// // 每3秒保存一次参数
// setInterval(() => {
//   localStorage.setItem("smokeParams", JSON.stringify(smokeParams));
//   localStorage.setItem("windFadeTime", JSON.stringify(windFadeParams.windFadeTime));
// }, 3000);

// 水

// 风暴
// let windOn = false;
// var tuniform = {
//   iTime: { value: 0.1 },
//   tDiffuse: { value: null },
//   speed: { value: smokeParams.speed },
//   smokeColor: {
//     value: new THREE.Vector4(
//       (smokeParams.rgb[0] / 255) * smokeParams.a,
//       (smokeParams.rgb[1] / 255) * smokeParams.a,
//       (smokeParams.rgb[2] / 255) * smokeParams.a,
//       smokeParams.a
//     ),
//   },
// };

// var mat = new THREE.ShaderMaterial({
//   uniforms: tuniform,
//   vertexShader: WindShader.vertexShader,
//   fragmentShader: WindShader.fragmentShader,
// });

// const windPass = new WindPass(mat);
// const outputPass = new OutputPass();
// composer.addPass(outputPass);

// 大风开关
// function BeginWind() {
//   if (windOn) return;
//   windOn = true;
//   composer.addPass(windPass);
//   windFadeParams.a = 0;
//   changeColor(windFadeParams);
//   var interval = setInterval(() => {
//     if (windFadeParams.a >= smokeParams.a) {
//       clearInterval(interval);
//     }
//     windFadeParams.a += (100 / 1000 / windFadeParams.windFadeTime) * smokeParams.a;
//     changeColor(windFadeParams);
//   }, 100);
// }

// function EndWind() {
//   if (!windOn) return;
//   windOn = false;
//   windFadeParams.a = smokeParams.a;
//   changeColor(windFadeParams);
//   var interval = setInterval(() => {
//     if (windFadeParams.a <= 0) {
//       composer.removePass(windPass);
//       clearInterval(interval);
//     }
//     windFadeParams.a -= (100 / 1000 / windFadeParams.windFadeTime) * smokeParams.a;
//     changeColor(windFadeParams);
//   }, 100);
// }

// 大风参数
// const gui = new dat.GUI();
// gui
//   .addColor(smokeParams, "rgb")
//   .name("大风颜色")
//   .onChange(() => changeColor(smokeParams));
// gui
//   .add(smokeParams, "a")
//   .name("大风透明度")
//   .min(0)
//   .max(1)
//   .onChange(() => changeColor(smokeParams));
// gui
//   .add(smokeParams, "speed")
//   .name("风速")
//   .min(0)
//   .onChange(() => (tuniform.speed.value = smokeParams.speed));
// gui.add(windFadeParams, "windFadeTime").min(0).name("淡入淡出时间");

// function changeColor(params) {
//   tuniform.smokeColor.value = new THREE.Vector4(
//     (params.rgb[0] / 255) * params.a,
//     (params.rgb[1] / 255) * params.a,
//     (params.rgb[2] / 255) * params.a,
//     params.a
//   );
// }

// control
const controls = new OrbitControls(camera, renderer.domElement);

//sky
let rgbLoader = new RGBELoader();
rgbLoader.load("models/gaoDe/sky.hdr", (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
});

let cables = []
const cableNames = [
    "curveJinSuNorthOuter",
    "curveJinSuSouthOuter",
    "curveSuHuangNorthOuter",
    "curveSuHuangSouthOuter",
]

const loader = new GLTFLoader();

//Load a glTF resource
loader.load(
    // resource URL
    "models/gaoDe/cableNormal.glb",
    // called when the resource is loaded
    function (gltf) {
        // models = gltf.scene;
        let models = gltf.scene
        scene.add(models);
        models.children.forEach(e => {
            cableNames.forEach(n => {
                if (n === e.name) {
                    initCableIce(e)
                }
            })
        });
    },
    // called while loading is progressing
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    // called when loading has errors
    function (error) {
        console.log("An error happened : ", error);
    }
);

// 两个光线：全局光和平行光
// const light1 = new THREE.DirectionalLight(0xffffff, 1);
const light = new THREE.AmbientLight(0x404040); // soft white light
// light1.position.set(10, 50, 100);
scene.add(light);
// scene.add(light1);

// 相机位置切换
// let timeLine1 = gsap.timeline();
// let timeLine2 = gsap.timeline();
// function moveCamera(pos, target) {
//   timeLine1.to(camera.position, {
//     x: pos.x,
//     y: pos.y,
//     z: pos.z,
//     duration: 1,
//     ease: "power2.inOut",
//   });

//   timeLine2.to(controls.target, {
//     x: target.x,
//     y: target.y,
//     z: target.z,
//     duration: 1,
//     ease: "power2.inOut",
//   });
// }

// const raycaster = new THREE.Raycaster();
// const mousePoint = new THREE.Vector2();

// function clickOnBuilding(event) {
//   if (event.button != 2) {
//   }

//   mousePoint.x = (event.clientX / window.innerWidth) * 2 - 1;
//   mousePoint.y = -(event.clientY / window.innerHeight) * 2 + 1;
//   raycaster.setFromCamera(mousePoint, camera);

//   // calculate objects intersecting the picking ray
//   const intersects = raycaster.intersectObject(models);
//   if (intersects.length != 0) {
//     let find = false;
//     // 如果找到了,就把模型位置存下来
//     let pos = null;
//     for (let i = 0; i < intersects.length; ++i) {
//       let ob = intersects[i].object;
//       while (!find) {
//         if (ob == null) {
//           break;
//         }
//         // 是否点击到了模型
//         ModelData.forEach((data) => {
//           if (ob.name === data.name) {
//             find = true;
//             pos = new THREE.Vector3(ob.position.x, ob.position.y, ob.position.z);
//             //pos.multiplyScalar(scaleFactor);
//             // 轮廓线
//             outlinePass.selectedObjects = [ob];
//           }
//         });
//         ob = ob.parent;
//       }
//       if (find) {
//         break;
//       }
//     }
//     if (pos != null) {
//       // 点击到了模型
//       let cameraPos = new THREE.Vector3(pos.x, pos.y + 20, pos.z + 20);
//       moveCamera(cameraPos, pos);
//     }
//   }
// }
// 模型数据
// const ModelData = [
//   {
//     name: "House1",
//   },
//   {
//     name: "House2",
//   },
//   {
//     name: "House3",
//   },
//   {
//     name: "House4",
//   },
//   {
//     name: "Transformer1",
//   },
//   {
//     name: "Transformer2",
//   },
//   {
//     name: "breaker1",
//   },
//   {
//     name: "breaker2",
//   },
//   {
//     name: "breaker3",
//   },
//   {
//     name: "breaker4",
//   },
//   {
//     name: "breaker5",
//   },
//   {
//     name: "breaker6",
//   },
//   {
//     name: "breaker7",
//   },
//   {
//     name: "breaker8",
//   },
//   {
//     name: "breaker9",
//   },
//   {
//     name: "breaker10",
//   },
//   {
//     name: "breaker11",
//   },
//   {
//     name: "breaker12",
//   },
//   {
//     name: "breaker13",
//   },
//   {
//     name: "breaker14",
//   },
//   {
//     name: "breaker15",
//   },
//   {
//     name: "breaker16",
//   },
//   {
//     name: "breaker17",
//   },
//   {
//     name: "breaker18",
//   },
//   {
//     name: "CT1",
//   },
//   {
//     name: "CT2",
//   },
//   {
//     name: "CT3",
//   },
//   {
//     name: "CT4",
//   },
//   {
//     name: "CT5",
//   },
//   {
//     name: "CT6",
//   },
//   {
//     name: "CT7",
//   },
//   {
//     name: "CT8",
//   },
//   {
//     name: "CT9",
//   },
// ];

// 渲染
function render() {
    // update the picking ray with the camera and pointer position
    controls.update(clock.getDelta());
    // composer.render();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
onMounted(() => {
    const element = document.getElementById("containerCable");
    element.appendChild(renderer.domElement);
    scene.updateMatrixWorld(true);
    render();
});

function initCableIce(model) {
    model.materialOri = model.material
    cables.push(model)
    let iceUniform = {
        // 噪声取样步长
        step: { value: 10.7 },
        // 噪声起始位置
        origin: { value: new THREE.Vector2(66.0, 66.0) },
        // 冰柱长度
        iceHeight: { value: Math.sqrt(2) },
    }

    let iceMat = new THREE.ShaderMaterial({
        uniforms: iceUniform,
        vertexShader: IceShader.vertexShader,
        fragmentShader: IceShader.fragmentShader,
    })

    model.materialIce = iceMat
}

function switchCableState(state) {
    switch (state) {
        case 'normal':
            cableStateDiscription.value = "正常"
            break
        case 'ice':
            cableStateDiscription.value = "覆冰"
            break
        // case 'dance':
        //     if (e.materialDance) {
        //         e.material = e.materialDance
        //     }
        //     e.timeline?.resume()
        //     break
        default:
            console.log('unkonwn state: ', state)
    }
    cables.forEach(e => {
        // e.timeline?.pause()
        switch (state) {
            case 'normal':
                if (e.materialOri) {
                    e.material = e.materialOri
                }
                break
            case 'ice':
                if (e.materialIce) {
                    e.material = e.materialIce
                }
                break
            // case 'dance':
            //     if (e.materialDance) {
            //         e.material = e.materialDance
            //     }
            //     e.timeline?.resume()
            //     break
            default:
                console.log('unkonwn state: ', state)
        }
    })
}

</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
}

canvas {
    width: 90vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
}

#containerCable {
    /* width: 100%;
    height: 100%; */
    box-shadow: 0 0 5px skyblue;
    z-index: 999;
    position: absolute;
    top: 20vh;
    right: 6vw;
}

#discription {
    color: #fff;
    font-size: medium;
    font-weight: bold;
    position: absolute;
    bottom: 2vh;
    right: 50%;
    transform: translate(50%);
}
</style>
