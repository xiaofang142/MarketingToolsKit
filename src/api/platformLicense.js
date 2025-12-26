import { http } from '@/utils/request'

export const PlatformLicenseApi = {
  // 获取许可证列表
  getList: (params) => {
    return http.get('/platform/license/list', { params })
  },
  
  // 获取许可证详情
  getById: (id) => {
    return http.get(`/platform/license/${id}`)
  },
  
  // 创建许可证
  create: (data) => {
    return http.post('/platform/license/create', data)
  },
  
  // 更新许可证
  update: (id, data) => {
    return http.put(`/platform/license/${id}/update`, data)
  },
  
  // 删除许可证
  delete: (id) => {
    return http.delete(`/platform/license/${id}/delete`)
  },
  
  // 续期许可证
  renew: (id, days) => {
    return http.post(`/platform/license/${id}/renew`, { days })
  },
  
  // 禁用许可证
  disable: (id) => {
    return http.post(`/platform/license/${id}/disable`)
  },
  
  // 启用许可证
  enable: (id) => {
    return http.post(`/platform/license/${id}/enable`)
  },
  
  // 验证许可证（公共接口）
  verify: (key) => {
    return http.post('/platform/license/verify', { key })
  },
  
  // 获取许可证状态（用户端使用）
  getStatus: () => {
    return http.get('/platform/license/status')
  }
}