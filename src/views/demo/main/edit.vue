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

                        <el-form-item label="标题" prop="Title">
                            <el-input type="text" v-model="formData.Title" clearable placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="性别" prop="Sex">
                            <el-select v-model="formData.Sex" placeholder="请选择">
                                <el-option v-for="item in sexOptions" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
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
                        <el-form-item label="状态" prop="Status">
                            <el-switch v-model="formData.Status" active-text="启用" inactive-text="禁用">
                            </el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="数量" prop="Num">
                            <el-input type="text" v-model="formData.Num" clearable placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="可空数字" prop="Num2">
                            <el-input type="text" v-model="formData.Num2" clearable placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="双精度" prop="ValueD">
                            <el-input type="text" v-model="formData.ValueD" clearable placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="金额" prop="ValueDe">
                            <el-input type="text" v-model="formData.ValueDe" clearable placeholder="请输入">
                                <template slot="prepend">￥</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="日期" prop="Date1">
                            <el-date-picker v-model="formData.Date1" type="date" value-format="yyyy-MM-dd" :default-value="new Date()" placeholder="选择">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="日期时间" prop="Date2">
                            <el-date-picker v-model="formData.Date2" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :default-value="new Date()" placeholder="选择">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="可空时间" prop="Date3">
                            <el-date-picker v-model="formData.Date3" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :default-value="new Date()" placeholder="选择">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="描述" prop="Remark">
                            <el-input type="textarea" v-model="formData.Remark" :autosize="{ minRows: 3, maxRows: 5}" maxlength="200" show-word-limit clearable placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="富文本" prop="HtmlText">
                            <editor v-model="formData.HtmlText" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="图片列表">
                            <images-upload :files="formData.ImageList" @on-success="imageListUploadSuccess" />
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

            <page-main title="明细">
                <el-row class="dynamic-table-tools">
                    <el-button size="small" icon="el-icon-plus" @click="dynamicAdd">添加</el-button>
                    <el-button size="small" icon="el-icon-bottom" @click="dynamicInsert">插入</el-button>
                    <el-button size="small" icon="el-icon-delete" @click="dynamicDelete">删除</el-button>
                    <el-button size="small" icon="el-icon-delete-solid" @click="dynamicClear">清空</el-button>
                </el-row>
                <el-form ref="dynamicFormDataRef" :model="dynamicFormData">
                    <el-table ref="dynamicFormTableRef" :data="dynamicFormData.dynamicFormItems" :highlight-current-row="true" :row-class-name="dynamicFormItemsClassName" @row-click="dynamicFormItemsRowClick">
                        <el-table-column property="Name" label="姓名" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="'dynamicFormItems.' + scope.$index + '.Name'" :rules="dynamicTableValidateRule.Name">
                                    <el-input size="small" v-model="scope.row.Name"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="Sex" label="性别" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="'dynamicFormItems.' + scope.$index + '.Sex'">
                                    <el-select v-model="scope.row.Sex" placeholder="请选择">
                                        <el-option v-for="item in sexOptions" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="Num" label="数量" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop=" 'dynamicFormItems.' + scope.$index + '.Num' " :rules="dynamicTableValidateRule.Num">
                                    <el-input class="money-right" size="small" v-model="scope.row.Num" @input="calcItem(scope)"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="ValueDe" label="金额" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop=" 'dynamicFormItems.' + scope.$index + '.ValueDe' " :rules="dynamicTableValidateRule.ValueDe">
                                    <el-input class="money-right" size="small" v-model="scope.row.ValueDe" @input="calcItem(scope)"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="TotalValue" label="总金额" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop=" 'dynamicFormItems.' + scope.$index + '.TotalValue' " :rules="dynamicTableValidateRule.TotalValue">
                                    <el-input class="money-right" size="small" v-model="scope.row.TotalValue" :readonly="true"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="Date1" label="日期" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop=" 'dynamicFormItems.' + scope.$index + '.Date1' " :rules="dynamicTableValidateRule.Date1">
                                    <el-date-picker v-model="scope.row.Date1" type="date" value-format="yyyy-MM-dd" :default-value="new Date()" placeholder="选择">
                                    </el-date-picker>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="Remark" label="备注" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="'dynamicFormItems.' + scope.$index + '.Remark'" :rules="dynamicTableValidateRule.Remark">
                                    <el-input size="small" v-model="scope.row.Remark"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form>
            </page-main>

        </page-main>

        <fixed-action-bar>
            <el-button icon="el-icon-check" type="primary" @click="saveFormData()" v-if="!formLoading">保存</el-button>
            <el-button icon="el-icon-back" @click="goBack()">返回</el-button>
        </fixed-action-bar>
    </div>
</template>

<script>
import { apiGetDemoMainInfo, apiModifyDemoMainInfo } from "@/api/demo/main";

