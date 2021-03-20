import request from "@/util/request"

//获取列表
export const apiGetSysRolePageList = data => {
    return request({
        url: '/sysrole/get/pagelist',
        method: 'post',
        data
    })
}