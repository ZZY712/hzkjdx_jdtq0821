<template>
    <div>
        <div v-if="dialogVisible">
            <div class="dialog">
                <div class="dialog_body">
                    <div class="dialog_title">
                        任务进程-{{ TaskName }}
                    </div>
                    <!-- 任务列表 -->
                    <div class="task_list" :key="flagKey">
                        <!-- <div class="fixed_tags"> -->
                        <!-- <el-tag @click.native="changeTask(0)" style="cursor: pointer;"
                                :class="{ 'bgColor': flagNum === 0 }" type="success">全部任务</el-tag> -->
                        <!-- <el-tag @click.native="changeTask(1)" style="cursor: pointer;"
                                :class="{ 'bgColor': flagNum === 1 }" type="success">多能互补</el-tag> -->
                        <!-- <el-tag @click.native="changeTask(2)" style="cursor: pointer;"
                                :class="{ 'bgColor': flagNum === 2 }" type="success">源网巡航</el-tag> -->
                        <!-- <el-tag @click.native="changeTask(3)" style="cursor: pointer;"
                                :class="{ 'bgColor': flagNum === 3 }" type="success">拓扑辨识</el-tag> -->
                        <!-- <el-tag @click.native="changeTask(4)" style="cursor: pointer;"
                                :class="{ 'bgColor': flagNum === 4 }" type="success">多能协同</el-tag> -->
                        <!-- <el-tag @click.native="changeTask(5)" style="cursor: pointer;"
                                :class="{ 'bgColor': flagNum === 5 }" type="success">供电恢复</el-tag> -->
                        <!-- <el-tag @click.native="changeTask(6)" style="cursor: pointer;"
                                :class="{ 'bgColor': flagNum === 6 }" type="success">韧性评估</el-tag> -->
                        <!-- <el-tag @click.native="changeTask(7)" style="cursor: pointer;"
                                :class="{ 'bgColor': flagNum === 7 }" type="success">上传任务</el-tag> -->
                        <!-- </div> -->
                        <div class="card_list">
                            <el-card v-for="(task, index) in tasks" :key="index" class="task_card">
                                <div>{{ task.name }}</div>
                                <el-tag v-if="task.completed === 'S'" type="success" style="cursor: pointer;"
                                    @click.native="successRun(task)">结果展示</el-tag>
                                <el-tag v-if="task.completed === 'NONE'" type="warning" style="cursor: pointer;"
                                    @click.native="successRun(task)">无结果数据</el-tag>
                                <el-tag v-if="task.completed === 'R'" type="warning" style="cursor: pointer;"
                                    @click.native="successRun(task)">正在运行</el-tag>
                                <el-tag v-if="task.completed === 'F'" type="danger" style="cursor: pointer;"
                                    @click.native="successRun(task)">算法报错</el-tag>
                                <el-tag v-if="task.completedInput === 'S'" type="success"
                                    style="cursor: pointer;">上传成功</el-tag>
                                <el-tag v-if="task.completedInput === 'R'" type="warning"
                                    style="cursor: pointer;">正在上传</el-tag>
                                <el-tag v-if="task.completedInput === 'F'" type="danger"
                                    style="cursor: pointer;">上传失败</el-tag>
                                <el-tag type="success" style="cursor: pointer;margin-left: 0.2vw;"
                                    @click.native="allInfo(task)">详情</el-tag>
                            </el-card>
                        </div>
                    </div>
                    <div class="close" @click="onCancel">
                        <i class="el-icon-circle-close"></i>
                    </div>
                    <div class="infoAll" v-if="infoDialogVisible">
                        <div class="closeChild" @click="closeChild">
                            <i class="el-icon-circle-close"></i>
                        </div>
                        <div v-if="selectedTask.basic_data_id[0] != '0'" :selectedTask="selectedTask"
                            style="margin-top: 1vh;margin-left: 0.5vw;">
                            <pre>{{ selectedTask.details }}</pre>
                            <!-- <p>类型名称: {{ selectedTask.data_type }}</p>
                            <p>开始时间: {{ selectedTask.start_date }}</p>
                            <p>结束时间: {{ selectedTask.end_date }}</p> -->
                        </div>
                        <div v-else :selectedTask="selectedTask">
                            <p>类型名称: {{ selectedTask.basic_data_id }}</p>
                            <p>创建时间: {{ selectedTask.create_time }}</p>
                            <p>上传状态: {{ selectedTask.status }}</p>
                            <p>上传类型: {{ selectedTask.data_type }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import util from '@/api/generalFormat'
import { MessageBox } from 'element-ui'
export default {
    name: 'queue',
    props: {
        visiableQueue: Boolean,
        toolGroups: Array,
    },
    data() {
        return {
            dialogVisible: false,
            flagKey: 0,
            flag: true,
            tasks: [],
            allTasks: [],
            task1: [],
            task2: [],
            task3: [],
            task4: [],
            task5: [],
            task6: [],
            uploadTasks: [],
            allData: [],
            cardNum: '',
            infoDialogVisible: false,
            selectedTask: null,
            timer: 0,
            flagNum: 0,
            TaskName: '',
        }
    },
    methods: {
        onCancel() {
            this.$parent.visiableQueue = false;
            this.infoDialogVisible = false
        },
        closeChild() {
            this.infoDialogVisible = false
        },
        changeTask(data) {
            this.flagNum = data
            this.closeChild()
            switch (data) {
                case 0:
                    this.tasks = this.allTasks
                    break;
                case 1:
                    this.tasks = this.task1
                    break;
                case 2:
                    this.tasks = this.task2
                    break;
                case 3:
                    this.tasks = this.task3
                    break;
                case 4:
                    this.tasks = this.task4
                    break;
                case 5:
                    this.tasks = this.task5
                    break;
                case 6:
                    this.tasks = this.task6
                    break;
                case 7:
                    this.tasks = this.uploadTasks
                    break;
                default:
                    break;
            }
        },
        successRun(task) {
            if (task.completed === 'S') {
                // 防止多次点击
                if (this.timer) {
                    clearTimeout(this.timer);
                }
                this.timer = setTimeout(() => {
                    let name = this.allData[task.num].data_type
                    switch (name) {
                        case '发电出力&故障恢复':
                        case '拓扑结构&故障恢复':
                            // this.$parent.toRunMain(this.toolGroups[2][0])
                            setTimeout(() => {
                                this.$bus.$emit('runQueueDataResto', this.allData[task.num]);
                            }, 50)
                            break;
                        case "拓扑结构&拓扑自动辨识(训练)":
                        case "拓扑结构&拓扑自动辨识(预测)":
                        case "拓扑结构&拓扑自动辨识(训练)-CnnAttention":
                        case "拓扑结构&拓扑自动辨识(预测)-CnnAttention":
                        case "拓扑结构&拓扑自动辨识(训练)-Dnn":
                        case "拓扑结构&拓扑自动辨识(预测)-Dnn":
                            // this.$parent.toRunMain(this.toolGroups[0][0])
                            setTimeout(() => {
                                this.$bus.$emit('runQueueDataTopology', { data: this.allData[task.num], flagNum: 1 });
                            }, 50)
                            break;
                        case "拓扑结构&特征重要性-LightGbm":
                        case "拓扑结构&特征重要性-Rf":
                            // this.$parent.toRunMain(this.toolGroups[0][0])
                            setTimeout(() => {
                                this.$bus.$emit('runQueueDataTopology', { data: this.allData[task.num], flagNum: 2 });
                            }, 50)
                            break;
                        case "拓扑结构&igdt_cvar 有波动":
                        case "拓扑结构&igdt_cvar 无波动":
                            // this.$parent.toRunMain(this.toolGroups[1][0])
                            setTimeout(() => {
                                this.$bus.$emit('runQueueDataRegulate', { data: this.allData[task.num], flagNum: 1 });
                            }, 50)
                            break;
                        case "拓扑结构&nnc":
                            // this.$parent.toRunMain(this.toolGroups[1][0])
                            setTimeout(() => {
                                this.$bus.$emit('runQueueDataRegulate', { data: this.allData[task.num], flagNum: 2 });
                            }, 50)
                            break;
                        default:
                            break;
                    }
                    let tipsName = '已提交' + name
                    // this.$message.success(tipsName)
                    this.$bus.$emit('infoAll', this.allData[task.num])
                    this.$notify({ title: tipsName, message: '数据正在进行渲染', type: 'success' });
                }, 1500)
            } else if (task.completed === 'R') {
                this.$message.warning('算法正在运行中');
                console.log('算法正在运行中');
            } else if (task.completed === 'T') {
                this.$message.warning('算法等待重新运行中');
                console.log('算法等待重新运行中');
            } else if (task.completed === 'NONE') {
                this.$message.warning('无结果数据');
                console.log('无结果数据');
            } else {
                MessageBox.confirm('是否重新进行算法运行？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    setTimeout(() => {
                        this.computerTasks()
                        this.changeTask(this.flagNum)
                        this.flagKey++
                        console.log(this.task);
                    }, 1000)
                    console.log('重新运行', task);
                    util.post('/restart/run/task', { data_id: task.data_id, task_id: task.task_id, data_type: task.data_type, })
                        .then(response => {
                            // 处理POST请求的响应
                            if (response && response.code === 200) {
                                // 请求成功的处理逻辑
                                console.log('请求成功');
                            } else {
                                // 请求失败的处理逻辑
                                console.log('请求失败');
                                // this.$message.error('服务器错误')
                            }
                        })
                        .catch(error => {
                            // 处理POST请求的错误
                            // this.$message.error('POST请求错误')
                            console.log('POST请求错误', error);
                        });
                }).catch(() => {
                    this.$message.info('取消运行');
                });
                // console.log(task, '算法运行错误');
            }
        },
        allInfo(task) {
            this.selectedTask = this.allData[task.num];
            if (this.selectedTask.status === 'S') {
                this.selectedTask.data_id != "D000000" ? this.selectedTask.status = '结果展示' : this.selectedTask.status = '上传成功'
            }
            else if (this.selectedTask.status === 'R') {
                this.selectedTask.data_id != "D000000" ? this.selectedTask.status = '算法正在运行' : this.selectedTask.status = '正在上传'
            } else if (this.selectedTask.status === 'T') {
                this.selectedTask.data_id != "D000000" ? this.selectedTask.status = '算法等待重新运行' : this.selectedTask.status = '等待重新上传'
            } else {
                this.selectedTask.data_id != "D000000" ? this.selectedTask.status = '算法错误' : this.selectedTask.status = '上传失败'
            }
            this.infoDialogVisible = !this.infoDialogVisible;
        },
        computerTasks() {
            this.flagNum = 0
            util.get('/get/task/data')
                .then(response => {
                    // 处理POST请求的响应
                    if (response && response.code === 200) {
                        // 请求成功的处理逻辑
                        console.log('请求成功');
                        this.tasks = []
                        this.task1 = []
                        this.task2 = []
                        this.task3 = []
                        this.task4 = []
                        this.task5 = []
                        this.task6 = []
                        this.uploadTasks = []
                        this.allTask = []
                        this.allData = []
                        this.allData = response.rows
                        if (response.rows) {
                            response.rows.map((item, index) => {
                                if (item.status != 'O' && item.status != 'WX') {
                                    let time = item.create_time.split('T')
                                    if (item.data_id != "D000000") {
                                        switch (item.data_type) {
                                            case "发电出力&故障恢复":
                                            case '拓扑结构&故障恢复':
                                                this.task5.push({
                                                    name: item.data_type + '-' + time[0] + ' ' + time[1].split('.')[0],
                                                    completed: item.status,
                                                    completedInput: '',
                                                    num: index,
                                                    data_id: item.data_id,
                                                    data_type: item.data_type,
                                                    task_id: item.task_id,
                                                });
                                                break;
                                            case "拓扑结构&拓扑自动辨识(训练)":
                                            case "拓扑结构&拓扑自动辨识(预测)":
                                            case "拓扑结构&拓扑自动辨识(训练)-CnnAttention":
                                            case "拓扑结构&拓扑自动辨识(预测)-CnnAttention":
                                            case "拓扑结构&拓扑自动辨识(训练)-Dnn":
                                            case "拓扑结构&拓扑自动辨识(预测)-Dnn":
                                            case "拓扑结构&特征重要性-LightGbm":
                                            case "拓扑结构&特征重要性-Rf":
                                                this.task3.push({
                                                    name: item.data_type + '-' + time[0] + ' ' + time[1].split('.')[0],
                                                    completed: item.status,
                                                    completedInput: '',
                                                    num: index,
                                                    data_id: item.data_id,
                                                    data_type: item.data_type,
                                                    task_id: item.task_id,
                                                });
                                                break;
                                            case "拓扑结构&igdt_cvar 有波动":
                                            case "拓扑结构&igdt_cvar 无波动":
                                            case "拓扑结构&nnc":
                                                this.task4.push({
                                                    name: item.data_type + '-' + time[0] + ' ' + time[1].split('.')[0],
                                                    completed: item.status,
                                                    completedInput: '',
                                                    num: index,
                                                    data_id: item.data_id,
                                                    data_type: item.data_type,
                                                    task_id: item.task_id,
                                                });
                                                break;
                                            default:
                                                break;
                                        }

                                    } else {
                                        this.uploadTasks.push({
                                            name: item.data_type + '-' + time[0] + ' ' + time[1].split('.')[0],
                                            completed: '',
                                            completedInput: item.status,
                                            num: index,
                                            data_id: item.data_id,
                                            data_type: item.data_type,
                                            task_id: item.task_id,
                                        })
                                    }
                                }
                            })
                            this.tasks = [...this.task1, ...this.task2, ...this.task3, ...this.task4, ...this.task5, ...this.task6, ...this.uploadTasks]
                            this.allTasks = this.tasks
                            this.changeSelect()
                        }
                        this.$message.success('任务队列刷新成功')
                    } else {
                        // 请求失败的处理逻辑
                        console.log('请求失败');
                        this.$message.error('服务器错误')
                    }
                })
                .catch(error => {
                    // 处理POST请求的错误
                    this.$message.error('GET请求错误')
                    console.log('GET请求错误', error);
                });
        },
        changeSelect() {
            switch (this.$route.path) {
                case '/topology':
                    this.TaskName = '拓扑辨识'
                    this.changeTask(3)
                    break;
                case '/regulate':
                    this.TaskName = '多能协同'
                    this.changeTask(4)
                    break;
                case '/restoration':
                    this.TaskName = '供电恢复'
                    this.changeTask(5)
                    break;
                default:
                    break;
            }
        }
    },
    mounted() {
        // 获取任务队列
        this.computerTasks()
        this.$bus.$on('queueData', (data) => {
            if (data === 200) {
                this.computerTasks()
            }
        })
    },
    watch: {
        visiableQueue() {
            this.dialogVisible = this.visiableQueue
        },
    },
};
</script>
<style lang="scss" scoped>
.dialog {
    position: fixed;
    right: 2vw;
    top: 2vh;
    z-index: 999;
    background: rgba(64, 160, 255, 0.73);
    border: 0.5vh solid #a534de77;
    border-radius: 1vh;
    padding-bottom: 2vh;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: moveDown 0.5s forwards;

    .dialog_body {
        position: relative;
        width: 20.5vw;
        height: 27vh;

        .dialog_title {
            text-align: center;
            font-size: 2vh;
            font-weight: bold;
            color: #fff;
            margin-bottom: 1.2vh;
            border-bottom: 2px solid #a534de79;
        }

        .task_list {
            width: 100%;
            height: 25vh;
            /* 启用垂直滚动条 */
            overflow-y: auto;
            overflow-x: hidden;

            // .fixed_tags {
            //     position: fixed;
            //     top: 3vh;
            //     left: 0vw;
            //     background-color: #2f8c90;
            //     margin-bottom: 0.5vh;
            //     margin-top: 0.5vh;
            // }

            .card_list {
                // margin-top: 6vh;
            }

            /deep/.el-card__body,
            .el-main {
                padding: 0.5vh;
            }

            /deep/.el-card {
                font-size: 1.45vh;
                color: #fff;
                font-weight: bold;
                background-color: #2f63909c;
            }

            /deep/.el-tag.el-tag--success {
                background-color: #2f3e9082;
                border-color: #e1f3d8;
                color: #ffffff;
            }

            /deep/.el-tag.el-tag--success:hover {
                background-color: #4bca1082;
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
        }

        .close {
            position: absolute;
            right: 0.5vw;
            top: 0vh;
            font-size: 2.2vh;
            color: #ffffff;
            cursor: pointer;
        }

        .close:hover {
            color: #d59318;
            cursor: pointer;
        }

        .closeChild {
            position: fixed;
            right: 0.5vw;
            font-size: 2.2vh;
            color: #ffffff;
            cursor: pointer;
        }

        .closeChild:hover {
            color: #d59318;
            cursor: pointer;
        }

        .infoAll {
            position: absolute;
            border-radius: 1vh;
            background: rgba(27, 62, 118, 0.99);
            width: 100%;
            height: 15vh;
            right: 0vw;
            bottom: -20%;
            font-size: 1.6vh;
            overflow-x: hidden;
            overflow-y: auto;
            font-weight: bold;
            color: #fff;

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
        }
    }
}

@keyframes moveDown {
    0% {
        transform: translateY(-100%);
        /* 初始位置在上方，向上偏移 100% */
    }

    100% {
        transform: translateY(0);
        /* 最终位置在原始位置，不再偏移 */
    }
}

.bgColor {
    background-color: #4bca1082 !important;
}
</style>