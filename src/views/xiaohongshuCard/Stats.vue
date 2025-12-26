<template>
  <div class="xiaohongshu-stats-container">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-cards">
      <el-col :span="8">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon" style="background-color: #409EFF;">
              <el-icon><Document /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-value">{{ formatNumber(overallStats.total_cards) }}</div>
              <div class="stats-label">总卡片数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon" style="background-color: #67C23A;">
              <el-icon><Check /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-value">{{ formatNumber(overallStats.active_cards) }}</div>
              <div class="stats-label">激活卡片数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon" style="background-color: #E6A23C;">
              <el-icon><View /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-value">{{ formatNumber(overallStats.total_views) }}</div>
              <div class="stats-label">总浏览量</div>
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

    <!-- 热门卡片和最近活动 -->
    <el-row :gutter="20" class="table-row">
      <el-col :span="12">
        <el-card class="table-card">
          <div class="table-header">
            <span>热门卡片</span>
          </div>
          <el-table :data="overallStats.top_cards" stripe style="width: 100%">
            <el-table-column prop="title" label="标题" min-width="150" show-overflow-tooltip />
            <el-table-column prop="author" label="作者" width="100" />
            <el-table-column prop="view_count" label="浏览量" width="80" />
            <el-table-column label="操作" width="100" fixed="right">
              <template #default="scope">
                <el-button size="small" type="primary" @click="goToCardStats(scope.row.id)">统计</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="table-card">
          <div class="table-header">
            <span>最近活动</span>
          </div>
          <el-table :data="overallStats.recent_activities.filter(item => item.action_type === 'view')" stripe style="width: 100%">
            <el-table-column prop="card_title" label="卡片标题" min-width="150" show-overflow-tooltip />
            <el-table-column prop="action_type" label="操作类型" width="100">
              <template #default="scope">
                <el-tag :type="getActionType(scope.row.action_type)">
                  {{ getActionText(scope.row.action_type) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="user_ip" label="用户IP" width="120" />
            <el-table-column prop="created_at" label="时间" width="180">
              <template #default="scope">
                {{ formatTime(scope.row.created_at) }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { getXiaohongshuCardOverallStats } from '@/api/xiaohongshuCard'

// 路由
const router = useRouter()

// 响应式数据
const loading = ref(false)
const viewChart = ref(null)

// 筛选表单
const filterForm = reactive({
  dateRange: [],
  groupBy: 'day'
})

// 统计数据
const overallStats = reactive({
  total_cards: 0,
  active_cards: 0,
  total_views: 0,
  top_cards: [],
  recent_activities: [],
  view_trend: []
})

// 获取统计数据
const fetchOverallStats = async () => {
  loading.value = true
  try {
    const params = {}
    
    // 添加日期范围参数
    if (filterForm.dateRange && filterForm.dateRange.length === 2) {
      params.start_date = filterForm.dateRange[0]
      params.end_date = filterForm.dateRange[1]
    }
    
    // 添加分组参数
    params.group_by = filterForm.groupBy
    
    const res = await getXiaohongshuCardOverallStats(params)
    if (res.code === 200) {
      // 更新统计数据
      Object.assign(overallStats, res.data)
      
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
  fetchOverallStats()
}

// 日期范围改变
const handleDateChange = () => {
  fetchOverallStats()
}

// 分组方式改变
const handleGroupByChange = () => {
  fetchOverallStats()
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
        data: overallStats.view_trend.map(item => item.date)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '浏览量',
          type: 'line',
          data: overallStats.view_trend.map(item => item.count),
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

// 跳转到单个卡片统计页面
const goToCardStats = (cardId) => {
  router.push(`/xiaohongshu-card-stats/${cardId}`)
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
  const typeMap = {
    view: ''
  }
  return typeMap[type] || ''
}

const getActionText = (type) => {
  const textMap = {
    view: '浏览'
  }
  return textMap[type] || type
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
  
  fetchOverallStats()
})
</script>

<style scoped>
.xiaohongshu-stats-container {
  padding: 20px;
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

.table-row {
  margin-bottom: 20px;
}

.table-card {
  height: 400px;
}

.table-header {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #EBEEF5;
}
</style>