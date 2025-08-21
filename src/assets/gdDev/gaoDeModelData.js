import { gsap } from 'gsap'
import * as THREE from 'three'

// 固定数据，定义模型文件名称、电缆连接点偏移量
export let modelBaseData = [
    // 输电塔
    {
        id: 1,
        fileName: 'tower.glb',
        clickRadius: 7,
        clickZoom: 23,
        // 电缆连接点偏移量(可有多个连接点)
        cableJoinPoint: [
            {
                xOffset: 1.77,
                yOffset: 0,
                zOffset: 4.75,
            },
            {
                xOffset: -1.77,
                yOffset: 0,
                zOffset: 4.75,
            }
        ],
        // 设置常亮灯
        constantPointLight: true
    },
    // 220kv
    {
        id: 2,
        fileName: 'substation220.glb',
        // 点击漫游效果：判断鼠标击中的半径
        clickRadius: 70,
        clickZoom: 22,
        cableJoinPoint: [
            {
                xOffset: 0,
                yOffset: 30,
                zOffset: 0
            },
        ],
        // 设置呼吸灯
        breathPointLight: true,
        tagName: '220kv变电站',
    },
    // 小区
    {
        id: 3,
        clickRadius: 50,
        clickZoom: 22,
        fileName: 'community.glb',
        breathPointLight: true,
        tagName: '居民区',
    },
    // 10kv变电箱
    {
        id: 4,
        fileName: '10kv.glb',
        clickRadius: 7,
        clickZoom: 25,
        cableJoinPoint: [
            {
                xOffset: 0,
                yOffset: 0,
                zOffset: 0,
            },
            {
                xOffset: 0,
                yOffset: 0,
                zOffset: 0
            }
        ],
        breathPointLight: true,
        tagName: '10kv变电箱',
    },
    // 小区变压器
    {
        id: 5,
        fileName: 'communityTransformer.glb',
        clickRadius: 7,
        clickZoom: 24,
        cableJoinPoint: [
            {
                xOffset: 0.15,
                yOffset: 0,
                zOffset: 3
            },
            {
                xOffset: -0.2,
                yOffset: 0,
                zOffset: 3
            }
        ],
        breathPointLight: true
    },
    // 小区电线杆
    {
        id: 6,
        fileName: 'powerPole.glb',
        cableJoinPoint: [
            {
                xOffset: 0.3,
                yOffset: 0,
                zOffset: 2.5,
            },
            {
                xOffset: -0.3,
                yOffset: 0,
                zOffset: 2.5
            }
        ],
        constantPointLight: true
    },
    // 220kv变压器外面的架子
    {
        id: 7,
        fileName: 'substationShelf.glb',
        cableJoinPoint: [
            {
                xOffset: 0,
                yOffset: 0,
                zOffset: 0
            },
        ],
    },
    {
        id: 8,
        fileName: 'windPower.glb',
        cableJoinPoint: [],
        clickRadius: 7,
        clickZoom: 23,
        // 设置常亮灯
        constantPointLight: true,
        tagName: '风力储能阵列',
    },
    {
        id: 9,
        fileName: 'solarPower.glb',
        cableJoinPoint: [],
        clickRadius: 7,
        clickZoom: 23,
        // 设置常亮灯
        constantPointLight: true,
        tagName: '光能储能阵列',
    },
    {
        id: 10,
        fileName: 'energyStorage.glb',
        cableJoinPoint: [],
        clickRadius: 7,
        clickZoom: 23,
        // 设置常亮灯
        constantPointLight: true,
        tagName: '储能站',
    },
]

