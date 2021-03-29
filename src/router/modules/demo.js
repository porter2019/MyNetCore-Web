import Layout from '@/layout'

export default {
    path: '/demo',
    component: Layout,
    name: 'demo',
    redirect: '/demo/main/index',
    meta: {
        title: '功能演示',
        auth: ['demoMain.show'],
        icon: 'setting',
    },
    children: [
        //主体
        {
            path: 'main/index',
            name: 'demoMain Index',
            component: () => import(/* webpackChunkName: 'demo' */ '@/views/demo/main/index'),
            meta: {
                title: "主体列表",
                auth: ['demoMain.show'],
                icon: 'user',
            }
        },
        {
            path: 'main/show',
            name: 'demoMain Show',
            component: () => import(/* webpackChunkName: 'demo' */ '@/views/demo/main/show'),
            meta: {
                title: '主体详情',
                auth: ['demoMain.show'],
                sidebar: false,
                activeMenu: '/demo/main/index'
            }
        },
        {
            path: 'main/edit',
            name: 'demoMain Edit',
            component: () => import(/* webpackChunkName: 'demo' */ '@/views/demo/main/edit'),
            meta: {
                title: '主体编辑',
                auth: ['demoMain.modify'],
                sidebar: false,
                activeMenu: '/demo/main/index'
            }
        },
    ]
}
