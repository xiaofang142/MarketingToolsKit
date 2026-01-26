import { http } from '@/utils/request'

export default {
  // 账号管理
  listAccounts(params = {}) { return http.get('/api/whatsapp/accounts', { params }) },
  createAccount(data) { return http.post('/api/whatsapp/accounts', data) },
  startLogin(id) { return http.post(`/api/whatsapp/accounts/${id}/login/start`) },
  loginStatus(id) { return http.get(`/api/whatsapp/accounts/${id}/login/status`) },

  // 草稿箱
  listDrafts(params = {}) { return http.get('/api/whatsapp/drafts', { params }) },
  createDraft(data) { return http.post('/api/whatsapp/drafts', data) },

  // 群发任务
  createJob(data) { return http.post('/api/whatsapp/jobs', data) },
}

