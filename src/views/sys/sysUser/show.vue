<template>
    <div>
        <page-main>
            <el-row>
                <el-col :md="24" :lg="12">
                    <el-form v-loading="formLoading" ref="formDef" :model="formData" label-width="120px" class="form-show">
                        <el-form-item label="用户id">
                            {{ formData.id }}
                        </el-form-item>
                        <el-form-item label="登录名">
                            {{ formData.loginName }}
                        </el-form-item>
                        <el-form-item label="用户名">
                            {{ formData.userName }}
                        </el-form-item>
                        <el-form-item label="状态">
                            {{ formData.status ? "正常":"禁用" }}
                        </el-form-item>
                        <el-form-item label="创建者">
                            {{ formData.createdUserName }}
                        </el-form-item>
                        <el-form-item label="创建时间">
                            {{ formData.createdDate }}
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </page-main>

        <fixed-action-bar>
            <el-button icon="el-icon-edit" type="primary" @click="goModify()" v-if="id > 0">编辑</el-button>
            <el-button icon="el-icon-back" @click="goBack()">返回</el-button>
        </fixed-action-bar>
    </div>
</template>

<script>
import { apiGetSysUserInfo } from "@/api/sys/sysUser";

export default {
    data() {
        return {
            id: 0,
            formData: {},
            formLoading: true,
        };
    },
    created() {
        this.route = this.$route.query;
        if (this.route.id) this.id = this.$base64.DeCode(this.route.id);
        if (this.id <= 0) this.goBack();

        this.loadFormData();
    },
    methods: {
        //加载表单数据
        loadFormData() {
            this.formLoading = true;
            apiGetSysUserInfo(this.id)
                .then((res) => {
                    this.formLoading = false;
                    this.formData = res.data;
                })
                .catch(() => {
                    this.formLoading = false;
                });
        },
        goModify() {
            this.$router.push({
                path: "edit",
                query: { id: this.$base64.EnCode(this.id) },
            });
        },
        goBack() {
            this.$router.push({
                path: "index",
            });
        },
    },
};
</script>
