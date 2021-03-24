import request from "@/util/request"

//获取列表
export const apiGetSysUserPageList = data => {
    return request({
        url: '/sysuser/get/pagelist',
        method: 'post',
        data
    })
}

//删除
export const apiDeleteSysUserByIds = (ids) => {
    return request({
        url: '/sysuser/delete',
        method: 'delete',
        params: { ids: ids }
    })
}

//获取详情
export const apiGetSysUserInfo = (id) => {
    return request({
        url: '/sysuser/get/info',
        method: 'get',
        params: { id: id }
    })
}

//编辑信息
export const apiModifySysUserInfo = data => {
    return request({
        url: '/sysuser/modify',
        method: 'post',
        data
    })
}

//判断登录名是否存在
export const apiCheckLoginNameExists = (userId, loginName) => {
    return request({
        url: '/sysuser/exists/loginname',
        method: 'get',
        params: { userId: userId, loginName: loginName }
    })
}