// 模型摆放、电缆连接数据。假数据，已弃用
export let fakeData = {
    models: [
        // {
        //     id: 1,
        //     // 对应 baseBata 的 id 字段
        //     modelId: 2,
        //     // 经纬度
        //     lnglat: [113.58377, 34.704543],
        //     // 旋转角度
        //     angle: 0,
        // },
        {
            id: 1,
            modelId: 2,
            // 经纬度
            lnglat: [113.58377, 34.704543],
            angle: 0,
        },
        {
            id: 2,
            modelId: 1,
            lnglat: [113.582639, 34.70753],
            angle: 0
        },
        {
            id: 3,
            modelId: 1,
            lnglat: [113.582269, 34.708192],
            angle: 0
        },
        {
            id: 4,
            modelId: 1,
            lnglat: [113.582543, 34.709237],
            angle: 0
        },
        {
            id: 5,
            modelId: 1,
            lnglat: [113.579742, 34.710481],
            angle: 0,
        },
        {
            id: 6,
            modelId: 1,
            lnglat: [113.578857, 34.711437],
            angle: 0
        },
        {
            id: 7,
            modelId: 1,
            lnglat: [113.584538, 34.709409],
            angle: 0,
        },
        {
            id: 8,
            modelId: 1,
            lnglat: [113.586239, 34.709532],
            angle: 0
        },
        {
            id: 9,
            modelId: 5,
            lnglat: [113.5862, 34.70932],
            angle: 0,
        },
        {
            id: 10,
            modelId: 6,
            lnglat: [113.5862, 34.70912],
            angle: 0,
        },
        {
            id: 11,
            modelId: 4,
            lnglat: [113.5863, 34.70912],
            angle: 0,
        },
        {
            id: 12,
            modelId: 3,
            lnglat: [113.5862, 34.70892],
            angle: 0,
        },
        {
            id: 13,
            modelId: 7,
            lnglat: [113.58377, 34.704843],
            angle: 0,
        },

        {
            id: 112,
            modelId: 1,
            lnglat: [113.576639, 34.70653],
            angle: 0
        },
        {
            id: 113,
            modelId: 1,
            lnglat: [113.576269, 34.707192],
            angle: 0
        },
        {
            id: 114,
            modelId: 1,
            lnglat: [113.576543, 34.708237],
            angle: 0
        },
        {
            id: 115,
            modelId: 1,
            lnglat: [113.573742, 34.709481],
            angle: 0
        },
        {
            id: 116,
            modelId: 1,
            lnglat: [113.572857, 34.710437],
            angle: 0
        },
        {
            id: 117,
            modelId: 1,
            lnglat: [113.578538, 34.708409],
            angle: 0
        },
        {
            id: 118,
            modelId: 1,
            lnglat: [113.580239, 34.708532],
            angle: 0
        },

        {
            id: 122,
            modelId: 1,
            lnglat: [113.584639, 34.71353],
            angle: 0
        },
        {
            id: 123,
            modelId: 1,
            lnglat: [113.584269, 34.714192],
            angle: 0
        },
        {
            id: 124,
            modelId: 1,
            lnglat: [113.584543, 34.715237],
            angle: 0
        },
        {
            id: 125,
            modelId: 1,
            lnglat: [113.581742, 34.716481],
            angle: 0
        },
        {
            id: 126,
            modelId: 1,
            lnglat: [113.580857, 34.717437],
            angle: 0
        },
        {
            id: 127,
            modelId: 1,
            lnglat: [113.586538, 34.715409],
            angle: 0
        },
        {
            id: 128,
            modelId: 1,
            lnglat: [113.588239, 34.715532],
            angle: 0
        },

        {
            id: 132,
            modelId: 1,
            lnglat: [113.581639, 34.71753],
            angle: 0
        },
        {
            id: 133,
            modelId: 1,
            lnglat: [113.581269, 34.718192],
            angle: 0
        },
        {
            id: 134,
            modelId: 1,
            lnglat: [113.581543, 34.719237],
            angle: 0
        },
        {
            id: 135,
            modelId: 1,
            lnglat: [113.578742, 34.720481],
            angle: 0
        },
        {
            id: 136,
            modelId: 1,
            lnglat: [113.577857, 34.721437],
            angle: 0
        },
        {
            id: 137,
            modelId: 1,
            lnglat: [113.583538, 34.719409],
            angle: 0
        },
        {
            id: 138,
            modelId: 1,
            lnglat: [113.585239, 34.719532],
            angle: 0
        },


        {
            id: 142,
            modelId: 1,
            lnglat: [113.592639, 34.70653],
            angle: 0
        },
        {
            id: 143,
            modelId: 1,
            lnglat: [113.592269, 34.707192],
            angle: 0
        },
        {
            id: 144,
            modelId: 1,
            lnglat: [113.592543, 34.708237],
            angle: 0
        },
        {
            id: 145,
            modelId: 1,
            lnglat: [113.589742, 34.709481],
            angle: 0
        },
        {
            id: 146,
            modelId: 1,
            lnglat: [113.588857, 34.710437],
            angle: 0
        },
        {
            id: 147,
            modelId: 1,
            lnglat: [113.594538, 34.708409],
            angle: 0
        },
        {
            id: 148,
            modelId: 1,
            lnglat: [113.596239, 34.708532],
            angle: 0
        },

        {
            id: 152,
            modelId: 1,
            lnglat: [113.570639, 34.70853],
            angle: 0
        },
        {
            id: 153,
            modelId: 1,
            lnglat: [113.570269, 34.709192],
            angle: 0
        },
        {
            id: 154,
            modelId: 1,
            lnglat: [113.571543, 34.710237],
            angle: 0
        },
        {
            id: 155,
            modelId: 1,
            lnglat: [113.568742, 34.711481],
            angle: 0
        },
        {
            id: 156,
            modelId: 1,
            lnglat: [113.567857, 34.712437],
            angle: 0
        },
        {
            id: 157,
            modelId: 1,
            lnglat: [113.573538, 34.710409],
            angle: 0
        },
        {
            id: 158,
            modelId: 1,
            lnglat: [113.575239, 34.710532],
            angle: 0
        },
    ],
    // 电缆
    cables: [
        [
            { modelDataId: 118, joinPointIndex: 0, },
            { modelDataId: 5, joinPointIndex: 0, },
        ],
        [
            { modelDataId: 8, joinPointIndex: 0, },
            { modelDataId: 122, joinPointIndex: 0, },
        ],
        [
            { modelDataId: 126, joinPointIndex: 0, },
            { modelDataId: 132, joinPointIndex: 0, },
        ],
        [
            { modelDataId: 8, joinPointIndex: 0, },
            { modelDataId: 142, joinPointIndex: 0, },
        ],
        [
            { modelDataId: 1, joinPointIndex: 0, },
            { modelDataId: 2, joinPointIndex: 0, },
            { modelDataId: 3, joinPointIndex: 0, },
            { modelDataId: 4, joinPointIndex: 0, },
            { modelDataId: 5, joinPointIndex: 0, },
            { modelDataId: 6, joinPointIndex: 0, },
        ],
        [
            { modelDataId: 4, joinPointIndex: 0, },
            { modelDataId: 7, joinPointIndex: 0, },
            { modelDataId: 8, joinPointIndex: 0, },
        ],
        [
            { modelDataId: 8, joinPointIndex: 0, },
            { modelDataId: 9, joinPointIndex: 0, },
            { modelDataId: 10, joinPointIndex: 0, },
        ],

        // 第二根线
        [
            { modelDataId: 2, joinPointIndex: 1, },
            { modelDataId: 3, joinPointIndex: 1, },
            { modelDataId: 4, joinPointIndex: 1, },
            { modelDataId: 5, joinPointIndex: 1, },
            { modelDataId: 6, joinPointIndex: 1, },
        ],
        [
            { modelDataId: 4, joinPointIndex: 1, },
            { modelDataId: 7, joinPointIndex: 1, },
            { modelDataId: 8, joinPointIndex: 1, },
        ],
        [
            { modelDataId: 8, joinPointIndex: 1, },
            { modelDataId: 9, joinPointIndex: 1, },
            { modelDataId: 10, joinPointIndex: 1, },
        ],
        // 第二块
        [
            { modelDataId: 112, joinPointIndex: 0, },
            { modelDataId: 113, joinPointIndex: 0, },
            { modelDataId: 114, joinPointIndex: 0, },
            { modelDataId: 115, joinPointIndex: 0, },
            { modelDataId: 116, joinPointIndex: 0, },
        ],
        [
            { modelDataId: 114, joinPointIndex: 0, },
            { modelDataId: 117, joinPointIndex: 0, },
            { modelDataId: 118, joinPointIndex: 0, },
        ],
        [
            { modelDataId: 112, joinPointIndex: 1, },
            { modelDataId: 113, joinPointIndex: 1, },
            { modelDataId: 114, joinPointIndex: 1, },
            { modelDataId: 115, joinPointIndex: 1, },
            { modelDataId: 116, joinPointIndex: 1, },
        ],
        [
            { modelDataId: 114, joinPointIndex: 1, },
            { modelDataId: 117, joinPointIndex: 1, },
            { modelDataId: 118, joinPointIndex: 1, },
        ],

        // 第二块
        [
            { modelDataId: 112, joinPointIndex: 0, },
            { modelDataId: 113, joinPointIndex: 0, },
            { modelDataId: 114, joinPointIndex: 0, },
            { modelDataId: 115, joinPointIndex: 0, },
            { modelDataId: 116, joinPointIndex: 0, },
        ],
        [
            { modelDataId: 114, joinPointIndex: 0, },
            { modelDataId: 117, joinPointIndex: 0, },
            { modelDataId: 118, joinPointIndex: 0, },
        ],
        [
            { modelDataId: 112, joinPointIndex: 1, },
            { modelDataId: 113, joinPointIndex: 1, },
            { modelDataId: 114, joinPointIndex: 1, },
            { modelDataId: 115, joinPointIndex: 1, },
            { modelDataId: 116, joinPointIndex: 1, },
        ],
        [
            { modelDataId: 114, joinPointIndex: 1, },
            { modelDataId: 117, joinPointIndex: 1, },
            { modelDataId: 118, joinPointIndex: 1, },
        ],
        // 第3块
        [
            { modelDataId: 122, joinPointIndex: 0, },
            { modelDataId: 123, joinPointIndex: 0, },
            { modelDataId: 124, joinPointIndex: 0, },
            { modelDataId: 125, joinPointIndex: 0, },
            { modelDataId: 126, joinPointIndex: 0, },
        ],
        [
            { modelDataId: 124, joinPointIndex: 0, },
            { modelDataId: 127, joinPointIndex: 0, },
            { modelDataId: 128, joinPointIndex: 0, },
        ],
        [
            { modelDataId: 122, joinPointIndex: 1, },
            { modelDataId: 123, joinPointIndex: 1, },
            { modelDataId: 124, joinPointIndex: 1, },
            { modelDataId: 125, joinPointIndex: 1, },
            { modelDataId: 126, joinPointIndex: 1, },
        ],
        [
            { modelDataId: 124, joinPointIndex: 1, },
            { modelDataId: 127, joinPointIndex: 1, },
            { modelDataId: 128, joinPointIndex: 1, },
        ],
        // 第4块
        [
            { modelDataId: 132, joinPointIndex: 0, },
            { modelDataId: 133, joinPointIndex: 0, },
            { modelDataId: 134, joinPointIndex: 0, },
            { modelDataId: 135, joinPointIndex: 0, },
            { modelDataId: 136, joinPointIndex: 0, },
        ],
        [
            { modelDataId: 134, joinPointIndex: 0, },
            { modelDataId: 137, joinPointIndex: 0, },
            { modelDataId: 138, joinPointIndex: 0, },
        ],
        [
            { modelDataId: 132, joinPointIndex: 1, },
            { modelDataId: 133, joinPointIndex: 1, },
            { modelDataId: 134, joinPointIndex: 1, },
            { modelDataId: 135, joinPointIndex: 1, },
            { modelDataId: 136, joinPointIndex: 1, },
        ],
        [
            { modelDataId: 134, joinPointIndex: 1, },
            { modelDataId: 137, joinPointIndex: 1, },
            { modelDataId: 138, joinPointIndex: 1, },
        ],
        // 第5块
        [
            { modelDataId: 142, joinPointIndex: 0, },
            { modelDataId: 143, joinPointIndex: 0, },
            { modelDataId: 144, joinPointIndex: 0, },
            { modelDataId: 145, joinPointIndex: 0, },
            { modelDataId: 146, joinPointIndex: 0, },
        ],
        [
            { modelDataId: 144, joinPointIndex: 0, },
            { modelDataId: 147, joinPointIndex: 0, },
            { modelDataId: 148, joinPointIndex: 0, },
        ],
        [
            { modelDataId: 142, joinPointIndex: 1, },
            { modelDataId: 143, joinPointIndex: 1, },
            { modelDataId: 144, joinPointIndex: 1, },
            { modelDataId: 145, joinPointIndex: 1, },
            { modelDataId: 146, joinPointIndex: 1, },
        ],
        [
            { modelDataId: 144, joinPointIndex: 1, },
            { modelDataId: 147, joinPointIndex: 1, },
            { modelDataId: 148, joinPointIndex: 1, },
        ],
        // 第6块
        [
            { modelDataId: 152, joinPointIndex: 0, },
            { modelDataId: 153, joinPointIndex: 0, },
            { modelDataId: 154, joinPointIndex: 0, },
            { modelDataId: 155, joinPointIndex: 0, },
            { modelDataId: 156, joinPointIndex: 0, },
        ],
        [
            { modelDataId: 154, joinPointIndex: 0, },
            { modelDataId: 157, joinPointIndex: 0, },
            { modelDataId: 158, joinPointIndex: 0, },
        ],
        [
            { modelDataId: 152, joinPointIndex: 1, },
            { modelDataId: 153, joinPointIndex: 1, },
            { modelDataId: 154, joinPointIndex: 1, },
            { modelDataId: 155, joinPointIndex: 1, },
            { modelDataId: 156, joinPointIndex: 1, },
        ],
        [
            { modelDataId: 154, joinPointIndex: 1, },
            { modelDataId: 157, joinPointIndex: 1, },
            { modelDataId: 158, joinPointIndex: 1, },
        ],
    ],
}

