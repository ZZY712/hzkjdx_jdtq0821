import util from '@/api/generalFormat'
export function computeIdData(data) {
    // if (!data || !data.id) {
    //     console.error('缺少必要参数：id');
    //     return Promise.reject('缺少必要参数：id');
    // }

    const requestData = {
        // BasicDataType: '天气实际&预测数据',
        BasicDataType: '1节点支路实际&预测天气',
        id: data.id
    };
    return util.post('/get/datas', requestData)
        .then(response => {
            if (response?.code === 200) {
                return response;
            } else {
                throw new Error('请求失败');
            }
        })
        .catch(error => {
            console.error('POST请求错误', error);
            throw error;
        });
}
export function computeIdTopologyData(data) {
    // if (!data || !data.id) {
    //     console.error('缺少必要参数：id');
    //     return Promise.reject('缺少必要参数：id');
    // }
    return new Promise((resolve, reject) => {
        let responses
        data = {
            BasicDataType: '支路实际&预测天气',
            id: data.id
        }
        util.post('/get/datas', data)
            .then(response => {
                if (response && response.code === 200) {
                    responses = response
                    resolve({ responses });
                } else {
                    console.log('请求失败');
                    reject(new Error('请求失败'));
                }
            })
            .catch(error => {
                console.log('GET请求错误', error);
                reject(error);
            });
    })
}
export function computeIdLoadData(data) {
    // if (!data || !data.id) {
    //     console.error('缺少必要参数：id');
    //     return Promise.reject('缺少必要参数：id');
    // }

    const requestData = {
        // BasicDataType: '天气实际&预测数据',
        BasicDataType: '节点负载数据',
        id: data.id
    };
    return util.post('/get/datas', requestData)
        .then(response => {
            if (response?.code === 200) {
                return response;
            } else {
                throw new Error('请求失败');
            }
        })
        .catch(error => {
            console.error('POST请求错误', error);
            throw error;
        });
}