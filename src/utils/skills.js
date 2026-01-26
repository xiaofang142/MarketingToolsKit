/**
 * 中文环境下技能配置
 * 包含各种营销工具的功能配置和国际化支持
 */

// 营销工具类型映射
export const marketingToolTypes = {
  EMAIL: {
    value: 'email',
    label: '邮件营销',
    icon: 'Message',
    description: '自动化邮件序列，优化用户生命周期管理'
  },
  SMS: {
    value: 'sms',
    label: '短信营销',
    icon: 'ChatDotSquare',
    description: '批量发送个性化内容，支持模板化操作'
  },
  SOCIAL_CARD: {
    value: 'social_card',
    label: '社交媒体卡片',
    icon: 'VideoPlay',
    description: '一键生成抖音、快手、小红书、闲鱼等平台的推广卡片'
  },
  TELEGRAM: {
    value: 'telegram',
    label: 'Telegram机器人',
    icon: 'ChatDotRound',
    description: '支持关键词回复、任务调度及用户数据分析'
  },
  WHATSAPP: {
    value: 'whatsapp',
    label: 'WhatsApp机器人',
    icon: 'ChatLineRound',
    description: '集成消息模板，实现快速客服与促销通知'
  },
  AUTO_REPLY: {
    value: 'auto_reply',
    label: '智能自动回复',
    icon: 'ChatSquare',
    description: '基于用户行为触发实时响应，减少人工干预'
  },
  SHORT_LINK: {
    value: 'short_link',
    label: '短链服务',
    icon: 'Link',
    description: '生成和管理营销短链接，追踪点击数据'
  },
  LIVE_CODE: {
    value: 'live_code',
    label: '活码系统',
    icon: 'QrCode',
    description: '动态二维码生成，支持多渠道引流'
  },
  DOMAIN_POOL: {
    value: 'domain_pool',
    label: '域名池',
    icon: 'Connection',
    description: '管理多个域名用于不同营销活动'
  }
}

// 社交媒体平台配置
export const socialPlatforms = {
  XIAOHONGSHU: {
    value: 'xiaohongshu',
    label: '小红书',
    icon: 'Picture',
    color: '#FF4A00',
    description: '小红书推广卡片和自动回复'
  },
  DOUYIN: {
    value: 'douyin',
    label: '抖音',
    icon: 'VideoPlay',
    color: '#000000',
    description: '抖音推广卡片和自动回复'
  },
  KUAISHOU: {
    value: 'kuaishou',
    label: '快手',
    icon: 'Bell',
    color: '#FF4A00',
    description: '快手推广卡片和自动回复'
  },
  XIANYU: {
    value: 'xianyu',
    label: '闲鱼',
    icon: 'ShoppingBag',
    color: '#007AFF',
    description: '闲鱼推广卡片和自动回复'
  },
  WECHAT: {
    value: 'wechat',
    label: '微信',
    icon: 'ChatDotRound',
    color: '#07C160',
    description: '微信生态营销工具'
  },
  WECHAT_VIDEO: {
    value: 'wechat_video',
    label: '视频号',
    icon: 'VideoCamera',
    color: '#07C160',
    description: '微信视频号推广工具'
  }
}

// 营销活动状态配置
export const campaignStatus = {
  DRAFT: {
    value: 'draft',
    label: '草稿',
    tagType: 'info',
    description: '营销活动草稿状态'
  },
  SCHEDULED: {
    value: 'scheduled',
    label: '已排期',
    tagType: 'warning',
    description: '营销活动已排期等待执行'
  },
  RUNNING: {
    value: 'running',
    label: '进行中',
    tagType: 'primary',
    description: '营销活动正在执行中'
  },
  COMPLETED: {
    value: 'completed',
    label: '已完成',
    tagType: 'success',
    description: '营销活动已成功完成'
  },
  FAILED: {
    value: 'failed',
    label: '已失败',
    tagType: 'danger',
    description: '营销活动执行失败'
  },
  PAUSED: {
    value: 'paused',
    label: '已暂停',
    tagType: 'info',
    description: '营销活动已暂停'
  },
  CANCELLED: {
    value: 'cancelled',
    label: '已取消',
    tagType: 'info',
    description: '营销活动已取消'
  }
}

// 营销效果指标配置
export const marketingMetrics = {
  IMPRESSIONS: {
    value: 'impressions',
    label: '曝光量',
    unit: '次',
    description: '营销内容的展示次数'
  },
  CLICKS: {
    value: 'clicks',
    label: '点击量',
    unit: '次',
    description: '营销内容的点击次数'
  },
  CONVERSIONS: {
    value: 'conversions',
    label: '转化量',
    unit: '次',
    description: '营销带来的实际转化次数'
  },
  CLICK_THROUGH_RATE: {
    value: 'ctr',
    label: '点击率',
    unit: '%',
    description: '点击率 = (点击数/曝光数)*100%'
  },
  CONVERSION_RATE: {
    value: 'cr',
    label: '转化率',
    unit: '%',
    description: '转化率 = (转化数/点击数)*100%'
  },
  COST_PER_CLICK: {
    value: 'cpc',
    label: '单次点击成本',
    unit: '元',
    description: '每次点击的平均成本'
  },
  RETURN_ON_AD_SPEND: {
    value: 'roas',
    label: '广告支出回报率',
    unit: '倍',
    description: '广告投入产出比'
  }
}