// export let regionCenter = [
//     {
//         name: '老城区',
//         lnglat: [
//             113.582183,
//             34.705073
//         ],
//     },
//     {
//         name: '新农村',
//         lnglat:
//             [
//                 113.596591,
//                 34.718113
//             ],
//     },
//     {
//         name: '市中心',
//         lnglat:
//             [
//                 113.659477,
//                 34.742897
//             ],

//     },
//     {
//         name: '集中式风储',
//         lnglat:
//             [
//                 113.439476,
//                 34.622413
//             ]
//     },
// ]

// export let laserOut = {
//     type: 'FeatureCollection',
//     name: 'out',
//     crs: {
//         type: 'name',
//         properties: {
//             name: 'urn:ogc:def:crs:OGC:1.3:CRS84'
//         }
//     },
//     features: [
//         {
//             type: 'Feature',
//             properties: {},
//             geometry: {
//                 type: 'Polygon',
//                 coordinates: [
//                     [
//                         [
//                             113.583854,
//                             34.699956
//                         ],
//                         [
//                             113.587243,
//                             34.699956
//                         ],
//                         [
//                             113.589756,
//                             34.700049
//                         ],
//                         [
//                             113.591269,
//                             34.702709
//                         ],
//                         [
//                             113.591208,
//                             34.70557
//                         ],
//                         [
//                             113.591679,
//                             34.707729
//                         ],
//                         [
//                             113.590103,
//                             34.710548
//                         ],
//                         [
//                             113.587037,
//                             34.711205
//                         ],
//                         [
//                             113.585049,
//                             34.711465
//                         ],
//                         [
//                             113.577418,
//                             34.711809
//                         ],
//                         [
//                             113.574835,
//                             34.708946
//                         ],
//                         [
//                             113.572832,
//                             34.707113
//                         ],
//                         [
//                             113.572647,
//                             34.704451
//                         ],
//                         [
//                             113.573743,
//                             34.70334
//                         ],
//                         [
//                             113.576612,
//                             34.700094
//                         ],
//                         [
//                             113.581204,
//                             34.69995
//                         ],
//                         [
//                             113.583854,
//                             34.699956
//                         ],
//                     ],
//                     [


