import { ElLoading } from 'element-plus'
import api from './index.js'
import { useUserStore } from '../store/user.js'

const userStore = useUserStore() // 获取用户 store
const token = userStore.token // 获取 token
const headers = {
  Authorization: 'Bearer ' + token, // 添加 Authorization 头部字段
}
let loadingInstance // 定义加载实例

const showLoading = () => {
  // 创建加载实例并显示加载动画
  loadingInstance = ElLoading.service({
    lock: true,
    text: '加载中...', // 可自定义加载提示文本
  })
}

const hideLoading = () => {
  // 关闭加载实例，隐藏加载动画
  if (loadingInstance) {
    loadingInstance.close()
  }
}

const requestWithLoading = async (config) => {
  showLoading() // 显示加载动画

  try {
    return await api.request(config) // 发起接口请求
  } finally {
    hideLoading() // 隐藏加载动画
  }
}

const One = async (id) => {
  return await requestWithLoading({
    url: '/mall/cms-help/one/' + id,
    headers,
  })
}

const Add = (data) => {
  return requestWithLoading({
    url: '/mall/cms-help/add',
    method: 'post',
    headers,
    data,
  })
}

const Del = (id) => {
  return requestWithLoading({
    url: '/mall/cms-help/del/' + id,
    headers,
  })
}

const Edit = (data) => {
  return requestWithLoading({
    url: '/mall/cms-help/edit',
    method: 'post',
    headers,
    data
  })
}

const Page = (data) => {
  return requestWithLoading({
    url: '/mall/cms-help/page',
    method: 'post',
    headers,
    data
  })
}

const getCmsHelpsByCategoryId = (categoryId) => {
    return requestWithLoading({
      url: '/mall/cms-help/getCmsHelps/' + categoryId,
      headers,
    })
  }

export {
  One,
  Add,
  Del,
  Edit,
  Page,
  getCmsHelpsByCategoryId
}
