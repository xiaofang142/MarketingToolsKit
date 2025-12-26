// 更新API配置脚本
// 在浏览器控制台中运行此脚本，以更新API配置

// 1. 清除当前的API配置
localStorage.removeItem('apiConfig');

// 2. 设置正确的API配置（仅基础地址）
const correctConfig = {
  baseUrl: 'http://localhost:8086'
};

// 3. 保存新配置
localStorage.setItem('apiConfig', JSON.stringify(correctConfig));

// 4. 刷新页面以应用新配置
console.log('API配置已更新为:', correctConfig);
console.log('请刷新页面以应用新配置');
