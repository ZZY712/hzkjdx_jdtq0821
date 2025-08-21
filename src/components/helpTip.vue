<template>
    <div>
        <div @click="showImage" class="pdfStlye">
            {{ PDFName }}详图
        </div>

        <!-- 图片预览弹窗 -->
        <div v-if="showPreview" class="image-preview-overlay" @click.self="closePreview">
            <div class="image-preview-container">
                <div class="preview-header">
                    <span>{{ PDFName }}详图</span>
                    <div class="control-buttons">
                        <button @click.stop="zoomOut" title="缩小" :disabled="scale <= minScale">－</button>
                        <button @click.stop="resetZoom" title="重置">{{ Math.round(scale * 100) }}%</button>
                        <button @click.stop="zoomIn" title="放大" :disabled="scale >= maxScale">＋</button>
                    </div>
                    <button @click="closePreview" class="close-btn">×</button>
                </div>
                <div class="preview-content" ref="previewContent">
                    <div class="image-wrapper" :style="{
                        transform: `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`,
                        transition: isDragging ? 'none' : 'transform 0.2s ease'
                    }" @mousedown="startDrag" @touchstart="startDrag" @wheel="handleWheel">
                        <img ref="previewImage" :src="imageUrl" :alt="PDFName + '详图'" @load="imageLoaded = true"
                            @error="handleImageError" v-show="!showError && imageLoaded" />
                    </div>

                    <div v-if="loading && !imageLoaded && !showError" class="loading-indicator">
                        <div class="spinner"></div>
                        <p>图片加载中...</p>
                    </div>
                    <div v-if="showError" class="error-message">
                        <p>⚠️ 图片加载失败</p>
                        <p>请检查图片路径: {{ imageUrl }}</p>
                    </div>

                    <div class="zoom-hint" v-if="showZoomHint">
                        使用鼠标滚轮或 +/- 按钮缩放图片
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        PDFName: String,
    },
    data() {
        return {
            showPreview: false,
            imageUrl: "",
            loading: false,
            imageLoaded: false,
            showError: false,
            scale: 1,
            minScale: 0.2,
            maxScale: 5,
            offsetX: 0,
            offsetY: 0,
            isDragging: false,
            startDragX: 0,
            startDragY: 0,
            startOffsetX: 0,
            startOffsetY: 0,
            showZoomHint: true
        };
    },
    mounted() {
        // 添加全局事件监听
        document.addEventListener('keydown', this.handleKeyDown);
    },
    beforeDestroy() {
        // 移除全局事件监听
        document.removeEventListener('keydown', this.handleKeyDown);
    },
    methods: {
        showImage() {
            if (!this.PDFName) {
                console.error("PDFName prop is required");
                return;
            }

            // 重置状态
            this.imageLoaded = false;
            this.showError = false;
            this.loading = true;
            this.showPreview = true;
            this.scale = 1;
            this.offsetX = 0;
            this.offsetY = 0;

            // 设置图片URL - 根据实际路径调整
            this.imageUrl = `/pdf/${this.PDFName}.png`;

            // 3秒后隐藏缩放提示
            setTimeout(() => {
                this.showZoomHint = false;
            }, 3000);
        },

        closePreview() {
            this.showPreview = false;
            this.loading = false;
            this.showZoomHint = true;
        },

        handleImageError() {
            this.showError = true;
            this.loading = false;
        },

        // 放大功能
        zoomIn() {
            if (this.scale < this.maxScale) {
                this.scale = Math.min(this.maxScale, this.scale + 0.2);
                this.adjustPositionAfterZoom();
            }
        },

        // 缩小功能
        zoomOut() {
            if (this.scale > this.minScale) {
                this.scale = Math.max(this.minScale, this.scale - 0.2);
                this.adjustPositionAfterZoom();
            }
        },

        // 重置缩放和位置
        resetZoom() {
            this.scale = 1;
            this.offsetX = 0;
            this.offsetY = 0;
        },

        // 缩放后调整位置
        adjustPositionAfterZoom() {
            // 确保图片不会超出边界太多
            const maxOffset = 100 * this.scale;
            this.offsetX = Math.min(maxOffset, Math.max(-maxOffset, this.offsetX));
            this.offsetY = Math.min(maxOffset, Math.max(-maxOffset, this.offsetY));
        },

        // 开始拖拽
        startDrag(e) {
            if (!this.imageLoaded) return;

            this.isDragging = true;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            this.startDragX = clientX;
            this.startDragY = clientY;
            this.startOffsetX = this.offsetX;
            this.startOffsetY = this.offsetY;

            // 添加事件监听
            document.addEventListener('mousemove', this.onDrag);
            document.addEventListener('mouseup', this.endDrag);
            document.addEventListener('touchmove', this.onDrag, { passive: false });
            document.addEventListener('touchend', this.endDrag);

            e.preventDefault();
        },

        // 拖拽中
        onDrag(e) {
            if (!this.isDragging) return;

            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            // 计算偏移量
            this.offsetX = this.startOffsetX + (clientX - this.startDragX) / this.scale;
            this.offsetY = this.startOffsetY + (clientY - this.startDragY) / this.scale;

            // 限制最大偏移量
            const maxOffset = 100 * this.scale;
            this.offsetX = Math.min(maxOffset, Math.max(-maxOffset, this.offsetX));
            this.offsetY = Math.min(maxOffset, Math.max(-maxOffset, this.offsetY));

            e.preventDefault();
        },

        // 结束拖拽
        endDrag() {
            this.isDragging = false;

            // 移除事件监听
            document.removeEventListener('mousemove', this.onDrag);
            document.removeEventListener('mouseup', this.endDrag);
            document.removeEventListener('touchmove', this.onDrag);
            document.removeEventListener('touchend', this.endDrag);
        },

        // 键盘快捷键
        handleKeyDown(e) {
            if (!this.showPreview) return;

            // 放大缩小快捷键: + / -
            if (e.key === '+' || e.key === '=') {
                this.zoomIn();
                e.preventDefault();
            } else if (e.key === '-' || e.key === '_') {
                this.zoomOut();
                e.preventDefault();
            } else if (e.key === '0') {
                this.resetZoom();
                e.preventDefault();
            } else if (e.key === 'Escape') {
                this.closePreview();
                e.preventDefault();
            }
        },

        // 处理鼠标滚轮缩放
        handleWheel(e) {
            if (!this.imageLoaded || !this.showPreview) return;

            e.preventDefault();
            const delta = e.deltaY > 0 ? -1 : 1;

            // 计算缩放中心点（相对于图片）
            const rect = this.$refs.previewContent.getBoundingClientRect();
            const centerX = (e.clientX - rect.left - rect.width / 2) / this.scale;
            const centerY = (e.clientY - rect.top - rect.height / 2) / this.scale;

            // 保存当前缩放比例
            const oldScale = this.scale;

            // 更新缩放比例
            this.scale = Math.max(this.minScale, Math.min(this.maxScale, this.scale + delta * 0.1));

            // 调整位置，使缩放中心保持不变
            this.offsetX = this.offsetX + centerX * (1 - this.scale / oldScale);
            this.offsetY = this.offsetY + centerY * (1 - this.scale / oldScale);

            // 限制最大偏移量
            this.adjustPositionAfterZoom();
        }
    }
}
</script>