// 用户行为类型配置
export const userActionTypes = {
  VIEW: {
    value: 'view',
    label: '浏览',
    description: '用户浏览了营销内容'
  },
  CLICK: {
    value: 'click',
    label: '点击',
    description: '用户点击了营销内容'
  },
  SHARE: {
    value: 'share',
    label: '分享',
    description: '用户分享了营销内容'
  },
  COMMENT: {
    value: 'comment',
    label: '评论',
    description: '用户评论了营销内容'
  },
  LIKE: {
    value: 'like',
    label: '点赞',
    description: '用户点赞了营销内容'
  },
  FORWARD: {
    value: 'forward',
    label: '转发',
    description: '用户转发了营销内容'
  },
  PURCHASE: {
    value: 'purchase',
    label: '购买',
    description: '用户通过营销内容完成购买'
  },
  SIGN_UP: {
    value: 'sign_up',
    label: '注册',
    description: '用户通过营销内容完成注册'
  }
}

// 营销自动化工作流节点类型
export const workflowNodeTypes = {
  TRIGGER: {
    value: 'trigger',
    label: '触发器',
    description: '工作流的起始节点'
  },
  CONDITION: {
    value: 'condition',
    label: '条件判断',
    description: '根据条件分支执行'
  },
  ACTION: {
    value: 'action',
    label: '执行动作',
    description: '执行具体的营销动作'
  },
  DELAY: {
    value: 'delay',
    label: '延时',
    description: '延时执行后续动作'
  },
  END: {
    value: 'end',
    label: '结束',
    description: '工作流结束节点'
  }
}

// 消息模板类型
export const messageTemplateTypes = {
  WELCOME: {
    value: 'welcome',
    label: '欢迎消息',
    description: '新用户加入时发送的欢迎消息'
  },
  PROMOTION: {
    value: 'promotion',
    label: '促销消息',
    description: '商品促销或活动推广消息'
  },
  REMINDER: {
    value: 'reminder',
    label: '提醒消息',
    description: '重要事项提醒消息'
  },
  FEEDBACK: {
    value: 'feedback',
    label: '反馈消息',
    description: '收集用户反馈的消息'
  },
  FOLLOW_UP: {
    value: 'follow_up',
    label: '跟进消息',
    description: '销售跟进或客户服务消息'
  }
}

// 数据导出格式
export const exportFormats = {
  CSV: {
    value: 'csv',
    label: 'CSV',
    extension: '.csv',
    description: '逗号分隔值格式'
  },
  EXCEL: {
    value: 'excel',
    label: 'Excel',
    extension: '.xlsx',
    description: 'Microsoft Excel格式'
  },
  PDF: {
    value: 'pdf',
    label: 'PDF',
    extension: '.pdf',
    description: '便携式文档格式'
  },
  JSON: {
    value: 'json',
    label: 'JSON',
    extension: '.json',
    description: 'JavaScript对象表示法'
  }
}

// 通用工具函数
export const getToolLabel = (toolType) => {
  const tool = Object.values(marketingToolTypes).find(t => t.value === toolType)
  return tool ? tool.label : toolType
}

export const getPlatformLabel = (platform) => {
  const plat = Object.values(socialPlatforms).find(p => p.value === platform)
  return plat ? plat.label : platform
}

export const getStatusLabel = (status) => {
  const stat = Object.values(campaignStatus).find(s => s.value === status)
  return stat ? stat.label : status
}

export const getMetricLabel = (metric) => {
  const met = Object.values(marketingMetrics).find(m => m.value === metric)
  return met ? met.label : metric
}

export const getUserActionLabel = (action) => {
  const act = Object.values(userActionTypes).find(a => a.value === action)
  return act ? act.label : action
}

export const getWorkflowNodeTypeLabel = (nodeType) => {
  const node = Object.values(workflowNodeTypes).find(n => n.value === nodeType)
  return node ? node.label : nodeType
}

export const getMessageTemplateTypeLabel = (templateType) => {
  const template = Object.values(messageTemplateTypes).find(t => t.value === templateType)
  return template ? template.label : templateType
}

export const getExportFormatLabel = (format) => {
  const fmt = Object.values(exportFormats).find(f => f.value === format)
  return fmt ? fmt.label : format
}