<template>
    <div class="body_Charts">
        <div v-for="(items, indexs) in carDisaster" :key="indexs">
            <div class="st_titles">
                {{ items.name }}
            </div>
            <div class="card">
                <el-table height="33vh" :header-cell-style="{ background: 'rgba(0,25,47,0)', color: '#fff' }"
                    :data="items.data" style="width: 92%;margin-left: 2.5%;font-size: 1.4vh;" border>
                    <el-table-column v-for="(item, index) in items.tableData" :key="index" :prop="item.name"
                        :label="item.label" align="center"></el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    components: {
    },
    data() {
        return {
            carDisaster: [
                {
                    name: '节点负载数据',
                    tableData: [
                        {
                            name: 'date',
                            label: '日期时间'
                        },
                        {
                            name: 'node',
                            label: '节点名称'
                        },
                        {
                            name: 'pl',
                            label: '有功功率'
                        },
                        {
                            name: 'ql',
                            label: '无功功率'
                        },
                        {
                            name: 'ps',
                            label: '视在功率'
                        },
                    ],
                    data: []
                },
            ],
        };
    },
    methods: {
        computerData(data) {
            //节点
            this.carDisaster[0].data = []
            this.carDisaster[0].name = ''
            this.carDisaster[0].name = '节点负载数据-' + data.name
            // console.log(data);
            data.data.rows[0].data[0].forEach((item) => {
                this.carDisaster[0].data.push({
                    date: item[0],
                    node: item[1],
                    pl: item[2],
                    ql: item[3],
                    ps: item[4],
                })
            })
        }
    },
    mounted() {
        this.$bus.$on('returnLoadData', (allData) => {
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

    .st_titles {
        background-size: 100% 107%;
        background-repeat: no-repeat;
        background-image: url('../../../../../assets/img/ch/item_new.png');
    }

    .card {
        width: 98%;
        cursor: pointer;
        position: relative;
        height: calc(100% - 4vh);
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-image: url('../../../../../assets/img/ch/chbg_new.png');
        transform: translateX(-50%);
        animation-name: moveRight;
        animation-duration: 1.5s;
        animation-fill-mode: forwards;

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
        // background-color: rgba(7, 185, 225, 0.5);
    }
}
</style>
