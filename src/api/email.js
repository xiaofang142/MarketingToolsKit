import { http } from '@/utils/request'

// Email相关API
export const emailApi = {
  // 获取有效账号列表
  getEmailSmtpList() {
    return http.get('/api/email/smtp')
  },
  
  // 添加账号
  addEmailSmtp(data) {
    return http.post('/api/email/smtp', data)
  },
  
  // 更新账号
  updateEmailSmtp(id,data) {
    return http.put(`/api/email/smtp/${id}`, data)
  },
  
  // 删除账号
  deleteEmailSmtp(id) {
    return http.delete(`/api/email/smtp/${id}`)
  },
  
  // 新增：草稿箱相关API
  // 获取草稿列表
  getDrafts() {
    return http.get('/api/email/drafts')
  },
  
  // 获取单个草稿详情
  getDraftDetail(id) {
    return http.get(`/api/email/drafts/${id}`)
  },
  
  // 创建草稿
  createDraft(data) {
    return http.post('/api/email/drafts', data)
  },
  
  // 更新草稿
  updateDraft(id, data) {
    return http.put(`/api/email/drafts/${id}`, data)
  },
  
  // 删除草稿
  deleteDraft(id) {
    return http.delete(`/api/email/drafts/${id}`)
  },
  
  // 上传图片（用于富文本编辑器）
  uploadImage(formData) {
    return http.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  
  // 发送邮件
  sendEmail(data) {
    return http.post('/api/email/list', data)
  },
  getEmailList: (page,limit) => {
    return http.get(`/api/email/list?page=${page}&limit=${limit}`)
  },
  
  // 删除已发送邮件
  // deleteSentEmail: (id) => http.delete(`/api/email/sent/${id}`),

  // 获取任务列表
  getJobsList(page,limit) {
    return http.get(`/api/email/jobs?page=${page}&limit=${limit}`)
  },
  // 删除任务
  deleteJob(id) {
    return http.delete(`/api/email/jobs/${id}`)
  },
  // 获取任务详情
  getJobDetail(id) {
    return http.get(`/api/email/jobs/${id}`)
  },
  // 删除任务详情
  // deleteJobDetail(id) {
  //   return http.delete(`/api/email/jobs/detail?id=${id}`)
  // },

  

 

}