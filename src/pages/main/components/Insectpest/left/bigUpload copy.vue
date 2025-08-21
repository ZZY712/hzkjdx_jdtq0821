<template>
    <div style="margin-top: 1vh;margin-left: 4vw;">
        <!-- 显示上传进度，如果 uploadProgress 存在 -->
        <div v-if="uploadProgress" style="margin-bottom: 1vh;margin-left: 1vw; width: 18vw;">
            <el-progress :text-inside="true" :stroke-width="24" :percentage="uploadProgress"
                status="success"></el-progress>
        </div>
        <!-- 文件输入框，当文件改变时调用 handleFileChange 方法 -->
        <input type="file" @change="handleFileChange" multiple />
        <!-- 提交按钮，只有当有文件时才可点击 -->
        <button @click="submit" :disabled="!files.length">上传</button>
        <!-- 文件列表 -->
        <div v-if="files.length">
            <ul>
                <li v-for="(file, index) in files" :key="index">
                    {{ file.name }}
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
            maxFiles: 1,  // 最大文件数量
        };
    },
    methods: {
        // 文件改变时的处理方法
        handleFileChange(event) {
            // 限制文件数量
            const selectedFiles = Array.from(event.target.files);
            if (selectedFiles.length + this.files.length > this.maxFiles) {
                this.$message.warning(`文件数量不能超过 ${this.maxFiles} 个`);
                return;
            }
            this.files.push(...selectedFiles);
        },
        // 提交上传文件的方法
        submit() {
            if (this.formInline.level != '' &&
                this.formInline.state != '' &&
                this.formInline.model != '') {
                for (let file of this.files) {
                    if (file.size >= this.chunkSize) {
                        this.uploadFile(this.formInline, file);
                    } else {
                        this.$message.warning('文件大小小于10M,请使用普通文件上传');
                    }
                }
                // 如果所有参数都不为空，则调用 uploadFile 方法上传文件
            } else {
                // 否则，显示警告信息
                this.$message.warning('传入的参数不能为空');
            }
        },
        // 异步上传文件的方法
        async uploadFile(formInline, file) {
            // 如果等级是 1，则只保留 model 参数
            if (formInline.level === 1) {
                formInline = {
                    model: formInline.model
                }
            }
            // 如果没有文件，直接返回
            if (!file) return;

            // 计算总块数
            const totalChunks = Math.ceil(file.size / this.chunkSize);
            let currentChunk = 0;
            console.log(totalChunks, 'totalChunks');
            // 循环上传每个文件块
            while (currentChunk < totalChunks) {
                const start = currentChunk * this.chunkSize;
                const end = Math.min(file.size, start + this.chunkSize);
                const chunk = file.slice(start, end);

                // 创建 FormData 对象，添加文件块和相关信息
                const formData = new FormData();
                formData.append('chunk', chunk);
                formData.append('chunkIndex', currentChunk);
                formData.append('totalChunks', totalChunks);
                formData.append('fileName', file.name);
                // 附加信息追加需要添加请求头信息
                formData.append('infoVo', new Blob([JSON.stringify(formInline)], { type: 'application/json' }));

                try {
                    // 发送 POST 请求上传文件块
                    await util.postBig('/system/weather/importExcel', formData, {});

                    // 成功后，当前块索引增加，更新上传进度
                    currentChunk += 1;
                    this.uploadProgress = Math.round((currentChunk / totalChunks) * 100);
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
</style>
