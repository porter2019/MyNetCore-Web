import axios from 'axios'
// import Qs from 'qs'
import router from '@/router/index'
import store from '@/store/index'
import { Message } from 'element-ui'

const tokenHeaderName = process.env.VUE_APP_TOKEN_HEADER_NAME || "AccessToken"

const toLogin = () => {
    router.push({
        path: '/login',
        query: {
            redirect: router.currentRoute.fullPath
        }
    })
}

const request = axios.create({
    baseURL: process.env.VUE_APP_API_ROOT,
    timeout: 10000,
    responseType: 'json'
    // withCredentials: true
})

request.interceptors.request.use(
    request => {
        if (request.method == 'post' && request.data == undefined) {
            request.data = {};//如果post不传值，则会报错：415/Unsupported Media Type，这里给个默认值
        }
        if (store.getters['user/isLogin']) {
            request.headers = {
                'Content-Type': 'application/json',
                [tokenHeaderName]: store.state.user.token
            }
        } else {
            request.headers = {
                'Content-Type': 'application/json',
            }
        }
        return request
    }
)

request.interceptors.response.use(
    response => {
        if (response.data.code != 200) {
            // 如果接口请求时发现 token 失效，则立马跳转到登录页
            if (response.data.code === 401 || response.data.code === 412) {
                toLogin()
            }
            Message.error(response.data.msg)
            return Promise.reject(response.data)
        } else {
            return Promise.resolve(response.data)
        }
    },
    error => {
        Message.error(error.message)
        return Promise.reject(error)
    }
)

export default request
