<template>
  <div class="dashboard">
    <div class="dashboard-content">
      <!-- 添加导入按钮区域 -->
      <div style="margin-bottom: 20px; text-align: right;">
        <el-button type="primary" @click="openImportDialog">导入线索</el-button>
      </div>
      
      <!-- 导入对话框 -->
      <el-dialog v-model="importDialogVisible" title="导入线索" width="600px">
        <el-form ref="importForm" :model="importForm" label-width="80px">
          <el-form-item label="线索类型" prop="type">
            <el-select v-model="importForm.type" placeholder="请选择线索类型" value-key="value" @change="handleTypeChange">
              <el-option v-for="item in clueTypeMap" :key="String(item.value)" :label="item.label" :value="String(item.value)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="线索内容" prop="content" >
            <el-input
              type="textarea"
              v-model="importForm.content"
              placeholder="请输入多行线索，每行一条，使用逗号分隔名称、账号、城市和地址（例如：张三,123456,北京,海淀区）"
              :rows="10"
              :disabled="false"
              :readonly="false"
              class="import-textarea"
              @input="handleTextareaInput"
            ></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="importDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitImport">导入</el-button>
        </template>
      </el-dialog>

      <div class="recent-tasks">
        <el-table :data="cluelist" style="width: 100%">
          <el-table-column prop="name" label="名称" width="300" />
          <el-table-column prop="account" label="账号" width="300" />
          <el-table-column prop="city" label="城市" width="300" />
          <el-table-column prop="address" label="地址" width="400" />
          <el-table-column label="类型" width="100" flex="1">
            <template #default="scope">
              {{ getClueType(scope.row.type) }}
            </template>
          </el-table-column>
          <el-table-column label="是否验证" width="100" flex="1">
            <template #default="scope">
              {{ scope.row.is_verify < 1 ? '否' : '是' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300" flex="1">
            <template #default="scope">
              <el-button size="small" type="primary" @click="deleteClue(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="width: 100%;text-align: center; display: flex;">
          <el-pagination style="margin: 0 auto;" :page-size="cluelimit" @change="handlePageChange"
            layout="prev, pager, next"  :total="cluetotal" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElDialog, ElForm, ElFormItem, ElSelect, ElOption, ElInput } from 'element-plus'
import { clueApi } from '@/api/clue'
import { getClueName, getClueMap } from '@/utils/map'

const cluelist = ref([])
const cluetotal = ref(0)
const cluepage = ref(1)
const cluelimit = ref(10)
const loading = ref(false)
const clueTypeMap = ref(getClueMap()) // 添加这一行


const getClueType = (type) => {
  return getClueName(type)
}
const handlePageChange = (number) => {
  // 防止重复点击同一页码
  if (cluepage.value === number) return
  cluepage.value = number
  fetchCluelist()
}

const fetchCluelist = async () => {
  console.log('loading.value',loading.value)
  // 防止并发请求
  if (loading.value) return
  loading.value = true
  try {
    const { data } = await clueApi.list(cluepage.value, cluelimit.value)
    cluelist.value = data.list
    cluetotal.value = data.total
  } catch (error) {
    console.error('获取线索列表失败:', error)
    ElMessage.error('获取线索列表失败')
  } finally {
    loading.value = false
  }
}
// 组件挂载时获取素材列表
onMounted(() => {
  fetchCluelist();
  // 确保线索类型数据已加载
  console.log('线索类型数据:', clueTypeMap.value);
})

// 删除任务
const deleteClue = async (clue) => {
  ElMessageBox.confirm(`确定要删除线索 ${clue.title} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', }).then(async () => {
    // 更新任务状态
    const res = await clueApi.delete(clue.id)
    if (res.code == 200) {
      ElMessage({ type: 'success', message: '线索已删除', })
    }
    fetchCluelist()
  })
}

// 添加导入相关变量
const importDialogVisible = ref(false)
const importForm = ref({
  type: '',
  content: ''
})

// 添加导入方法
const submitImport = async () => {
  if (!importForm.value.type) {
    ElMessage.error('请选择线索类型')
    return
  }
  if (!importForm.value.content) {
    ElMessage.error('请输入线索内容')
    return
  }

  // 解析线索内容
  const lines = importForm.value.content.split('\n')
  const clues = []
  for (const line of lines) {
    if (!line.trim()) continue
    // 如果有 '，'替换成,
    
    const parts = line.split(',')
    if (parts.length < 2) {
      ElMessage.warning(`跳过无效格式行: ${line}`)
      continue
    }
    clues.push({
      name: parts[0].trim(),
      account: parts[1].trim(),
      city: parts.length > 2 ? parts[2].trim() : '',
      address: parts.length > 3 ? parts[3].trim() : '',
      type: importForm.value.type
    })
  }

  if (clues.length === 0) {
    ElMessage.warning('没有有效的线索数据')
    return
  }

  try {
    const res = await clueApi.import(clues)
    if (res.code === 200) {
      ElMessage.success(`成功导入 ${res.data.successCount} 条线索，跳过 ${res.data.skipCount} 条重复数据`)
      importDialogVisible.value = false
      importForm.value = { type: '', content: '' }
      fetchCluelist() // 刷新列表
    }
  } catch (error) {
    console.error('线索导入失败:', error)
    ElMessage.error('线索导入失败')
  }
}

// 添加打开导入对话框方法
const openImportDialog = () => {
  importDialogVisible.value = true
}
// 添加调试方法
const handleTextareaInput = (value) => {
  importForm.content.value = value;
}

const handleTypeChange = (value) => {
  console.log('选中的类型值:', value);
  // 确保值被正确设置
  importForm.value.type = String(value);
  console.log('importForm.value',importForm.value.type)
}
// 检查初始值
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.dashboard {
  .page-header {
    margin-bottom: 20px;

    h1 {
      font-size: 24px;
      color: $text-primary;
      margin: 0;
    }
  }

  .dashboard-content {
    .stat-card {
      height: 140px;
      margin-bottom: 20px;

      .stat-card-content {
        display: flex;
        align-items: center;
        margin-bottom: 15px;

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: rgba($primary-color, 0.1);
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 15px;

          .el-icon {
            font-size: 30px;
            color: $primary-color;
          }

          &.platform-icon {
            background-color: rgba($success-color, 0.1);

            .el-icon {
              color: $success-color;
            }
          }

          &.task-icon {
            background-color: rgba($warning-color, 0.1);

            .el-icon {
              color: $warning-color;
            }
          }

          &.content-icon {
            background-color: rgba($info-color, 0.1);

            .el-icon {
              color: $info-color;
            }
          }
        }

        .stat-info {
          .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: $text-primary;
            line-height: 1.2;
          }

          .stat-label {
            font-size: 14px;
            color: $text-secondary;
          }
        }
      }

      .stat-footer {
        border-top: 1px solid $border-lighter;
        padding-top: 10px;

        .stat-detail {
          display: flex;
          justify-content: space-between;
          color: $text-secondary;
          font-size: 13px;

          .el-tag {
            margin-right: 5px;
          }
        }
      }
    }

    .quick-actions {
      margin: 20px 0 30px;

      h2 {
        font-size: 18px;
        margin-bottom: 15px;
        color: $text-primary;
      }

      .action-card {
        height: 160px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .action-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: rgba($primary-color, 0.1);
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 15px;

          .el-icon {
            font-size: 24px;
            color: $primary-color;
          }
        }

        .action-title {
          font-size: 16px;
          font-weight: bold;
          color: $text-primary;
          margin-bottom: 5px;
        }

        .action-desc {
          font-size: 13px;
          color: $text-secondary;
          text-align: center;
        }
      }
    }

    .recent-tasks {
      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;

        h2 {
          font-size: 18px;
          color: $text-primary;
          margin: 0;
        }
      }
    }
  }
}
</style>