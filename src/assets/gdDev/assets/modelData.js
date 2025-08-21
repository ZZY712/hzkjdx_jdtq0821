import * as Effects from './effects.js'

export const ModelData = [
    {
        name: 'House1',
        tag: '配电室',
    },
    {
        name: 'House2',
        tag: '配电室',
    },
    {
        name: 'Transformer1',
        tag: '变压器',
    },
    {
        name: 'Transformer2',
        tag: '变压器',
    },
    {
        name: 'breaker3',
        tag: '隔离开关',
    },
    {
        name: 'breaker10',
        tag: '隔离开关',
    },
    {
        name: 'breaker1-switch',
        anim: Effects.breakerAnim,
    },
    {
        name: 'breaker2-switch',
        anim: Effects.breakerAnim,
    },
    {
        name: 'breaker3-switch',
        anim: Effects.breakerAnim,
    },
    {
        name: 'breaker4-switch',
        anim: Effects.breakerAnim,
    },
    {
        name: 'breaker5-switch',
        anim: Effects.breakerAnim,
    },
    {
        name: 'breaker8-switch',
        anim: Effects.breakerAnim,
    },
    {
        name: 'breaker9-switch',
        anim: Effects.breakerAnim,
    },
    {
        name: 'breaker10-switch',
        anim: Effects.breakerAnim,
    },
    {
        name: 'breaker11-switch',
        anim: Effects.breakerAnim,
    },
    {
        name: 'breaker12-switch',
        anim: Effects.breakerAnim,
    },
    {
        name: 'breaker13-switch',
        anim: Effects.breakerAnim,
    },
    {
        name: 'breaker14-switch',
        anim: Effects.breakerAnim,
    },
    {
        name: 'disconnector2',
        tag: '断路器',
    },
    {
        name: 'disconnector3',
        tag: '断路器',
    },
    {
        name: 'undergroundCable',
        tag: '地下电缆',
        doNotClick: true,
    },
    {
        name: 'Ground',
        doNotClick: true,
        initFunc: Effects.groundNoise,
    },
    {
        name: 'platform1',
        doNotClick: true,
        initFunc: Effects.groundNoise,

    },
    {
        name: 'platform2',
        doNotClick: true,
        initFunc: Effects.groundNoise,
    },
    {
        name: 'platform3',
        doNotClick: true,
        initFunc: Effects.groundNoise,
    },
    {
        name: 'platform4',
        doNotClick: true,
        initFunc: Effects.groundNoise,
    },
    {
        name: 'platform5',
        doNotClick: true,
        initFunc: Effects.groundNoise,
    },
    {
        name: 'ground-frames',
        doNotClick: true,
        initFunc: Effects.groundFrame,
    },
    {
        name: 'indoor110kv',
        doNotClick: true,
    },
    {
        name: 'indoor10kvFirstFloor',
        doNotClick: true,
    },
    {
        name: 'indoor10kvSecondFloor',
        doNotClick: true,
    },
    {
        name: 'tower1',
        tag: '高压电塔',
    },
    {
        name: 'tower2',
        tag: '高压电塔',
    },
    {
        name: 'bus',
        tag: '母线',
    },
    {
        name: 'curveJinSuNorth',
        tag: '金苏北线',
        initFunc: Effects.initCableEffects,
        doNotClick: true,
    },
    {
        name: 'curveJinSuSouth',
        tag: '金苏南线',
        initFunc: Effects.initCableEffects,
        doNotClick: true,
    },
    {
        name: 'curveSuHuangNorth',
        tag: '苏黄北线',
        initFunc: Effects.initCableEffects,
        doNotClick: true,
    },
    {
        name: 'curveSuHuangSouth',
        tag: '苏黄南线',
        initFunc: Effects.initCableEffects,
        doNotClick: true,
    },
    {
        name: 'curveJinSuNorthOuter',
        initFunc: Effects.initCableEffects,
        doNotClick: true,
    },
    {
        name: 'curveJinSuSouthOuter',
        initFunc: Effects.initCableEffects,
        doNotClick: true,
    },
    {
        name: 'curveSuHuangNorthOuter',
        initFunc: Effects.initCableEffects,
        doNotClick: true,
    },
    {
        name: 'curveSuHuangSouthOuter',
        initFunc: Effects.initCableEffects,
        doNotClick: true,
    },
    {
        name: 'capacitor1',
        tag: '电容器',
    },
    {
        name: 'capacitor2',
        tag: '电容器',
    },
    {
        name: 'capacitor3',
        tag: '电容器',
    },
    {
        name: 'waterLayer',
        doNotClick: true,
        initFunc: Effects.initGroundWater,
    }
]
