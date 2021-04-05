<template>
    <div>
        <el-row :gutter="20" style="margin: 0 10px;">
            <el-col :span="6">
                <page-main title="分类" style="margin: 0;">
                    <div class="table-tool">
                        <ul class="filter-container">
                            <li class="filter-item">
                                <el-input v-model="searchTitle" size="small" clearable placeholder="请输入" @change="formData = {}, getTreeList()"></el-input>
                            </li>
                        </ul>
                    </div>
                    <el-tree :data="treeListData" v-loading="treeListLoading" :default-expand-all="true" :props="treeProps" @node-click="treeNodeClick" empty-text="暂无数据"></el-tree>
                </page-main>
            </el-col>
            <el-col :span="18">
                <page-main title="详情" style="margin: 0;">
                    <div class="table-tool">
                        <div class="btn-container">
                            <el-button v-auth="['bookCategory.modify']" class="btn-item" type="primary" size="small" icon="el-icon-plus" @click="goModify(0)">添加</el-button>
                            <el-button v-if="formData.Id" v-auth="'bookCategory.modify'" class="btn-item" type="primary" size="small" icon="el-icon-edit" @click="goModify(-1)">编辑</el-button>
                            <el-button v-if="formData.Id" v-auth="'bookCategory.delete'" class="btn-item" type="danger" size="small" icon="el-icon-delete" @click="del">删除</el-button>
                        </div>
                    </div>
                    <el-form v-if="formData.Id" ref="formMain" :model="formData" label-width="140px" class="form-show">
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="标题">
                                    {{ formData.Title }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="排序数字">
                                    {{ formData.OrderNo }}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="上级标题">
                                    {{ formData.ParentTitle }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="层级">
                                    {{ formData.LevelNo }}
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
                    <span v-else style="display: block; text-align: center; margin-top: 150px; color: #606266;">点击左侧树以查看详情</span>
                </page-main>
            </el-col>
        </el-row>

    </div>
</template>

<script>
import { apiDeleteBookCategoryById, apiGetBookCategoryTreeList } from "@/api/demo/bookCategory";

export default {
    data() {
        return {
            treeListData: [],
            searchTitle: "",
            treeListLoading: true,
            treeProps: {
                children: "Childs",
                label: "Title",
            },

            formData: {},
        };
    },
    created() {
        this.getTreeList();
    },
    methods: {
        treeNodeClick(data) {
            this.formData = data;
        },
        getTreeList() {
            this.treeListLoading = true;
            apiGetBookCategoryTreeList(this.searchTitle)
                .then((res) => {
                    this.treeListLoading = false;
                    if (res.code === 200) {
                        this.treeListData = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch(() => {
                    this.treeListLoading = false;
                });
        },
        del() {
            this.$confirm("确定删除【" + this.formData.Title + "】吗，将会同时删除下数据下的所有子数据？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    apiDeleteBookCategoryById(this.formData.Id)
                        .then((res) => {
                            if (res.code === 200) {
                                this.$message.success(res.msg);
                                this.getTreeList();
                            } else {
                                this.$message.error(res.msg);
                            }
                        })
                        .catch(() => {
                            this.$message.error("远程通讯失败");
                        });
                })
                .catch(() => {});
        },
        goModify(id) {
            if (this.formData.Id && id < 0) {
                id = this.formData.Id;
            }
            this.$router.push({
                path: "edit",
                query: { id: this.$base64.EnCode(id) },
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.page-main {
    min-height: 640px;
}
</style>