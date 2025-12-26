import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref({
    id: '',
    username: '',
    email: '',
    role: ''
  })
  
  const token = ref('')
  
  const isLoggedIn = computed(() => !!token.value)
  
  const username = computed(() => userInfo.value.username)
  
  const setUserInfo = (info) => {
    userInfo.value = {
      id: info.id || '',
      username: info.username || '',
      email: info.email || '',
      role: info.role || ''
    }
  }
  
  const setToken = (newToken) => {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
  }
  
  const login = (info, userToken) => {
    setUserInfo(info)
    setToken(userToken)
  }
  
  const logout = () => {
    userInfo.value = {
      id: '',
      username: '',
      email: '',
      role: ''
    }
    token.value = ''
    localStorage.removeItem('token')
  }
  
  // 初始化时从localStorage恢复token
  const initAuth = () => {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      token.value = savedToken
    }
  }
  
  // 初始化
  initAuth()
  
  return {
    userInfo,
    token,
    isLoggedIn,
    username,
    setUserInfo,
    setToken,
    login,
    logout
  }
})