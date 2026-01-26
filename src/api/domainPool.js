import { http } from '@/utils/request'

// 域名池API
export const domainPoolApi = {
  // 获取域名池列表
  getList(params) {
    return http.get('/api/domainpool/list', { params })
  },
  
  // 根据ID获取域名池详情
  getById(id) {
    return http.get(`/api/domainpool/${id}`)
  },
  
  // 创建域名池
  create(data) {
    return http.post('/api/domainpool/create', data)
  },
  
  // 更新域名池
  update(data) {
    return http.put('/api/domainpool/update', data)
  },
  
  // 删除域名池
  delete(id) {
    return http.delete(`/api/domainpool/delete/${id}`)
  },
  
  // 检查单个域名
  checkDomain(id) {
    return http.post(`/api/domainpool/check/${id}`)
  },
  
  // 检查所有域名
  checkAllDomains() {
    return http.post('/api/domainpool/checkall')
  }
}