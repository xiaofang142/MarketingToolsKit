<template>
  <div class="xiaohongshu-card-stats-container">
    <!-- 卡片信息 - 小红书聊天消息样式 -->
    <div class="chat-message-container">
      <div class="chat-message">
        <div class="message-avatar">
          <el-avatar :size="50" src="">X</el-avatar>
        </div>
        <div class="message-content">
          <div class="message-header">
            <span class="author-name">小红书卡片</span>
            <span class="message-time">{{ formatDate(cardInfo.created_at) }}</span>
          </div>
          <div class="message-body">
            <div class="message-title">{{ cardInfo.title }}</div>
            <div class="message-description">{{ cardInfo.description }}</div>
            <div class="message-image" v-if="cardInfo.image_url">
              <el-image
                :src="cardInfo.image_url"
                :preview-src-list="[cardInfo.image_url]"
                fit="cover"
                style="width: 100%; height: 200px; border-radius: 8px;"
              />
            </div>
            <div class="message-tags" v-if="cardInfo.tags">
              <el-tag
                v-for="tag in cardInfo.tags.split(',')"
                :key="tag"
                size="small"
                type="info"
                style="margin-right: 5px; margin-bottom: 5px;"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>
          <div class="message-stats">
            <span class="stat-item">
              <el-icon><View /></el-icon>
              {{ formatNumber(cardStats.view_count) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-cards">
      <el-col :span="8">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon" style="background-color: #E6A23C;">
              <el-icon><View /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-value">{{ formatNumber(cardStats.view_count) }}</div>
              <div class="stats-label">总浏览量</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon" style="background-color: #E6A23C;">
              <el-icon><TrendCharts /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-value">{{ formatPercent(cardStats.engagement_rate) }}%</div>
              <div class="stats-label">互动率</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon" style="background-color: #67C23A;">
              <el-icon><User /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-value">{{ formatNumber(cardStats.unique_visitors) }}</div>
              <div class="stats-label">独立访客数</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="stats-cards">
      <el-col :span="8">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon" style="background-color: #F56C6C;">
              <el-icon><Clock /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-value">{{ formatNumber(cardStats.avg_view_time) }}s</div>
              <div class="stats-label">平均浏览时长</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 筛选条件 -->
    <el-card class="filter-card">
      <el-form :model="filterForm" inline>
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            @change="handleDateChange"
          />
        </el-form-item>
        <el-form-item label="分组方式">
          <el-select v-model="filterForm.groupBy" placeholder="请选择分组方式" @change="handleGroupByChange">
            <el-option label="按天" value="day" />
            <el-option label="按周" value="week" />
            <el-option label="按月" value="month" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="refreshData">刷新数据</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="24">
        <el-card class="chart-card">
          <div class="chart-header">
            <span>访问趋势</span>
          </div>
          <div id="viewChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近活动 -->
    <el-card class="activity-card">
      <div class="activity-header">
        <span>最近活动</span>
      </div>
      <el-table :data="recentActivities" stripe style="width: 100%" v-loading="loading">
          <el-table-column prop="date" label="日期" width="120" />
          <el-table-column prop="views" label="浏览量" width="80" />
        </el-table>
      
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { getXiaohongshuCard, getXiaohongshuCardStats } from '@/api/xiaohongshuCard'

// 路由
const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(false)
const viewChart = ref(null)

// 卡片信息
const cardInfo = reactive({
  id: null,
  title: '',
  description: '',
  author: '',
  category: '',
  image_url: '',
  redirect_url: '',
  tags: '',
  is_active: true,
  created_at: '',
  updated_at: ''
})

// 卡片统计
const cardStats = reactive({
  view_count: 0,
  engagement_rate: 0,
  unique_visitors: 0,
  avg_view_time: 0,
  view_trend: []
})

// 筛选表单
const filterForm = reactive({
  dateRange: [],
  groupBy: 'day'
})

// 最近活动
const recentActivities = ref([])

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 获取卡片信息
const fetchCardInfo = async () => {
  const cardId = route.params.id
  if (!cardId) {
    ElMessage.error('缺少卡片ID')
    return
  }
  
  try {
    const res = await getXiaohongshuCard(cardId)
    if (res.code === 200 || res.code === 0) {
      Object.assign(cardInfo, res.data)
    } else {
      ElMessage.error(res.message || '获取卡片信息失败')
    }
  } catch (error) {
    ElMessage.error('获取卡片信息失败')
    console.error(error)
  }
}

// 获取卡片统计
const fetchCardStats = async () => {
  const cardId = route.params.id
  if (!cardId) {
    ElMessage.error('缺少卡片ID')
    return
  }
  
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      page_size: pagination.pageSize
    }
    
    // 添加日期范围参数
    if (filterForm.dateRange && filterForm.dateRange.length === 2) {
      params.start_date = filterForm.dateRange[0]
      params.end_date = filterForm.dateRange[1]
    }
    
    // 添加分组参数
    params.group_by = filterForm.groupBy
    
    const res = await getXiaohongshuCardStats(cardId, params)
    if (res.code === 200 || res.code === 0) {
      // 更新统计数据
      if (res.data.card) {
        Object.assign(cardStats, res.data.card)
      }
      
      // 更新最近活动
      recentActivities.value = res.data.daily_stats || []
      pagination.total = res.data.daily_stats ? res.data.daily_stats.length : 0
      
      // 更新图表
      nextTick(() => {
        updateCharts()
      })
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

// 刷新数据
const refreshData = () => {
  fetchCardStats()
}

// 日期范围改变
const handleDateChange = () => {
  pagination.page = 1
  fetchCardStats()
}

// 分组方式改变
const handleGroupByChange = () => {
  pagination.page = 1
  fetchCardStats()
}

// 分页大小改变
const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.page = 1
  fetchCardStats()
}

// 当前页改变
const handleCurrentChange = (val) => {
  pagination.page = val
  fetchCardStats()
}

// 更新图表
const updateCharts = () => {
  // 访问趋势图
  if (viewChart.value) {
    viewChart.value.dispose()
  }
  
  const viewChartDom = document.getElementById('viewChart')
  if (viewChartDom) {
    viewChart.value = echarts.init(viewChartDom)
    const viewOption = {
      title: {
        text: '访问趋势',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: recentActivities.value.map(item => item.date)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '浏览量',
          type: 'line',
          data: recentActivities.value.map(item => item.views),
          smooth: true,
          itemStyle: {
            color: '#409EFF'
          }
        }
      ]
    }
    viewChart.value.setOption(viewOption)
  }
}

// 工具函数
const formatNumber = (num) => {
  if (!num) return 0
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const formatPercent = (num) => {
  if (!num) return 0
  return (num * 100).toFixed(2)
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString()
}

const formatTime = (time) => {
  if (!time) return ''
  return new Date(time).toLocaleString()
}

const getActionType = (type) => {
  return 'view'
}

const getActionText = (type) => {
  return '浏览'
}

// 页面加载时获取数据
onMounted(() => {
  // 设置默认日期范围为最近7天
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 7)
  
  filterForm.dateRange = [
    start.toISOString().split('T')[0],
    end.toISOString().split('T')[0]
  ]
  
  fetchCardInfo()
  fetchCardStats()
})
</script>

<style scoped>
.xiaohongshu-card-stats-container {
  padding: 20px;
}

/* 聊天消息样式 */
.chat-message-container {
  margin-bottom: 20px;
  background-color: #f5f5f5;
  border-radius: 12px;
  padding: 15px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.chat-message {
  display: flex;
  gap: 12px;
}

.message-avatar {
  flex-shrink: 0;
}

.message-content {
  flex: 1;
  background-color: white;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  position: relative;
}

.message-content::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 15px;
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-right: 8px solid white;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.author-name {
  font-weight: bold;
  color: #ff2442;
  font-size: 14px;
}

.message-time {
  font-size: 12px;
  color: #999;
}

.message-body {
  margin-bottom: 10px;
}

.message-title {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 16px;
}

.message-description {
  color: #333;
  margin-bottom: 10px;
  line-height: 1.4;
}

.message-image {
  margin-bottom: 10px;
}

.message-tags {
  margin-bottom: 10px;
}

.message-stats {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #666;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 3px;
}

.stats-cards {
  margin-bottom: 20px;
}

.stats-card {
  height: 100px;
}

.stats-content {
  display: flex;
  align-items: center;
  height: 100%;
}

.stats-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  color: white;
  font-size: 24px;
}

.stats-info {
  flex: 1;
}

.stats-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.stats-label {
  font-size: 14px;
  color: #909399;
}

.filter-card {
  margin-bottom: 20px;
}

.chart-row {
  margin-bottom: 20px;
}

.chart-card {
  height: 400px;
}

.chart-header {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #EBEEF5;
}

.chart-container {
  height: 320px;
}

.activity-card {
  margin-bottom: 20px;
}

.activity-header {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #EBEEF5;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>