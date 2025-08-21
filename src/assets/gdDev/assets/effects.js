import { CableDanceShader } from '../assets/shaders/cableDanceShader'
import { WindShader } from '../assets/shaders/wind/windShader'
import { WindPass } from '../assets/shaders/wind/windPass'
import { Water } from './shaders/groundWater/Water'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { IceShader } from '../assets/shaders/iceShader'
import snowFlake1 from './snowflake1.png'
import snowFlake2 from './snowflake2.png'
import snowFlake3 from './snowflake3.png'
import snowFlake4 from './snowflake4.png'
import snowFlake5 from './snowflake5.png'
import rainDrop from './rainDrop.png'
import { GroundNoiseShader } from './shaders/groundNoise'
import { RainShader } from './shaders/rain/rainShader'
import { RainPass } from './shaders/rain/rainPass'

let cables = []
// #region 电缆舞动
function initCableDance(model) {
    let cableDanceUniform = {
        iTime: { value: 0 },
        amplitude: { value: 1.8 },
        frequency: { value: 3 },
        phase: { value: Math.random() * Math.PI },
    }

    let cableDanceMat = new THREE.ShaderMaterial({
        uniforms: cableDanceUniform,
        vertexShader: CableDanceShader.vertexShader,
        fragmentShader: CableDanceShader.fragmentShader,
    })

    model.materialDance = cableDanceMat
    model.timeline = new gsap.timeline()
    model.timeline.to(cableDanceUniform.iTime, {
        value: 1000,
        repeat: Infinity,
        ease: 'none',
        duration: 1000,
    })
    model.timeline.pause()
}

// #endregion

// #region 电缆覆冰
function initCableIce(model) {
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
// #endregion

// #region 电缆特效开关
// 初始化
export function initCableEffects(model) {
    model.materialOri = model.material
    cables.push(model)
    initCableDance(model)
    initCableIce(model)
}

// 状态开关
export function switchCableState(state) {
    cables.forEach(e => {
        e.timeline?.pause()
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
            case 'dance':
                if (e.materialDance) {
                    e.material = e.materialDance
                }
                e.timeline?.resume()
                break
            default:
                console.log('unkonwn state: ', state)
        }
    })
}

// #endregion

// #region 隔离开关
export function breakerAnim(model) {
    if (model.rotated !== undefined && !model.rotated) {
        gsap.to(model.rotation, {
            y: 0,
            duration: 1,
            ease: 'power2.inOut',
        })
        model.rotated = true
    } else {
        gsap.to(model.rotation, {
            y: Math.PI / 2,
            duration: 1,
            ease: 'power2.inOut',
        })
        model.rotated = false
    }
}
// #endregion

// #region 地面网格呼吸灯
export function groundFrame(model) {
    let groundFrameTimeline = new gsap.timeline()
    // console.log('intense: ', model.material)
    model.material.emissive = new THREE.Color(0x32dfef)
    groundFrameTimeline.to(model.material, {
        emissiveIntensity: 10,
        duration: 1,
        yoyo: true,
        repeat: Infinity,
        ease: 'power2.inOut',
    })
}
// #endregion

// #region 下雪
const particleNum = 2000
const maxRange = 1800
const minRange = maxRange / 2
let parameters
const materials = []
const vertices = []
const velocities = []
let snowEnabled = true
let particles = []
let snowCoverAnim

const assignSRGB = (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace
}

