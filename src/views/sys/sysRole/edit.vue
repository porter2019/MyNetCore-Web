<template>
    <div>
        <page-main>
            <el-row>
                <el-col :md="24" :lg="12">
                    <el-form v-loading="formLoading" ref="formMain" :model="formData" status-icon :rules="formValidateRules" label-width="120px" class="form-edit">
                        <el-form-item label="组名" prop="RoleName">
                            <el-input type="text" v-model="formData.RoleName" clearable placeholder="请输入组名"></el-input>
                        </el-form-item>
                        <el-form-item label="描述" prop="Description">
                            <el-input type="textarea" v-model="formData.Description" :autosize="{ minRows: 3, maxRows: 5}" maxlength="200" show-word-limit clearable placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="超级用户组" prop="Status">
                            <el-switch v-model="formData.IsSuper" active-text="是" inactive-text="否">
                            </el-switch>
                        </el-form-item>
                        <el-form-item label="状态" prop="Status">
                            <el-switch v-model="formData.Status" active-text="启用" inactive-text="禁用">
                            </el-switch>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </page-main>

        <fixed-action-bar>
            <el-button icon="el-icon-check" type="primary" @click="saveFormData()" v-if="!formLoading">保存</el-button>
            <el-button icon="el-icon-back" @click="goBack()">返回</el-button>
        </fixed-action-bar>
    </div>
</template>

<script>
import { apiGetSysRoleInfo, apiModifySysRoleInfo, apiCheckRoleNameExists } from "@/api/sys/sysRole";

export default {
    data() {
        //组名异步网络校验
        var validateRoleName = (rule, value, callback) => {
            apiCheckRoleNameExists(this.id, value)
                .then((res) => {
                    if (res.code === 200) {
                        if (res.data) {
                            callback(new Error("该组名已存在!"));
                        } else {
                            callback();
                        }
                    } else {
                        callback(new Error("远程校验接口返回有误!"));
                    }
                })
                .catch(() => {
                    callback(new Error("服务器返回错误"));
                });
        };
        return {
            id: 0,
            formData: {},
            formLoading: true,
            //表单验证
            formValidateRules: {
                RoleName: [
                    { required: true, message: "请输入组名", trigger: "blur" },
                    { min: 1, max: 30, message: "组名长度范围在1-30之间" },
                    { validator: validateRoleName, trigger: "blur" },
                ],
            },
        };
    },
    created() {
        this.route = this.$route.query;
        if (this.route.id) this.id = this.$base64.DeCode(this.route.id);
        if (this.id < 0) this.goBack();

        this.loadFormData();
    },
    methods: {
        //加载表单数据
        loadFormData() {
            this.formLoading = true;
            apiGetSysRoleInfo(this.id)
                .then((res) => {
                    this.formLoading = false;
                    this.formData = res.data || {};
                })
                .catch(() => {
                    this.formLoading = false;
                });
        },
        saveFormData() {
            this.$refs.formMain.validate((valid) => {
                if (valid) {
                    this.formLoading = true;
                    apiModifySysRoleInfo(this.formData)
                        .then((res) => {
                            this.formLoading = false;
                            if (res.code === 200) {
                                this.$message.success("保存成功");
                                this.goBack();
                            } else {
                                this.$message.error(res.msg);
                            }
                        })
                        .catch(() => {
                            this.formLoading = false;
                            this.$message.error("远程通讯失败");
                        });
                } else {
                    this.$message.warning("请检查表单信息是否填写完整");
                }
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
