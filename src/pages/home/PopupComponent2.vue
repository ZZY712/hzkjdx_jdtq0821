<template>
    <div class="popup" ref="popup">
        <div class="popupInfo">
            <div class="infoBlock">
                <img src="../../assets/img/jiduan/fengshu.png" alt="" class="iconImage">
                <div class="infoContent">
                    <div class="fontStyle">风速</div>
                    风速
                </div>
            </div>
            <div class="infoBlock">
                <img src="../../assets/img/jiduan/guzhangbaojing.png" alt="" class="iconImage">
                <div class="infoContent">
                    <div class="fontStyle">故障报警</div>
                    故障报警
                </div>
            </div>
            <div class="infoBlock">
                <img src="../../assets/img/jiduan/diaoduzhuangtai.png" alt="" class="iconImage">
                <div class="infoContent">
                    <div class="fontStyle">调度状态</div>
                    调度状态
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PopupComponent2',
    methods: {
        closePopup() {
        },
    },
};
</script>

<style lang="scss" scoped>
.popup {
    position: fixed;
    top: 5vh;
    left: 0vw;
    width: 15%;
    height: 25%;
    border: 3px solid #4187B3;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    padding: 20px;
    z-index: 9999;
    border-radius: 6px;
    background-color: rgba(61, 232, 244, 0.4);
    overflow-y: auto;

    .fontStyle {
        font-size: 1.5vh;
        text-align: center;
        font-weight: bold;
        margin-bottom: 10px;
    }

    .popupInfo {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }

    .infoBlock {
        margin-bottom: 20px;
        display: flex;
        align-items: center;
    }

    .infoContent {
        padding: 10px;
        border-radius: 8px;
        background-color: white;
        font-size: 1.2vh;
        min-height: 4vh;
        flex-grow: 1;
    }

    .iconImage {
        width: 4vh;
        height: 4vh;
        padding: 1vh;
        border-radius: 1.5vh;
        background-color: white;
        margin-right: 10px;
    }
}
</style>
<style>
::-webkit-scrollbar {
    width: 6px;
    height: 8px;
    background-color: rgb(32, 52, 131);
}

::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 2px rgba(0, 0, 0, .3);
    -webkit-box-shadow: inset 0 0 wpx rgba(0, 0, 0, .3);
    background-color: rgb(136, 244, 230);
    border-radius: 3px;
}

::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    background: rgba(0, 0, 0, 0.2);
}
</style>
