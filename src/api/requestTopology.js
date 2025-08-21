/* global BMap */
import util from '@/api/generalFormat'
import { decryptData, encryptData } from '@/utils/cryptoUtils';
export function computeTopology(dataName) {
    return new Promise((resolve, reject) => {
        let responses;
        let num;
        let id;
        if (sessionStorage.getItem('topologyDATA') != null) {
            responses = decryptData(sessionStorage.getItem('topologyDATA'), process.env.VUE_APP_CRYPTO_KEY);
            for (let index = 0; index < responses.rows.length; index++) {
                if (responses.rows[index].name === dataName) {
                    num = index;
                    id = responses.rows[index].id;
                    break;
                }
            }
            resolve({ responses, num, id });
        } else {
            util.get('/get/topology/data')
                .then(response => {
                    if (response && response.code === 200) {
                        let encryptedData = encryptData({ rows: response.rows, }, process.env.VUE_APP_CRYPTO_KEY);
                        sessionStorage.setItem("topologyDATA", encryptedData);
                        for (let index = 0; index < response.rows.length; index++) {
                            if (response.rows[index].name === dataName) {
                                num = index;
                                id = response.rows[index].id;
                                break;
                            }
                        }
                        responses = response;
                        resolve({ responses, num, id });
                    } else {
                        console.log('请求失败');
                        reject(new Error('请求失败'));
                    }
                })
                .catch(error => {
                    console.log('GET请求错误', error);
                    reject(error);
                });
        }
    });
}
export function mapBaidu(dataName) {
    // 检测网络连接状态
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
        console.warn("No internet connection available. Baidu map initialization aborted.");
        return;
    }
    // 尝试初始化地图（捕获可能的网络错误）
    try {
        let map = new BMap.Map(dataName);
        map.centerAndZoom(new BMap.Point(120.6167, 31.2667), 15);

        map.enableScrollWheelZoom();
        map.enableDragging();
        var mapStyle = { style: 'midnight' };
        map.setMapStyle(mapStyle);
    } catch (error) {
        console.error("Baidu map initialization failed:", error);
    }
}