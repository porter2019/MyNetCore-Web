import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'

import request from './util/request'
Vue.prototype.$request = request

import dayjs from 'dayjs'
Vue.prototype.$dayjs = dayjs

import auth from './util/auth'
Vue.use(auth)

import * as base64 from './util/base64'
Vue.prototype.$base64 = base64

import * as dateUtil from './util/date'
Vue.prototype.$dateUtil = dateUtil

import cookies from 'vue-cookies'
Vue.use(cookies)

import VueMeta from 'vue-meta'
Vue.use(VueMeta)

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import hotkeys from 'hotkeys-js'
Vue.prototype.$hotkeys = hotkeys

// 全局组件自动注册
import './components/autoRegister'

// 自动加载 svg 图标
const req = require.context('./assets/icons', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

import './assets/styles/reset.scss'

// 自定义样式
import './assets/styles/site.scss'

// import './mock'

Vue.config.productionTip = false

Vue.prototype.$eventBus = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
