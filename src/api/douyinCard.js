import { http } from '@/utils/request'

// 获取抖音卡片列表
export function getDouyinCardList(params) {
  return http.get('/api/douyin/list', params)
}

// 获取单个抖音卡片
export function getDouyinCard(id) {
  return http.get(`/api/douyin/${id}`)
}

// 创建抖音卡片
export function createDouyinCard(data) {
  return http.post('/api/douyin/create', data)
}

// 更新抖音卡片
export function updateDouyinCard(data) {
  return http.put('/api/douyin/update', data)
}

// 删除抖音卡片
export function deleteDouyinCard(id) {
  return http.delete(`/api/douyin/delete/${id}`)
}

// 访问抖音卡片
export function viewDouyinCard(id) {
  return http.get(`/api/douyin/view/${id}`)
}

// 获取抖音卡片统计数据
export function getDouyinCardStats(id, params) {
  return http.get(`/api/douyin/stats/card/${id}`, params)
}

// 获取抖音卡片总体统计数据
export function getDouyinCardOverallStats(params) {
  return http.get('/api/douyin/stats/overall', params)
}

// 生成抖音卡片短链接
export function generateShortLink(id) {
  return http.post(`/api/douyin/${id}/generate-short-link`)
}