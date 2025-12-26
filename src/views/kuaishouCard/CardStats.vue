<template>
  <div class="kuaishou-card-stats-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>快手卡片统计 - {{ cardInfo.title || '加载中...' }}</span>
          <div class="header-actions">
            <el-button @click="goBack">返回</el-button>
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

      <!-- 卡片信息 -->
      <div class="card-info-section" v-if="cardInfo.id">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-image 
              style="width: 100%; height: 200px" 
              :src="cardInfo.image_url" 
              :preview-src-list="[cardInfo.image_url]"
              fit="cover"
            />
          </el-col>
          <el-col :span="18">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="卡片ID">{{ cardInfo.id }}</el-descriptions-item>
              <el-descriptions-item label="标题">{{ cardInfo.title }}</el-descriptions-item>
              <el-descriptions-item label="状态">
                <el-tag :type="cardInfo.is_active ? 'success' : 'danger'">
                  {{ cardInfo.is_active ? '激活' : '禁用' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="创建时间">{{ cardInfo.created_at }}</el-descriptions-item>
              <el-descriptions-item label="描述" :span="2">{{ cardInfo.description }}</el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>
      </div>

      <!-- 总体统计 -->
      <div class="stats-overview">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-card class="stats-card">
              <div class="stats-item">
                <div class="stats-value">{{ formatNumber(cardStats.view_count) }}</div>
                <div class="stats-label">总浏览量</div>
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
              <div ref="visitTrendChart" class="chart-container"></div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 最近活动 -->
      <div class="bottom-section">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-card>
              <template #header>
                <div class="card-header">
                  <span>最近活动</span>
                </div>
              </template>
              <el-table :data="cardStats.recentActivity.filter(item => item.action === 'view')" style="width: 100%">
                <el-table-column prop="username" label="用户" />
                <el-table-column prop="action" label="操作">
                  <template #default="scope">
                    <el-tag :type="getActionType(scope.row.action)">
                      {{ getActionText(scope.row.action) }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="ip_address" label="IP地址" />
                <el-table-column prop="created_at" label="时间">
                  <template #default="scope">
                    {{ formatDate(scope.row.created_at) }}
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
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { getKuaishouCard, getKuaishouCardStats } from '@/api/kuaishouCard'

// 路由
const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(false)
const cardId = ref(route.params.id)
const cardInfo = ref({})
const dateRange = ref([])
const groupBy = ref('day')

// 卡片统计数据
const cardStats = reactive({
  cardId: 0,
  title: '',
  viewCount: 0,
  dailyStats: [],
  recentActivity: []
})

// 图表实例
const visitTrendChart = ref(null)
let visitChartInstance = null

// 获取卡片信息
const fetchCardInfo = async () => {
  try {
    const res = await getKuaishouCard(cardId.value)
    if (res.code === 200) {
      cardInfo.value = res.data
    } else {
      ElMessage.error(res.message || '获取卡片信息失败')
    }
  } catch (error) {
    ElMessage.error('获取卡片信息失败')
    console.error('获取快手卡片信息失败:', error)
  }
}

// 获取卡片统计数据
const fetchCardStats = async () => {
  try {
    const params = {}
    
    // 添加日期范围参数
    if (dateRange.value && dateRange.value.length === 2) {
      params.start_date = formatDate(dateRange.value[0])
      params.end_date = formatDate(dateRange.value[1])
    }
    
    // 添加分组参数
    params.group_by = groupBy.value
    
    const res = await getKuaishouCardStats(cardId.value, params)
    if (res.code === 200) {
      // 更新统计数据
      Object.assign(cardStats, res.data)
      
      // 更新图表
      nextTick(() => {
        initCharts()
      })
    } else {
      ElMessage.error(res.message || '获取统计数据失败')
    }
  } catch (error) {
    ElMessage.error('获取统计数据失败')
    console.error('获取快手卡片统计失败:', error)
  }
}

// 初始化图表
const initCharts = () => {
  // 销毁已存在的图表
  if (visitChartInstance) {
    visitChartInstance.dispose()
  }

  // 初始化访问趋势图
  if (visitTrendChart.value) {
    visitChartInstance = echarts.init(visitTrendChart.value)
    const visitOption = {
      tooltip: {
        trigger: 'axis'
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
        data: cardStats.dailyStats.map(item => item.date)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '浏览量',
          type: 'line',
          smooth: true,
          data: cardStats.dailyStats.map(item => item.view_count),
          itemStyle: {
            color: '#2684FF'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(38, 132, 255, 0.3)' },
              { offset: 1, color: 'rgba(38, 132, 255, 0.1)' }
            ])
          }
        }
      ]
    }
    visitChartInstance.setOption(visitOption)
  }

  // 响应式调整
  window.addEventListener('resize', handleResize)
}

// 处理窗口大小变化
const handleResize = () => {
  if (visitChartInstance) visitChartInstance.resize()
}

// 处理日期范围变化
const handleDateChange = () => {
  fetchCardStats()
}

// 处理分组方式变化
const handleGroupByChange = () => {
  fetchCardStats()
}

// 刷新数据
const refreshData = () => {
  fetchCardInfo()
  fetchCardStats()
}

// 返回列表
const goBack = () => {
  router.push('/kuaishouCard')
}

// 格式化数字
const formatNumber = (num) => {
  if (!num) return '0'
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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

// 获取操作类型标签
const getActionType = (action) => {
  const typeMap = {
    'view': 'info'
  }
  return typeMap[action] || 'default'
}

// 获取操作类型文本
const getActionText = (action) => {
  const typeMap = {
    'view': '浏览'
  }
  return typeMap[action] || '未知'
}

// 生命周期
onMounted(async () => {
  // 设置默认日期范围为最近30天
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 30)
  dateRange.value = [startDate, endDate]
  
  // 获取数据
  await fetchCardInfo()
  await fetchCardStats()
})

// 组件卸载时清理
import { onUnmounted } from 'vue'
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (visitChartInstance) visitChartInstance.dispose()
})
</script>

<style scoped>
.kuaishou-card-stats-container {
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

.card-info-section {
  margin-bottom: 30px;
}

.stats-overview {
  margin-bottom: 30px;
}

.stats-card {
  text-align: center;
}

.stats-item {
  padding: 20px;
}

.stats-value {
  font-size: 24px;
  font-weight: 600;
  color: #409EFF;
  margin-bottom: 8px;
}

.stats-label {
  font-size: 14px;
  color: #909399;
}

.charts-section {
  margin-bottom: 30px;
}

.chart-container {
  height: 400px;
}

.bottom-section {
  margin-bottom: 30px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.el-tag {
  margin-right: 5px;
}

.el-tag:last-child {
  margin-right: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .header-actions {
    width: 100%;
    flex-wrap: wrap;
  }
}
</style>