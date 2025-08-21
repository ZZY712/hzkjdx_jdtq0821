<template>
    <div>
        <div class="btnOther">
            <el-cascader v-model="value" :options="options" :props="{ expandTrigger: 'hover' }" placeholder="功能菜单"
                @change="handleChange" popperClass="multi-choose"></el-cascader>
        </div>
        <div :style=weatherTypeStyle>
            <div>
                <div>{{ areaName + '-' }}{{ WeatherTypeNow.date + '-' + WeatherTypeNow.WeatherType }}</div>
                <div>
                    <img src="../assets/img/jiduan/温度.png" alt="" class="iconImage">
                    {{ WeatherTypeNow.WD }}
                </div>
                <div>
                    <img src="../assets/img/jiduan/湿度.png" alt="" class="iconImage">
                    {{ WeatherTypeNow.SD }}
                </div>
                <div>
                    <img src="../assets/img/jiduan/风速.png" alt="" class="iconImage">
                    {{ WeatherTypeNow.FS }}
                </div>
                <div>
                    <img src="../assets/img/jiduan/雨量.png" alt="" class="iconImage">
                    {{ WeatherTypeNow.YL }}
                </div>
            </div>
            <div style="width: 2vw;font-size: 2.8vh;" v-for="item in WeatherTypeNow.WeatherTypeOld" :key="item">
                <i :class=item></i>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            value: [],
            options: [
                {
                    value: '态势感知',
                    label: '态势感知',
                    children: [
                        {
                            value: '/pingu',
                            label: '极端天气灾害与配电网风险的态势智能评估',
                        },
                        {
                            value: '/yujing_warning',
                            label: '配电网停电风险智能预警',
                        },
                        {
                            value: '/yujing',
                            label: '极端天气灾害智能临近识别与预测预警',
                        },
                        // {
                        //     value: '/deeplyIntegrated',
                        //     label: '小样本增广',
                        // },
                    ]
                },
                {
                    value: '应急调度',
                    label: '应急调度',
                    children: [
                        {
                            value: '/zhenduan',
                            label: '基于FTU信号丢失的有源配电网故障诊断',
                        },
                        {
                            value: '/topology',
                            label: '城市配电网拓扑自动辨识技术',
                        },
                        {
                            value: '/restoration',
                            label: '城市配电网储能优化配置和多能协调控制技术',
                        },
                        {
                            value: '/regulate',
                            label: '基于igdt-cvar的应急调度策略',
                        },
                    ]
                },
                {
                    value: '实时响应',
                    label: '实时响应',
                    children: [
                        {
                            value: '/stereoStrategy',
                            label: '可移动式储能协同优化应急处置技术',
                        },
                        {
                            value: '/assessment',
                            label: '网络动态重构的配电网大面积停电应急处置技术',
                        },
                    ]
                },
                {
                    value: '数字孪生',
                    label: '数字孪生',
                    children: [
                        {
                            value: '/digitalTwin',
                            label: '数字孪生',
                        },
                        // {
                        //     value: '/gdDev',
                        //     label: '城市电网',
                        // },
                        // {
                        //     value: '/gdEditor',
                        //     label: '快速重构',
                        // },
                    ]
                },
            ],
            WeatherTypeData: [],
            currentTime: '',
            oldTime: ['', ''],
            weatherTypeStyle: 'position: absolute;display: flex;top: -100vh;width: -100vw;color: #ffcc00;font-size: 1.8vh;font-weight: bold;z-index: 999;',
            WeatherTypeNow: {
                WeatherType: '天气类型数据',
                WD: '温度数据',
                SD: '湿度数据',
                YL: '雨量数据',
                FS: '风速数据'
            },
            timer: '',
            areaName: ''
        };
    },
    methods: {
        handleChange(value) {
            this.$emit('LABLENAME', value[1]);
            this.$router.push(value[1]);
        },
        getCurrentTime(index) {
            // const now = new Date();
            // let currentHour = now.getHours();
            // let currentMinutes = now.getMinutes();
            // currentHour = parseInt(currentHour)
            // currentMinutes = parseInt(currentMinutes)
            // if (currentHour != this.oldTime[0] ||
            //     currentMinutes != this.oldTime[1]) {
            //     this.WeatherTypeData.forEach((item) => {
            //         if (item.Hours === currentHour &&
            //             item.Minutes === currentMinutes) {
            //             this.WeatherTypeNow = item
            //         }
            //     })
            //     let WeatherType = ''
            //     for (let i = 0; i < this.WeatherTypeNow.WeatherType.length; i++) {
            //         WeatherType += this.WeatherTypeNow.WeatherType[i]
            //     }
            //     this.WeatherTypeNow.WeatherType = WeatherType
            //     this.oldTime[0] = currentHour
            //     this.oldTime[1] = currentMinutes
            // }
            this.WeatherTypeNow = this.WeatherTypeData[index]
            let WeatherType = ''
            for (let i = 0; i < this.WeatherTypeNow.WeatherType.length; i++) {
                WeatherType += this.WeatherTypeNow.WeatherType[i]
            }
            this.WeatherTypeNow.WeatherType = WeatherType
        },
        computeWeather(data) {
            this.WeatherTypeData = []
            let weatherTypeQi = {
                高温: "qi-1009",
                暴雨: "qi-311",
                台风: "qi-1001",
                冻雨: "qi-313",
                寒潮: "qi-1005",
                正常天气: "qi-100",
            }
            for (let i = 0; i < data[0].data[0].length; i++) {
                //高温 "qi-1009" 暴雨 "qi-311" 台风 "qi-1001" 冻雨 "qi-313" 寒潮 "qi-1005"
                let WeatherTypeOld = []
                if (data[0].data[0][i][4] === null) data[0].data[0][i][4] = ['正常天气']
                data[0].data[0][i][4].forEach((item) => {
                    WeatherTypeOld.push(weatherTypeQi[item])
                })
                this.WeatherTypeData.push({
                    date: data[1].data[0][i][1],
                    Hours: parseInt(data[1].data[0][i][1].split(' ')[1].split(':')[0]),
                    Minutes: parseInt(data[1].data[0][i][1].split(' ')[1].split(':')[1]),
                    WD: data[0].data[0][i][2] + '℃',
                    SD: data[1].data[0][i][2] + 'g/m³',
                    FS: data[2].data[0][i][2] + 'm/s',
                    YL: data[3].data[0][i][2] + 'mm/㎡',
                    WeatherTypeOld: WeatherTypeOld,
                    WeatherType: data[1].data[0][i][4] ? data[1].data[0][i][4] : ['正常天气']
                })
            }
            let index = 0
            this.getCurrentTime(index);
            // 每隔一分钟更新一次时间
            this.timer = setInterval(() => {
                if (index <= this.WeatherTypeData.length) {
                    this.getCurrentTime(index);
                    index++
                } else {
                    index = 0
                    this.getCurrentTime(index);
                }
            }, 1000 * 60);
        }
    },
    created() {
    },
    mounted() {
        this.$bus.$on('returnIdData', (data) => {
            if (this.$route.path === '/main') {
                this.weatherTypeStyle = 'position: absolute;left: 60vh;;display: flex;top: 14vh;width: 10vw;color: #ffcc00;font-size: 1.8vh;font-weight: bold;z-index: 999;'
            } else {
                this.weatherTypeStyle = 'position: absolute;left: 22vh;display: flex;top: 18vh;width: 10vw;color: #ffcc00;font-size: 1.8vh;font-weight: bold;z-index: 999;'
            }
            this.computeWeather(data.rows)
        })
        this.$bus.$on('infoAll', (data) => {
            let area = data.argument
            this.areaName = area.province + '-' + area.city + '-' + area.town + '-' + area.site
        })
    },
    destroyed() {
    },

}
</script>

<style lang="scss" scoped>
.iconImage {
    width: 3vh;
    height: 3vh;
    margin-right: 0.5vh;
}

.btnOther {
    position: absolute;
    left: 1vh;
    top: 7vh;
    z-index: 999;


    /deep/ .el-input__inner {
        width: 7vw;
        font-size: 1.8vh;
        font-weight: bold;
        color: rgb(255, 255, 255);
        border: 1px solid rgba(31, 91, 193, 1);
        border-radius: 0.5vw;
        background-color: rgba(14, 39, 84, 0.68);
    }

    /deep/.el-cascader .el-input .el-input__inner {
        color: rgb(255, 255, 255);
        font-size: 1.8vh;
        font-weight: bold;
    }

    /deep/::placeholder {
        font-size: 1.8vh;
        color: rgb(255, 255, 255);
        font-weight: bold;
    }

    /deep/.el-input__inner:hover {
        font-weight: bold;
        border: 1px solid rgb(0, 255, 251);
        border-radius: 0.5vw;
        background-color: rgba(21, 255, 0, 0.61);
    }
}
</style>
<style lang="scss">
.multi-choose {

    .el-cascader-panel {
        font-size: 1.6vh !important;
        font-weight: bold;

    }


}
</style>