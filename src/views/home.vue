<template>
  <div class="marketing-helper-home">
    <!-- 通讯工具介绍 -->
    <section class="communication-tools">
      <div class="section-header">
        <h2>支持多种通讯渠道</h2>
        <p>覆盖全球主流社交与通讯平台，满足不同地区客户沟通需求</p>
      </div>

      <div class="tools-grid">
        <!-- Telegram -->
        <el-card class="tool-card" hoverable>
          <div class="tool-icon telegram">
            <el-icon :size="40"><Message /></el-icon>
          </div>
          <div class="tool-content">
            <h3>Telegram</h3>
            <p>通过Telegram机器人和频道功能，向订阅用户发送精准营销信息，支持多媒体内容和互动按钮。</p>
            <ul class="tool-features">
              <li>• 高速消息送达</li>
              <li>• 支持大型群组营销</li>
              <li>• 丰富的API接口</li>
            </ul>
          </div>
        </el-card>

        <!-- 微信 -->
        <el-card class="tool-card" hoverable>
          <div class="tool-icon wechat">
            <el-icon :size="40"><ChatSquare /></el-icon>
          </div>
          <div class="tool-content">
            <h3>微信</h3>
            <p>整合微信公众号、服务号和小程序，实现内容推送、用户管理和互动营销一体化。</p>
            <ul class="tool-features">
              <li>• 精准用户画像</li>
              <li>• 模板消息推送</li>
              <li>• 小程序引流</li>
            </ul>
          </div>
        </el-card>

        <!-- 邮件 -->
        <el-card class="tool-card" hoverable>
          <div class="tool-icon email">
            <el-icon :size="40"><Mail /></el-icon>
          </div>
          <div class="tool-content">
            <h3>邮件</h3>
            <p>专业邮件营销系统，支持个性化内容、批量发送和效果追踪，提升邮件打开率和转化率。</p>
            <ul class="tool-features">
              <li>• 精美模板库</li>
              <li>• 详细数据分析</li>
              <li>• 反垃圾邮件优化</li>
            </ul>
          </div>
        </el-card>

        <!-- 短信 -->
        <el-card class="tool-card" hoverable>
          <div class="tool-icon sms">
            <el-icon :size="40"><Phone /></el-icon>
          </div>
          <div class="tool-content">
            <h3>短信</h3>
            <p>全球短信发送服务，支持验证码、通知和营销短信，高到达率确保信息有效触达。</p>
            <ul class="tool-features">
              <li>• 99%+ 送达率</li>
              <li>• 即时发送</li>
              <li>• 国际覆盖广</li>
            </ul>
          </div>
        </el-card>

        <!-- WhatsApp -->
        <el-card class="tool-card" hoverable>
          <div class="tool-icon whatsapp">
            <el-icon :size="40"><Comment /></el-icon>
          </div>
          <div class="tool-content">
            <h3>WhatsApp</h3>
            <p>利用WhatsApp Business API进行客户沟通和营销，支持多媒体消息和自动回复。</p>
            <ul class="tool-features">
              <li>• 全球20亿+用户</li>
              <li>• 高打开率</li>
              <li>• 官方认证账户</li>
            </ul>
          </div>
        </el-card>
      </div>
    </section>

    <!-- 功能亮点 -->
    <section class="features-section">
      <div class="section-header">
        <h2>营销助手核心优势</h2>
        <p>一站式平台解决多渠道营销难题，提升团队工作效率</p>
      </div>

      <div class="features-list">
        <el-col :span="8" class="feature-item">
          <div class="feature-icon">
            <el-icon :size="36"><Layout /></el-icon>
          </div>
          <h3>统一管理平台</h3>
          <p>所有通讯渠道集中管理，无需切换多个平台，简化工作流程</p>
        </el-col>
        
        <el-col :span="8" class="feature-item">
          <div class="feature-icon">
            <el-icon :size="36"><BarChart /></el-icon>
          </div>
          <h3>数据分析报告</h3>
          <p>实时追踪各渠道营销效果，提供详细数据报表和优化建议</p>
        </el-col>
        
        <el-col :span="8" class="feature-item">
          <div class="feature-icon">
            <el-icon :size="36"><RefreshLeft /></el-icon>
          </div>
          <h3>自动化营销</h3>
          <p>设置触发条件，实现自动化消息发送，提升客户互动体验</p>
        </el-col>
      </div>
    </section>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.marketing-helper-home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 导航栏样式 */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.logo {
  display: flex;
  align-items: center;
}

