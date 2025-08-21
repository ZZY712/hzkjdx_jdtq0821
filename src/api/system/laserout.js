import request from '@/utils/request'

// 查询围墙数据列表
export function listLaserOut(query) {
  return request({
    url: '/system/laserout/list',
    method: 'get',
    params: query
  })
}

// 查询围墙数据详细
export function getLaserOut(id) {
  return request({
    url: '/system/laserout/' + id,
    method: 'get'
  })
}

// 新增围墙数据
export function addLaserOut(data) {
  return request({
    url: '/system/laserout',
    method: 'post',
    data: data
  })
}

// 修改围墙数据
export function updateLaserOut(data) {
  return request({
    url: '/system/laserout',
    method: 'put',
    data: data
  })
}

// 删除围墙数据
export function delLaserOut(id) {
  return request({
    url: '/system/laserout/' + id,
    method: 'delete'
  })
}