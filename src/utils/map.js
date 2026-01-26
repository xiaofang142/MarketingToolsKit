// 获取平台标签tag
export const getPlatformTag = (type) => {
  const typeMap = {
    '1': 'success',
    '2': 'danger',
    '3': 'warning',
    '4': 'info'
  }
  return typeMap[type] || '未知'
}
// 获取平台标签name
export const getPlatformName = (type) => {
  const typeMap = {
    '1': '小红书',
    '2': '视频号',
    '3': '抖音',
    '4': '快手'
  }
  return typeMap[type] || '未知'
}

// 获取平台标签map
export const getPlatformMap = () => {
  const typeMap = [
    {value: '1', label: '小红书'},
    {value: '2', label: '视频号'},
    {value: '3', label: '抖音'},
    {value: '4', label: '快手'},
  ]
  return typeMap
}


export const getStatusTag = (status) => {
  const typeMap = {
    '1': 'info',
    '5': 'warning',
    '8': 'success',
    '9': 'info',
    '10': 'danger'
  }
  return typeMap[status] || 'info'
}


export const getStatusName = (status) => {
  const typeMap = {
    '1': '待执行',
    '5': '进行中',
    '8': '已失败',
    '9': '已取消',
    '10': '已完成'
  }
  return typeMap[status] || '未知'
}


export const getClueMap = () => {
  const typeMap = [
    {value: '1', label: 'QQ'},
    {value: '2', label: '微信'},
    {value: '3', label: '电话'},
    {value: '4', label: 'Telegram'},
    {value: '5', label: 'Whatsapp'},
    {value: '6', label: 'twitter'},
  ]
  return typeMap
}
export const getClueName = (type) => {
  const typeMap = {
    '1': 'QQ',
    '2': '微信',
    '3': '电话',
    '4': 'Telegram',
    '5': 'Whatsapp',
    '6': 'twitter',
  }
  return typeMap[type] || '未知'
}