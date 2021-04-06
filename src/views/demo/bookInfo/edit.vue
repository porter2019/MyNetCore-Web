<template>
    <div>
        <page-main :title="pageTitle">
            <el-form v-loading="formLoading" ref="formMain" :model="formData" status-icon :rules="formValidateRules" label-width="140px" class="form-edit">
                <el-row v-show="false">
                    <el-col>
                        <el-input type="hidden" v-model="formData.ImagePath"></el-input>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="名称" prop="Name">
                            <el-input type="text" v-model="formData.Name" clearable placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="分类" prop="CategoryName">
                            <el-input type="text" v-model="formData.CategoryName" readonly placeholder="请选择">
                                <el-button slot="append" @click="btnSelectCategory">选择</el-button>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="出版日期" prop="ReleaseDate">
                            <el-date-picker v-model="formData.ReleaseDate" type="date" value-format="yyyy-MM-dd" :default-value="new Date()" placeholder="选择">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="图片">
                            <image-upload :url.sync="formData.ImagePathFull" :data="{'tag':'images'}" @on-success="imageUploadSuccess" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="附件">
                            <file-upload :files="formData.Attachs" @on-success="attachUploadSuccess" />
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
        </page-main>

        <fixed-action-bar>
            <el-button icon="el-icon-check" type="primary" @click="saveFormData()" v-if="!formLoading">保存</el-button>
            <el-button icon="el-icon-back" @click="goBack()">返回</el-button>
        </fixed-action-bar>

        <el-dialog title="选择分类" :visible.sync="parentTreeDialogVisible" width="40%" @close="parentTreeDialogVisible=false" :destroy-on-close="true">
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
import { apiGetBookInfoInfo, apiModifyBookInfoInfo } from "@/api/demo/bookInfo";
import {apiGetBookCategoryTreeList } from "@/api/demo/bookCategory";

export default {
    data() {
        return {
            id: 0,
            pageTitle: "添加",
            formData: {},
            formLoading: true,
            //表单验证
            formValidateRules: {
                Name: [
                    { required: true, message: "请输入名称", trigger: "blur" },
                    { min: 1, max: 30, message: "名称长度范围在1-30之间" },
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
        btnSelectCategory() {
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
            this.formData.CategoryId = this.currentCheckId;
            this.formData.CategoryName = this.currentCheckTitle;
            this.parentTreeDialogVisible = false;
        },
        getTreeList() {
            this.treeListLoading = true;
            apiGetBookCategoryTreeList(this.searchTitle)
                .then((res) => {
                    this.treeListLoading = false;
                    if (res.code === 200) {
                        this.treeListData = res.data;
                        if (this.formData.CategoryId > 0) {
                            this.$refs.tree.setCheckedKeys([this.formData.CategoryId], true);
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
            apiGetBookInfoInfo(this.id)
                .then((res) => {
                    this.formLoading = false;
                    this.formData = res.data || {};
                    if (this.formData.ImagePath) {
                        this.imageWebPath = process.env.VUE_APP_Attach_ROOT + this.formData.ImagePath;
                    }
                    if (this.formData.Attachs == null) {
                        this.formData.Attachs = [];
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
                    apiModifyBookInfoInfo(this.formData)
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

        //上传
        imageUploadSuccess(res) {
            if (res.code === 200) {
                if ((res.data || []).length > 0) {
                    this.formData.ImagePathFull = res.data[0].FileWebPath;
                    this.formData.ImagePath = res.data[0].FilePath;
                } else {
                    this.$message.error("上传成功，但是没有返回上传后的文件");
                }
            } else {
                this.$message.error(res.msg);
            }
        },

        attachUploadSuccess(res, file) {
            if (res.code === 200) {
                if ((res.data || []).length > 0) {
                    this.formData.Attachs.push({
                        FileExt: res.data[0].FileExt,
                        FileName: res.data[0].FileName,
                        FilePath: res.data[0].FilePath,
                        FileSize: res.data[0].FileSize,
                        FileType: res.data[0].FileType,
                        FileWebPath: res.data[0].FileWebPath,
                        name: res.data[0].FileSourceName,
                        url: res.data[0].FileWebPath,
                    });
                } else {
                    this.$message.error("上传成功，但是没有返回上传后的文件");
                }
            } else {
                this.$message.error(res.msg);
                this.formData.Attachs.pop();
            }
        },
    },
};
</script>