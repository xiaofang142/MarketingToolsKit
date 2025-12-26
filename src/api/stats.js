import { http } from '@/utils/request'

export const StatsApi = {
  getSystemInfo: () => http.get('/api/stats/system')
}

