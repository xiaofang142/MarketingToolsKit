import { http } from '@/utils/request'

export const xianyuAutoReplyApi = {
  listAccounts() {
    return http.get('/api/xianyu/auto-reply/accounts')
  },
  upsertAccount(data) {
    return http.post('/api/xianyu/auto-reply/accounts', data)
  },
  deleteAccount(id) {
    return http.delete(`/api/xianyu/auto-reply/accounts/${id}`)
  },
  loginStart(data) {
    return http.post('/api/xianyu/auto-reply/login/start', data)
  },
  loginStatus(username) {
    return http.get('/api/xianyu/auto-reply/login/status', { 
      params: { username }
    })
  },
  saveCookies(id, cookie) {
    return http.post(`/api/xianyu/auto-reply/accounts/${id}/cookies`, { cookie })
  },
  getRule() {
    return http.get('/api/xianyu/auto-reply/rules')
  },
  saveRule(data) {
    return http.post('/api/xianyu/auto-reply/rules', data)
  },
  listLogs({ page = 1, page_size = 10 } = {}) {
    return http.get('/api/xianyu/auto-reply/logs', { 
      params: { page, page_size }
    })
  },
  start(data) {
    return http.post('/api/xianyu-auto-reply/start', data)
  },
  stop(data) {
    return http.post('/api/xianyu-auto-reply/stop', data)
  }
}