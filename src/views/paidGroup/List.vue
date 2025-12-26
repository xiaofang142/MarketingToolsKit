<template>
  <div class="paid-group-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>付费群列表</span>
          <el-button type="primary">创建付费群</el-button>
        </div>
      </template>
      
      <div class="search-form">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="群名称">
            <el-input v-model="searchForm.name" placeholder="请输入群名称" clearable />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
              <el-option label="启用" value="active" />
              <el-option label="禁用" value="inactive" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <el-table :data="groupList" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="群名称" />
        <el-table-column prop="price" label="入群费用" width="120">
          <template #default="scope">
            ¥{{ scope.row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="memberCount" label="成员数" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
              {{ scope.row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="250">
          <template #default="scope">
            <el-button size="small" @click="handleView(scope.row)">查看</el-button>
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="warning" @click="handleOrders(scope.row)">订单</el-button>
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

// 搜索表单
const searchForm = ref({
  name: '',
  status: ''
})

// 付费群列表数据
const groupList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 获取付费群列表
const getGroupList = () => {
  // 模拟数据
  groupList.value = [
    { 
      id: 1, 
      name: 'VIP交流群', 
      price: 99.00, 
      memberCount: 120, 
      status: 'active', 
      createTime: '2023-01-01 10:00:00'
    },
    { 
      id: 2, 
      name: '技术分享群', 
      price: 199.00, 
      memberCount: 80, 
      status: 'active', 
      createTime: '2023-01-02 10:00:00'
    },
    { 
      id: 3, 
      name: '资源分享群', 
      price: 299.00, 
      memberCount: 50, 
      status: 'inactive', 
      createTime: '2023-01-03 10:00:00'
    }
  ]
  total.value = 3
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  getGroupList()
}

// 重置
const handleReset = () => {
  searchForm.value = {
    name: '',
    status: ''
  }
  handleSearch()
}

// 查看群详情
const handleView = (row) => {
  console.log('查看群详情', row)
}

// 编辑群
const handleEdit = (row) => {
  console.log('编辑群', row)
}

// 查看订单
const handleOrders = (row) => {
  console.log('查看订单', row)
}

// 删除群
const handleDelete = (row) => {
  console.log('删除群', row)
}

// 分页大小改变
const handleSizeChange = (val) => {
  pageSize.value = val
  getGroupList()
}

// 当前页改变
const handleCurrentChange = (val) => {
  currentPage.value = val
  getGroupList()
}

onMounted(() => {
  getGroupList()
})
</script>

<style scoped>
.paid-group-list {
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