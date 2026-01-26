import { http } from '@/utils/request'

export default {
  // 配置相关
  getConfig() {
    return http.get('/api/sms/config')
  },
  saveConfig(data) {
    return http.post('/api/sms/config', data)
  },
  
  // 短信列表
  getSmsList(params) {
    return http.get('/api/sms/list', { params })
  },
  getSmsDetail(id) {
    return http.get(`/api/sms/detail/${id}`)
  },
  resendSms(id) {
    return http.post(`/api/sms/resend/${id}`)
  },
  sendSms(data) {
    return http.post('/api/sms/send', data)
  },
  
  // 草稿相关
  getDraftList(params) {
    return http.get('/api/sms/draft/list', { params })
  },
  getDraftDetail(id) {
    return http.get(`/api/sms/draft/${id}`)
  },
  createDraft(data) {
    return http.post('/api/sms/draft', data)
  },
  updateDraft(id, data) {
    return http.put(`/api/sms/draft/${id}`, data)
  },
  deleteDraft(id) {
    return http.delete(`/api/sms/draft/${id}`)
  },
  sendDraft(id, data) {
    return http.post(`/api/sms/draft/${id}/send`, data)
  },
  
  // 任务相关
  getJobList(params) {
    return http.get('/api/sms/job/list', { params })
  },
  getJobDetail(id) {
    return http.get(`/api/sms/job/${id}`)
  },
  pauseJob(id) {
    return http.post(`/api/sms/job/${id}/pause`)
  },
  resumeJob(id) {
    return http.post(`/api/sms/job/${id}/resume`)
  },
  stopJob(id) {
    return http.post(`/api/sms/job/${id}/stop`)
  },
  createJob(data) {
    return http.post('/api/sms/job', data)
  },
  deleteJob(id) {
    return http.delete(`/api/sms/job/${id}`)
  },
  getJobRecords(id, params) {
    return http.get(`/api/sms/job/${id}/records`, { params })
  }
}