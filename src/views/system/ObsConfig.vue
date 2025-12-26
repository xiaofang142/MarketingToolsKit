<template>
  <div class="obs-config">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>云存储配置</span>
          <el-button type="primary" @click="handleCreate">新增配置</el-button>
        </div>
      </template>

      <el-table :data="configList" v-loading="loading" border>
        <el-table-column prop="name" label="配置名称" width="150" />
        <el-table-column prop="provider" label="服务商" width="120">
          <template #default="{ row }">
            <el-tag :type="getProviderType(row.provider)">
              {{ getProviderLabel(row.provider) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="bucket" label="存储桶" width="150" />
        <el-table-column prop="endpoint" label="节点域名" min-width="200" />
        <el-table-column prop="isDefault" label="默认" width="80">
          <template #default="{ row }">
            <el-tag v-if="row.isDefault" type="success">是</el-tag>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleTest(row)">测试</el-button>
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button 
              type="success" 
              link 
              @click="handleSetDefault(row)"
              v-if="!row.isDefault"
            >
              设为默认
            </el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 配置表单对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="配置名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入配置名称" />
        </el-form-item>

        <el-form-item label="服务商" prop="provider">
          <el-select v-model="formData.provider" placeholder="请选择服务商" @change="handleProviderChange">
            <el-option label="七牛云" value="qiniu" />
            <el-option label="阿里云OSS" value="aliyun" />
            <el-option label="腾讯云COS" value="tencent" />
            <el-option label="AWS S3" value="aws" />
            <el-option label="本地存储" value="local" />
          </el-select>
        </el-form-item>

        <el-form-item label="存储桶名称" prop="bucket">
          <el-input v-model="formData.bucket" placeholder="请输入存储桶名称" />
        </el-form-item>

        <el-form-item label="Access Key" prop="accessKey">
          <el-input v-model="formData.accessKey" placeholder="请输入Access Key" />
        </el-form-item>

        <el-form-item label="Secret Key" prop="secretKey">
          <el-input v-model="formData.secretKey" type="password" placeholder="请输入Secret Key" />
        </el-form-item>

        <el-form-item label="节点域名" prop="endpoint" v-if="formData.provider !== 'local'">
          <el-input v-model="formData.endpoint" placeholder="请输入节点域名" />
          <div class="form-tip">
            七牛云：http://xxx.bkt.clouddn.com<br>
            阿里云：http://xxx.oss-cn-region.aliyuncs.com<br>
            腾讯云：http://xxx.cos.region.myqcloud.com
          </div>
        </el-form-item>

        <el-form-item label="存储区域" prop="region" v-if="formData.provider === 'aws'">
          <el-input v-model="formData.region" placeholder="请输入存储区域，如：ap-southeast-1" />
        </el-form-item>

        <el-form-item label="存储路径" prop="basePath" v-if="formData.provider === 'local'">
          <el-input v-model="formData.basePath" placeholder="请输入本地存储路径" />
        </el-form-item>

        <el-form-item label="CDN域名" prop="cdnDomain" v-if="formData.provider !== 'local'">
          <el-input v-model="formData.cdnDomain" placeholder="请输入CDN域名（可选）" />
        </el-form-item>

        <el-form-item label="状态">
          <el-radio-group v-model="formData.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="inactive">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注信息" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getObsConfigList, createObsConfig, updateObsConfig, deleteObsConfig, testObsConnection, setDefaultObsConfig } from '@/api/obs'

const loading = ref(false)
const configList = ref([])
const dialogVisible = ref(false)
const formRef = ref(null)
const currentId = ref(null)

const formData = reactive({
  name: '',
  provider: '',
  bucket: '',
  accessKey: '',
  secretKey: '',
  endpoint: '',
  region: '',
  basePath: '',
  cdnDomain: '',
  status: 'active',
  remark: ''
})

const formRules = {
  name: [{ required: true, message: '请输入配置名称', trigger: 'blur' }],
  provider: [{ required: true, message: '请选择服务商', trigger: 'change' }],
  bucket: [{ required: true, message: '请输入存储桶名称', trigger: 'blur' }],
  accessKey: [{ required: true, message: '请输入Access Key', trigger: 'blur' }],
  secretKey: [{ required: true, message: '请输入Secret Key', trigger: 'blur' }],
  endpoint: [{ required: true, message: '请输入节点域名', trigger: 'blur' }],
  region: [{ required: true, message: '请输入存储区域', trigger: 'blur' }],
  basePath: [{ required: true, message: '请输入存储路径', trigger: 'blur' }]
}

const dialogTitle = computed(() => {
  return currentId.value ? '编辑配置' : '新增配置'
})

const getProviderType = (provider) => {
  const types = {
    qiniu: 'warning',
    aliyun: 'primary',
    tencent: 'success',
    aws: 'info',
    local: 'default'
  }
  return types[provider] || 'default'
}

const getProviderLabel = (provider) => {
  const labels = {
    qiniu: '七牛云',
    aliyun: '阿里云OSS',
    tencent: '腾讯云COS',
    aws: 'AWS S3',
    local: '本地存储'
  }
  return labels[provider] || provider
}

const handleProviderChange = (provider) => {
  // 根据服务商设置默认值
  switch (provider) {
    case 'qiniu':
      formData.endpoint = 'http://xxx.bkt.clouddn.com'
      break
    case 'aliyun':
      formData.endpoint = 'https://xxx.oss-cn-hangzhou.aliyuncs.com'
      break
    case 'tencent':
      formData.endpoint = 'https://xxx.cos.ap-guangzhou.myqcloud.com'
      break
    case 'aws':
      formData.region = 'ap-southeast-1'
      break
    case 'local':
      formData.basePath = '/uploads'
      break
  }
}

const loadConfigList = async () => {
  loading.value = true
  try {
    const response = await getObsConfigList()
    configList.value = (response.data && response.data.list) || []
  } catch (error) {
    ElMessage.error('获取配置列表失败')
  } finally {
    loading.value = false
  }
}

const handleCreate = () => {
  currentId.value = null
  resetForm()
  dialogVisible.value = true
}

const handleEdit = (row) => {
  currentId.value = row.id
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleTest = async (row) => {
  try {
    await testObsConnection(row.id)
    ElMessage.success('连接测试成功')
  } catch (error) {
    ElMessage.error('连接测试失败：' + error.message)
  }
}

const handleSetDefault = async (row) => {
  try {
    await setDefaultObsConfig(row.id)
    ElMessage.success('设置默认配置成功')
    loadConfigList()
  } catch (error) {
    ElMessage.error('设置默认配置失败')
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该配置吗？', '提示', {
      type: 'warning'
    })
    
    await deleteObsConfig(row.id)
    ElMessage.success('删除成功')
    loadConfigList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return
    
    try {
      if (currentId.value) {
        await updateObsConfig(currentId.value, formData)
        ElMessage.success('更新成功')
      } else {
        await createObsConfig(formData)
        ElMessage.success('创建成功')
      }
      
      dialogVisible.value = false
      loadConfigList()
    } catch (error) {
      ElMessage.error(currentId.value ? '更新失败' : '创建失败')
    }
  })
}

const handleDialogClose = () => {
  formRef.value.resetFields()
}

const resetForm = () => {
  Object.assign(formData, {
    name: '',
    provider: '',
    bucket: '',
    accessKey: '',
    secretKey: '',
    endpoint: '',
    region: '',
    basePath: '',
    cdnDomain: '',
    status: 'active',
    remark: ''
  })
}

onMounted(() => {
  loadConfigList()
})
</script>

<style scoped>
.obs-config {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-tip {
  margin-top: 5px;
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
}
</style>
