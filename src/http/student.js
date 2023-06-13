import { ElLoading } from 'element-plus'
import api from './axios.js'
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
const getallinfo = async(params)=>{
    return await requestWithLoading({
        url:'/api/student/page/school',
        headers,
        params,
    })
}

const studentAdd=(data)=>{
  return requestWithLoading({
      url:'/api/student/add',
      method:'post',
      headers,
      data
  })
}

const studentupdate=(data)=>{
  return requestWithLoading({
      url:'/api/student/saveOrUpdate',
      method:'post',
      headers,
      data
  })
}

const studentEdit=(data)=>{
  return requestWithLoading({
      url:'/api/student/edit',
      method:'post',
      headers,
      data
  })
}

const studentdel=(params)=>{
  return requestWithLoading({
      url:'/api/student/delete',
      headers,
      params
  })
}

const getStudentsByNo=(params)=>{
  return requestWithLoading({
      url:'/api/student/getStudentByStudentNo',
      headers,
      params
  })
}

const getall=(params)=>{
  return requestWithLoading({
      url:'/api/student/all',
      headers,
      params
  })
}

const getwant=(params)=>{
  return requestWithLoading({
      url:'/api/student/colums',
      headers,
      params
  })
}

export {
  getallinfo,
  studentAdd,
  studentEdit,
  studentdel,
  getStudentsByNo,
  studentupdate,
  getall,
  getwant
}