//                         [
//                             113.595021,
//                             34.716024
//                         ],
//                         [
//                             113.595401,
//                             34.715817
//                         ],
//                         [
//                             113.595806,
//                             34.715757
//                         ],
//                         [
//                             113.596466,
//                             34.715697
//                         ],
//                         [
//                             113.596766,
//                             34.715925
//                         ],
//                         [
//                             113.597039,
//                             34.716225
//                         ],
//                         [
//                             113.597612,
//                             34.716157
//                         ],
//                         [
//                             113.597956,
//                             34.716295
//                         ],
//                         [
//                             113.598411,
//                             34.716556
//                         ],
//                         [
//                             113.598623,
//                             34.717084
//                         ],
//                         [
//                             113.598741,
//                             34.717707
//                         ],
//                         [
//                             113.59889,
//                             34.718541
//                         ],
//                         [
//                             113.598842,
//                             34.718837
//                         ],
//                         [
//                             113.599318,
//                             34.71957
//                         ],
//                         [
//                             113.598586,
//                             34.719972
//                         ],
//                         [
//                             113.597991,
//                             34.720186
//                         ],
//                         [
//                             113.597187,
//                             34.720255
//                         ],
//                         [
//                             113.59644,
//                             34.720497
//                         ],
//                         [
//                             113.595861,
//                             34.720497
//                         ],
//                         [
//                             113.595136,
//                             34.720438
//                         ],
//                         [
//                             113.59427,
//                             34.720282
//                         ],
//                         [
//                             113.594097,
//                             34.719714
//                         ],
//                         [
//                             113.594003,
//                             34.719196
//                         ],
//                         [
//                             113.594007,
//                             34.718612
//                         ],
//                         [
//                             113.594078,
//                             34.717999
//                         ],
//                         [
//                             113.594354,
//                             34.716902
//                         ],
//                         [
//                             113.594582,
//                             34.71652
//                         ],
//                         [
//                             113.594964,
//                             34.715991
//                         ]

