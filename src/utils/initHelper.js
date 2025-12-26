// 初始化辅助工具函数
import { saveApiConfig, testApiConnection as testConnection, getApiConfig as getConfig } from './configManager'
import { http } from '@/utils/request'

// 本地存储键名
export const INIT_STATUS_KEY = 'system_initialized'

// 测试API连接
export const testApiConnection = async (config) => {
  return await testConnection(config)
}

// 保存API配置到文件
export const saveApiConfigToFile = async (config) => {
  try {
    await saveApiConfig(config)
    return { success: true }
  } catch (error) {
    throw new Error(error.response?.data?.message || '保存配置失败')
  }
}

// 标记初始化完成
export const markInitializationComplete = async () => {
  localStorage.setItem(INIT_STATUS_KEY, 'true')
}

// 创建默认管理员账户
export const createDefaultAdmin = async () => {
  try {
    // 导入请求工具
    const { http } = await import('@/utils/request')
    
    console.log('正在创建默认管理员账户...')
    
    // 调用创建默认管理员的公开API端点
    const response = await http.post('/api/auth/init-admin')
    console.log('默认管理员账户创建成功:', response)
    return response
  } catch (error) {
    console.error('创建默认管理员账户失败:', error)
    
    // 如果是"管理员已存在"的错误，不算作失败
    if (error.response?.data?.msg === '管理员已存在') {
      console.log('管理员账户已存在，跳过创建')
      return { success: true, message: '管理员已存在' }
    }
    // 404 请求地址不存在
    if (error.response?.status === 404) {
      throw new Error('创建默认管理员账户失败: 请求地址不存在')
    }
    // 网络连接失败
    if (!error.response) {
      throw new Error('创建默认管理员账户失败: 网络连接失败')
    }
    throw new Error('创建默认管理员账户失败: ' + (error.response?.data?.message || error.message))
  }
}

// 检查是否已初始化
export const isInitialized = () => {
  return localStorage.getItem(INIT_STATUS_KEY) === 'true'
}

// 重置初始化状态
export const resetInitialization = () => {
  localStorage.removeItem(INIT_STATUS_KEY)
}

// 服务器端数据重置
export const resetServerData = async () => {
  const res = await http.post('/api/system/reset')
  return res
}

// 获取API配置
export const getApiConfig = () => {
  try {
    return getConfig()
  } catch (error) {
    throw new Error(error.response?.data?.message || '获取配置失败')
  }
}
