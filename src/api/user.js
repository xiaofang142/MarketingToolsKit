import request from '@/utils/request'

// 用户登录
export function login(data) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data
  })
}

// 刷新令牌
export function refreshToken() {
  return request({
    url: '/api/refresh-token',
    method: 'post'
  })
}

// 获取当前用户信息
export function getCurrentUser() {
  return request({
    url: '/api/user',
    method: 'get'
  })
}

// 修改密码
export function changePassword(data) {
  return request({
    url: '/api/change-password',
    method: 'post',
    data
  })
}

// 获取用户列表
export function getUsers(params) {
  return request({
    url: '/api/users',
    method: 'get',
    params
  })
}

// 获取用户详情
export function getUser(id) {
  return request({
    url: `/api/users/${id}`,
    method: 'get'
  })
}

// 创建用户
export function createUser(data) {
  return request({
    url: '/api/users',
    method: 'post',
    data
  })
}

// 更新用户
export function updateUser(id, data) {
  return request({
    url: `/api/users/${id}`,
    method: 'put',
    data
  })
}

// 删除用户
export function deleteUser(id) {
  return request({
    url: `/api/users/${id}`,
    method: 'delete'
  })
}

// 重置用户密码
export function resetUserPassword(id, data) {
  return request({
    url: `/api/users/${id}/reset-password`,
    method: 'post',
    data
  })
}