//                     ],
//                     [
//                         [
//                             113.656592,
//                             34.737377
//                         ],
//                         [
//                             113.658085,
//                             34.737633
//                         ],
//                         [
//                             113.661098,
//                             34.738025
//                         ],
//                         [
//                             113.662946,
//                             34.73842
//                         ],
//                         [
//                             113.664997,
//                             34.739064
//                         ],
//                         [
//                             113.66469,
//                             34.74088
//                         ],
//                         [
//                             113.664177,
//                             34.743117
//                         ],
//                         [
//                             113.66383,
//                             34.743951
//                         ],
//                         [
//                             113.663245,
//                             34.744766
//                         ],
//                         [
//                             113.66277,
//                             34.745653
//                         ],
//                         [
//                             113.661865,
//                             34.747821
//                         ],
//                         [
//                             113.662935,
//                             34.748554
//                         ],
//                         [
//                             113.663493,
//                             34.748904
//                         ],
//                         [
//                             113.662964,
//                             34.74989
//                         ],
//                         [
//                             113.662074,
//                             34.751403
//                         ],
//                         [
//                             113.659834,
//                             34.750751
//                         ],
//                         [
//                             113.65705,
//                             34.749745
//                         ],
//                         [
//                             113.654637,
//                             34.748943
//                         ],
//                         [
//                             113.65227,
//                             34.748128
//                         ],
//                         [
//                             113.653373,
//                             34.745064
//                         ],
//                         [
//                             113.653885,
//                             34.743682
//                         ],
//                         [
//                             113.654107,
//                             34.742944
//                         ],
//                         [
//                             113.654759,
//                             34.741608
//                         ],
//                         [
//                             113.655095,
//                             34.740691
//                         ],
//                         [
//                             113.655588,
//                             34.739169
//                         ],
//                         [
//                             113.656031,
//                             34.738004
//                         ],
//                         [
//                             113.656518,
//                             34.73738
//                         ],
//                         [
//                             113.656592,
//                             34.737377
//                         ],
//                     ],
//                     [
//                         [
//                             113.438544,
//                             34.620345
//                         ],
//                         [
//                             113.438878,
//                             34.620175
//                         ],
//                         [
//                             113.439208,
//                             34.62001
//                         ],
//                         [
//                             113.439719,
//                             34.619781
//                         ],
//                         [
//                             113.440184,
//                             34.619618
//                         ],
//                         [
//                             113.440831,
//                             34.620214
//                         ],
//                         [
//                             113.441981,
//                             34.621514
//                         ],
//                         [
//                             113.443328,
//                             34.622976
//                         ],
//                         [
//                             113.442967,
//                             34.623703
//                         ],
//                         [
//                             113.44193,
//                             34.624333
//                         ],
//                         [
//                             113.439691,
//                             34.625703
//                         ],
//                         [
//                             113.437453,
//                             34.626728
//                         ],
//                         [
//                             113.436791,
//                             34.626223
//                         ],
//                         [
//                             113.436359,
//                             34.625647
//                         ],
//                         [
//                             113.435435,
//                             34.624481
//                         ],
//                         [
//                             113.434685,
//                             34.623241
//                         ],
//                         [
//                             113.434727,
//                             34.622074
//                         ],
//                         [
//                             113.436252,
//                             34.621139
//                         ],
//                         [
//                             113.437891,
//                             34.620226
//                         ],
//                         [
//                             113.438544,
//                             34.620345
//                         ],
//                     ]
//                 ]
//             }
//         }
//     ]
// }

