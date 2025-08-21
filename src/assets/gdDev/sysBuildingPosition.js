import util from '@/utils/request'

// @Tags BuildingPosition
// @Summary 创建BuildingPosition
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.BuildingPosition true "创建BuildingPosition"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /buildingPosition/createBuildingPosition [post]
export const createBuildingPosition = (data) => {
  return util({
    url: '/buildingPosition/createBuildingPosition',
    method: 'post',
    data
  })
}

// @Tags BuildingPosition
// @Summary 删除BuildingPosition
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.BuildingPosition true "删除BuildingPosition"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /buildingPosition/deleteBuildingPosition [delete]
export const deleteBuildingPosition = (data) => {
  return util({
    url: '/buildingPosition/deleteBuildingPosition',
    method: 'delete',
    data
  })
}

// @Tags BuildingPosition
// @Summary 删除BuildingPosition
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body request.IdsReq true "批量删除BuildingPosition"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /buildingPosition/deleteBuildingPosition [delete]
export const deleteBuildingPositionByIds = (data) => {
  return util({
    url: '/buildingPosition/deleteBuildingPositionByIds',
    method: 'delete',
    data
  })
}

// @Tags BuildingPosition
// @Summary 更新BuildingPosition
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.BuildingPosition true "更新BuildingPosition"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"更新成功"}"
// @Router /buildingPosition/updateBuildingPosition [put]
export const updateBuildingPosition = (data) => {
  return util({
    url: '/buildingPosition/updateBuildingPosition',
    method: 'put',
    data
  })
}

// @Tags BuildingPosition
// @Summary 用id查询BuildingPosition
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data query model.BuildingPosition true "用id查询BuildingPosition"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"查询成功"}"
// @Router /buildingPosition/findBuildingPosition [get]
export const findBuildingPosition = (params) => {
  return util({
    url: '/buildingPosition/findBuildingPosition',
    method: 'get',
    params
  })
}

// @Tags BuildingPosition
// @Summary 分页获取BuildingPosition列表
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data query request.PageInfo true "分页获取BuildingPosition列表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /buildingPosition/getBuildingPositionList [get]
export const getBuildingPositionList = (params) => {
  let url = '/buildingPosition/getBuildingPositionList'
  if (params && params.page && params.pageSize) {
    url += '?page=' + params.page + "&pageSize=" + params.pageSize
  }
  return util.get(
    url
  )
}
