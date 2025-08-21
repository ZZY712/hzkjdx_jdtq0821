<template>
    <div>
        <div class="map">
            <img class="map_topleft" width="4%" height="auto" src="../../../../assets/img/map/1.png" alt="">
            <img class="map_topright" width="4%" height="auto" src="../../../../assets/img/map/2.png" alt="">
            <img class="map_bottomleft" width="4%" height="auto" src="../../../../assets/img/map/3.png" alt="">
            <img class="map_bottomright" width="4%" height="auto" src="../../../../assets/img/map/4.png" alt="">
            <div id="topologyCharts1"
                style="width: 42vw; height: 56vh;margin-left: 3vh;margin-top: 1vh;border: 2px solid rgb(153, 196, 248);border-radius: 3vh;
                -moz-box-shadow:4px 5px 20px  rgba(42, 171, 140, 0.75); -webkit-box-shadow:4px 5px 20px  rgba(42, 171, 140, 0.75); box-shadow:4px 5px 20px  rgba(42, 171, 140, 0.75);">
            </div>
            <div class="mapChart">
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                    <el-form-item>
                        <el-select v-model="formInline.topology" placeholder="区域拓扑图">
                            <el-option v-for="(item) in topologyData" :key="item" :label="item" :value="item"
                                @click.native="changeTopology(item)"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
