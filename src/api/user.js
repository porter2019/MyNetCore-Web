import request from "@/util/request"

//登录
export const userLogin = data => {
    return request({
        url: '/account/login',
        method: 'post',
        data
    })
}

//获取登录用户的权限列表
export const getCurrentUserPermissions = data => {
    return request({
        url: '/account/permissions',
        method: 'post',
        data
    })
}