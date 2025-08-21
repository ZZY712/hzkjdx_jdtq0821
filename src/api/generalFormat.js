import request from '@/utils/requestPy'
let util = {}

util.get = async function get(url) {
    try {
        return await request({
            url,
            method: 'get',
            headers: {
                Authorization: window.token,
                token: window.token,
            },
        })
    } catch (error) {
        console.error('Error in util.get:', error)
        throw error
    }
}

util.post = async function post(url, data) {
    try {
        return await request({
            url,
            method: 'post',
            headers: {
                "Authorization": window.token,
            },
            data: JSON.stringify(data),
            timeout: 1000 * 60 * 2
        })
    } catch (error) {
        console.error('Error in util.post:', error)
        throw error
    }
}

util.postBig = async function post(url, data) {
    try {
        return await request({
            url,
            method: 'post',
            data: data,
            headers: {
                //请求头
                "Authorization": window.token,
                'Content-Type': 'multipart/form-data',
            },
            timeout: 1000 * 60 * 2
        })
    } catch (error) {
        console.error('Error in util.postBig:', error)
        throw error
    }
}

util.postFormData = async function postFormData(url, data, formInline) {
    try {
        let formData = new FormData();
        for (const key in data) {
            var v = data[key];
            if (key === 'file' && v.length) {
                v.forEach((value,) => {
                    formData.append('file', value);
                })
            } else {
                formData.append(key, v)
            }
        }
        // 附加信息追加需要添加请求头信息
        formData.append('infoVo', new Blob([JSON.stringify(formInline)], { type: 'application/json' }));
        // console.log(formData, 'formData');
        return await request({
            url,
            method: 'post',
            data: formData,
            headers: {
                //请求头
                "Authorization": window.token,
                'Content-Type': 'multipart/form-data',
            },
            timeout: 60000 * 5
        })
    } catch (error) {
        console.error('Error in util.postFormData:', error)
        throw error
    }
}

export default util;