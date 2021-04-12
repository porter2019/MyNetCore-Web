import request from '@/util/request'

const state = {
    account: localStorage.account || '',
    token: localStorage.token || '',
    failure_time: localStorage.failure_time || '',
    permissions: []
}

const getters = {
    isLogin: state => {
        let retn = false
        if (state.token) {
            let unix = Date.parse(new Date()) / 1000;//秒
            if (unix < state.failure_time) {
                retn = true
            }
        }
        return retn
    }
}

const actions = {
    login({ commit }, data) {
        commit('setUserData', data);
        // return new Promise((resolve, reject) => {
        //     // 通过 mock 进行登录
        //     request.post('account/login', data).then(res => {
        //         if (res.data.code != 200) {
        //             throw res.data.msg;
        //             // this.$message.error(res.data.msg);
        //         }
        //         console.log(res.data, '登录返回');
        //         commit('setUserData', res.data);
        //         resolve();
        //     }).catch(error => {
        //         reject(error)
        //     })
        // })
    },
    logout({ commit }) {
        commit('removeUserData')
        commit('menu/invalidRoutes', null, { root: true })
    },
    // 获取我的权限，页面刷新后会重新请求接口
    getPermissions({ state, commit }) {
        // return new Promise(resolve => {
        //     // 通过 mock 获取权限
        //     api.get('mock/member/permission', {
        //         params: {
        //             account: state.account
        //         }
        //     }).then(res => {
        //         console.log(res.data.permissions, '当前用户拥有的权限')
        //         commit('setPermissions', res.data.permissions)
        //         resolve(res.data.permissions)
        //     })
        // })
        return new Promise((resolve, reject) => {
            request.post('/account/permissions').then(res => {
                commit('setPermissions', res.data)
                resolve(res.data)
            }).catch(error => {
                reject(error)
            })
        })
    }
}

const mutations = {
    setUserData(state, data) {
        localStorage.setItem('account', data.LoginName)
        localStorage.setItem('token', data.Token)
        localStorage.setItem('failure_time', data.FailureTime)
        state.account = data.LoginName
        state.token = data.Token
        state.failure_time = data.FailureTime
    },
    removeUserData(state) {
        localStorage.removeItem('account')
        localStorage.removeItem('token')
        localStorage.removeItem('failure_time')
        state.account = ''
        state.token = ''
        state.failure_time = ''
        state.permissions = []
    },
    setPermissions(state, permissions) {
        state.permissions = permissions
    }
}

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations
}
