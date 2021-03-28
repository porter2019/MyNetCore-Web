import Layout from '@/layout'

export default {
    path: '/sys',
    component: Layout,
    name: 'sys',
    meta: {
        title: '系统设置',
        auth: ['sysUser.show', 'sysRole.show'],
        icon: 'setting',
    },
    children: [
        //用户
        {
            path: 'sysUser/index',
            name: 'sysUser Index',
            component: () => import(/* webpackChunkName: 'sys' */ '@/views/sys/sysUser/index'),
            meta: {
                title: "用户列表",
                auth: ['sysUser.show'],
                icon: 'user',
            }
        },
        {
            path: 'sysUser/show',
            name: 'sysUser Show',
            component: () => import(/* webpackChunkName: 'sys' */ '@/views/sys/sysUser/show'),
            meta: {
                title: '用户详情',
                auth: ['sysUser.show'],
                sidebar: false,
                activeMenu: '/sys/sysUser/index'
            }
        },
        {
            path: 'sysUser/edit',
            name: 'sysUser Edit',
            component: () => import(/* webpackChunkName: 'sys' */ '@/views/sys/sysUser/edit'),
            meta: {
                title: '用户编辑',
                auth: ['sysUser.modify'],
                sidebar: false,
                activeMenu: '/sys/sysUser/index'
            }
        },
        //用户组
        {
            path: 'sysRole/index',
            name: 'sysRole Index',
            component: () => import(/* webpackChunkName: 'sys' */ '@/views/sys/sysRole/index'),
            meta: {
                title: "用户组列表",
                auth: ['sysRole.show'],
                icon: 'users',
            }
        },
        {
            path: 'sysRole/show',
            name: 'sysRole Show',
            component: () => import(/* webpackChunkName: 'sys' */ '@/views/sys/sysRole/show'),
            meta: {
                title: '用户组详情',
                auth: ['sysRole.show'],
                sidebar: false,
                activeMenu: '/sys/sysRole/index'
            }
        },
        {
            path: 'sysRole/edit',
            name: 'sysRole Edit',
            component: () => import(/* webpackChunkName: 'sys' */ '@/views/sys/sysRole/edit'),
            meta: {
                title: '用户组编辑',
                auth: ['sysRole.modify'],
                sidebar: false,
                activeMenu: '/sys/sysRole/index'
            }
        }
    ]
}