export default {
    data() {
        return {
            id: 0,
            pageTitle: "添加",
            formData: {},
            formLoading: true,
            //表单验证
            formValidateRules: {
                Title: [
                    { required: true, message: "请输入标题", trigger: "blur" },
                    { min: 1, max: 30, message: "标题长度范围在1-30之间" },
                ],
                Sex: [{ required: true, message: "请选择", trigger: "change" }],
                Num: [
                    { required: true, message: "请输入", trigger: "blur" },
                    { pattern: this.$global.RegEx_Number, message: "只能输入正整数" },
                ],
                ValueDe: [
                    { required: true, message: "请输入", trigger: "blur" },
                    { pattern: this.$global.RegEx_Money, message: "只能输入金额" },
                ],
            },

            sexOptions: [
                {
                    value: 0,
                    label: "未知",
                },
                {
                    value: 1,
                    label: "男",
                },
                {
                    value: 2,
                    label: "女",
                },
            ],

            //动态表格
            dynamicFormData: {
                dynamicFormItems: [], //明细数据
            },
            dynamicFormItemsRowIndex: 0, //表格选中的行索引

            dynamicTableValidateRule: {
                Name: [
                    { required: true, message: "请输入", trigger: "blur" },
                    { min: 1, max: 30, message: "标题长度范围在1-20之间" },
                ],
                Num: [
                    { required: true, message: "请输入", trigger: "blur" },
                    { pattern: this.$global.RegEx_Number, message: "只能输入正整数" },
                ],
                ValueDe: [
                    { required: true, message: "请输入", trigger: "blur" },
                    { pattern: this.$global.RegEx_Money, message: "只能输入金额" },
                ],
                TotalValue: [
                    { required: true, message: "请输入", trigger: "blur" },
                    { pattern: this.$global.RegEx_Money, message: "只能输入金额" },
                ],
                Date1: [{ required: true, message: "请输入", trigger: ["blur", "change"] }],
            },
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
        //加载表单数据
        loadFormData() {
            this.formLoading = true;
            apiGetDemoMainInfo(this.id)
                .then((res) => {
                    this.formLoading = false;
                    this.formData = res.data || {};
                    if (this.formData.ImagePath) {
                        this.imageWebPath = process.env.VUE_APP_Attach_ROOT + this.formData.ImagePath;
                    }
                    if (this.formData.Attachs == null) {
                        this.formData.Attachs = [];
                    }
                    //给动态表格复制
                    this.dynamicFormData.dynamicFormItems = this.formData.Items || [];
                })
                .catch(() => {
                    this.formLoading = false;
                });
        },
        saveFormData() {
            console.log(this.formData);
            if ((this.dynamicFormData.dynamicFormItems || []).length < 1) {
                this.$message.warning("明细不能为空");
                return;
            }
            if ((this.dynamicFormData.dynamicFormItems || []).length > 0) {
                let tableFormIsValid = false;
                this.$refs.dynamicFormDataRef.validate((valid) => {
                    tableFormIsValid = valid;
                });
                if (!tableFormIsValid) {
                    this.$message.warning("请检查明细是否都准确的填写完毕");
                    return;
                }
            }
            this.$refs.formMain.validate((valid) => {
                if (valid) {
                    this.formLoading = true;
                    // let postData = JSON.parse(JSON.stringify(this.formData)); //对象拷贝
                    // postData.Items = this.dynamicFormData.dynamicFormItems || [];
                    apiModifyDemoMainInfo(this.formData)
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
        //动态表格
        dynamicFormItemsClassName({ row, rowIndex }) {
            //把每一行的索引放进row
            row.index = rowIndex;
        },
        //行点击
        dynamicFormItemsRowClick(row, column, event) {
            this.dynamicFormItemsRowIndex = row.index;
        },
        //添加一列
        dynamicAdd() {
            this.dynamicFormData.dynamicFormItems.push({ Name: "", Sex: 0, Num: 2, ValueDe: 0.0, TotalValue: 0.0, Date1: "2021-03-30", Remark: "默认值" });
        },
        //插入一列
        dynamicInsert() {
            this.dynamicFormData.dynamicFormItems.splice(this.dynamicFormItemsRowIndex, 0, { Name: "", Sex: 0, Num: 2, ValueDe: 0.0, TotalValue: 0.0, Date1: "2021-03-30", Remark: "默认值" });
        },
        //删除列
        dynamicDelete() {
            if ((this.dynamicFormData.dynamicFormItems || []).length == 0) {
                this.$message.info("表格中没有任何数据");
                return;
            }
            this.dynamicFormData.dynamicFormItems.splice(this.dynamicFormItemsRowIndex, 1);
            this.$refs["dynamicFormDataRef"].clearValidate();
        },
        //清空表格
        dynamicClear() {
            if ((this.dynamicFormData.dynamicFormItems || []).length == 0) {
                this.$message.info("表格中没有任何数据");
                return;
            }
            this.$confirm("确定清空列表中的数据吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.dynamicFormData.dynamicFormItems.splice(0, this.dynamicFormData.dynamicFormItems.length);
                })
                .catch(() => {});
        },
        calcItem(scope) {
            let num = Number(scope.row.Num); // 数量
            let value = Number(scope.row.ValueDe); //单价
            let totalValue = this.$mathUtil.multiply(num, value, 2);
            scope.row.TotalValue = totalValue;
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
        imageListUploadSuccess(res, file) {
            console.log(res);
            if (res.code === 200) {
                if ((res.data || []).length > 0) {
                    this.formData.ImageList.push({
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
                this.formData.ImageList.pop();
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