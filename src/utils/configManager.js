// 配置文件管理模块（不再使用API密钥）
import axios from 'axios'

// API配置文件路径
const CONFIG_FILE_PATH = '/src/config/http.js'

// 默认配置文件内容模板
const DEFAULT_CONFIG_TEMPLATE = `// API配置文件
// 此文件由系统自动生成，请勿手动修改
const API_BASE_URL = '{{API_BASE_URL}}'

export { API_BASE_URL }
`

// 保存API配置
export const saveApiConfig = async (config) => {
  try {
    // 保存到localStorage
    localStorage.setItem('apiConfig', JSON.stringify(config))
    
    // 生成配置文件内容
    const configContent = DEFAULT_CONFIG_TEMPLATE
      .replace('{{API_BASE_URL}}', config.baseUrl)
    
    // 在浏览器环境中，我们需要动态更新http.js中的配置
    // 由于无法直接写入文件系统，我们将配置保存到localStorage
    // 并在request.js中动态读取这些配置
    
    return { success: true }
  } catch (error) {
    console.error('保存API配置失败:', error)
    return { success: false, error: error.message }
  }
}

// 获取API配置
export const getApiConfig = () => {
  try {
    // 从localStorage获取配置
    const configStr = localStorage.getItem('apiConfig')
    if (!configStr) {
      return {
        baseUrl: ''
      }
    }
    
    const config = JSON.parse(configStr)
    return {
      baseUrl: config.baseUrl || ''
    }
  } catch (error) {
    console.error('获取API配置失败:', error)
    return {
      baseUrl: ''
    }
  }
}

// 测试API连接
export const testApiConnection = async (config) => {
  try {
    const response = await axios.get(`/api/health`, { timeout: 10000 })
    if (response?.data?.code === 200) {
      return { success: true, message: '连接成功' }
    }
    return { success: false, message: response?.data?.msg || response?.data?.message || '连接失败' }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || '连接失败'
    }
  }
}

// 重置配置
export const resetConfig = async () => {
  try {
    // 清除localStorage中的配置
    localStorage.removeItem('apiConfig')
    
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
