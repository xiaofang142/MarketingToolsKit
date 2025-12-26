import request from '@/utils/request'

// 获取OBS配置列表
export function getObsConfigList(params = {}) {
  return request({
    url: '/api/obs/config',
    method: 'get',
    params
  })
}

// 获取OBS配置详情
export function getObsConfig(id) {
  return request({
    url: `/api/obs/config/${id}`,
    method: 'get'
  })
}

// 创建OBS配置
export function createObsConfig(data) {
  return request({
    url: '/api/obs/config',
    method: 'post',
    data
  })
}

// 更新OBS配置
export function updateObsConfig(id, data) {
  return request({
    url: `/api/obs/config/${id}`,
    method: 'put',
    data
  })
}

// 删除OBS配置
export function deleteObsConfig(id) {
  return request({
    url: `/api/obs/config/${id}`,
    method: 'delete'
  })
}

// 测试OBS连接
export function testObsConnection(id) {
  return request({
    url: `/api/obs/config/${id}/test`,
    method: 'post'
  })
}

// 设置默认OBS配置
export function setDefaultObsConfig(id) {
  return request({
    url: `/api/obs/config/${id}/default`,
    method: 'post'
  })
}

// 获取默认OBS配置
export function getDefaultObsConfig() {
  return request({
    url: '/api/obs/config/default',
    method: 'get'
  })
}