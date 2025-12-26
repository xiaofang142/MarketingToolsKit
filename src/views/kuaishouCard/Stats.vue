<template>
  <div class="kuaishou-card-stats-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>快手卡片统计</span>
          <div class="header-actions">
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

      <!-- 总体统计 -->
      <div class="stats-overview">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card class="stats-card">
              <div class="stats-item">
                <div class="stats-value">{{ overallStats.totalCards || 0 }}</div>
                <div class="stats-label">总卡片数</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stats-card">
              <div class="stats-item">
                <div class="stats-value">{{ overallStats.activeCards || 0 }}</div>
                <div class="stats-label">激活卡片数</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stats-card">
              <div class="stats-item">
                <div class="stats-value">{{ formatNumber(overallStats.totalViews) }}</div>
                <div class="stats-label">总浏览量</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stats-card">
              <div class="stats-item">
                <div class="stats-value">{{ formatPercent(overallStats.activeCards, overallStats.totalCards) }}</div>
                <div class="stats-label">激活率</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 图表区域 -->
      <div class="charts-section">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-card>
              <template #header>
                <div class="card-header">
                  <span>访问趋势</span>
                </div>
              </template>
              <div ref="visitTrendChartRef" class="chart-container"></div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 热门卡片和最近活动 -->
      <div class="bottom-section">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card>
              <template #header>
                <div class="card-header">
                  <span>热门卡片</span>
                </div>
              </template>
              <el-table :data="overallStats.popularCards" style="width: 100%">
                <el-table-column prop="title" label="卡片标题" />
                <el-table-column prop="viewCount" label="浏览量">
                  <template #default="scope">
                    {{ formatNumber(scope.row.viewCount) }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                  <template #default="scope">
                    <el-button size="small" type="primary" @click="goToCardStats(scope.row.id)">
                      统计
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card>
              <template #header>
                <div class="card-header">
                  <span>最近活动</span>
                </div>
              </template>
              <el-table :data="overallStats.recentActivities" style="width: 100%">
                <el-table-column prop="cardTitle" label="卡片标题" />
                <el-table-column prop="action" label="操作">
                  <template #default="scope">
                    <el-tag :type="getActionType(scope.row.action)">
                      {{ getActionText(scope.row.action) }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="username" label="用户" />
                <el-table-column prop="createdAt" label="时间">
                  <template #default="scope">
                    {{ formatTime(scope.row.createdAt) }}
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import { getKuaishouCardOverallStats } from '@/api/kuaishouCard'

const router = useRouter()
const loading = ref(false)
const dateRange = ref([])
const groupBy = ref('day')

// 图表实例
let visitTrendChart = null

// 图表DOM引用
const visitTrendChartRef = ref(null)

// 总体统计数据
const overallStats = ref({
  totalCards: 0,
  activeCards: 0,
  totalViews: 0,
  activationRate: 0,
  popularCards: [],
  recentActivities: []
})

// 获取总体统计数据
const fetchOverallStats = async () => {
  if (!dateRange.value || dateRange.value.length !== 2) {
    ElMessage.warning('请选择日期范围')
    return
  }

  loading.value = true
  try {
    const [startDate, endDate] = dateRange.value
    const params = {
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
      group_by: groupBy.value
    }

    const response = await getKuaishouCardOverallStats(params)
    if (response.code === 200) {
      overallStats.value = {
        totalCards: response.data.totalCards || 0,
        activeCards: response.data.activeCards || 0,
        totalViews: response.data.totalViews || 0,
        activationRate: response.data.totalCards > 0 ? (response.data.activeCards / response.data.totalCards) * 100 : 0,
        popularCards: response.data.popularCards || [],
        recentActivities: response.data.recentActivities || [],
        trend_data: {
          dates: (response.data.dailyStats && Array.isArray(response.data.dailyStats)) ? response.data.dailyStats.map(item => item.date) : [],
          views: (response.data.dailyStats && Array.isArray(response.data.dailyStats)) ? response.data.dailyStats.map(item => item.views) : []
        }
      }
      
      // 更新图表
      updateCharts()
    } else {
      ElMessage.error(response.msg || '获取统计数据失败')
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
    ElMessage.error('获取统计数据失败')
  } finally {
    loading.value = false
  }
}

// 更新图表
const updateCharts = () => {
  if (!overallStats.value.trend_data) return

  // 如果没有趋势数据，创建空数据
  if (!overallStats.value.trend_data.dates || overallStats.value.trend_data.dates.length === 0) {
    // 创建默认日期和数据
    const today = new Date()
    const dates = []
    const views = []
    
    // 创建最近7天的数据
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      dates.push(formatDate(date))
      views.push(0)
    }
    
    overallStats.value.trend_data = {
      dates,
      views
    }
  }

  // 更新访问趋势图
  if (visitTrendChart) {
    const option = {
      title: {
        text: '访问趋势'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['浏览量']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: overallStats.value.trend_data.dates || []
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '浏览量',
          type: 'line',
          stack: 'Total',
          smooth: true,
          data: overallStats.value.trend_data.views || []
        }
      ]
    }
    visitTrendChart.setOption(option)
  }
}

// 初始化图表
const initCharts = () => {
  // 访问趋势图
  if (visitTrendChartRef.value) {
    visitTrendChart = echarts.init(visitTrendChartRef.value)
  }

  // 窗口大小变化时重新调整图表
  window.addEventListener('resize', () => {
    if (visitTrendChart) visitTrendChart.resize()
  })
}

// 处理日期变化
const handleDateChange = () => {
  fetchOverallStats()
}

// 处理分组方式变化
const handleGroupByChange = () => {
  fetchOverallStats()
}

// 刷新数据
const refreshData = () => {
  fetchOverallStats()
}

// 跳转到卡片统计页面
const goToCardStats = (cardId) => {
  router.push(`/kuaishou-card/stats/${cardId}`)
}

// 格式化数字
const formatNumber = (num) => {
  if (!num) return '0'
  return Number(num).toLocaleString()
}

// 格式化百分比
const formatPercent = (num, total) => {
  if (!total || total === 0) return '0%'
  return `${((num / total) * 100).toFixed(1)}%`
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 格式化时间
const formatTime = (time) => {
  if (!time) return ''
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60))
      return minutes === 0 ? '刚刚' : `${minutes}分钟前`
    }
    return `${hours}小时前`
  } else if (days === 1) {
    return '昨天'
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return formatDate(date)
  }
}

