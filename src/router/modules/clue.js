export default [
  {
    path: 'clue/list',
    name: 'ClueList',
    component: () => import('@/views/clue/List.vue'),
    meta: { title: '线索列表', group: 'clueLibrary', icon: 'Document' }
  },
  {
    path: 'clue/statistics',
    name: 'ClueStatistics',
    component: () => import('@/views/clue/Statistics.vue'),
    meta: { title: '线索统计', group: 'clueLibrary', icon: 'DataAnalysis' }
  }
]