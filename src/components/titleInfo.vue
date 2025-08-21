<template>
    <div class="boxCard">
        <el-card v-for="(item, index) in cardData" :key="item.titleName + index" class="card">
            <div slot="header" class="clearfix">
                <span>{{ item.titleName }}</span>
            </div>
            <div class="content">
                <div ref="animatedText" :id="'animatedText_' + index" class="animated-text"></div>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    props: {
        titleInfoFlag: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            cardData: [],
            titleInfoDatas: [
                [
                    {
                        titleName: '风速预测模型(预测)',
                        titleContent: '该算法可以对风速、雨量、温度、湿度四个维度进行预测，在界面的左右两边进行数据的可视化展示，在下方对结果进行汇总。'
                    },
                ],
                [
                    {
                        titleName: 'GAN模型(训练)',
                        titleContent: '该算法主要是将少部分数据经过GAN算法进行小样本数据的增广在界面的左右两边进行数据的可视化展示。'
                    },
                ],
                [
                    {
                        titleName: '故障预测模型(训练)',
                        titleContent: '故障预测模型(训练)主要是对数据进行处理，得到残差图和分析图，在左侧图表进行可视化展示。'
                    },
                    {
                        titleName: '故障预测模型(预测)',
                        titleContent: '故障预测模型(预测)主要是对数据进行处理，得到模型预测故障概率图、残差图和分析图，在右侧图表进行可视化展示。'
                    },
                    // {
                    //     titleName: '故障预测模型(微调)',
                    //     titleContent: '故障预测模型(训练)主要是对数据进行处理，得到残差图和分析图，在左侧图表进行可视化展示。'
                    // },
                    {
                        titleName: '台风模型线路故障概率',
                        titleContent: '台风模型线路故障概率算法能得到风速与故障概率之间的变化图，在左侧的第一个图表上进行可视化展示。'
                    }, {
                        titleName: '故障预测数学模型',
                        titleContent: '故障预测数学模型算法能得到模型预测故障概率图(数学模型),在右侧图表进行可视化展示。'
                    },
                ],
                [
                    {
                        titleName: '基于电流的风险预警(训练)',
                        titleContent: '基于电流的风险预警(训练)得到的主要是loss训练数据，以及误差数据表中MAE、RSME、SMAPE的具体的值。'
                    },
                    {
                        titleName: '基于电流的风险预警(预测)',
                        titleContent: '基于电流的风险预警(预测)得到的主要是残差图以及预警分析图并进行可视化展示。'
                    },
                    {
                        titleName: '基于电流的风险预警(pytorch训练)',
                        titleContent: '基于电流的风险预警(pytorch训练)得到的主要是loss训练数据，以及误差数据表中MAE、RSME、SMAPE的具体的值。'
                    },
                    {
                        titleName: '基于电流的风险预警(pytorch预测)',
                        titleContent: '基于电流的风险预警(pytorch预测)得到的主要是残差图以及预警分析图并进行可视化展示。'
                    },
                ],
                [
                    {
                        titleName: '故障诊断(预测)',
                        titleContent: '故障诊断(预测)得到的主要是混淆矩阵在左侧热力图中进行可视化的展示。'
                    },
                    {
                        titleName: '故障定位',
                        titleContent: '故障定位中的基于attention-lstm的故障定位在左侧热力图中进行可视化展示；性能比较的结果在左侧的正确定位次数、运算时间中进行可视化展示；性能比较(容错)的结果在右侧单点、两单、三点故障图中进行可视化展示；容错性测试、基于ftu信息的故障定位、大规模配电网测试的结果则在中间图表中展示。其中方案一：基于整数线性规划的考虑FTU信息缺失的有源配电网故障区段定位模型。 方案二：不考虑FTU信息缺失，将模型转化为整数线性规划模型进行求解。 方案三：传统的智能优化算法（遗传算法）求解故障定位逻辑模型。'
                    },
                ],
                [
                    {
                        titleName: '拓扑自动辨识',
                        titleContent: '故障诊断(预测)得到的主要是混淆矩阵在左侧热力图中进行可视化的展示。'
                    },
                ],
            ],
        };
    },
    watch: {
        titleInfoFlag(newValue) {
            if (newValue >= 0 && newValue < this.titleInfoDatas.length) {
                this.cardData = []
                this.cardData = this.titleInfoDatas[newValue];
                this.animateText();
            } else {
                console.error('titleInfoFlag无效', newValue);
            }
        }
    },
    methods: {
        animateText() {
            this.$nextTick(() => {
                this.cardData.forEach((item, index) => {
                    const textElement = document.getElementById('animatedText_' + index);
                    const text = item.titleContent;
                    let i = 0;

                    textElement.innerHTML = ''; // 清空当前的内容

                    const typingEffect = () => {
                        if (i < text.length) {
                            textElement.innerHTML += text.charAt(i);
                            i++;
                            setTimeout(typingEffect, 50); // 设定打字速度
                        }
                    };

                    typingEffect();
                });
            });
        }
    },
    mounted() {
        if (this.titleInfoFlag >= 0 && this.titleInfoFlag < this.titleInfoDatas.length) {
            this.cardData = []
            this.cardData = this.titleInfoDatas[this.titleInfoFlag];
            this.animateText();
        }
        // this.$bus.$on('RELOADINFO', () => {
        //     this.cardData = []
        //     this.cardData = this.titleInfoDatas[this.titleInfoFlag];
        //     this.animateText();
        // })
    },
}
</script>

<style lang="scss" scoped>
.boxCard {
    position: absolute;
    width: 100%;
    height: 35vh;
    // top: 11vh;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;

    .clearfix {
        text-align: center;
        font-size: 1.8vh;
        font-weight: bold;
    }

    /deep/ .el-card {
        border-radius: 4px;
        border: 1px solid #EBEEF5;
        background-color: rgba(14, 39, 84, 0.68);
        overflow: hidden;
        color: #fff;
        transition: .3s;
        width: 18vw;
        height: 90%;
        margin-top: 2vh;
        margin-bottom: 2vh;
    }

    .content {
        width: 100%;
        height: 100%;
    }

    .animated-text {
        display: inline-block;
        font-size: 1.42vh;
    }

    /* Custom scrollbar styles */
    &::-webkit-scrollbar {
        width: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: #4f668e00;
        border-radius: 4px;
    }

    &::-webkit-scrollbar-track {
        background: #52557900;
        border-radius: 4px;
    }
}
</style>
