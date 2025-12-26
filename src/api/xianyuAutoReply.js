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
    return http.get('/api/xianyu/auto-reply/login/status', { username })
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
    return http.get('/api/xianyu/auto-reply/logs', { page, page_size })
  },
  start() {
    return http.post('/api/xianyu/auto-reply/start', {})
  },
  stop() {
    return http.post('/api/xianyu/auto-reply/stop', {})
  }
}