// 获取操作类型
const getActionType = (action) => {
  const actionTypeMap = {
    view: ''
  }
  return actionTypeMap[action] || ''
}

// 获取操作文本
const getActionText = (action) => {
  const actionTextMap = {
    view: '浏览'
  }
  return actionTextMap[action] || action
}

// 页面初始化
onMounted(() => {
  // 设置默认日期范围为最近7天
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(endDate.getDate() - 7)
  
  dateRange.value = [startDate, endDate]
  
  // 使用nextTick确保DOM完全渲染后再初始化图表
  nextTick(() => {
    // 初始化图表
    initCharts()
    
    // 获取数据
    fetchOverallStats()
  })
})

// 页面卸载时清理
onUnmounted(() => {
  if (visitTrendChart) {
    visitTrendChart.dispose()
    visitTrendChart = null
  }
  window.removeEventListener('resize', () => {})
})
</script>

<style scoped>
.kuaishou-card-stats-container {
  padding: 20px;
}

.box-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

/* 统计概览区域 */
.stats-overview {
  margin-bottom: 20px;
}

.stats-card {
  text-align: center;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stats-item {
  width: 100%;
}

.stats-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 5px;
}

.stats-label {
  font-size: 14px;
  color: #909399;
}

/* 图表区域 */
.charts-section {
  margin-bottom: 20px;
}

.chart-container {
  height: 300px;
  width: 100%;
}

/* 底部区域 */
.bottom-section {
  margin-top: 20px;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .header-actions {
    flex-direction: column;
    gap: 5px;
  }
  
  .chart-container {
    height: 250px;
  }
}
</style>