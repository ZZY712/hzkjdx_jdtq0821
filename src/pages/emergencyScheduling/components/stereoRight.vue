<template>
    <div class="title_main">
        <rightLine1 />
        <rightLine2 />
        <rightLine3 />
        <!-- <draggable v-model="afterDisaster" tag="div" :options="{ animation: 200 }">
            <div v-for="(item, index) in afterDisaster" :key="index" class="card">
                {{ item.name }}
            </div>
        </draggable> -->
    </div>
</template>

<script>
import rightLine1 from '@/pages/emergencyScheduling/components/rightLine1.vue'
import rightLine2 from '@/pages/emergencyScheduling/components/rightLine2.vue'
import rightLine3 from '@/pages/emergencyScheduling/components/rightLine3.vue'
// import draggable from 'vuedraggable'
export default {
    components: {
        // draggable,
        rightLine1,
        rightLine2,
        rightLine3,
    },
    data() {
        return {
            afterDisaster: [
                {
                    name: '各时段负荷功率和恢复比例'
                },
                {
                    name: '移动储能有功功率输出与接入位置的关系'
                },
                {
                    name: '移动储能荷电状态与接入位置的关系'
                },
            ],
            chartInstances: [],
        };
    },
    methods: {
    },
    mounted() {
    },
    beforeDestroy() {
    }
}
</script>

<style lang="scss" scoped>
.title_main {
    width: 100%;
    height: 95%;
    /* 启用垂直滚动条 */
    overflow-y: auto;
    overflow-x: hidden;

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


    .card {
        border: 1px solid #14c0d3de;
        font-size: 1.6vh;
        border-radius: 2vh;
        margin-left: 10%;
        margin-bottom: 5%;
        height: 16vh;
        width: 80%;
        color: #fff;
        background-color: rgba(7, 185, 225, 0.664);
        cursor: pointer;
    }

    .card:hover {
        background-color: rgb(7, 185, 225);
    }

}
</style>
