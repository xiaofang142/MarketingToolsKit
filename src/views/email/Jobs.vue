<template>
  <div class="dashboard">
    <div class="dashboard-content">
      <div class="recent-tasks">
        <el-table :data="jobsList" style="width: 100%">
          <el-table-column prop="subject" label="主题" width="200" />
          <el-table-column prop="email_total" label="计划条数" width="120" />
          <el-table-column prop="send_total" label="已发送条数" width="120" />
          <el-table-column prop="success_total" label="成功条数" width="120" />
          <el-table-column prop="fail_total" label="失败条数" width="120" />
          <el-table-column prop="read_total" label="已读条数" width="120" />
          <el-table-column  label="未读条数" width="120" flex="1">
            <template #default="scope">
              {{ scope.row.success_total - scope.row.read_total }}
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="创建时间" width="300" flex="1" />
        </el-table>
        <div style="width: 100%;text-align: center; display: flex;">
          <el-pagination style="margin: 0 auto;" :page-size="jobsLimit" @change="handlePageChange"
            layout="prev, pager, next"  :total="jobsTotal" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { emailApi } from '@/api/email'

const jobsList = ref([])
const jobsTotal = ref(0)
const jobsPage = ref(1)
const jobsLimit = ref(10)
const loading = ref(false) // 添加加载状态

const handlePageChange = (number) => {
  // 防止重复点击同一页码
  if (jobsPage.value === number) return
  jobsPage.value = number
  fetchJobsList()
}

const fetchJobsList = async () => {
  console.log('loading.value',loading.value)
  // 防止并发请求
  if (loading.value) return
  loading.value = true
  try {
    const { data } = await emailApi.getJobsList(jobsPage.value, jobsLimit.value)
    jobsList.value = data.list
    jobsTotal.value = data.total
  } catch (error) {
    console.error('获取任务列表失败:', error) 
    ElMessage.error('获取任务列表失败')
  } finally {
    loading.value = false
  }
}
// 组件挂载时获取任务列表
onMounted(() => {
  fetchJobsList()
})

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