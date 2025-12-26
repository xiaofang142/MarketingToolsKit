<template>
  <div class="short-link-stats-container">
    <!-- 页面标题和操作按钮 -->
    <div class="page-header">
      <h2>短链统计</h2>
      <div class="action-buttons">
        <el-button type="primary" @click="handleAllStats">
          <el-icon><DataAnalysis /></el-icon>
          总体统计
        </el-button>
      </div>
    </div>

    <!-- 搜索表单 -->
    <div class="search-form">
      <el-form :inline="true" :model="searchForm" class="search-form-content">
        <el-form-item label="短码">
          <el-input v-model="searchForm.short_code" placeholder="请输入短码" clearable />
        </el-form-item>
        <el-form-item label="原始URL">
          <el-input v-model="searchForm.original_url" placeholder="请输入原始URL" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="resetSearch">
            <el-icon><RefreshRight /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 短链列表 -->
    <el-table :data="shortLinkList" border style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="short_code" label="短码" width="120" />
      <el-table-column prop="original_url" label="原始URL" min-width="200" show-overflow-tooltip />
      <el-table-column prop="title" label="标题" min-width="150" show-overflow-tooltip />
      <el-table-column prop="click_count" label="累计点击次数" width="120" />
      <el-table-column prop="status_str" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row)">
            {{ scope.row.status_str }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleStats(scope.row)">
            <el-icon><DataAnalysis /></el-icon>
            统计
          </el-button>
          <el-button type="success" size="small" @click="handleShare(scope.row)">
            <el-icon><Share /></el-icon>
            分享
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        :current-page="pagination.page"
        :page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 单个短链统计对话框 -->
    <el-dialog
      v-model="statsDialogVisible"
      title="短链统计"
      width="80%"
      top="5vh"
    >
      <div v-loading="statsLoading" class="stats-content">
        <div class="stats-summary">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-card class="stats-card">
                <div class="stats-item">
                  <div class="stats-value">{{ currentStats.total_clicks || 0 }}</div>
                  <div class="stats-label">累计访问人数</div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="stats-card">
                <div class="stats-item">
                  <div class="stats-value">{{ currentStats.today_clicks || 0 }}</div>
                  <div class="stats-label">今日访问人数</div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="stats-card">
                <div class="stats-item">
                  <div class="stats-value">{{ currentStats.yesterday_clicks || 0 }}</div>
                  <div class="stats-label">昨日访问人数</div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="stats-card">
                <div class="stats-item">
                  <div class="stats-value">{{ currentStats.avg_daily_clicks || 0 }}</div>
                  <div class="stats-label">日均访问人数</div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <div class="stats-charts">
          <el-row :gutter="20">
            <el-col :span="16">
              <el-card>
                <div class="chart-title">七日访问趋势</div>
                <div ref="trendChartRef" class="chart-container"></div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card>
                <div class="chart-title">设备类型分布</div>
                <div ref="deviceChartRef" class="chart-container"></div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-dialog>

    <!-- 总体统计对话框 -->
    <el-dialog
      v-model="allStatsDialogVisible"
      title="总体统计"
      width="80%"
      top="5vh"
    >
      <div v-loading="allStatsLoading" class="stats-content">
        <div class="stats-summary">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-card class="stats-card">
                <div class="stats-item">
                  <div class="stats-value">{{ allStats.total_clicks || 0 }}</div>
                  <div class="stats-label">累计访问人数</div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="stats-card">
                <div class="stats-item">
                  <div class="stats-value">{{ allStats.today_clicks || 0 }}</div>
                  <div class="stats-label">今日访问人数</div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="stats-card">
                <div class="stats-item">
                  <div class="stats-value">{{ allStats.total_links || 0 }}</div>
                  <div class="stats-label">短链总数</div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="stats-card">
                <div class="stats-item">
                  <div class="stats-value">{{ allStats.active_links || 0 }}</div>
                  <div class="stats-label">活跃短链数</div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <div class="stats-charts">
          <el-row :gutter="20">
            <el-col :span="16">
              <el-card>
                <div class="chart-title">七日访问趋势</div>
                <div ref="allTrendChartRef" class="chart-container"></div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card>
                <div class="chart-title">设备类型分布</div>
                <div ref="allDeviceChartRef" class="chart-container"></div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-dialog>

    <!-- 分享对话框 -->
    <el-dialog
      v-model="shareDialogVisible"
      title="分享短链"
      width="500px"
    >
      <div v-loading="shareLoading" class="share-content">
        <el-form label-width="80px">
          <el-form-item label="短链地址">
            <el-input v-model="shareData.short_url" readonly>
              <template #append>
                <el-button @click="copyToClipboard(shareData.short_url)">复制</el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="二维码">
            <div class="qr-code-container">
              <img v-if="shareData.qr_code" :src="shareData.qr_code" alt="二维码" />
              <div v-else class="qr-code-placeholder">二维码生成中...</div>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { DataAnalysis, Share, Search, RefreshRight } from '@element-plus/icons-vue'
import { shortLinkApi } from '@/api/shortLink'
import * as echarts from 'echarts'

// 响应式数据
const loading = ref(false)
const statsLoading = ref(false)
const allStatsLoading = ref(false)
const shareLoading = ref(false)
const shortLinkList = ref([])
const statsDialogVisible = ref(false)
const allStatsDialogVisible = ref(false)
const shareDialogVisible = ref(false)
const currentStats = ref({})
const allStats = ref({})
const shareData = ref({})

// 图表引用
const trendChartRef = ref(null)
const deviceChartRef = ref(null)
const allTrendChartRef = ref(null)
const allDeviceChartRef = ref(null)

// 图表实例
let trendChart = null
let deviceChart = null
let allTrendChart = null
let allDeviceChart = null

// 搜索表单
const searchForm = reactive({
  short_code: '',
  original_url: ''
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 生命周期
onMounted(() => {
  fetchShortLinkList()
})

// 方法
const fetchShortLinkList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      page_size: pagination.pageSize,
      short_code: searchForm.short_code,
      original_url: searchForm.original_url
    }
    const res = await shortLinkApi.getList(params)
    if (res.code === 200) {
      shortLinkList.value = res.data.list
      pagination.total = res.data.total
    } else {
      ElMessage.error(res.msg || '获取短链列表失败')
    }
  } catch (error) {
    ElMessage.error('获取短链列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const getStatusType = (row) => {
  if (row.status === 2) return 'danger' // 禁用
  if (row.expire_time && new Date(row.expire_time) < new Date()) return 'warning' // 已过期
  return 'success' // 正常
}

const handleSearch = () => {
  pagination.page = 1
  fetchShortLinkList()
}

const resetSearch = () => {
  searchForm.short_code = ''
  searchForm.original_url = ''
  pagination.page = 1
  fetchShortLinkList()
}

const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.page = 1
  fetchShortLinkList()
}

const handleCurrentChange = (val) => {
  pagination.page = val
  fetchShortLinkList()
}

const handleStats = async (row) => {
  statsDialogVisible.value = true
  statsLoading.value = true
  
  try {
    // 获取最近7天的统计数据
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - 6)
    
    const params = {
      start_date: formatDate(startDate),
      end_date: formatDate(endDate)
    }
    
    const res = await shortLinkApi.getStats(row.id, params)
    if (res.code === 200) {
      currentStats.value = res.data
      
      // 等待DOM更新后初始化图表
      await nextTick()
      initCharts(res.data)
    } else {
      ElMessage.error(res.msg || '获取统计数据失败')
    }
  } catch (error) {
    ElMessage.error('获取统计数据失败')
    console.error(error)
  } finally {
    statsLoading.value = false
  }
}

