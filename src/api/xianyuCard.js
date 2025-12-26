import { http } from '@/utils/request'

// 获取咸鱼卡片列表
export function getXianyuCardList(params) {
  return http.get('/api/xianyu/list', params)
}

// 获取单个咸鱼卡片
export function getXianyuCard(id) {
  return http.get(`/api/xianyu/${id}`)
}

// 创建咸鱼卡片
export function createXianyuCard(data) {
  return http.post('/api/xianyu/create', data)
}

// 更新咸鱼卡片
export function updateXianyuCard(data) {
  return http.put('/api/xianyu/update', data)
}

// 删除咸鱼卡片
export function deleteXianyuCard(id) {
  return http.delete(`/api/xianyu/delete/${id}`)
}

// 访问咸鱼卡片
export function viewXianyuCard(id) {
  return http.get(`/api/xianyu/view/${id}`)
}

// 获取咸鱼卡片统计数据
export function getXianyuCardStats(id, params) {
  return http.get(`/api/xianyu/stats/card/${id}`, params)
}

// 获取咸鱼卡片总体统计数据
export function getXianyuCardOverallStats(params) {
  return http.get('/api/xianyu/stats/overall', params)
}

// 生成咸鱼卡片短链接
export function generateXianyuShortLink(id) {
  return http.post(`/api/xianyu/${id}/generate-short-link`)
}