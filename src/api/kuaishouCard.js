import { http } from '@/utils/request'

// 获取快手卡片列表
export function getKuaishouCardList(params) {
  return http.get('/api/kuaishou/list', { params })
}

// 获取单个快手卡片
export function getKuaishouCard(id) {
  return http.get(`/api/kuaishou/${id}`)
}

// 创建快手卡片
export function createKuaishouCard(data) {
  return http.post('/api/kuaishou/create', data)
}

// 更新快手卡片
export function updateKuaishouCard(data) {
  return http.put('/api/kuaishou/update', data)
}

// 删除快手卡片
export function deleteKuaishouCard(id) {
  return http.delete(`/api/kuaishou/delete/${id}`)
}

// 访问快手卡片
export function viewKuaishouCard(id) {
  return http.get(`/api/kuaishou/view/${id}`)
}

// 点赞快手卡片
export function likeKuaishouCard(id) {
  return http.post(`/api/kuaishou/like/${id}`, {})
}

// 分享快手卡片
export function shareKuaishouCard(id) {
  return http.post(`/api/kuaishou/share/${id}`, {})
}

// 获取快手卡片统计数据
export function getKuaishouCardStats(id, params) {
  return http.get(`/api/kuaishou/stats/card/${id}`, { params })
}

// 获取快手卡片总体统计数据
export function getKuaishouCardOverallStats(params) {
  return http.get('/api/kuaishou/stats/overall', { params })
}

// 生成快手卡片短链接
export function generateShortLink(id) {
  return http.post(`/api/kuaishou/${id}/generate-short-link`, {})
}