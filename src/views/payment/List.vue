<template>
  <div class="payment-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>支付列表</span>
          <el-button type="primary">新增支付</el-button>
        </div>
      </template>
      
      <el-table :data="paymentList" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="支付名称" />
        <el-table-column prop="type" label="支付类型" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
              {{ scope.row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 支付列表数据
const paymentList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 获取支付列表
const getPaymentList = () => {
  // 模拟数据
  paymentList.value = [
    { id: 1, name: '支付宝支付', type: 'alipay', status: 'active', createTime: '2023-01-01 10:00:00' },
    { id: 2, name: '微信支付', type: 'wechat', status: 'active', createTime: '2023-01-02 10:00:00' },
    { id: 3, name: '银联支付', type: 'unionpay', status: 'inactive', createTime: '2023-01-03 10:00:00' }
  ]
  total.value = 3
}

// 编辑支付
const handleEdit = (row) => {
  console.log('编辑支付', row)
}

// 删除支付
const handleDelete = (row) => {
  console.log('删除支付', row)
}

// 分页大小改变
const handleSizeChange = (val) => {
  pageSize.value = val
  getPaymentList()
}

// 当前页改变
const handleCurrentChange = (val) => {
  currentPage.value = val
  getPaymentList()
}

onMounted(() => {
  getPaymentList()
})
</script>

<style scoped>
.payment-list {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>