import { http } from '@/utils/request'

export const autoReplyApi = {
  listAccounts(platform) {
    return http.get('/api/auto-reply/accounts', { 
      params: { platform }
    })
  },
  upsertAccount(data) {
    return http.post('/api/auto-reply/accounts', data)
  },
  deleteAccount(id) {
    return http.delete(`/api/auto-reply/accounts/${id}`)
  },
  loginStart(data) {
    return http.post('/api/auto-reply/start-login', data)
  },
  loginStatus(platform, username) {
    return http.get('/api/auto-reply/login-status', { 
      params: { platform, username }
    })
  },
  saveCookies(id, cookie) {
    return http.post(`/api/auto-reply/accounts/${id}/cookies`, { cookie })
  },
  getRule(platform) {
    return http.get('/api/auto-reply/rule', { 
      params: { platform }
    })
  },
  saveRule(data) {
    return http.post('/api/auto-reply/rule', data)
  },
  listLogs(platform, { page = 1, page_size = 10 } = {}) {
    return http.get('/api/auto-reply/logs', { 
      params: { platform, page, page_size }
    })
  },
  start(data) {
    return http.post('/api/auto-reply/start', data)
  },
  stop(data) {
    return http.post('/api/auto-reply/stop', data)
  }
}
