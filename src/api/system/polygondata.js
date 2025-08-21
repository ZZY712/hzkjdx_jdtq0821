import request from '@/utils/request'

// 查询polygon列表
export function listpolygon(query) {
  return request({
    url: '/system/polygonpoint/list',
    method: 'get',
    params: query
  })
}

// 查询电缆数据详细
export function getpolygon(id) {
  return request({
    url: '/system/polygon/' + id,
    method: 'get'
  })
}

// 新增电缆数据
export function addCabledata(data) {
  return request({
    url: '/system/cabledata',
    method: 'post',
    data: data
  })
}

// 修改电缆数据
export function updateCabledata(data) {
  return request({
    url: '/system/cabledata',
    method: 'put',
    data: data
  })
}

// 删除电缆数据
export function delCabledata(id) {
  return request({
    url: '/system/cabledata/' + id,
    method: 'delete'
  })
}

// 获取电路状态
export function getCircuitStatus() {
  return request({
    url: '/circuit/state',
    method: 'get',
  })
}