<template>
    <div>
        <page-main title="详情">
            <el-form v-loading="formLoading" ref="formMain" :model="formData" label-width="140px" class="form-show">
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="标题">
                            {{ formData.Title }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="性别">
                            {{ formData.SexText }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="图片">
                            <image-preview v-if="formData.ImagePathFull" :src="formData.ImagePathFull" :width="100" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="状态">
                            {{ formData.Status ? "正常":"禁用" }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="数量">
                            {{ formData.Num }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="可空数字">
                            {{ formData.Num2 }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="双精度">
                            {{ $numberUtil.formatMoney(formData.ValueD) }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="金额">
                            {{ $numberUtil.formatMoney(formData.ValueDe) }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="日期">
                            {{ $dateUtil.formatDate(formData.Date1) }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="日期时间">
                            {{ formData.Date2 }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="可空时间">
                            {{ formData.Date3 }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="描述">
                            {{ formData.Remark }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="富文本">
                            <div v-html="formData.HtmlText"></div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="图片列表">
                            <ImagesPreview :attachList="(formData.ImageList || [])" :width="100"></ImagesPreview>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="附件">
                            <FilePreview :attachList="(formData.Attachs || [])"></FilePreview>
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

            <page-main title="明细">
                <el-form ref="dynamicFormDataRef" :model="dynamicFormData">
                    <el-table ref="dynamicFormTableRef" :data="dynamicFormData.dynamicFormItems" :highlight-current-row="true" :row-class-name="dynamicFormItemsClassName" @row-click="dynamicFormItemsRowClick">
                        <!-- <el-table-column property="Name" label="姓名" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="'dynamicFormItems.' + scope.$index + '.Name'" :rules="dynamicTableValidateRule.Name">
                                    <el-input size="small" v-model="scope.row.Name"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column> -->
                        <el-table-column label="姓名" prop="Name" min-width="80" align="center" header-align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column label="性别" prop="Sex" min-width="80" align="center" header-align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column label="数量" prop="Num" min-width="80" align="center" header-align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column label="金额" prop="ValueDe" min-width="80" align="center" header-align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column label="总金额" prop="TotalValue" min-width="80" align="center" header-align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column label="日期" prop="Date1":formatter="(row,column,cellValue,index)=>$dateUtil.formatDate(cellValue)" min-width="80" align="center" header-align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column label="备注" prop="Remark" min-width="80" align="center" header-align="center" show-overflow-tooltip></el-table-column>
                    </el-table>
                </el-form>
            </page-main>

        </page-main>

        <fixed-action-bar>
            <el-button v-auth="'demoMain.modify'" icon="el-icon-edit" type="primary" @click="goModify()" v-if="id > 0 && !formLoading">编辑</el-button>
            <el-button icon="el-icon-back" @click="goBack()">返回</el-button>
        </fixed-action-bar>
    </div>
</template>

<script>
import { apiGetDemoMainInfo } from "@/api/demo/main";

export default {
    data() {
        return {
            id: 0,
            formData: {},
            formLoading: true,

            //动态表格
            dynamicFormData: {
                dynamicFormItems: [], //明细数据
            },
            dynamicFormItemsRowIndex: 0, //表格选中的行索引
            dynamicTableValidateRule: {},
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
            apiGetDemoMainInfo(this.id)
                .then((res) => {
                    this.formLoading = false;
                    this.formData = res.data;
                    //给动态表格复制
                    this.dynamicFormData.dynamicFormItems = this.formData.Items || [];
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
        //动态表格
        dynamicFormItemsClassName({ row, rowIndex }) {
            //把每一行的索引放进row
            row.index = rowIndex;
        },
        //行点击
        dynamicFormItemsRowClick(row, column, event) {
            this.dynamicFormItemsRowIndex = row.index;
        },
    },
};
</script>
