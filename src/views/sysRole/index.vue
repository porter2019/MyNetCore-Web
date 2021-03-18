<template>
    <div>
        <h1>首页</h1>
        <auth value="sysRole.show">
            <router-link :to="{path:'show'}">详情页</router-link><br>
        </auth>
        <router-link v-auth="['sysRole.edit']" :to="{path:'edit'}">编辑</router-link>
    </div>
</template>

<script>
export default {
    data() {
        return {
            account: this.$store.state.user.account,
        };
    },
    methods: {
        permissionCheck(permissions) {
            //permissions格式："" 或 ["",""]
            if (this.$auth(permissions)) {
                this.$message.success("校验通过");
            } else {
                this.$message.error("校验不通过");
            }
        },
    },
};
</script>