export function initSnow(scene) {
    if (particles.length !== 0) {
        particles.forEach(e => {
            scene.add(e)
        })
        return
    }
    const geometry = new THREE.BufferGeometry()
    geometry.vertices = []

    const textureLoader = new THREE.TextureLoader()


    const sprite1 = textureLoader.load(snowFlake1, assignSRGB)
    const sprite2 = textureLoader.load(snowFlake2, assignSRGB)
    const sprite3 = textureLoader.load(snowFlake3, assignSRGB)
    const sprite4 = textureLoader.load(snowFlake4, assignSRGB)
    const sprite5 = textureLoader.load(snowFlake5, assignSRGB)

    for (let i = 0; i < particleNum; i++) {
        const x = Math.random() * maxRange - minRange
        const y = Math.random() * maxRange - minRange
        const z = Math.random() * maxRange - minRange

        vertices.push(x, y, z)
        geometry.vertices.push({ x, y, z })

        const vx = Math.floor(Math.random() * 6 - 3) * 0.1
        const vz = Math.abs(Math.random() * 10 + 3) * -0.05
        const vy = Math.floor(Math.random() * 6 - 3) * 0.1
        const velocity = new THREE.Vector3(vx, vy, vz)

        velocities.push(velocity)
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))


    parameters = [
        [[0.95, 0.95, 1], sprite2, 240],
        [[0.95, 0.95, 1], sprite3, 200],
        [[0.95, 0.95, 1], sprite1, 240],
        [[0.95, 0.95, 1], sprite5, 160],
        [[0.95, 0.95, 1], sprite4, 160]
    ]

    for (let i = 0; i < parameters.length; i++) {
        const color = parameters[i][0]
        const sprite = parameters[i][1]
        const size = parameters[i][2]

        materials[i] = new THREE.PointsMaterial({ size: size, map: sprite, blending: THREE.AdditiveBlending, transparent: true })
        materials[i].color.setHSL(color[0], color[1], color[2], THREE.SRGBColorSpace)

        const particlesTmp = new THREE.Points(geometry, materials[i])

        particlesTmp.rotation.z = Math.random() * 6

        particlesTmp.geometry.velocities = velocities

        scene.add(particlesTmp)
        particles.push(particlesTmp)
    }
    enableSnow(false)
}

function enableSnow(enable) {
    snowEnabled = enable
    particles.forEach(p => {
        p.visible = enable
    })
    switchCableState(enable ? 'ice' : 'normal')
    if (snowCoverAnim) {
        console.log('cover, ', enable)
        if (enable) {
            snowCoverAnim([0, 1], false)
        } else {
            snowCoverAnim([1, 0], true)
        }
    }
}

export const snowAnim = (timeStamp) => {
    if (snowEnabled) {
        particles.forEach(p => {
            const posArr = p.geometry.vertices
            const velArr = p.geometry.velocities
            posArr.forEach((vertex, i) => {
                const velocity = velArr[i]

                const x = i * 3
                const y = i * 3 + 1
                const z = i * 3 + 2

                // const velX = Math.sin(timeStamp * 0.001 * velocity.x) * 0.1
                // const velZ = Math.cos(timeStamp * 0.0015 * velocity.z) * 0.1

                // vertex.x += velX
                vertex.z += velocity.z
                // vertex.z += velZ

                if (vertex.z < -minRange) {
                    vertex.z = minRange
                }

                vertices[x] = vertex.x
                vertices[y] = vertex.y
                vertices[z] = vertex.z
            })
            p.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
        })
    }
    requestAnimationFrame(snowAnim)
}
// #endregion

// #region 积水
let water
let waterScene
const params = {
    color: '#7c8f9c',
    // color: '#ffffff',
    scale: 1,
    flowX: 1,
    flowY: 1,
    reflectivity: 0.01,
}
export function initGroundWater(_, scene) {
    waterScene = scene
    water = new Water(new THREE.PlaneGeometry(200, 200), {
        color: params.color,
        scale: params.scale,
        flowDirection: new THREE.Vector2(params.flowX, params.flowY),
        textureWidth: 1024,
        textureHeight: 1024,
        reflectivity: params.reflectivity,
    })
    water.position.y = 0.05
    water.rotateX(- Math.PI / 2)
}

function enableGroundWater(enabled) {
    if (enabled) {
        waterScene?.add(water)
    } else {
        waterScene?.remove(water)
    }
}

// 地面起伏
export function groundNoise(ob) {
    ob.material.onBeforeCompile = (info) => {
        info.vertexShader = GroundNoiseShader.vertexShader
    }
}

// #endregion

