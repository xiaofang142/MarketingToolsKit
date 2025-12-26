import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建axios实例（不再使用X-API-KEY）
const createRequestInstance = () => {
  let apiBaseUrl = 'http://localhost:8086'
  try {
    const configStr = localStorage.getItem('apiConfig')
    if (configStr) {
      const cfg = JSON.parse(configStr)
      apiBaseUrl = cfg.baseUrl || apiBaseUrl
    }
  } catch (e) {}
  return axios.create({
    baseURL: apiBaseUrl,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 添加拦截器
const addInterceptors = () => {
  // 请求拦截器
  request.interceptors.request.use(
    (config) => {
      // 添加token到请求头
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      console.error('请求错误:', error)
      return Promise.reject(error)
    }
  )

  // 响应拦截器
  request.interceptors.response.use(
    (response) => {
      const { data } = response
      
      // 检查响应数据是否存在
      if (!data) {
        ElMessage.error('响应数据为空')
        return Promise.reject(new Error('响应数据为空'))
      }
      
      // 根据后端接口规范处理响应，统一使用code=200表示成功
      if (data.code === 200) {
        return data
      } else {
        // 确保错误信息存在，优先使用message字段，其次使用msg字段
        const errorMsg = data.message || data.msg || '请求失败'
        ElMessage.error(errorMsg)
        return Promise.reject(new Error(errorMsg))
      }
    },
    (error) => {
      console.error('响应错误:', error)
      
      // 处理HTTP错误状态码
      if (error.response) {
        const { status } = error.response
        switch (status) {
          case 403:
            ElMessage.error('拒绝访问')
            break
          case 404:
            ElMessage.error('请求地址不存在')
            break
          case 500:
            ElMessage.error('服务器内部错误')
            break
          default:
            ElMessage.error('网络错误')
        }
      } else {
        ElMessage.error('网络连接失败')
      }
      
      return Promise.reject(error)
    }
  )
}

// 初始化请求实例
let request = createRequestInstance()
addInterceptors()

// 更新请求实例配置
export const updateRequestConfig = async () => {
  const { getApiConfig } = await import('./configManager')
  const apiConfig = getApiConfig()
  const apiBaseUrl = apiConfig.baseUrl || 'http://localhost:8086'
  request = axios.create({
    baseURL: apiBaseUrl,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  addInterceptors()
  console.log('请求配置已更新:', { baseURL: apiBaseUrl })
  return { baseURL: apiBaseUrl }
}

// 封装常用的请求方法
export const http = {
  get(url, params) {
    return request.get(url, { params })
  },
  
  post(url, data, config = {}) {
    return request.post(url, data, config)
  },
  
  put(url, data, config = {}) {
    return request.put(url, data, config)
  },
  
  delete(url, params) {
    return request.delete(url, { params })
  },
  
  upload(url, formData) {
    return request.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default request
