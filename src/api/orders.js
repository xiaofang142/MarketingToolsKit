import { http } from '@/utils/request'

export const ordersApi = {
  list: (page,limit) => {
    return http.get(`/api/orders/list?page=${page}&limit=${limit}`)
  },
  delete: (id) => {
    return http.delete(`/api/orders/delete/${id}`)
  },
}