export let carsModelFileNames = [
    "CarsNormal1.glb",
    "CarsNormal2.glb",
    "CarsNormal3.glb",
    "CarsNormal4.glb",
    "CarsNormal5.glb"
]

export let carsDataClass = {
    init(models, scene) {
        this.models = models
        // console.log("models:", models)
        this.initAnim(scene)
    },
    initAnim(scene) {
        this.carsData.forEach(carData => {
            let idx = 0
            const speed = 5
            const pathCoor = carData.pathCoor
            this.anim(pathCoor, speed, idx, scene)
            this.anim(pathCoor, speed, idx + 1, scene)
            this.anim(pathCoor, speed, idx + 2, scene)
        })
    },
    anim(pathCoor, speed, idx, scene) {
        const model = this.getModel()
        const modelClone = model.clone()
        modelClone.children[0].carId = Math.floor(Math.random() * 10) % 5 + 1
        modelClone.position.setX(pathCoor[idx][0])
        modelClone.position.setY(pathCoor[idx][1])
        scene.add(modelClone)
        // console.log("pathCoor", pathCoor)
        // console.log("modelClone:", modelClone)
        const timeline = new gsap.timeline()
        this.doAnim(idx, pathCoor, timeline, speed, modelClone)
    },
    doAnim(idx, pathCoor, timeline, speed, modelClone) {
        if (timeline.isActive()) {
            requestAnimationFrame(() => this.doAnim(idx, pathCoor, timeline, speed, modelClone))
            return
        }
        const nextIdx = (idx + 1) % pathCoor.length
        const from = new THREE.Vector3(0, 1, 0)
        const to = new THREE.Vector3(pathCoor[nextIdx][0] - pathCoor[idx][0], pathCoor[nextIdx][1] - pathCoor[idx][1], 0)
        to.normalize()
        // 旋转
        modelClone.rotation.setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(from, to))
        const dis = Math.sqrt(
            (pathCoor[nextIdx][0] - pathCoor[idx][0]) * (pathCoor[nextIdx][0] - pathCoor[idx][0])
            +
            (pathCoor[nextIdx][1] - pathCoor[idx][1]) * (pathCoor[nextIdx][1] - pathCoor[idx][1])
        )
        const duration = dis / speed
        timeline.to(modelClone.position, {
            x: pathCoor[nextIdx][0],
            ease: 'none',
            duration
        })
        gsap.to(modelClone.position, {
            y: pathCoor[nextIdx][1],
            ease: 'none',
            duration
        })
        idx = (idx + 1) % pathCoor.length
        requestAnimationFrame(() => this.doAnim(idx, pathCoor, timeline, speed, modelClone))
    },
    getModel() {
        return this.models[Math.floor(Math.random() * this.models.length)]
    },
    carsData: [
        {
            pathLngLat: [
                [113.586193, 34.701577],
                [113.586535, 34.702676],
                [113.586535, 34.702676],
                [113.586709, 34.702979],
                [113.587015, 34.703427],
                [113.587182, 34.704041],
                [113.587646, 34.704787],
                [113.587611, 34.705372],
                [113.587527, 34.705959],
                [113.587289, 34.706807],
                [113.587047, 34.706585],
                [113.584448, 34.704591],
                [113.583586, 34.703581],
                [113.583188, 34.702794],
                [113.583054, 34.702279],
            ],
        },
        {
            pathLngLat: [
                [113.582869, 34.701384],
                [113.583062, 34.702289],
                [113.583314, 34.703117],
                [113.583144, 34.703147],
                [113.582948, 34.703156],
                [113.582717, 34.703141],
                [113.5816, 34.703208],
                [113.5816, 34.703208],
                [113.582064, 34.701488],
                [113.582288, 34.701437],
            ]
        },
        {
            pathLngLat: [
                [113.581583, 34.703472],
                [113.581255, 34.707666],
                [113.581148, 34.708154],
                [113.579146, 34.707509],
                [113.579284, 34.706988],
                [113.579295, 34.705286],
                [113.579261, 34.705174],
                [113.579194, 34.70412],
                [113.579489, 34.703895],
            ]
        },
        {
            pathLngLat: [
                [113.580222, 34.702945],
                [113.579261, 34.703762],
                [113.57918, 34.703864],
                [113.579259, 34.705176],
                [113.579293, 34.705291],
                [113.579283, 34.706991],
                [113.579149, 34.707509],
                [113.576912, 34.706872],
                [113.576843, 34.70684],
                [113.576814, 34.706851],
                [113.575967, 34.707483],
                [113.573754, 34.705736],
                [113.57277, 34.704632],
                [113.57277, 34.704632],
                [113.57544, 34.703994],
                [113.57544, 34.703994],
                [113.57544, 34.703994],
            ]
        }
    ],
}