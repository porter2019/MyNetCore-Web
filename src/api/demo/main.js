import request from "@/util/request"

//获取列表
export const apiGetDemoMainPageList = data => {
    return request({
        url: '/demomain/get/pagelist',
        method: 'post',
        data
    })
}


//删除
export const apiDeleteDemoMainByIds = (ids) => {
    return request({
        url: '/demomain/delete',
        method: 'delete',
        params: { ids: ids }
    })
}

//获取详情
export const apiGetDemoMainInfo = (id) => {
    return request({
        url: '/demomain/get/info',
        method: 'get',
        params: { id: id }
    })
}

//编辑信息
export const apiModifyDemoMainInfo = data => {
    return request({
        url: '/demomain/modify',
        method: 'post',
        data
    })
}
