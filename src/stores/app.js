import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 是否是第一次进入账号管理页面
  const isFirstTimeAccountManagement = ref(true)
  
  // 是否是第一次进入素材管理页面
  const isFirstTimeMaterialManagement = ref(true)

  // 账号管理页面刷新状态
  const isAccountRefreshing = ref(false)

  // 素材列表数据
  const materials = ref([])
  // 话题库列表数据
  const topics = ref([])
  // 分类列表数据
  const categorys = ref([])
  // 设置账号管理页面已访问
  const setAccountManagementVisited = () => {
    isFirstTimeAccountManagement.value = false
  }
  
  // 设置素材管理页面已访问
  const setMaterialManagementVisited = () => {
    isFirstTimeMaterialManagement.value = false
  }
  
  // 重置所有访问状态（用于重新登录或刷新应用时）
  const resetVisitStatus = () => {
    isFirstTimeAccountManagement.value = true
    isFirstTimeMaterialManagement.value = true
  }

  // 更新素材列表
  const setMaterials = (materialList) => {
    materials.value = materialList
  }

  // 添加新素材
  const addMaterial = (material) => {
    materials.value.push(material)
  }

  // 删除素材
  const removeMaterial = (materialId) => {
    const index = materials.value.findIndex(m => m.id === materialId)
    if (index > -1) {
      materials.value.splice(index, 1)
    }
  }

  // 更新分类列表
  const setCategorys = (categoryList) => {
    categorys.value = categoryList
  }

  // 添加新分类
  const addCategory = (category) => {
    categorys.value.push(category)
  }

  // 删除分类
  const removeCategory = (categoryId) => {
    const index = categorys.value.findIndex(m => m.id === categoryId)
    if (index > -1) {
      categorys.value.splice(index, 1)
    }
  }
  

  // 更新素材列表
  const setTopics = (topicList) => {
    topics.value = topicList
  }

  // 添加新素材
  const addTopic = (topic) => {
    topics.value.push(topic)
  }

  // 删除素材
  const removeTopic = (topicId) => {
    const index = topics.value.findIndex(m => m.id === topicId)
    if (index > -1) {
      topics.value.splice(index, 1)
    }
  }
  
  // 设置账号管理页面刷新状态
  const setAccountRefreshing = (status) => {
    isAccountRefreshing.value = status
  }

  return {
    isFirstTimeAccountManagement,
    isFirstTimeMaterialManagement,
    isAccountRefreshing,
    materials,
    categorys,
    topics,
    setAccountManagementVisited,
    setMaterialManagementVisited,
    resetVisitStatus,
    setMaterials,
    addMaterial,
    removeMaterial,
    setAccountRefreshing,
    setCategorys,
    addCategory,
    removeCategory,
    setTopics,
    addTopic,
    removeTopic
  }
})