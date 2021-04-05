import request from "@/util/request"

//获取树形数据
export const apiGetBookCategoryTreeList = title => {
    return request({
        url: '/bookcategory/get/list/tree',
        method: 'get',
        params: { title: title }
    })
}

//删除
export const apiDeleteBookCategoryById = (id) => {
    return request({
        url: '/bookcategory/delete',
        method: 'delete',
        params: { id: id }
    })
}

//获取详情
export const apiGetBookCategoryInfo = (id) => {
    return request({
        url: '/bookcategory/get/info',
        method: 'get',
        params: { id: id }
    })
}

//编辑信息
export const apiModifyBookCategoryInfo = data => {
    return request({
        url: '/bookcategory/modify',
        method: 'post',
        data
    })
}