// #region 下雨
// Rain Drop Texture
let rainCount = 4000
let rainEnabled = false
let rain
let rainRange
let rainVertices = []
let rainDropVelocity = 4
let rainComposer
let rainPass
export function initRain(range, offset, scene, composer) {
    if (rain) {
        scene.add(rain)
        return
    }

    const textureLoader = new THREE.TextureLoader()
    const rainDropSprite = textureLoader.load(rainDrop, assignSRGB)

    rainRange = range
    const rainGeo = new THREE.BufferGeometry()
    rainGeo.vertices = []
    for (let i = 0; i < rainCount; i++) {
        const x = Math.random() * range.x + offset.x
        const y = Math.random() * range.y + offset.y
        const z = Math.random() * range.z + offset.z
        rainVertices.push(x, y, z)
        rainGeo.vertices.push({ x, y, z })
    }

    rainGeo.setAttribute('position', new THREE.Float32BufferAttribute(rainVertices, 3))

    let rainMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 80,
        transparent: true,
        map: rainDropSprite,
    })

    rain = new THREE.Points(rainGeo, rainMaterial)
    scene.add(rain)

    rainComposer = composer
    let rainUniform = {
        iTime: { value: 0.1 },
        tDiffuse: { value: null },
    }

    let rainMat = new THREE.ShaderMaterial({
        uniforms: rainUniform,
        vertexShader: RainShader.vertexShader,
        fragmentShader: RainShader.fragmentShader,
    })

    rainPass = new RainPass(rainMat)
    enableRain(false)
}

export function rainAnim() {
    if (rainEnabled) {
        rain.geometry.vertices.forEach((p, i) => {
            const x = i * 3
            const y = i * 3 + 1
            const z = i * 3 + 2

            p.z -= rainDropVelocity * 1

            if (p.z < 0) {
                p.z = rainRange.z
            }

            rainVertices[x] = p.x
            rainVertices[y] = p.y
            rainVertices[z] = p.z
        })
        // rain.rotation.y += 0.002;
        rain.geometry.setAttribute('position', new THREE.Float32BufferAttribute(rainVertices, 3))
    }
    requestAnimationFrame(rainAnim)
}

function enableRain(enabled) {
    enableGroundWater(enabled)
    rainEnabled = enabled
    rain.visible = rainEnabled
    if (enabled) {
        rainComposer?.addPass(rainPass)
    } else {
        rainComposer?.removePass(rainPass)
    }
}
// #endregion

// #region 大风
let windComposer
let windPass
let smokeParams = { rgb: [100, 100, 100], a: 0.8, speed: 8 }
let mixer
let actions = []

export function updateWind(timeDelta) {
    if (!weatherFuncs.wind.enabled) return

    if (mixer) {
        mixer.update(timeDelta)
    }
}
export function initWind(composer, modelRoot) {
    windComposer = composer
    // 风暴
    let windUniform = {
        iTime: { value: 0.1 },
        tDiffuse: { value: null },
        speed: { value: smokeParams.speed },
        smokeColor: {
            value: new THREE.Vector4(
                (smokeParams.rgb[0] / 255) * smokeParams.a,
                (smokeParams.rgb[1] / 255) * smokeParams.a,
                (smokeParams.rgb[2] / 255) * smokeParams.a,
                smokeParams.a
            ),
        },
    }

    let windMat = new THREE.ShaderMaterial({
        uniforms: windUniform,
        vertexShader: WindShader.vertexShader,
        fragmentShader: WindShader.fragmentShader,
    })

    windPass = new WindPass(windMat)

    mixer = new THREE.AnimationMixer(modelRoot.scene)
    let clips = modelRoot.animations
    clips.forEach(clip => {
        actions.push(mixer.clipAction(clip).reset().stop())
    })
}

// 大风开关
function BeginWind() {
    windComposer?.addPass(windPass)
    actions.forEach(action => {
        action.reset().play()
    })
}

function EndWind() {
    windComposer?.removePass(windPass)
    actions.forEach(action => {
        action.stop()
    })
}

function enableWind(enabled) {
    if (enabled) {
        BeginWind()
        switchCableState('dance')
    } else {
        EndWind()
        switchCableState('normal')
    }
}
// #endregion

// #region 天气特效开关
let weatherFuncs = {
    snow: { func: enableSnow, enabled: false },
    rain: { func: enableRain, enabled: false },
    wind: { func: enableWind, enabled: false },
    normal: { func: () => { }, enabled: false },
}

export function switchWeather(weather) {
    if (weatherFuncs[weather].enabled == true) {
        return
    }
    Object.entries(weatherFuncs).forEach(e => {
        e[1].func(false)
        e[1].enabled = false
    })
    weatherFuncs[weather].func(true)
    weatherFuncs[weather].enabled = true
}

export function addSnowCoverAnim(anim) {
    if (anim) {
        snowCoverAnim = anim
    }
}
// #endregion