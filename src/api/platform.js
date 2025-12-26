import request from '@/utils/request'

// 平台相关API
export const platformAPI = {
  // 获取最新消息
  getLatestMessage() {
    return request({
      url: '/api/platform/message/latest',
      method: 'get'
    })
  },

  // 标记消息已读
  markMessageRead(messageId) {
    return request({
      url: `/api/platform/message/${messageId}/read`,
      method: 'post'
    })
  },

  // 获取授权状态
  getLicenseStatus() {
    return request({
      url: '/api/platform/license/status',
      method: 'get'
    })
  },

  // 上报API日志
  reportAPILog(data) {
    return request({
      url: '/api/platform/logs/report',
      method: 'post',
      data
    })
  },

  // 注册商户
  registerMerchant(data) {
    return request({
      url: '/api/platform/merchant/register',
      method: 'post',
      data
    })
  }
}