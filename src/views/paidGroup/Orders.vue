<template>
  <div class="paid-group-orders">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>入群订单</span>
          <el-button type="primary">导出订单</el-button>
        </div>
      </template>
      
      <div class="search-form">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="订单号">
            <el-input v-model="searchForm.orderNo" placeholder="请输入订单号" clearable />
          </el-form-item>
          <el-form-item label="群名称">
            <el-input v-model="searchForm.groupName" placeholder="请输入群名称" clearable />
          </el-form-item>
          <el-form-item label="支付状态">
            <el-select v-model="searchForm.paymentStatus" placeholder="请选择支付状态" clearable>
              <el-option label="待支付" value="pending" />
              <el-option label="已支付" value="paid" />
              <el-option label="已退款" value="refunded" />
              <el-option label="支付失败" value="failed" />
            </el-select>
          </el-form-item>
          <el-form-item label="支付时间">
            <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <el-table :data="orderList" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column prop="groupName" label="群名称" />
        <el-table-column prop="userName" label="用户名" />
        <el-table-column prop="userPhone" label="用户手机号" />
        <el-table-column prop="amount" label="金额" width="100">
          <template #default="scope">
            ¥{{ scope.row.amount }}
          </template>
        </el-table-column>
        <el-table-column prop="paymentMethod" label="支付方式" width="100" />
        <el-table-column prop="paymentStatus" label="支付状态" width="100">
          <template #default="scope">
            <el-tag :type="getPaymentStatusType(scope.row.paymentStatus)">
              {{ getPaymentStatusText(scope.row.paymentStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="paymentTime" label="支付时间" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click="handleView(scope.row)">查看</el-button>
            <el-button size="small" type="success" @click="handleRefund(scope.row)" v-if="scope.row.paymentStatus === 'paid'">退款</el-button>
            <el-button size="small" type="warning" @click="handleAddToGroup(scope.row)" v-if="scope.row.paymentStatus === 'paid'">加群</el-button>
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

// 搜索表单
const searchForm = ref({
  orderNo: '',
  groupName: '',
  paymentStatus: '',
  dateRange: []
})

// 订单列表数据
const orderList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 获取支付状态类型
const getPaymentStatusType = (status) => {
  const statusMap = {
    pending: 'info',
    paid: 'success',
    refunded: 'warning',
    failed: 'danger'
  }
  return statusMap[status] || 'info'
}

// 获取支付状态文本
const getPaymentStatusText = (status) => {
  const statusMap = {
    pending: '待支付',
    paid: '已支付',
    refunded: '已退款',
    failed: '支付失败'
  }
  return statusMap[status] || '未知'
}

// 获取订单列表
const getOrderList = () => {
  // 模拟数据
  orderList.value = [
    { 
      id: 1, 
      orderNo: 'ORD202301010001', 
      groupName: 'VIP交流群', 
      userName: '张三', 
      userPhone: '13800138000', 
      amount: 99.00, 
      paymentMethod: '支付宝', 
      paymentStatus: 'paid', 
      paymentTime: '2023-01-01 10:00:00'
    },
    { 
      id: 2, 
      orderNo: 'ORD202301010002', 
      groupName: '技术分享群', 
      userName: '李四', 
      userPhone: '13800138001', 
      amount: 199.00, 
      paymentMethod: '微信支付', 
      paymentStatus: 'paid', 
      paymentTime: '2023-01-01 11:00:00'
    },
    { 
      id: 3, 
      orderNo: 'ORD202301010003', 
      groupName: '资源分享群', 
      userName: '王五', 
      userPhone: '13800138002', 
      amount: 299.00, 
      paymentMethod: '银联支付', 
      paymentStatus: 'pending', 
      paymentTime: ''
    }
  ]
  total.value = 3
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  getOrderList()
}

// 重置
const handleReset = () => {
  searchForm.value = {
    orderNo: '',
    groupName: '',
    paymentStatus: '',
    dateRange: []
  }
  handleSearch()
}

// 查看订单详情
const handleView = (row) => {
  console.log('查看订单详情', row)
}

// 退款
const handleRefund = (row) => {
  console.log('退款', row)
}

// 加群
const handleAddToGroup = (row) => {
  console.log('加群', row)
}

// 分页大小改变
const handleSizeChange = (val) => {
  pageSize.value = val
  getOrderList()
}

// 当前页改变
const handleCurrentChange = (val) => {
  currentPage.value = val
  getOrderList()
}

onMounted(() => {
  getOrderList()
})
</script>

<style scoped>
.paid-group-orders {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>