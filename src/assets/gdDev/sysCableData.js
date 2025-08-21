import util from '@/utils/request'

// @Tags CableData
// @Summary 创建CableData
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.CableData true "创建CableData"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /cableData/createCableData [post]
export const createCableData = (data) => {
  return util({
    url: '/cableData/createCableData',
    method: 'post',
    data
  })
}

// @Tags CableData
// @Summary 删除CableData
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.CableData true "删除CableData"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /cableData/deleteCableData [delete]
export const deleteCableData = (data) => {
  return util({
    url: '/cableData/deleteCableData',
    method: 'delete',
    data
  })
}

// @Tags CableData
// @Summary 删除CableData
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body request.IdsReq true "批量删除CableData"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /cableData/deleteCableData [delete]
export const deleteCableDataByIds = (data) => {
  return util({
    url: '/cableData/deleteCableDataByIds',
    method: 'delete',
    data
  })
}

// @Tags CableData
// @Summary 更新CableData
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.CableData true "更新CableData"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"更新成功"}"
// @Router /cableData/updateCableData [put]
export const updateCableData = (data) => {
  return util({
    url: '/cableData/updateCableData',
    method: 'put',
    data
  })
}

// @Tags CableData
// @Summary 用id查询CableData
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data query model.CableData true "用id查询CableData"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"查询成功"}"
// @Router /cableData/findCableData [get]
export const findCableData = (params) => {
  return util({
    url: '/cableData/findCableData',
    method: 'get',
    params
  })
}

// @Tags CableData
// @Summary 分页获取CableData列表
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data query request.PageInfo true "分页获取CableData列表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /cableData/getCableDataList [get]
export const getCableDataList = (params) => {
  let url = '/cableData/getCableDataList'
  if (params && params.page && params.pageSize) {
    url += '?page=' + params.page + "&pageSize=" + params.pageSize
  }
  return util.get(
    url
  )
}
