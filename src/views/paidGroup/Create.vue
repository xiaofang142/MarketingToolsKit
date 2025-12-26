<template>
  <div class="paid-group-create">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>创建付费群</span>
        </div>
      </template>
      
      <el-form :model="groupForm" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="群名称" prop="name">
          <el-input v-model="groupForm.name" placeholder="请输入群名称" />
        </el-form-item>
        
        <el-form-item label="群描述" prop="description">
          <el-input type="textarea" v-model="groupForm.description" placeholder="请输入群描述" :rows="4" />
        </el-form-item>
        
        <el-form-item label="群封面" prop="cover">
          <el-upload
            class="cover-uploader"
            action="#"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleCoverChange"
          >
            <img v-if="groupForm.cover" :src="groupForm.cover" class="cover" />
            <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">建议尺寸：400x400像素，大小不超过2MB</div>
        </el-form-item>
        
        <el-form-item label="入群费用" prop="price">
          <el-input-number v-model="groupForm.price" :min="0.01" :precision="2" />
          <span style="margin-left: 10px;">元</span>
        </el-form-item>
        
        <el-form-item label="有效期" prop="validity">
          <el-select v-model="groupForm.validity" placeholder="请选择有效期">
            <el-option label="永久" value="permanent" />
            <el-option label="1个月" value="1month" />
            <el-option label="3个月" value="3months" />
            <el-option label="6个月" value="6months" />
            <el-option label="1年" value="1year" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="群二维码" prop="qrcode">
          <el-upload
            class="qrcode-uploader"
            action="#"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleQrcodeChange"
          >
            <img v-if="groupForm.qrcode" :src="groupForm.qrcode" class="qrcode" />
            <el-icon v-else class="qrcode-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">建议尺寸：400x400像素，大小不超过2MB</div>
        </el-form-item>
        
        <el-form-item label="群链接" prop="link">
          <el-input v-model="groupForm.link" placeholder="请输入群链接" />
        </el-form-item>
        
        <el-form-item label="群公告" prop="notice">
          <el-input type="textarea" v-model="groupForm.notice" placeholder="请输入群公告" :rows="4" />
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-switch v-model="groupForm.status" active-text="启用" inactive-text="禁用" />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">创建</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const formRef = ref()

// 表单数据
const groupForm = reactive({
  name: '',
  description: '',
  cover: '',
  price: 9.99,
  validity: 'permanent',
  qrcode: '',
  link: '',
  notice: '',
  status: true
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入群名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入群描述', trigger: 'blur' },
    { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入入群费用', trigger: 'blur' }
  ],
  validity: [
    { required: true, message: '请选择有效期', trigger: 'change' }
  ],
  link: [
    { type: 'url', message: '请输入正确的链接格式', trigger: 'blur' }
  ]
}

// 处理封面图片变化
const handleCoverChange = (file) => {
  // 这里应该上传图片到服务器，现在只是模拟
  const reader = new FileReader()
  reader.onload = (e) => {
    groupForm.cover = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

// 处理二维码变化
const handleQrcodeChange = (file) => {
  // 这里应该上传图片到服务器，现在只是模拟
  const reader = new FileReader()
  reader.onload = (e) => {
    groupForm.qrcode = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

// 提交表单
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      console.log('提交表单', groupForm)
      ElMessage.success('创建成功')
      router.push('/paidGroup/list')
    } else {
      ElMessage.error('请填写正确的信息')
      return false
    }
  })
}

// 取消创建
const handleCancel = () => {
  router.push('/paidGroup/list')
}
</script>

<style scoped>
.paid-group-create {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cover-uploader, .qrcode-uploader {
  display: inline-block;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.cover-uploader:hover, .qrcode-uploader:hover {
  border-color: var(--el-color-primary);
}

.cover-uploader-icon, .qrcode-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  line-height: 178px;
}

.cover, .qrcode {
  width: 178px;
  height: 178px;
  display: block;
}

.upload-tip {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}
</style>