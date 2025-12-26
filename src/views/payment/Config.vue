<template>
  <div class="payment-config">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>支付配置</span>
          <el-button type="primary" @click="handleSave">保存配置</el-button>
        </div>
      </template>
      
      <el-form :model="paymentConfig" label-width="120px">
        <el-form-item label="默认支付方式">
          <el-select v-model="paymentConfig.defaultMethod" placeholder="请选择默认支付方式">
            <el-option label="支付宝" value="alipay" />
            <el-option label="微信支付" value="wechat" />
            <el-option label="银联支付" value="unionpay" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="支付超时时间">
          <el-input-number v-model="paymentConfig.timeout" :min="1" :max="60" />
          <span style="margin-left: 10px;">分钟</span>
        </el-form-item>
        
        <el-form-item label="自动确认收货">
          <el-switch v-model="paymentConfig.autoConfirm" />
          <span style="margin-left: 10px;">天后自动确认</span>
          <el-input-number v-model="paymentConfig.autoConfirmDays" :min="1" :max="30" style="margin-left: 10px;" />
        </el-form-item>
        
        <el-form-item label="退款审核">
          <el-switch v-model="paymentConfig.refundAudit" />
        </el-form-item>
        
        <el-divider>支付宝配置</el-divider>
        
        <el-form-item label="支付宝AppID">
          <el-input v-model="paymentConfig.alipay.appId" placeholder="请输入支付宝AppID" />
        </el-form-item>
        
        <el-form-item label="支付宝私钥">
          <el-input type="textarea" v-model="paymentConfig.alipay.privateKey" placeholder="请输入支付宝私钥" />
        </el-form-item>
        
        <el-form-item label="支付宝公钥">
          <el-input type="textarea" v-model="paymentConfig.alipay.publicKey" placeholder="请输入支付宝公钥" />
        </el-form-item>
        
        <el-divider>微信支付配置</el-divider>
        
        <el-form-item label="微信AppID">
          <el-input v-model="paymentConfig.wechat.appId" placeholder="请输入微信AppID" />
        </el-form-item>
        
        <el-form-item label="微信商户号">
          <el-input v-model="paymentConfig.wechat.mchId" placeholder="请输入微信商户号" />
        </el-form-item>
        
        <el-form-item label="微信API密钥">
          <el-input v-model="paymentConfig.wechat.apiKey" placeholder="请输入微信API密钥" />
        </el-form-item>
        
        <el-divider>银联支付配置</el-divider>
        
        <el-form-item label="银联商户号">
          <el-input v-model="paymentConfig.unionpay.merId" placeholder="请输入银联商户号" />
        </el-form-item>
        
        <el-form-item label="银联证书路径">
          <el-input v-model="paymentConfig.unionpay.certPath" placeholder="请输入银联证书路径" />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 支付配置数据
const paymentConfig = ref({
  defaultMethod: 'alipay',
  timeout: 30,
  autoConfirm: true,
  autoConfirmDays: 7,
  refundAudit: false,
  alipay: {
    appId: '',
    privateKey: '',
    publicKey: ''
  },
  wechat: {
    appId: '',
    mchId: '',
    apiKey: ''
  },
  unionpay: {
    merId: '',
    certPath: ''
  }
})

// 获取支付配置
const getPaymentConfig = () => {
  // 模拟从后端获取配置
  console.log('获取支付配置')
}

// 保存配置
const handleSave = () => {
  console.log('保存配置', paymentConfig.value)
  ElMessage.success('配置保存成功')
}

onMounted(() => {
  getPaymentConfig()
})
</script>

<style scoped>
.payment-config {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-divider {
  margin: 30px 0 20px;
}
</style>