<template>
    <div class="body_Charts">
        <draggable v-model="carDisaster" tag="div" v-bind="{ animation: 200 }">
            <div v-for="(items, indexs) in carDisaster" :key="indexs" class="card">
                <div style="text-align: center;font-size: 2vh;font-weight: bold;padding: 1.5vh;">
                    {{ items.name }}
                </div>
                <div>
                    <el-table height="28vh" :header-cell-style="{ background: 'rgba(0,25,47,0)', color: '#fff' }"
                        :data="items.data" style="width: 95%;margin-left: 2.5%;margin-top: -2%;font-size: 1.4vh;"
                        border>
                        <el-table-column v-for="(item, index) in items.tableData" :key="index" :prop="item.name"
                            :label="item.label" align="center"></el-table-column>
                    </el-table>
                </div>
            </div>
        </draggable>
    </div>
</template>

<script>
import draggable from 'vuedraggable';
export default {
    components: {
        draggable,
    },
    data() {
        return {
            loading: true,
            carDisaster: [
                // {
                //     name: '韧性评估指标',
                //     tableData: [
                //         {
                //             name: 'Bruneau1',
                //             label: '鲁棒性'
                //         },
                //         {
                //             name: 'Bruneau2',
                //             label: '冗余性'
                //         },
                //         {
                //             name: 'Bruneau3',
                //             label: '智慧性'
                //         },
                //         {
                //             name: 'Bruneau4',
                //             label: '快速性'
                //         },
                //         {
                //             name: 'Bruneau5',
                //             label: '评估结果'
                //         },
                //     ],
                //     data: []
                // },
                {
                    name: '支路状态',
                    tableData: [
                        {
                            name: 'loadName',
                            label: '线路编号'
                        },
                        {
                            name: 'loadLevel',
                            label: '电压等级'
                        },
                        {
                            name: 'loadStatus',
                            label: '状态'
                        },
                        {
                            name: 'loadGAILV',
                            label: '故障概率'
                        },
                        // {
                        //     name: 'loadState',
                        //     label: '故障类型'
                        // },
                    ],
                    data: []
                },
                {
                    name: '节点状态',
                    tableData: [
                        {
                            name: 'nodeName',
                            label: '节点编号'
                        },
                        {
                            name: 'nodeLevel',
                            label: '电压等级'
                        },
                        {
                            name: 'nodeStatus',
                            label: '状态'
                        },
                        {
                            name: 'nodeTime',
                            label: '停电时长/h'
                        },
                    ],
                    data: []
                },
            ],
            chartInstances: []
        };
    },
    methods: {
        computerData(data) {
            //节点
            this.carDisaster[1].data = []
            data[0].data[0][1].forEach((item) => {
                this.carDisaster[1].data.push({
                    nodeName: item[0],
                    nodeLevel: '10kv',
                    nodeStatus: item[2] === 0 ? '正常' : '预警',
                    nodeTime: item[1],
                })
            })
            //支路
            this.carDisaster[0].data = []
            data[1].data[0][1].forEach((item) => {
                this.carDisaster[0].data.push({
                    loadName: item[1] + '-' + item[2],
                    loadStatus: item[4] === 0 ? '正常' : item[4] === 1 ? '蓝色预警' : item[4] === 2 ? '橙色预警' : '红色预警',
                    loadGAILV: item[3],
                    loadLevel: '10kv',
                    // loadState: '',
                })
            })
        }
    },
    mounted() {
        this.$bus.$on('NEWTOPOLOGYDATA', (allData) => {
            this.computerData(allData)
        })
    },
    beforeDestroy() {
    }
}
</script>

<style lang="scss" scoped>
.body_Charts {
    width: 100%;
    height: 95%;
    /* 启用垂直滚动条 */
    overflow-y: auto;
    overflow-x: hidden;

    /deep/.el-loading-spinner i {
        color: #40f3ff00;
        // font-size: 8vh;
    }

    /* 自定义滚动条样式 */
    &::-webkit-scrollbar {
        width: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: #4f668e;
        /* 滚动条滑块的颜色 */
        border-radius: 4px;
    }

    &::-webkit-scrollbar-track {
        background: #525579;
        /* 滚动条轨道的颜色 */
        border-radius: 4px;
    }

    .body_left {
        height: 36vh;
        position: relative;

    }

    .card {
        // border: 1px solid #14c0d3de;
        font-size: 1.6vh;
        border-radius: 2vh;
        margin-left: 5%;
        margin-bottom: 5%;
        min-height: 34vh;
        // min-height: 42vh;
        width: 85%;
        color: #fff;
        background-color: rgba(7, 185, 225, 0.21);
        cursor: pointer;

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

        ::v-deep .el-table--scrollable-x .el-table__body-wrapper {
            overflow-x: auto;
        }

        ::-webkit-scrollbar {
            width: 8px;
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

    .card:hover {
        background-color: rgba(7, 185, 225, 0.5);
    }
}
</style>
