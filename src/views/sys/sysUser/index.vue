<template>
    <div>
        <page-header title="系统用户列表" content="" />
        
        <page-main>
            <div class="table-tool">
                <ul class="filter-container">
                    <li class="filter-item">
                        <label>采购单位名称：</label>
                        <el-input v-model="pageQuery.BuyerName" size="small" clearable placeholder="请输入采购单位名称"></el-input>
                    </li>
                </ul>
                <div class="btn-container">
                    <el-button class="btn-item" type="danger" size="small" icon="el-icon-delete">删除</el-button>
                    <el-button class="btn-item" type="primary" size="small" icon="el-icon-download">导出</el-button>
                </div>
            </div>
            <el-table v-loading="listLoading" ref="table" :data="pageListData" border fit style="width: 100%;" @sort-change="sortChange" @selection-change="changeSelectItem">
                <el-table-column label="用户ID" prop="userId" sortable="custom" min-width="80" fixed="left" header-align="center" align="left" show-overflow-tooltip></el-table-column>
                <el-table-column label="登录名" prop="loginName" sortable="custom" min-width="80" fixed="left" header-align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="用户名" prop="userName" min-width="100" header-align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="密码" prop="password" min-width="80" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="创建者" prop="createdUserName" min-width="50" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="创建时间" prop="createdDate" :formatter="(row,column,cellValue,index)=>$dateUtil.formatDate(cellValue)" sortable="custom" width="120" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="状态" prop="status" sortable="custom" min-width="50" align="center" fixed="right">
                    <template slot-scope="{row}">
                        <el-tag v-if="row.status" type="success" size="small" effect="light">正常</el-tag>
                        <el-tag v-else type="danger" size="small" effect="light">禁用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="160" align="center" fixed="right">
                    <template slot-scope="{row}">
                        <el-button type="primary" size="mini" @click="showT1005(row)">账户余额</el-button>
                        <el-button type="primary" size="mini" @click="show(row.Id)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination v-show="total>0" :total="total" :currentpage="pageQuery.PageOptions.PageIndex" :pagesize.sync="pageQuery.PageOptions.PageSize" @current-change="changePageIndex" @size-change="changePageSize" />
        </page-main>
    </div>
</template>

<script>
import { apiGetSysUserPageList } from "@/api/sys/sysUser";

export default {
    data() {
        return {
            pageListData: [],
            pageListSelectData: [],
            total: 0,
            listLoading: true,
            pageQuery: {
                PageOptions: {
                    PageIndex: 1,
                    PageSize: 20,
                },
                Type: 0,
            },
            searchRangeDate: "",
            pickerOptions: {
                shortcuts: [
                    {
                        text: "最近一周",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit("pick", [start, end]);
                        },
                    },
                    {
                        text: "最近一个月",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit("pick", [start, end]);
                        },
                    },
                    {
                        text: "最近三个月",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit("pick", [start, end]);
                        },
                    },
                    {
                        text: "最近半年",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
                            picker.$emit("pick", [start, end]);
                        },
                    },
                    {
                        text: "最近一年",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 360);
                            picker.$emit("pick", [start, end]);
                        },
                    },
                ],
            },
        };
    },
    created() {
        this.getPageList();
    },
    methods: {
        getPageList() {
            this.listLoading = true;
            apiGetSysUserPageList(this.pageQuery)
                .then((res) => {
                    this.listLoading = false;
                    this.pageListData = res.data;
                    this.total = res.total;
                })
                .catch(() => {
                    this.listLoading = false;
                });
        },
        searchDateChange(val) {
            if (!val) {
                this.pageQuery.StartDate = "";
                this.pageQuery.EndDate = "";
                this.pageQuery.PageOptions.PageIndex = 1;
                this.getPageList();
            } else {
                if (val.length == 2) {
                    this.pageQuery.StartDate = val[0];
                    this.pageQuery.EndDate = val[1];
                    this.pageQuery.PageOptions.PageIndex = 1;
                    this.getPageList();
                }
            }
        },
        sortChange(data) {
            this.pageQuery.PageOptions.PageIndex = 1;
            if (data.order != null) this.pageQuery.orderBy = data.prop + " " + data.order.replace("ending", "");
            else delete this.pageQuery["orderBy"];
            this.getPageList();
        },
        //行选中
        changeSelectItem(val) {
            this.pageListSelectData = val;
        },
        changePageIndex(index) {
            this.pageQuery.PageOptions.PageIndex = index;
            this.getPageList();
        },
        changePageSize(size) {
            this.pageQuery.PageOptions.PageSize = size;
            this.getPageList();
        },
    },
};
</script>

<style lang="scss" scoped>
.table-tool {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
}
.table-tool .filter-container {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
}
.table-tool .filter-container .filter-item {
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    margin-right: 20px;
}
</style>
