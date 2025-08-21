<template>
    <div style="margin-top: 1vh;margin-left: 4vw;">
        <!-- 显示上传进度，如果 uploadProgress 存在 -->
        <div v-if="uploadProgress" style="margin-bottom: 1vh;margin-left: 1vw; width: 18vw;">
            <el-progress :text-inside="true" :stroke-width="24" :percentage="uploadProgress"
                status="success"></el-progress>
            <p>{{ currentFileName }}</p>
        </div>
        <!-- 文件输入框，当文件改变时调用 handleFileChange 方法 -->
        <input type="file" @change="handleFileChange" webkitdirectory multiple />
        <!-- 提交按钮，只有当有文件时才可点击 -->
        <button @click="submit" :disabled="!files.length">上传</button>
        <!-- 全部删除按钮，只有当有文件时才可点击 -->
        <button @click="confirmRemoveAllFiles" :disabled="!files.length">全部删除</button>
        <!-- 文件列表 -->
        <div v-if="files.length" class="file-list">
            <ul>
                <li v-for="(file, index) in files" :key="index">
                    {{ index + 1 }}. {{ file.name }}
                    <!-- 删除按钮 -->
                    <button @click="confirmRemoveFile(index)">删除</button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import util from '@/api/generalFormat'
import { MessageBox } from 'element-ui'

export default {
    props: {
        formInline: Object,
    },
    data() {
        return {
            files: [],  // 存储选择的文件列表
            chunkSize: 10 * 1024 * 1024, // 10 MB, 每个文件块的大小
            uploadProgress: 0,  // 上传进度
            currentFileName: '',  // 当前正在上传的文件名
            maxFiles: 1,  // 最大文件数量
        };
    },
    methods: {
        // 文件改变时的处理方法
        handleFileChange(event) {
            // 清空之前的文件
            this.files = [];
            // 获取选择的文件
            const selectedFiles = Array.from(event.target.files);
            this.files.push(...selectedFiles);
        },
        // 提交上传文件的方法
        submit() {
            if (this.formInline.level != '' &&
                this.formInline.state != '' &&
                this.formInline.model != '') {
                this.uploadFilesInChunks();
                // 如果所有参数都不为空，则调用 uploadFilesInChunks 方法上传文件
            } else {
                // 否则，显示警告信息
                this.$message.warning('传入的参数不能为空');
            }
        },
        // 分块上传文件的方法
        async uploadFilesInChunks() {
            // 如果等级是 1，则只保留 model 参数
            let start = 0;
            while (start < this.files.length) {
                const chunk = this.files.slice(start, start + 10);
                await this.uploadChunk(chunk);
                start += 10;
            }
        },
        // 上传文件块的方法
        async uploadChunk(chunk) {
            let formInline = this.formInline
            if (this.formInline.level === 1) {
                formInline = {
                    model: formInline.model
                }
            }
            for (const file of chunk) {
                this.currentFileName = file.name;
                const formData = new FormData();
                formData.append('file', file, { type: 'multipart/form-data' });
                // 附加信息追加需要添加请求头信息
                formData.append('infoVo', new Blob([JSON.stringify(formInline)], { type: 'application/json' }));

                try {
                    await util.postBig('/system/weather/importExcel', formData, {});
                    this.uploadProgress = Math.round((this.files.indexOf(file) / this.files.length) * 100);
                } catch (error) {
                    console.error('上传失败:', error);
                    break;
                }
            }

            // 如果上传进度为 100%，则表示上传成功
            if (this.uploadProgress === 100) {
                console.log('上传成功!');
            }
        },
        // 确认删除文件的方法
        confirmRemoveFile(index) {
            MessageBox.confirm('确定要删除这个文件吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.removeFile(index);
            }).catch(() => {
                this.$message.info('取消删除');
            });
        },
        // 删除文件的方法
        removeFile(index) {
            this.files.splice(index, 1);
        },
        // 确认删除所有文件的方法
        confirmRemoveAllFiles() {
            MessageBox.confirm('确定要删除所有文件吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.removeAllFiles();
            }).catch(() => {
                this.$message.info('取消删除');
            });
        },
        // 删除所有文件的方法
        removeAllFiles() {
            this.files = [];
        }
    },
};
</script>

<style lang="scss" scoped>
input,
button {
    background-color: #19a6f900;
    border: 0.1vw solid #04f2f9;
    color: #fff;
    margin-left: 1vw;
    font-size: 1.5vh;
    font-weight: bold;
}

button:hover {
    cursor: pointer;
    background: #04f2f9;
}

/* 文件列表的样式 */
.file-list {
    height: 16vh;
    overflow-y: auto;
    margin-top: 1vh;
    margin-left: 1vw;
    width: 18vw;
}

ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5vh 0;
}

li button {
    background-color: #ff4d4f;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0.5vh 1vh;
    font-size: 1.2vh;
}

li button:hover {
    background-color: #ff7875;
}
</style>
