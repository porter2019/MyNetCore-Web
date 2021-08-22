<template>
    <div>
        <page-main title="详情">
            <el-form v-loading="formLoading" ref="formMain" :model="formData" label-width="140px" class="form-show">
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="用户id">
                            {{ formData.Id }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="登录名">
                            {{ formData.LoginName }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="用户名">
                            {{ formData.UserName }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="所属组">
                            {{ formatRoleInfo(formData.RoleInfo) }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="状态">
                            {{ formData.Status ? "正常":"禁用" }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="最后更新者">
                            {{ formData.UpdatedUserName }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="最后更新时间">
                            {{ formData.UpdatedDate }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="创建者">
                            {{ formData.CreatedUserName }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="创建时间">
                            {{ formData.CreatedDate }}
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </page-main>

        <fixed-action-bar>
            <el-button v-auth="'sysUser.modify'" icon="el-icon-edit" type="primary" @click="goModify()" v-if="id > 0 && !formLoading">编辑</el-button>
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
        formatRoleInfo(roleInfo) {
            if (!roleInfo) return "-";
            var tempArr = [];
            (roleInfo.split(",") || []).forEach((item) => {
                if (item) {
                    var roleArr = item.split(";");
                    if (roleArr.length == 2) {
                        tempArr.push(roleArr[1]);
                    }
                }
            });
            if (tempArr.length == 0) return "-";
            return tempArr.join("，");
        },
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
