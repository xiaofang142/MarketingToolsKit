import request from '@/utils/request'

// 获取活码列表
export function getLiveCodes(params) {
  return request({
    url: '/api/live-codes/list',
    method: 'get',
    params
  })
}

// 获取活码详情
export function getLiveCode(id) {
  return request({
    url: `/api/live-codes/${id}`,
    method: 'get'
  })
}

// 创建活码
export function createLiveCode(data) {
  return request({
    url: '/api/live-codes/create',
    method: 'post',
    data
  })
}

// 更新活码
export function updateLiveCode(id, data) {
  return request({
    url: `/api/live-codes/${id}/update`,
    method: 'put',
    data
  })
}

// 删除活码
export function deleteLiveCode(id) {
  return request({
    url: `/api/live-codes/${id}/delete`,
    method: 'delete',
    data: { id }
  })
}

// 获取活码统计
export function getLiveCodeStats(id) {
  return request({
    url: `/api/live-codes/${id}/stats`,
    method: 'get'
  })
}

// 获取活码二维码列表
export function getLiveCodeQRs(liveCodeId) {
  return request({
    url: `/api/live-codes/${liveCodeId}/qrcodes`,
    method: 'get'
  })
}

// 生成活码二维码
export function generateLiveCodeQR(liveCodeId, data) {
  return request({
    url: `/api/live-codes/${liveCodeId}/qrcodes/create`,
    method: 'post',
    data
  })
}

// 获取活码二维码统计
export function getLiveCodeQRStats(qrId) {
  return request({
    url: `/api/live-codes/qrcodes/${qrId}/stats`,
    method: 'get'
  })
}

// 分享活码
export function shareLiveCode(id, data) {
  return request({
    url: `/api/live-codes/${id}/share`,
    method: 'post',
    data
  })
}

// 删除活码二维码
export function deleteLiveCodeQR(id) {
  return request({
    url: `/api/live-codes/qrcodes/${id}/delete`,
    method: 'delete'
  })
}

// 更新活码二维码
export function updateLiveCodeQR(id, data) {
  return request({
    url: `/api/live-codes/qrcodes/${id}/update`,
    method: 'put',
    data
  })
}