const handleAllStats = async () => {
  allStatsDialogVisible.value = true
  allStatsLoading.value = true
  
  try {
    // 获取最近7天的统计数据
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - 6)
    
    const params = {
      start_date: formatDate(startDate),
      end_date: formatDate(endDate)
    }
    
    const res = await shortLinkApi.getAllStats(params)
    if (res.code === 200) {
      allStats.value = res.data
      
      // 等待DOM更新后初始化图表
      await nextTick()
      initAllCharts(res.data)
    } else {
      ElMessage.error(res.msg || '获取统计数据失败')
    }
  } catch (error) {
    ElMessage.error('获取统计数据失败')
    console.error(error)
  } finally {
    allStatsLoading.value = false
  }
}

const handleShare = async (row) => {
  shareDialogVisible.value = true
  shareLoading.value = true
  
  try {
    const res = await shortLinkApi.share(row.id)
    if (res.code === 200) {
      shareData.value = res.data
    } else {
      ElMessage.error(res.msg || '获取分享信息失败')
    }
  } catch (error) {
    ElMessage.error('获取分享信息失败')
    console.error(error)
  } finally {
    shareLoading.value = false
  }
}

const copyToClipboard = (text) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      ElMessage.success('复制成功')
    }).catch(() => {
      ElMessage.error('复制失败')
    })
  } else {
    // 兼容性处理
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    ElMessage.success('复制成功')
  }
}

