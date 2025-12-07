import axios from 'axios'
import { useAuthStore } from '@/auth/store'
import { getEnv } from '@/utils/env'
import { message, Modal } from 'antd'

const baseURL = getEnv('VITE_API_BASE', 'http://localhost:8888')

export const api = axios.create({
    baseURL,
    timeout: 15000,
})

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token
    if (token) {
        config.headers.Authorization = token
    }
    return config
})

api.interceptors.response.use(
    (response) => {
        const res = response.data
        if (res?.code !== 200) {
            message.error(res?.message || '请求失败')
            if (res?.code === 401 || res?.code === 403) {
                Modal.confirm({
                    title: '登录已失效',
                    content: '请重新登录',
                    okText: '重新登录',
                    onOk: () => {
                        useAuthStore.getState().logout()
                        window.location.href = '/login'
                    },
                })
            }
            return Promise.reject(res)
        }
        return res
    },
    (error) => {
        message.error(error?.message || '网络错误')
        return Promise.reject(error)
    },
)
