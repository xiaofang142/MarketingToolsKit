import { http } from '@/utils/request'

export const PlatformVersionApi = {
  // 获取版本列表
  getList: (params) => {
    return http.get('/platform/version/list', { params })
  },
  
  // 获取版本详情
  getById: (id) => {
    return http.get(`/platform/version/${id}`)
  },
  
  // 创建版本
  create: (data) => {
    return http.post('/platform/version/create', data)
  },
  
  // 更新版本
  update: (id, data) => {
    return http.put(`/platform/version/${id}/update`, data)
  },
  
  // 删除版本
  delete: (id) => {
    return http.delete(`/platform/version/${id}/delete`)
  },
  
  // 发布版本
  publish: (id) => {
    return http.post(`/platform/version/${id}/publish`)
  },
  
  // 归档版本
  archive: (id) => {
    return http.post(`/platform/version/${id}/archive`)
  },
  
  // 获取最新版本（用户端使用）
  getLatest: () => {
    return http.get('/platform/version/latest')
  },
  
  // 检查更新（用户端使用）
  checkUpdate: (params) => {
    return http.get('/platform/version/check-update', { params })
  }
}