/* global BMap */
import { encryptData, decryptData } from '@/utils/cryptoUtils';
import util from '@/api/generalFormat'
import { gotoDigitalTwin } from '@/assets/gdDev/utils';
import { computeIdData } from "@/api/requestID";
export default {
    components: {
    },
    data() {
        return {
            RSME: [],
            YUJING: [],
            BAOJING: [],
            time: [],
            formInline: {
                level: '',
                topology: ''
            },
            levelData: [],
            topologyData: [],
            pointData: [],
            lineData: [
            ],
            AllData: [],
            centerData: [
                {
                    lng: 113.14,
                    lat: 33.78
                },
            ],
            lineNum: "",
            loadSum: [0, 0, 0],
        }
    },
    methods: {
        mapBaidu(centerData, points, lines) {
            let map = new BMap.Map("topologyCharts1");
            map.centerAndZoom(new BMap.Point(centerData.lng, centerData.lat), 13);

            map.enableScrollWheelZoom();
            map.enableDragging();

            points.forEach((point, index) => {
                if (index >= this.lineNum - 1) {
                    return;
                }
                let marker = new BMap.Marker(new BMap.Point(point.lng, point.lat), {
                    icon: new BMap.Icon(require("../../../../assets/img/map/ditubiaodian.png"), new BMap.Size(30, 30), {
                        imageOffset: new BMap.Size(0, 0),
                        imageSize: new BMap.Size(30, 30)
                    })
                });
                map.addOverlay(marker);
                let label = new BMap.Label(point.name, { offset: new BMap.Size(-10, -30) });
                marker.addEventListener("click", function () {
                    label.setStyle({
                        border: "1px solid rgb(20,68,140)",
                        borderRadius: "5px",
                        padding: "5px",
                        color: "#333",
                        backgroundColor: "white",
                    });
                    marker.setLabel(label);
                    map.addOverlay(marker);
                });
                label.addEventListener("click", function () {
                    label.setStyle({
                        display: "none",
                    });
                });
                marker.addEventListener("click", function () {
                    label.setStyle({
                        display: "block",
                    });
                });
                marker.addEventListener("dblclick", () => {
                    console.log("双击了marker")
                    gotoDigitalTwin(this.$router)
                })
            });

            changeMapStyle();
            function changeMapStyle() {
                var mapStyle = {
                    style: 'midnight'
                };
                map.setMapStyle(mapStyle);
            }
            this.loadSum = [0, 0, 0]
            let colors = lines.map((line, index) => {
                if (index < 32) {
                    let rsmeValue = this.RSME[index];
                    let yujingValue = this.YUJING[index];
                    let baojingValue = this.BAOJING[index];
                    if (rsmeValue > baojingValue) {
                        this.loadSum[0]++
                        return "#ff0000";
                    } else if (rsmeValue > yujingValue) {
                        this.loadSum[1]++
                        return "#ffff00";
                    } else {
                        this.loadSum[2]++
                        return "#00ff00";
                    }
                }
            });
            this.$nextTick(() => {
                this.$bus.$emit('loadSum', this.loadSum)
            })
            let encryptedData = encryptData({ colors: colors, RSME: this.RSME }, process.env.VUE_APP_CRYPTO_KEY);
            sessionStorage.setItem("colorsDATA", encryptedData);
            lines.forEach((line, index) => {
                let polyline = new BMap.Polyline(line, {
                    strokeColor: index >= this.lineNum - 1 ? "#ffffff" : colors[index],
                    strokeWeight: 3,
                    strokeOpacity: 1,
                    strokeStyle: index >= this.lineNum - 1 ? "dashed" : "solid" // 设置为虚线
                });
                map.addOverlay(polyline);

                let rsmeValue = this.RSME[index] || '';
                let yujingValue = this.YUJING[index] || '';
                let baojingValue = this.BAOJING[index] || '';
                let status = rsmeValue > baojingValue ? '报警' : rsmeValue > yujingValue ? '预警' : '正常';

                let infoWindowContent = `
                    <div>
                        <p>线路编号: ${(index + 1) % 32 != 0 ? (index + 1) % 32 : 32}</p>
                        <p>实际值: ${rsmeValue}</p>
                        <p>预警值: ${yujingValue}</p>
                        <p>报警值: ${baojingValue}</p>
                        <p>状态: ${status}</p>
                    </div>
                `;

                let infoWindow = new BMap.InfoWindow(infoWindowContent, {
                    border: "1px solid rgb(20,68,140)",
                    borderRadius: "5px",
                    padding: "5px",
                    color: "#333",
                    backgroundColor: "white",
                });

                let middlePoint = new BMap.Point(
                    (line[0].lng + line[1].lng) / 2,
                    (line[0].lat + line[1].lat) / 2
                );
                polyline.addEventListener("click", function () {
                    map.openInfoWindow(infoWindow, middlePoint);
                });
                // polyline.addEventListener("click", function() {
                //     map.openInfoWindow(infoWindow, middlePoint);
                // });
                // polyline.addEventListener("mouseout", function() {
                //     map.closeInfoWindow();
                // });
            });
        },
        computerData(allDatas, listExtra) {
            let encryptedData = sessionStorage.getItem('PYTORCHDATA');
            if (encryptedData) {
                let decryptedData = decryptData(encryptedData, process.env.VUE_APP_CRYPTO_KEY);
                let alldata = decryptedData;
                this.RSME = alldata.data[0].data.slice(alldata.data[0].data.length - 33, alldata.data[0].data.length - 1);
                this.YUJING = alldata.data[1].data.slice(alldata.data[1].data.length - 33, alldata.data[1].data.length - 1);
                this.BAOJING = alldata.data[2].data.slice(alldata.data[2].data.length - 33, alldata.data[2].data.length - 1);
                this.time = alldata.time.slice(alldata.time.length - 33, alldata.time.length - 1);
            }
            let AllData = this.AllData
            let points = []
            let lines = []
            this.pointData = []
            this.lineData = []
            let names = this.formInline.topology
            let num = 0
            AllData.forEach((items, indexs) => {
                if (indexs === 0) {
                    items.forEach((item) => {
                        num++
                        points.push({
                            name: names + '-' + num,
                            lng: item[0],
                            lat: item[1]
                        })
                    })
                } else {
                    items.forEach((item, index) => {
                        if (index != 0) {
                            num++
                            points.push({
                                name: names + '-' + num,
                                lng: item[0],
                                lat: item[1]
                            })
                        }
                    })
                }
                for (let j = 0; j < items.length - 1; j++) {
                    lines.push([new BMap.Point(items[j][0], items[j][1]), new BMap.Point(items[j + 1][0], items[j + 1][1])])
                }
            })
            listExtra.forEach((item) => {
                if (allDatas[item[0] - 1][1] === allDatas[item[1] - 1][1]) {
                    allDatas[item[0] - 1][1] = allDatas[item[0] - 1][1] + 0.005
                    allDatas[item[1] - 1][1] = allDatas[item[1] - 1][1] + 0.005
                    points.push({
                        name: names + '虚拟',
                        lng: allDatas[item[0] - 1][0],
                        lat: allDatas[item[0] - 1][1]
                    }, {
                        name: names + '虚拟',
                        lng: allDatas[item[1] - 1][0],
                        lat: allDatas[item[1] - 1][1]
                    })
                    lines.push([new BMap.Point(allDatas[item[0] - 1][0], allDatas[item[0] - 1][1]), new BMap.Point(allDatas[item[0] - 1][0], allDatas[item[0] - 1][1] - 0.005)])
                    lines.push([new BMap.Point(allDatas[item[1] - 1][0], allDatas[item[1] - 1][1]), new BMap.Point(allDatas[item[1] - 1][0], allDatas[item[1] - 1][1] - 0.005)])
                }
                lines.push([new BMap.Point(allDatas[item[0] - 1][0], allDatas[item[0] - 1][1]), new BMap.Point(allDatas[item[1] - 1][0], allDatas[item[1] - 1][1])])
            })
            this.lineNum = num
            this.pointData = points
            this.lineData = lines
            this.centerData[0].lng = AllData[0][AllData[0].length / 2][0]
            this.centerData[0].lat = AllData[0][AllData[0].length / 2][1]
            this.mapBaidu(this.centerData[0], points, lines);
        },
        changeTopology(dataName) {
            this.computeTopology(dataName)
        },
        requestTopology() {
            // let response = decryptData(sessionStorage.getItem('topologyDATA'), process.env.VUE_APP_CRYPTO_KEY)
            if (sessionStorage.getItem('topologyDATA')) {
                this.formInline.topology = 'FTU&故障恢复 33节点'
                this.computeTopology('FTU&故障恢复 33节点')
                this.getSelect()
            } else {
                util.get('/get/topology/data')
                    .then(response => {
                        if (response && response.code === 200) {
                            console.log('请求成功');
                            let encryptedData = encryptData({ rows: response.rows, }, process.env.VUE_APP_CRYPTO_KEY);
                            sessionStorage.setItem("topologyDATA", encryptedData);
                            this.formInline.topology = 'FTU&故障恢复 33节点'
                            this.computeTopology('FTU&故障恢复 33节点')
                            this.getSelect()
                        } else {
                            console.log('请求失败');
                        }
                    })
                    .catch(error => {
                        console.log('GET请求错误', error);
                    });
            }
        },
        requestIdData(datas) {
            computeIdData(datas)
                .then(data => {
                    this.$bus.$emit('returnIdData', data)
                    console.log('获取数据成功', data);
                })
                .catch(error => {
                    console.error('获取数据失败', error);
                });
        },
        computeTopology(dataName) {
            let response = decryptData(sessionStorage.getItem('topologyDATA'), process.env.VUE_APP_CRYPTO_KEY)
            let num
            for (let index = 0; index < response.rows.length; index++) {
                if (response.rows[index].name === dataName) {
                    num = index;
                    this.requestIdData({ id: response.rows[index].id })
                    break;
                }
            }
            let allData = []
            allData = response.rows[num]
            // console.log(allData);
            this.AllData = []
            allData.listBranch.forEach((items, indexs) => {
                let num = indexs % 2 === 0 ? 1 : -1
                let itemNum = ''
                this.AllData.push([])
                items.forEach((item, index) => {
                    if (indexs === 0) {
                        this.AllData[indexs].push([parseFloat((113.06 + item * 0.01).toFixed(2)), parseFloat((33.78 + indexs * 0.01 * num).toFixed(2)), item])
                    } else {
                        if (index === 0) {
                            itemNum = item
                            this.AllData[indexs].push(this.AllData[0][itemNum - 1])
                        } else {
                            this.AllData[indexs].push([parseFloat((113.06 + (index + itemNum - 1) * 0.01).toFixed(2)), parseFloat((33.78 + indexs * 0.01 * num).toFixed(2)), item])
                        }
                    }
                })
            })
            //数组降维-去重
            let allDatas = [...new Set(this.AllData.flat())]
            this.computerData(allDatas, allData.listExtra)
        },
        //获取下拉框数据
        getSelect() {
            let arrSelect = []
            arrSelect = this.$store.state.select.selectOptions
            this.getSelectData(arrSelect.selectOptions)
        },
        // 处理下拉框接口数据
        getSelectData(data) {
            let topologyData = [];
            data.forEach(item => {
                if (item.dataType === '拓扑结构') {
                    // 处理 topologyData
                    if (!topologyData.includes(item.ip)) {
                        topologyData.push(item.ip);
                    }
                }
            });
            this.topologyData = []
            this.topologyData = topologyData
        },
    },
    mounted() {
        this.requestTopology();
    },
}
</script>

