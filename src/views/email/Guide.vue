<template>
  <div class="guide-container">
    <h1 class="guide-title">邮件代理使用指南</h1>
    <div class="guide-intro">
      <p>欢迎使用邮件代理服务！请按照以下步骤完成邮件发送流程。每个步骤都提供了详细操作指引，请仔细阅读并操作。</p>
    </div>
    <el-steps :active="activeStep" finish-status="success" class="steps-container">
      <!-- 步骤一：注册账号 -->
      <el-step title="注册账号" icon="User">
      </el-step>

      <!-- 步骤二：添加账号 -->
      <el-step title="添加代理" icon="Key">
      </el-step>

      <!-- 步骤三：新建草稿 -->
      <el-step title="新建草稿" icon="Edit">
      </el-step>

      <!-- 步骤四：发送草稿 -->
      <el-step title="发送草稿" icon="Paperclip">
      </el-step>

      <!-- 步骤五：查看明细 -->
      <el-step title="查看明细" icon="Message">
      </el-step>

      <!-- 步骤六：任务统计 -->
      <el-step title="任务统计" icon="BarChart">
      </el-step>
    </el-steps>

    <div class="nav-buttons">
      <el-button @click="prevStep" :disabled="activeStep === 0">上一步</el-button>
      <el-button type="primary" @click="nextStep" :disabled="activeStep === 5">下一步</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElSteps, ElStep, ElButton, ElImage } from 'element-plus';
import 'element-plus/dist/index.css';

// 当前激活的步骤
const activeStep = ref(0);

// 上一步
const prevStep = () => {
  if (activeStep.value > 0) {
    activeStep.value--;
  }
};

// 下一步
const nextStep = () => {
  if (activeStep.value < 5) {
    activeStep.value++;
  }
};
</script>

<style scoped>
.guide-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.guide-title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.steps-container {
  margin-bottom: 40px;
}

.step-content {
  margin-top: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.step-image {
  width: 100%;
  max-width: 600px;
  margin-top: 15px;
  border-radius: 4px;
}

.nav-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.step-list {
  padding-left: 20px;
  margin-bottom: 15px;
}

.sub-list {
  padding-left: 20px;
  margin: 5px 0 10px;
  color: #666;
}

.note-block {
  background-color: #fff8e6;
  border-left: 4px solid #ff9800;
  padding: 10px 15px;
  margin: 15px 0;
  border-radius: 4px;
}

.note-block strong {
  color: #e65100;
}

.guide-intro {
  background-color: #f0f7ff;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #e1f0ff;
}

.guide-link {
  color: #1890ff;
  text-decoration: none;
  margin: 0 3px;
}

.guide-link:hover {
  color: #096dd9;
  text-decoration: underline;
}
</style>