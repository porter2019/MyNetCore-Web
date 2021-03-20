import request from "@/util/request"

//获取列表
export const apiGetSysUserPageList = data => {
    return request({
        url: '/sysuser/get/pagelist',
        method: 'post',
        data
    })
}