<template>
  <div class="dashboard">
    <div class="dashboard-content">
      <div class="recent-tasks">
        <el-table :data="orderlist" style="width: 100%">
          <el-table-column prop="id" label="订单编号" width="500" />
          <el-table-column prop="price" label="价格" width="100" />
          <el-table-column prop="tg_id" label="tg id" width="200" />
          <el-table-column prop="create_time" label="下单时间" width="150" />
          <el-table-column label="状态" width="200" flex="1">
            <template #default="scope">
              {{ scope.row.status < 1 ? '待支付' : '已支付' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" flex="1">
            <template #default="scope">
              <el-button size="small" type="primary" @click="deleteOrder(scope.row)"
                v-if="scope.row.status == '1' || scope.row.status == '8' || scope.row.status == '9'">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="width: 100%;text-align: center; display: flex;">
          <el-pagination style="margin: 0 auto;" :page-size="orderlimit" @change="handlePageChange"
            layout="prev, pager, next" :total="ordertotal" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ordersApi } from '@/api/orders'

import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

const orderlist = ref([])
const ordertotal = ref(0)
const orderpage = ref(1)
const orderlimit = ref(10)

const handlePageChange = (number) => {
  orderpage.value = number
  fetchOrderlist()
}

const fetchOrderlist = async () => {
  const { data } = await ordersApi.list(orderpage.value, orderlimit.value)
  orderlist.value = data.list
  ordertotal.value = data.total
}
// 组件挂载时获取素材列表
onMounted(() => {
  fetchOrderlist()
})

// 删除任务
const deleteOrder = async (job) => {
  ElMessageBox.confirm(`确定要删除订单 ${job.title} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', }).then(async () => {
    // 更新任务状态
    const res = await ordersApi.delete(job.id)
    if (res.code == 200) {
      ElMessage({ type: 'success', message: '订单已删除', })
    }
    fetchOrderlist()
  })
}
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
      margin-top: 30px;

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