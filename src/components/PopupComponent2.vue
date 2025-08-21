<template>
    <div class="popup" ref="popup">
        <iframe width="320" scrolling="no" height="30" frameborder="0" allowtransparency="true"
            src="https://i.tianqi.com?c=code&id=1&color=%23FFFFFF&bdc=%23&icon=3&py=pingdingshan&site=16"></iframe>
        <!-- <iframe width="520" scrolling="no" height="190" frameborder="0" allowtransparency="true"
                    src="https://i.tianqi.com?c=code&id=83&icon=1&py=pingdingshan&site=12"></iframe> -->
        <div class="popupInfo">
            <div class="infoBlock">
                <img src="../assets/img/jiduan/运行状况.png" alt="" class="iconImage">
                <div class="infoContent">
                    <div class="fontStyle">配电网健康状况</div>
                    <div style=" font-size: 1.5vh;text-align: center;font-weight: bold;"
                        v-for="(item, index) in colorData" :key="index">
                        {{ item.name }}--{{ item.status }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { decryptData } from '@/utils/cryptoUtils';
export default {
    name: 'PopupComponent2',
    data() {
        return {
            showHealth: false,
            colorData: []
        }
    },
    methods: {
        closePopup() {
        },
        changeShow() {
            let encryptedData = sessionStorage.getItem('colorsDATA');
            if (encryptedData && this.colorData.length === 0) {
                let decryptedData = decryptData(encryptedData, process.env.VUE_APP_CRYPTO_KEY);
                decryptedData.colors.forEach((item, index) => {
                    this.colorData.push({
                        name: '线路编号' + (index + 1),
                        status: item === '#ff0000' ? '紧急' : item === '#ffff00' ? '警告' : '正常',
                    })
                });
            }
        }
    },
    mounted() {
        this.changeShow()
    },
    activated() {
        this.changeShow()
    },
    deactivated() {
    }
};
</script>

<style lang="scss" scoped>
.popup {
    position: fixed;
    top: 16.5vh;
    left: 31.2vw;
    width: 16vw;
    height: 9vh;
    // border: 3px solid #4187B3;
    // border-radius: 3vh 0vh 0vh 0vh;
    padding: 20px;
    z-index: 9999;
    // background-color: rgba(61, 232, 244, 0.4);

    .popupInfo {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;

        .infoBlock {
            margin-bottom: 20px;
            display: flex;
            align-items: center;

            .iconImage {
                width: 4vh;
                height: 4vh;
                padding: 1vh;
                border-radius: 1.5vh;
                background-color: white;
                margin-right: 10px;
            }
        }

        .infoContent {
            padding: 10px;
            border-radius: 8px;
            background-color: white;
            font-size: 1.2vh;
            height: 5vh;
            flex-grow: 1;
            overflow-y: auto;

            .fontStyle {
                font-size: 1.8vh;
                text-align: center;
                font-weight: bold;
                margin-bottom: 10px;
            }
        }
    }

}

::-webkit-scrollbar {
    width: 6px;
    height: 8px;
    background-color: rgb(32, 52, 131);
}

::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 2px rgba(0, 0, 0, .3);
    -webkit-box-shadow: inset 0 0 wpx rgba(0, 0, 0, .3);
    background-color: rgba(115, 167, 252, 0.599);
    border-radius: 3px;
}

::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    background: rgba(0, 0, 0, 0.2);
}
</style>