<style lang="scss" scoped>
.map {
    #map .anchorBL {
        display: none !important;
    }

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

    .mapChart {
        position: absolute;
        top: 2vh;
        left: 2vw;

        /deep/.el-form--inline .el-form-item {
            width: 6vw;
            margin-right: 0;
        }

        /deep/.el-form-item {
            margin-bottom: 0;
        }

        /deep/.el-input input {
            font-size: 1.6vh;
            border: 1px solid rgba(31, 91, 193, 1);
            background-color: rgba(14, 39, 84, 0.68);
        }

        /deep/.el-input__inner {
            text-align: center;
            color: rgb(255, 255, 255);
            font-weight: bold;
        }

        /deep/.el-select .el-input .el-select__caret {
            color: rgb(255, 255, 255);
        }


        /deep/::placeholder {
            color: rgb(255, 255, 255);
            font-weight: bold;
        }


    }

    .infoMenu {
        // background-color: rgba(61, 232, 244, 0.668);
        z-index: 9999;
        position: absolute;
        top: 7vh;
        left: 5.6vw;
        /* border: 2px solid rgb(153, 196, 248); */
        border-radius: 3vh 0vh 0vh 0vh;
    }

    .infoButton {
        z-index: 9999;
        position: absolute;
        top: 7vh;
        left: 2vw;
        color: #fff;

        a {
            text-decoration: none;
            background-color: rgba(97, 115, 25, 0.5);
            color: #fff;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 1.4vh;
            transition: background-color 0.3s;
        }

        a:hover {
            background-color: #0073e6;
            cursor: pointer;
        }
    }
}
</style>
