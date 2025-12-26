<template>
  <div class="xianyu-card-detail-stats">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>咸鱼卡片详情统计</span>
          <div class="header-actions">
            <el-button @click="goBack" icon="ArrowLeft">返回</el-button>
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="handleDateChange"
            />
            <el-select v-model="groupBy" placeholder="分组方式" @change="handleGroupByChange">
              <el-option label="按天" value="day" />
              <el-option label="按周" value="week" />
              <el-option label="按月" value="month" />
            </el-select>
            <el-button type="primary" @click="refreshData">刷新</el-button>
          </div>
        </div>
      </template>

      <!-- 卡片基本信息 -->
      <div class="card-info" v-if="cardInfo">
        <el-descriptions :column="3" border>
          <el-descriptions-item label="卡片标题">{{ cardInfo.title }}</el-descriptions-item>
          <el-descriptions-item label="描述">{{ cardInfo.description }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="cardInfo.is_active ? 'success' : 'danger'">
              {{ cardInfo.is_active ? '激活' : '禁用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ cardInfo.created_at }}</el-descriptions-item>
          <el-descriptions-item label="总浏览量">{{ cardInfo.view_count || 0 }}</el-descriptions-item>
          <el-descriptions-item label="总点击量">{{ cardInfo.click_count || 0 }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 统计概览 -->
      <div class="stats-overview">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card class="stats-card">
              <div class="stats-item">
                <div class="stats-value">{{ formatNumber(statsData.total_views) }}</div>
                <div class="stats-label">浏览量</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stats-card">
              <div class="stats-item">
                <div class="stats-value">{{ formatNumber(statsData.total_clicks) }}</div>
                <div class="stats-label">点击量</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stats-card">
              <div class="stats-item">
                <div class="stats-value">{{ formatNumber(statsData.total_shares) }}</div>
                <div class="stats-label">分享量</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stats-card">
              <div class="stats-item">
                <div class="stats-value">{{ formatPercent(statsData.click_rate) }}</div>
                <div class="stats-label">点击率</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 图表统计 -->
      <div class="charts-container">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card>
              <div class="chart-title">浏览量趋势</div>
              <div ref="viewsChart" class="chart"></div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card>
              <div class="chart-title">点击量趋势</div>
              <div ref="clicksChart" class="chart"></div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 详细数据表格 -->
      <div class="detail-table">
        <el-card>
          <div class="table-title">详细访问记录</div>
          <el-table :data="detailData" style="width: 100%" v-loading="loading">
            <el-table-column prop="date" label="日期" width="120" />
            <el-table-column prop="views" label="浏览量" width="100" />
            <el-table-column prop="clicks" label="点击量" width="100" />
            <el-table-column prop="shares" label="分享量" width="100" />
            <el-table-column prop="click_rate" label="点击率" width="100">
              <template #default="scope">
                {{ formatPercent(scope.row.click_rate) }}
              </template>
            </el-table-column>
            <el-table-column prop="unique_visitors" label="独立访客" width="100" />
          </el-table>
          
          <!-- 分页 -->
          <div class="pagination-container">
            <el-pagination
              v-model:current-page="pagination.page"
              v-model:page-size="pagination.page_size"
              :page-sizes="[10, 20, 50, 100]"
              :total="pagination.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import * as echarts from 'echarts'
import { getXianyuCard, getXianyuCardStats } from '@/api/xianyuCard'

const router = useRouter()
const route = useRoute()
const loading = ref(false)

// 卡片ID
const cardId = ref(route.params.id)

// 日期范围
const dateRange = ref([])
const groupBy = ref('day')

// 卡片信息
const cardInfo = ref(null)

// 统计数据
const statsData = reactive({
  total_views: 0,
  total_clicks: 0,
  total_shares: 0,
  click_rate: 0
})

const chartData = reactive({
  views: [],
  clicks: [],
  dates: []
})

const detailData = ref([])

// 分页数据
const pagination = reactive({
  page: 1,
  page_size: 10,
  total: 0
})

// 图表实例
let viewsChartInstance = null
let clicksChartInstance = null

const viewsChart = ref(null)
const clicksChart = ref(null)

// 格式化数字
const formatNumber = (num) => {
  if (!num) return '0'
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}

// 格式化百分比
const formatPercent = (rate) => {
  if (!rate) return '0%'
  return (rate * 100).toFixed(2) + '%'
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 初始化图表
const initCharts = () => {
  // 浏览量图表
  viewsChartInstance = echarts.init(viewsChart.value)
  const viewsOption = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: chartData.dates
    },
    yAxis: {
      type: 'value',
      name: '浏览量'
    },
    series: [{
      data: chartData.views,
      type: 'line',
      smooth: true,
      areaStyle: {
        opacity: 0.3
      },
      itemStyle: {
        color: '#FF6B35'
      }
    }]
  }
  viewsChartInstance.setOption(viewsOption)

  // 点击量图表
  clicksChartInstance = echarts.init(clicksChart.value)
  const clicksOption = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: chartData.dates
    },
    yAxis: {
      type: 'value',
      name: '点击量'
    },
    series: [{
      data: chartData.clicks,
      type: 'line',
      smooth: true,
      areaStyle: {
        opacity: 0.3
      },
      itemStyle: {
        color: '#1890ff'
      }
    }]
  }
  clicksChartInstance.setOption(clicksOption)
}

// 获取卡片信息
const fetchCardInfo = async () => {
  try {
    const res = await getXianyuCard(cardId.value)
    if (res.code === 200 || res.code === 0) {
      cardInfo.value = res.data
    } else {
      ElMessage.error(res.message || '获取卡片信息失败')
    }
  } catch (error) {
    ElMessage.error('获取卡片信息失败')
    console.error(error)
  }
}

// 获取统计数据
const fetchStats = async () => {
  loading.value = true
  try {
    const params = {
      start_date: dateRange.value?.[0] || '',
      end_date: dateRange.value?.[1] || '',
      group_by: groupBy.value,
      page: pagination.page,
      page_size: pagination.page_size
    }
    
    const res = await getXianyuCardStats(cardId.value, params)
    if (res.code === 200 || res.code === 0) {
      const data = res.data
      
      // 更新统计数据
      Object.assign(statsData, data.stats || {})
      
      // 更新图表数据
      chartData.dates = data.chart?.dates || []
      chartData.views = data.chart?.views || []
      chartData.clicks = data.chart?.clicks || []
      
      // 更新详细数据
      detailData.value = data.details?.list || []
      pagination.total = data.details?.total || 0
      
      // 重新渲染图表
      if (viewsChartInstance && clicksChartInstance) {
        initCharts()
      }
    } else {
      ElMessage.error(res.message || '获取统计数据失败')
    }
  } catch (error) {
    ElMessage.error('获取统计数据失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 日期变化处理
const handleDateChange = () => {
  pagination.page = 1
  fetchStats()
}

// 分组方式变化处理
const handleGroupByChange = () => {
  pagination.page = 1
  fetchStats()
}

// 刷新数据
const refreshData = () => {
  fetchStats()
}

// 分页大小变化
const handleSizeChange = (size) => {
  pagination.page_size = size
  fetchStats()
}

// 当前页变化
const handleCurrentChange = (page) => {
  pagination.page = page
  fetchStats()
}

// 响应式处理
const handleResize = () => {
  if (viewsChartInstance) {
    viewsChartInstance.resize()
  }
  if (clicksChartInstance) {
    clicksChartInstance.resize()
  }
}

onMounted(() => {
  // 设置默认日期范围（最近30天）
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 30)
  dateRange.value = [startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]]
  
  fetchCardInfo()
  fetchStats()
  
  // 初始化图表
  setTimeout(() => {
    initCharts()
  }, 100)
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // 清理图表实例
  if (viewsChartInstance) {
    viewsChartInstance.dispose()
  }
  if (clicksChartInstance) {
    clicksChartInstance.dispose()
  }
  
  // 移除事件监听
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.xianyu-card-detail-stats {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.card-info {
  margin-bottom: 20px;
}

.stats-overview {
  margin-bottom: 20px;
}

.stats-card {
  text-align: center;
}

.stats-item {
  padding: 20px;
}

.stats-value {
  font-size: 32px;
  font-weight: bold;
  color: #FF6B35;
  margin-bottom: 10px;
}

.stats-label {
  font-size: 14px;
  color: #666;
}

.charts-container {
  margin-bottom: 20px;
}

.chart-title,
.table-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 15px;
}

.chart {
  width: 100%;
  height: 300px;
}

.detail-table {
  margin-top: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>