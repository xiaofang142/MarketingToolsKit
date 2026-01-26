import { http } from '@/utils/request'

// 账号管理相关API
export const accountApi = {
  // 获取有效账号列表
  getAccounts(params = {}) {
    return http.get('/api/accounts/list', { params })
  },
  
  // 添加账号
  addAccount(data) {
    return http.post('/api/accounts/create', data)
  },
  
  // 更新账号
  updateAccount(id,data) {
    return http.put(`/api/accounts/update/${id}`, data)
  },
  
  // 删除账号
  deleteAccount(id) {
    return http.delete(`/api/accounts/delete/${id}`)
  },
  // 启动账号
  runAccount(id) {
    return http.post(`/api/accounts/run/${id}`)
  },
  // 统计
  // getAccountsStatistics() {
  //   return http.get('/account/statistics')
  // },
}