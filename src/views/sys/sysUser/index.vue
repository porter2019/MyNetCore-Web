<template>
    <div>
        <!-- <page-header title="系统用户列表" content="" /> -->

        <page-main>
            <div class="table-tool">
                <ul class="filter-container">
                    <li class="filter-item">
                        <label>所属组</label>
                        <el-select v-model="pageQuery.RoleId" clearable placeholder="请选择" @change="pageQuery.PageInfo.PageIndex=1;getPageList()" @clear="delete pageQuery['RoleId']">
                            <el-option v-for="item in roleOptionList" :key="item.RoleId" :label="item.RoleName" :value="item.RoleId">
                            </el-option>
                        </el-select>
                    </li>
                    <li class="filter-item">
                        <label>登录名</label>
                        <el-input v-model="pageQuery.LoginName" size="small" clearable placeholder="请输入" @change="pageQuery.PageInfo.PageIndex=1;getPageList()"></el-input>
                    </li>
                    <li class="filter-item">
                        <label>用户名</label>
                        <el-input v-model="pageQuery.UserName" size="small" clearable placeholder="请输入" @change="pageQuery.PageInfo.PageIndex=1;getPageList()"></el-input>
                    </li>
                    <li class="filter-item">
                        <label>更新日期</label>
                        <el-date-picker v-model="searchRangeDate" size="small" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions" @change="searchDateChange"></el-date-picker>
                    </li>
                </ul>
                <div class="btn-container">
                    <el-button v-auth="['sysUser.modify']" class="btn-item" type="primary" size="small" icon="el-icon-plus" @click="modify()">添加</el-button>
                    <el-button v-auth="'sysUser.delete'" class="btn-item" type="danger" size="small" icon="el-icon-delete" @click="del">删除</el-button>
                </div>
            </div>
            <el-table v-loading="listLoading" ref="table" :data="pageListData" border fit style="width: 100%;" height="calc(100vh - 280px)" @sort-change="sortChange" @selection-change="changeSelectItem">
                <!--列太少就不要用fixed-->
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column label="登录名" prop="LoginName" sortable="custom" min-width="70" align="center" header-align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="用户名" prop="UserName" min-width="70" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="所属组" prop="RoleInfo" min-width="140" align="center" show-overflow-tooltip>
                    <template slot-scope="{row}">
                        {{ formatRoleInfo(row.RoleInfo) }}
                    </template>
                </el-table-column>
                <el-table-column label="更新时间" prop="UpdatedDate1" sortable="custom" width="160" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="更新者" prop="UpdatedUserName" min-width="60" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="状态" prop="Status" sortable="custom" width="100" align="center">
                    <template slot-scope="{row}">
                        <el-tag v-if="row.Status" type="success" size="small" effect="light">正常</el-tag>
                        <el-tag v-else type="danger" size="small" effect="light">禁用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120" align="center">
                    <template slot-scope="{row}">
                        <el-button type="primary" size="mini" @click="show(row.Id)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination v-show="total>0" :total="total" :currentpage="pageQuery.PageInfo.PageIndex" :pagesize.sync="pageQuery.PageInfo.PageSize" @current-change="changePageIndex" @size-change="changePageSize" />
        </page-main>
    </div>
</template>

<script>
import { apiGetSysUserPageList, apiDeleteSysUserByIds } from "@/api/sys/sysUser";
import { apiGetSysRoleAllList } from "@/api/sys/sysRole";

export default {
    data() {
        return {
            pageListData: [],
            pageListSelectData: [],
            total: 0,
            listLoading: true,
            pageQuery: {
                PageInfo: {
                    PageIndex: 1,
                    PageSize: 20,
                },
            },
            searchRangeDate: "",
            pickerOptions: this.$global.DataPickShortcuts,

            //组数据
            roleOptionList: [],
        };
    },
    created() {
        this.getPageList();
        this.loadRoleList();
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
        getPageList() {
            this.listLoading = true;
            apiGetSysUserPageList(this.pageQuery)
                .then((res) => {
                    this.listLoading = false;
                    if (res.code === 200) {
                        this.pageListData = res.data;
                        this.total = res.total;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch(() => {
                    this.listLoading = false;
                });
        },
        //下拉列表数据
        loadRoleList() {
            apiGetSysRoleAllList()
                .then((res) => {
                    if (res.code === 200) {
                        this.roleOptionList = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch(() => {
                    this.$message.error("获取用户组数据失败");
                });
        },
        modify(id) {
            if (!id) {
                id = 0;
            }
            this.$router.push({
                path: "edit",
                query: { id: this.$base64.EnCode(id) },
            });
        },
        show(id) {
            this.$router.push({
                path: "show",
                query: { id: this.$base64.EnCode(id) },
            });
        },
        del() {
            var ids = [];
            this.pageListSelectData.forEach((item) => {
                ids.push(item.Id);
            });
            if (ids.length < 1) {
                this.$message.warning("请先选择需要删除的数据！");
                return;
            }

            this.$confirm("确定删除选中的数据吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    apiDeleteSysUserByIds(ids.join(",")).then((res) => {
                        if (res.code === 200) {
                            this.$message.success(res.msg);
                            this.pageQuery.PageInfo.PageIndex = 1;
                            this.getPageList();
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
                })
                .catch(() => {
                    this.$message.error("远程通讯失败");
                });
        },
        searchDateChange(val) {
            if (!val) {
                this.pageQuery.UpdatedDate = "";
                this.pageQuery.PageInfo.PageIndex = 1;
                this.getPageList();
            } else {
                if (val.length == 2) {
                    this.pageQuery.UpdatedDate = val[0] + ";" + val[1];
                    this.pageQuery.PageInfo.PageIndex = 1;
                    this.getPageList();
                }
            }
        },
        sortChange(data) {
            this.pageQuery.PageInfo.PageIndex = 1;
            if (data.order != null) {
                let orderColumn = data.prop + "";
                let columnMap = new Map();
                columnMap.set("UpdatedDate1", "UpdatedDate");
                if (columnMap.has(data.prop)) {
                    orderColumn = columnMap.get(data.prop);
                }
                this.pageQuery.PageInfo.orderBy = orderColumn + " " + data.order.replace("ending", "");
            } else {
                delete this.pageQuery.PageInfo["orderBy"];
            }
            this.getPageList();
        },
        //行选中
        changeSelectItem(val) {
            this.pageListSelectData = val;
        },
        changePageIndex(index) {
            this.pageQuery.PageInfo.PageIndex = index;
            this.getPageList();
        },
        changePageSize(size) {
            this.pageQuery.PageInfo.PageSize = size;
            this.getPageList();
        },
    },
};
</script>