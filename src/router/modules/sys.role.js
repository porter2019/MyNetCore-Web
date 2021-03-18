import Layout from '@/layout'

export default {
    path: '/sysRole',
    component: Layout,
    redirect: '/sysRole/index',
    name: 'sysRole',
    meta: {
        title: '用户组',
        icon: 'sidebar-menu',
        auth: ['sysRole.index']
    },
    children: [
        {
            path: 'index',
            name: 'sysRole Index',
            component: () => import(/* webpackChunkName: 'sysRole' */ '@/views/sysRole/index'),
            meta: {
                title: "用户组列表",
                icon: 'sidebar-default',
                auth: ['sysRole.index']
            }
        },
        {
            path: 'show',
            name: 'sysRole Show',
            component: () => import(/* webpackChunkName: 'sysRole' */ '@/views/sysRole/show'),
            meta: {
                title: '用户组详情',
                auth: ['sysRole.show'],
                sidebar: false,
                activeMenu: '/sysRole/index'
            }
        },
        {
            path: 'edit',
            name: 'sysRole Edit',
            component: () => import(/* webpackChunkName: 'sysRole' */ '@/views/sysRole/edit'),
            meta: {
                title: '用户组编辑',
                auth: ['sysRole.modify'],
                sidebar: false,
                activeMenu: '/sysRole/index'
            }
        }
    ]
}
