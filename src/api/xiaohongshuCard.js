import { http } from '@/utils/request'

// 获取小红书卡片列表
export function getXiaohongshuCardList(params) {
  return http.get('/api/xiaohongshu/list', { params })
}

// 获取小红书卡片详情
export function getXiaohongshuCard(id) {
  return http.get(`/api/xiaohongshu/${id}`)
}

// 创建小红书卡片
export function createXiaohongshuCard(data) {
  return http.post('/api/xiaohongshu/create', data)
}

// 更新小红书卡片
export function updateXiaohongshuCard(data) {
  return http.put('/api/xiaohongshu/update', data)
}

// 删除小红书卡片
export function deleteXiaohongshuCard(id) {
  return http.delete(`/api/xiaohongshu/delete/${id}`)
}

// 访问小红书卡片
export function viewXiaohongshuCard(id) {
  return http.get(`/api/xiaohongshu/view/${id}`)
}

// 获取小红书卡片统计数据
export function getXiaohongshuCardStats(id, params) {
  return http.get(`/api/xiaohongshu/stats/card/${id}`, { params })
}

// 获取小红书卡片总体统计数据
export function getXiaohongshuCardOverallStats(params) {
  return http.get('/api/xiaohongshu/stats/overall', { params })
}

// 生成小红书卡片短链接
export function generateShortLink(id) {
  return http.post(`/api/xiaohongshu/${id}/generate-short-link`, {})
}