import Layout from '@/layout'

export default {
    path: '/sys/sysUser',
    component: Layout,
    redirect: '/sys/sysUser/index',
    name: 'sysUser',
    meta: {
        title: '用户',
        icon: 'sidebar-menu',
        // auth: ['sysUser.index']
    },
    children: [
        {
            path: 'index',
            name: 'sysUser Index',
            component: () => import(/* webpackChunkName: 'sysUser' */ '@/views/sys/sysUser/index'),
            meta: {
                title: "用户列表",
                icon: 'sidebar-default',
                // auth: ['sysUser.index']
            }
        },
        {
            path: 'show',
            name: 'sysUser Show',
            component: () => import(/* webpackChunkName: 'sysUser' */ '@/views/sys/sysUser/show'),
            meta: {
                title: '用户详情',
                // auth: ['sysUser.show'],
                sidebar: false,
                activeMenu: '/sys/sysUser/index'
            }
        },
        {
            path: 'edit',
            name: 'sysUser Edit',
            component: () => import(/* webpackChunkName: 'sysUser' */ '@/views/sys/sysUser/edit'),
            meta: {
                title: '用户编辑',
                // auth: ['sysUser.modify'],
                sidebar: false,
                activeMenu: '/sys/sysUser/index'
            }
        }
    ]
}
