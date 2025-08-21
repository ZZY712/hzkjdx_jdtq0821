import request from '@/utils/request'

// 查询建筑位置信息列表
export function listBuildingposition(query) {
  return request({
    url: '/system/buildingposition/list',
    method: 'get',
    params: query
  })
}

// 查询建筑位置信息详细
export function getBuildingposition(id) {
  return request({
    url: '/system/buildingposition/' + id,
    method: 'get'
  })
}

// 新增建筑位置信息
export function addBuildingposition(data) {
  return request({
    url: '/system/buildingposition',
    method: 'post',
    data: data
  })
}

// 修改建筑位置信息
export function updateBuildingposition(data) {
  return request({
    url: '/system/buildingposition',
    method: 'put',
    data: data
  })
}

// 删除建筑位置信息
export function delBuildingposition(id) {
  return request({
    url: '/system/buildingposition/' + id,
    method: 'delete'
  })
}
