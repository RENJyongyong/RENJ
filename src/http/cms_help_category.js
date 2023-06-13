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

const categoryOne = async (id) => {
  return await requestWithLoading({
    url: '/mall/cms-help-category/one/' + id,
    headers,
  })
}

const categoryAdd = (data) => {
  return requestWithLoading({
    url: '/mall/cms-help-category/add',
    method: 'post',
    headers,
    data,
  })
}

const categoryDel = (id) => {
  return requestWithLoading({
    url: '/mall/cms-help-category/del/' + id,
    headers,
  })
}

const categoryEdit = (data) => {
  return requestWithLoading({
    url: '/mall/cms-help-category/edit',
    method: 'post',
    data
  })
}

const categoryPage = (data) => {
  return requestWithLoading({
    url: '/mall/cms-help-category/page',
    method: 'post',
    data,
  })
}

export {
  categoryOne,
  categoryAdd,
  categoryDel,
  categoryEdit,
  categoryPage
}
