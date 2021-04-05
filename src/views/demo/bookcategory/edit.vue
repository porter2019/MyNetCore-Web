<template>
    <div>
        <page-main :title="pageTitle">
            <el-form v-loading="formLoading" ref="formMain" :model="formData" status-icon :rules="formValidateRules" label-width="140px" class="form-edit">
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="父级" prop="Parent">
                            <el-input type="text" v-model="formData.Parent.Title" readonly placeholder="请选择">
                                <el-button slot="append" @click="btnSelectParent">选择</el-button>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="标题" prop="Title">
                            <el-input type="text" v-model="formData.Title" clearable placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="排序数字" prop="OrderNo">
                            <el-input type="text" v-model="formData.OrderNo" clearable placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </page-main>

        <fixed-action-bar>
            <el-button icon="el-icon-check" type="primary" @click="saveFormData()" v-if="!formLoading">保存</el-button>
            <el-button icon="el-icon-back" @click="goBack()">返回</el-button>
        </fixed-action-bar>

        <el-dialog title="选择父级" :visible.sync="parentTreeDialogVisible" width="40%" @close="parentTreeDialogVisible=false" :destroy-on-close="true">
            <el-input v-model="searchTitle" size="small" clearable placeholder="请输入" @change="getTreeList()"></el-input>
            <el-tree :data="treeListData" ref="tree" node-key="Id" :check-strictly="true" show-checkbox :default-expand-all="true" :props="treeProps" @check-change="treeCheckChange"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button class="determine" type="primary" @click="confirmCurrentNode" size="small">确定</el-button>
                <el-button class="cancel" @click="parentTreeDialogVisible=false" size="small">取消</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import { apiGetBookCategoryInfo, apiModifyBookCategoryInfo, apiGetBookCategoryTreeList } from "@/api/demo/bookCategory";

export default {
    data() {
        return {
            id: 0,
            pageTitle: "添加",
            formData: { Parent: { Title: "" } },
            formLoading: true,
            //表单验证
            formValidateRules: {
                Title: [
                    { required: true, message: "请输入标题", trigger: "blur" },
                    { min: 1, max: 30, message: "标题长度范围在1-30之间" },
                ],
                OrderNo: [
                    { required: true, message: "请输入排序数字", trigger: "blur" },
                    { pattern: this.$global.RegEx_Number, message: "只能输入数字" },
                ],
            },

            parentTreeDialogVisible: false,
            treeListData: [],
            searchTitle: "",
            treeListLoading: true,
            treeProps: {
                children: "Childs",
                label: "Title",
            },
            currentCheckId: 0,
            currentCheckTitle: "",
        };
    },
    created() {
        this.route = this.$route.query;
        if (this.route.id) this.id = this.$base64.DeCode(this.route.id);
        if (this.id < 0) this.goBack();

        if (this.id > 0) this.pageTitle = "编辑";

        this.loadFormData();
    },
    methods: {
        btnSelectParent() {
            this.parentTreeDialogVisible = true;
            this.currentCheckId = 0;
            this.currentCheckTitle = "";
            this.treeListData = [];
            this.getTreeList();
        },
        treeCheckChange(data, checked, indeterminate) {
            if (checked) {
                this.$refs.tree.setCheckedKeys([data.Id], true);
                this.currentCheckId = data.Id;
                this.currentCheckTitle = data.Title;
            }
        },
        confirmCurrentNode() {
            if (this.formData.Id > 0) {
                if (this.currentCheckId == this.formData.Id) {
                    this.$message.warning("不能设置自己为父级");
                    return;
                }
            }
            this.formData.ParentId = this.currentCheckId;
            this.formData.Parent.Title = this.currentCheckTitle;
            this.parentTreeDialogVisible = false;
        },
        getTreeList() {
            this.treeListLoading = true;
            apiGetBookCategoryTreeList(this.searchTitle)
                .then((res) => {
                    this.treeListLoading = false;
                    if (res.code === 200) {
                        this.treeListData = res.data;
                        if (this.formData.ParentId > 0) {
                            this.$refs.tree.setCheckedKeys([this.formData.ParentId], true);
                        }
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch(() => {
                    this.treeListLoading = false;
                });
        },
        //加载表单数据
        loadFormData() {
            this.formLoading = true;
            apiGetBookCategoryInfo(this.id)
                .then((res) => {
                    this.formLoading = false;
                    this.formData = res.data || {};
                    if (!this.formData.Parent) {
                        this.formData.Parent = { Title: "" };
                    }
                })
                .catch(() => {
                    this.formLoading = false;
                });
        },
        saveFormData() {
            this.$refs.formMain.validate((valid) => {
                if (valid) {
                    this.formLoading = true;
                    apiModifyBookCategoryInfo(this.formData)
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