const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const initCharts = (data) => {
  // 销毁已存在的图表实例
  if (trendChart) trendChart.dispose()
  if (deviceChart) deviceChart.dispose()
  
  // 初始化趋势图
  trendChart = echarts.init(trendChartRef.value)
  const trendOption = {
    title: {
      show: false
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['访问量']
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
      data: data.daily_stats ? data.daily_stats.map(item => item.date) : []
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '访问量',
        type: 'line',
        stack: 'Total',
        smooth: true,
        data: data.daily_stats ? data.daily_stats.map(item => item.count) : []
      }
    ]
  }
  trendChart.setOption(trendOption)
  
  // 初始化设备分布图
  deviceChart = echarts.init(deviceChartRef.value)
  const deviceOption = {
    title: {
      show: false
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 10
    },
    series: [
      {
        name: '设备类型',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: data.device_stats ? Object.keys(data.device_stats).map(key => ({
          value: data.device_stats[key],
          name: key
        })) : []
      }
    ]
  }
  deviceChart.setOption(deviceOption)
  
  // 监听窗口大小变化，调整图表大小
  window.addEventListener('resize', () => {
    trendChart.resize()
    deviceChart.resize()
  })
}

const initAllCharts = (data) => {
  // 销毁已存在的图表实例
  if (allTrendChart) allTrendChart.dispose()
  if (allDeviceChart) allDeviceChart.dispose()
  
  // 初始化趋势图
  allTrendChart = echarts.init(allTrendChartRef.value)
  const trendOption = {
    title: {
      show: false
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['访问量']
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
      data: data.daily_stats ? data.daily_stats.map(item => item.date) : []
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '访问量',
        type: 'line',
        stack: 'Total',
        smooth: true,
        data: data.daily_stats ? data.daily_stats.map(item => item.count) : []
      }
    ]
  }
  allTrendChart.setOption(trendOption)
  
  // 初始化设备分布图
  allDeviceChart = echarts.init(allDeviceChartRef.value)
  const deviceOption = {
    title: {
      show: false
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 10
    },
    series: [
      {
        name: '设备类型',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: data.device_stats ? Object.keys(data.device_stats).map(key => ({
          value: data.device_stats[key],
          name: key
        })) : []
      }
    ]
  }
  allDeviceChart.setOption(deviceOption)
  
  // 监听窗口大小变化，调整图表大小
  window.addEventListener('resize', () => {
    allTrendChart.resize()
    allDeviceChart.resize()
  })
}
</script>

<style lang="scss" scoped>
.short-link-stats-container {
  padding: 20px;
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h2 {
      margin: 0;
      font-size: 24px;
      color: #303133;
    }
    
    .action-buttons {
      display: flex;
      gap: 10px;
    }
  }
  
  .search-form {
    margin-bottom: 20px;
    padding: 15px;
    background-color: #f5f7fa;
    border-radius: 4px;
    
    .search-form-content {
      margin: 0;
    }
  }
  
  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
  
  .stats-content {
    .stats-summary {
      margin-bottom: 20px;
      
      .stats-card {
        text-align: center;
        
        .stats-item {
          padding: 10px 0;
          
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
        }
      }
    }
    
    .stats-charts {
      .chart-title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
        text-align: center;
      }
      
      .chart-container {
        height: 300px;
      }
    }
  }
  
  .share-content {
    .qr-code-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px;
      
      img {
        width: 200px;
        height: 200px;
      }
      
      .qr-code-placeholder {
        width: 200px;
        height: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f5f7fa;
        color: #909399;
      }
    }
  }
}
</style>