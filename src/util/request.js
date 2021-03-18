import axios from 'axios'
// import Qs from 'qs'
import router from '@/router/index'
import store from '@/store/index'
import { Message } from 'element-ui'

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
        if (request.method == 'post') {
            if (request.data instanceof FormData) {
                if (store.getters['user/isLogin']) {
                    // 如果是 FormData 类型（上传图片）
                    request.data.append('token', store.state.user.token)
                }
            } else {
                // 带上 token
                if (request.data == undefined) {
                    request.data = {}
                }
                if (store.getters['user/isLogin']) {
                    request.data.token = store.state.user.token
                }
                // request.data = Qs.stringify(request.data)
            }
        } else {
            // 带上 token
            if (request.params == undefined) {
                request.params = {}
            }
            if (store.getters['user/isLogin']) {
                request.params.token = store.state.user.token
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
        }
        return Promise.resolve(response.data)
    },
    error => {
        return Promise.reject(error)
    }
)

export default request
