import { http } from '@/utils/request'

// 短链API接口
export const shortLinkApi = {
  // 获取短链列表
  getList(params) {
    return http.get('/api/shortlink/list', { params })
  },
  
  // 获取短链详情
  getById(id) {
    return http.get(`/api/shortlink/${id}`)
  },
  
  // 创建短链
  create(data) {
    return http.post('/api/shortlink/create', data)
  },
  
  // 更新短链
  update(data) {
    return http.put('/api/shortlink/update', data)
  },
  
  // 删除短链
  delete(id) {
    return http.delete(`/api/shortlink/delete/${id}`)
  },
  
  // 访问短链
  access(data) {
    return http.post('/api/shortlink/access', data)
  },
  
  // 生成短码
  generateShortCode(data) {
    return http.post('/api/shortlink/generate', data)
  },
  
  // 获取短链统计
  getStats(id, params) {
    return http.get(`/api/shortlink/${id}/stats`, { params })
  },
  
  // 获取所有短链统计
  getAllStats(params) {
    return http.get('/api/shortlink/stats/all', { params })
  },
  
  // 分享短链
  share(id, data) {
    return http.post(`/api/shortlink/${id}/share`, data)
  }
}