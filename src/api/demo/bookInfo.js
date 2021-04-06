import request from "@/util/request"

//获取列表
export const apiGetBookInfoPageList = data => {
    return request({
        url: '/bookInfo/get/pagelist',
        method: 'post',
        data
    })
}


//删除
export const apiDeleteBookInfoByIds = (ids) => {
    return request({
        url: '/bookInfo/delete',
        method: 'delete',
        params: { ids: ids }
    })
}

//获取详情
export const apiGetBookInfoInfo = (id) => {
    return request({
        url: '/bookInfo/get/info',
        method: 'get',
        params: { id: id }
    })
}

//编辑信息
export const apiModifyBookInfoInfo = data => {
    return request({
        url: '/bookInfo/modify',
        method: 'post',
        data
    })
}
