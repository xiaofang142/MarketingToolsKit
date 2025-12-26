<template>
  <div class="xianyu-card-stats-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>咸鱼卡片统计</span>
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
                <div class="stats-value">{{ overallStats.total_cards || 0 }}</div>
                <div class="stats-label">总卡片数</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stats-card">
              <div class="stats-item">
                <div class="stats-value">{{ overallStats.active_cards || 0 }}</div>
                <div class="stats-label">激活卡片数</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stats-card">
              <div class="stats-item">
                <div class="stats-value">{{ formatNumber(overallStats.total_views) }}</div>
                <div class="stats-label">总浏览量</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stats-card">
              <div class="stats-item">
                <div class="stats-value">{{ formatNumber(overallStats.total_clicks) }}</div>
                <div class="stats-label">总点击量</div>
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

      <!-- 卡片排行 -->
      <div class="ranking-container">
        <el-card>
          <div class="card-title">热门卡片排行</div>
          <el-table :data="cardRanking" style="width: 100%" v-loading="loading">
            <el-table-column prop="title" label="卡片标题" show-overflow-tooltip />
            <el-table-column prop="view_count" label="浏览量" width="100" />
            <el-table-column prop="click_count" label="点击量" width="100" />
            <el-table-column prop="click_rate" label="点击率" width="100">
              <template #default="scope">
                {{ formatPercent(scope.row.click_rate) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button size="small" type="primary" @click="viewCardDetails(scope.row)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { getXianyuCardOverallStats } from '@/api/xianyuCard'

const router = useRouter()
const loading = ref(false)

// 日期范围
const dateRange = ref([])
const groupBy = ref('day')

// 统计数据
const overallStats = reactive({
  total_cards: 0,
  active_cards: 0,
  total_views: 0,
  total_clicks: 0,
  total_shares: 0
})

const chartData = reactive({
  views: [],
  clicks: [],
  dates: []
})

const cardRanking = ref([])

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

// 获取统计数据
const fetchStats = async () => {
  loading.value = true
  try {
    const params = {
      start_date: dateRange.value?.[0] || '',
      end_date: dateRange.value?.[1] || '',
      group_by: groupBy.value
    }
    
    const res = await getXianyuCardOverallStats(params)
    if (res.code === 200 || res.code === 0) {
      const data = res.data
      
      // 更新总体统计
      Object.assign(overallStats, data.overall || {})
      
      // 更新图表数据
      chartData.dates = data.chart?.dates || []
      chartData.views = data.chart?.views || []
      chartData.clicks = data.chart?.clicks || []
      
      // 更新卡片排行
      cardRanking.value = data.ranking || []
      
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

// 查看卡片详情
const viewCardDetails = (card) => {
  router.push(`/xianyu-card-stats/${card.id}`)
}

// 日期变化处理
const handleDateChange = () => {
  fetchStats()
}

// 分组方式变化处理
const handleGroupByChange = () => {
  fetchStats()
}

// 刷新数据
const refreshData = () => {
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
.xianyu-card-stats-container {
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

.chart-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 15px;
}

.chart {
  width: 100%;
  height: 300px;
}

.card-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 15px;
}

.ranking-container {
  margin-top: 20px;
}
</style>