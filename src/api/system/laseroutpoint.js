import request from '@/utils/request'

// 查询围墙点数据列表
export function listLaserOutPoint(query) {
  return request({
    url: '/system/laseroutpoint/list',
    method: 'get',
    params: query
  })
}

// 查询围墙点数据详细
export function getLaserOutPoint(id) {
  return request({
    url: '/system/laseroutpoint/' + id,
    method: 'get'
  })
}

// 新增围墙点数据
export function addLaserOutPoint(data) {
  return request({
    url: '/system/laseroutpoint',
    method: 'post',
    data: data
  })
}

// 修改围墙点数据
export function updateLaserOutPoint(data) {
  return request({
    url: '/system/laseroutpoint',
    method: 'put',
    data: data
  })
}

// 删除围墙点数据
export function delLaserOutPoint(id) {
  return request({
    url: '/system/laseroutpoint/' + id,
    method: 'delete'
  })
}