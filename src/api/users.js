import { http } from '@/utils/request'

export const usersApi = {
  // 获取用户列表
  list: (params) => {
    return http.get('/api/users', { params })
  },
  
  // 获取用户详情
  get: (id) => {
    return http.get(`/api/users/${id}`)
  },
  
  // 创建用户
  create: (data) => {
    return http.post('/api/users', data)
  },
  
  // 更新用户
  update: (id, data) => {
    return http.put(`/api/users/${id}`, data)
  },
  
  // 删除用户
  delete: (id) => {
    return http.delete(`/api/users/${id}`)
  },
  
  // 修改密码
  updatePassword: (id, data) => {
    return http.put(`/api/users/${id}/password`, data)
  },
  
  // 用户登录
  login: (data) => {
    return http.post('/api/auth/login', data)
  }
}