.logo-text {
  margin-left: 10px;
  font-size: 1.2rem;
  font-weight: bold;
  color: #165DFF;
}

.action-buttons {
  display: flex;
}

/* 英雄区域样式 */
.hero-section {
  padding: 60px 0;
  background-color: #f5f7fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 40px;
}

.hero-content {
  flex: 1;
}

.hero-content h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #333;
}

.subtitle {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 30px;
  line-height: 1.6;
}

.hero-image {
  flex: 1;
  height: 400px;
}

/* 通讯工具区域 */
.communication-tools {
  padding: 80px 20px;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-header h2 {
  font-size: 2rem;
  margin-bottom: 15px;
  color: #333;
}

.section-header p {
  font-size: 1.1rem;
  color: #666;
  max-width: 700px;
  margin: 0 auto;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.tool-card {
  height: 100%;
  transition: transform 0.3s ease;
}

.tool-card:hover {
  transform: translateY(-5px);
}

.tool-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.telegram {
  background-color: #e6f4ff;
  color: #0088cc;
}

.wechat {
  background-color: #eaffea;
  color: #07c160;
}

.email {
  background-color: #fff0e6;
  color: #ff7d00;
}

.sms {
  background-color: #f0f5ff;
  color: #1890ff;
}

.whatsapp {
  background-color: #e6fffa;
  color: #00b42a;
}

.tool-content h3 {
  margin-bottom: 15px;
  font-size: 1.3rem;
}

.tool-content p {
  color: #666;
  margin-bottom: 15px;
  line-height: 1.6;
}

.tool-features {
  color: #666;
  padding-left: 20px;
}

/* 功能亮点区域 */
.features-section {
  padding: 80px 20px;
  background-color: #f5f7fa;
}

.features-list {
  display: flex;
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-item {
  text-align: center;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.feature-icon {
  width: 70px;
  height: 70px;
  margin: 0 auto 20px;
  background-color: #e8f3ff;
  color: #165DFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-item h3 {
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.feature-item p {
  color: #666;
  line-height: 1.6;
}

/* 行动召唤区域 */
.cta-section {
  padding: 80px 20px;
  text-align: center;
}

.cta-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 50px 30px;
  background-color: #165DFF;
  border-radius: 12px;
  color: #fff;
}

.cta-container h2 {
  font-size: 1.8rem;
  margin-bottom: 20px;
}

.cta-container p {
  font-size: 1.1rem;
  margin-bottom: 30px;
  opacity: 0.9;
}

.cta-button {
  background-color: #fff;
  color: #165DFF;
  padding: 12px 30px;
  font-weight: bold;
}

/* 页脚样式 */
.footer {
  background-color: #1d2129;
  color: #86909c;
  padding: 60px 20px 30px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-logo {
  display: flex;
  align-items: center;
  margin-bottom: 40px;
  color: #fff;
}

.footer-links {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
}

.link-group h4 {
  color: #fff;
  margin-bottom: 20px;
  font-size: 1rem;
}

.link-group ul {
  list-style: none;
  padding: 0;
}

.link-group li {
  margin-bottom: 10px;
}

.link-group a {
  color: #86909c;
  text-decoration: none;
  transition: color 0.3s;
}

.link-group a:hover {
  color: #fff;
}

.copyright {
  text-align: center;
  padding-top: 30px;
  border-top: 1px solid #2b2f36;
}

/* 响应式样式 */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
  
  .hero-content {
    text-align: center;
  }
  
  .hero-image {
    width: 100%;
    height: auto;
  }
  
  .tools-grid {
    grid-template-columns: 1fr;
  }
  
  .features-list {
    flex-direction: column;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 30px;
  }
}
</style>