<style lang="scss" scoped>
.pdfStlye {
    padding: 0.5vh;
    left: 5vh;
    bottom: 2vh;
    position: absolute;
    z-index: 9999;
    cursor: pointer;
    border-radius: 1vh;
    color: #fff;
    border: 1px solid;
    background-color: #18abe1;
    transition: all 0.3s ease;
    font-size: 14px;
    text-align: center;
    min-width: 120px;
    display: inline-block;

    &:hover {
        background-color: #18e1c3;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
}

.image-preview-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
}

.image-preview-container {
    background: white;
    border-radius: 8px;
    width: 85%;
    max-width: 1000px;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 5px 30px rgba(0, 0, 0, 0.5);
}

.preview-header {
    padding: 12px 20px;
    background: #18abe1;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    font-weight: bold;

    .control-buttons {
        display: flex;
        gap: 8px;
        margin-left: 20px;

        button {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            font-size: 18px;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;

            &:hover:not(:disabled) {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.1);
            }

            &:disabled {
                opacity: 0.4;
                cursor: not-allowed;
            }

            &:nth-child(2) {
                width: auto;
                padding: 0 15px;
                border-radius: 18px;
                font-size: 16px;
            }
        }
    }
}

.close-btn {
    background: transparent;
    border: none;
    color: white;
    font-size: 32px;
    cursor: pointer;
    line-height: 1;
    padding: 0 15px;
    transition: transform 0.2s;

    &:hover {
        transform: scale(1.2);
    }
}

.preview-content {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
    padding: 20px;
    overflow: hidden;
    position: relative;
    cursor: grab;

    &:active {
        cursor: grabbing;
    }

    .image-wrapper {
        transform-origin: center center;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;

        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            box-shadow: 0 2px 15px rgba(0, 0, 0, 0.2);
            transition: transform 0.2s ease;
            cursor: move;
        }
    }
}

.zoom-hint {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 8px 15px;
    border-radius: 20px;
    font-size: 14px;
    animation: fadeHint 5s forwards;
}

@keyframes fadeHint {
    0% {
        opacity: 0;
    }

    10% {
        opacity: 1;
    }

    90% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}

.loading-indicator {
    text-align: center;
    color: #666;

    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #18abe1;
        border-radius: 50%;
        margin: 0 auto 15px;
        animation: spin 1s linear infinite;
    }

    p {
        margin: 0;
        font-size: 16px;
    }
}

.error-message {
    text-align: center;
    color: #e74c3c;
    padding: 20px;

    p {
        margin: 5px 0;
        font-size: 16px;

        &:first-child {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
        }
    }
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>