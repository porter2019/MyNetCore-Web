<template>
    <div>
        <page-main>
            <el-row>
                <el-col :md="24" :lg="12">
                    <el-form v-loading="formLoading" ref="formMain" :model="formData" status-icon :rules="formValidateRules" label-width="120px" class="form-edit">
                        <el-form-item label="登录名" prop="LoginName">
                            <el-input type="text" v-model="formData.LoginName" clearable placeholder="请输入登录名"></el-input>
                        </el-form-item>
                        <el-form-item label="用户名" prop="UserName">
                            <el-input type="text" v-model="formData.UserName" clearable placeholder="请输入用户名"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="Password">
                            <el-input type="password" v-model="formData.Password" clearable placeholder="请输入密码"></el-input>
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
            <el-button icon="el-icon-check" type="primary" @click="saveFormData()">保存</el-button>
            <el-button icon="el-icon-back" @click="goBack()">返回</el-button>
        </fixed-action-bar>
    </div>
</template>

<script>
import { apiGetSysUserInfo, apiModifySysUserInfo, apiCheckLoginNameExists } from "@/api/sys/sysUser";

export default {
    data() {
        //登录名异步网络校验
        var validateLoginName = (rule, value, callback) => {
            apiCheckLoginNameExists(this.id, value)
                .then((res) => {
                    if (res.code === 200) {
                        if (res.data) {
                            callback(new Error("该账户已存在!"));
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
                LoginName: [
                    { required: true, message: "请输入登录名", trigger: "blur" },
                    { min: 1, max: 20, message: "登录名长度范围在1-20之间" },
                    { pattern: this.$global.RegEx_AccountName, message: "只能由数字、字母、下划线组成" },
                    { validator: validateLoginName, trigger: "blur" },
                ],
                UserName: [
                    { required: true, message: "请输入用户名", trigger: "blur" },
                    { min: 1, max: 20, message: "用户名长度范围在1-20之间" },
                ],
                Password: [
                    { required: true, message: "请输入密码", trigger: "blur" },
                    { min: 3, max: 30, message: "密码长度范围在3-30之间" },
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
            apiGetSysUserInfo(this.id)
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
                    apiModifySysUserInfo(this.formData)
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
