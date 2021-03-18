module.exports = [
    {
        url: 'member/login',
        type: 'post',
        result: option => {
            return {
                msg: '',
                code: 200,
                data: {
                    account: option.body.account,
                    token: '@string',
                    failure_time: Date.parse(new Date()) / 1000 + 24 * 60 * 60
                }
            }
        }
    },
    {
        url: 'member/permission',
        type: 'get',
        result: option => {
            let permissions = []
            if (option.query.account == 'admin') {
                permissions = [
                    'permission.browse',
                    'permission.create',
                    'permission.edit',
                    'permission.remove',
                    'sysRole.index'
                ]
            } else if (option.query.account == 'test') {
                permissions = [
                    'permission.browse'
                ]
            }
            return {
                msg: '',
                code: 200,
                data: {
                    permissions
                }
            }
        }
    }
]
