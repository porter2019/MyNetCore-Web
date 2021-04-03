<template>
    <div>
        <!-- <page-header title="系统用户列表" content="" /> -->

        <page-main>
            <div class="table-tool">
                <ul class="filter-container">
                    <li class="filter-item">
                        <label>用户组名</label>
                        <el-input v-model="pageQuery.RoleName" size="small" clearable placeholder="请输入" @change="pageQuery.PageInfo.PageIndex=1;getPageList()"></el-input>
                    </li>
                    <li class="filter-item">
                        <label class="aaa">创建日期</label>
                        <el-date-picker v-model="searchRangeDate" size="small" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions" @change="searchDateChange"></el-date-picker>
                    </li>
                </ul>
                <div class="btn-container">
                    <el-button v-auth="['sysRole.modify']" class="btn-item" type="primary" size="small" icon="el-icon-plus" @click="modify()">添加</el-button>
                    <el-button v-auth="'sysRole.delete'" class="btn-item" type="danger" size="small" icon="el-icon-delete" @click="del">删除</el-button>
                </div>
            </div>
            <el-table v-loading="listLoading" ref="table" :data="pageListData" border fit style="width: 100%;" height="calc(100vh - 280px)" @sort-change="sortChange" @selection-change="changeSelectItem">
                <!--列太少就不要用fixed-->
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column label="用户组名称" prop="RoleName" sortable="custom" min-width="70" align="center" header-align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="描述" prop="Description" min-width="120" align="center" header-align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="超级管理组" prop="IsSuper" sortable="custom" width="120" align="center">
                    <template slot-scope="{row}">
                        <el-tag v-if="row.IsSuper" type="success" size="small" effect="light">是</el-tag>
                        <el-tag v-else type="info" size="small" effect="light">否</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="创建者" prop="CreatedUserName" min-width="60" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="创建时间" prop="CreatedDate1" sortable="custom" width="160" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="状态" prop="Status" sortable="custom" width="100" align="center">
                    <template slot-scope="{row}">
                        <el-tag v-if="row.Status" type="success" size="small" effect="light">正常</el-tag>
                        <el-tag v-else type="danger" size="small" effect="light">禁用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="{row}">
                        <el-button v-auth="'sysRole.modify'" type="success" v-if="!row.IsSuper" size="mini" @click="openPermitDialog(row.RoleId)">设置权限</el-button>
                        <el-button type="primary" size="mini" @click="show(row.Id)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination v-show="total>0" :total="total" :currentpage="pageQuery.PageInfo.PageIndex" :pagesize.sync="pageQuery.PageInfo.PageSize" @current-change="changePageIndex" @size-change="changePageSize" />
        </page-main>

        <!-- 设置权限弹窗 -->
        <el-dialog title="设置权限" v-loading="permitLoading" :visible.sync="permitDialogVisible" width="80%" @close="closePermitDialog" :destroy-on-close="true">
            <el-table class="power" :data="permitDataTable" v-if="(permitData || []).length > 0" border style="width: 100%;" :span-method="objectSpanMethod">
                <el-table-column property="ModuleName" class="powerLeft" width="130px" align="center" label="所属模块"></el-table-column>
                <el-table-column width="130" property="HandlerName" align="center" label="功能菜单"></el-table-column>
                <el-table-column property="PermitList" align="left" label="操作">
                    <template slot-scope="scope">
                        <el-checkbox v-for="(item,index) in scope.row.PermitList" @change="permitCheckBoxChange(item)" v-model="item.IsChecked" :label="item.PermitId" :key="index">{{item.PermitName}}</el-checkbox>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button class="determine" type="primary" @click="modifyPermit" size="small" v-if="!permitLoading">确定</el-button>
                <el-button class="cancel" @click="closePermitDialog" size="small">取消</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import { apiGetSysRolePageList, apiDeleteSysRoleByIds, apiGetRolePermitList, apiModifyRolePermit } from "@/api/sys/sysRole";

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

            //设置权限相关
            permitLoading: true,
            permitDialogVisible: false,
            permitData: [],
            permitDataTable: [],
            permitResult: [], //默认选中数据
            checkShow: false,
            rowspan: "",

            roleId: "",
        };
    },
    created() {
        this.getPageList();
    },
    methods: {
        getPageList() {
            this.listLoading = true;
            apiGetSysRolePageList(this.pageQuery)
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
                    apiDeleteSysRoleByIds(ids.join(","))
                        .then((res) => {
                            if (res.code === 200) {
                                this.$message.success(res.msg);
                                this.pageQuery.PageInfo.PageIndex = 1;
                                this.getPageList();
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
        searchDateChange(val) {
            if (!val) {
                this.pageQuery.CreatedDate = "";
                this.pageQuery.PageInfo.PageIndex = 1;
                this.getPageList();
            } else {
                if (val.length == 2) {
                    this.pageQuery.CreatedDate = val[0] + ";" + val[1];
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
                columnMap.set("CreatedDate1", "CreatedDate");
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
        //下面都是设置权限相关
        openPermitDialog(roleId) {
            this.roleId = roleId;
            this.permitDialogVisible = true;
            this.permitLoading = true;
            apiGetRolePermitList(roleId)
                .then((res) => {
                    this.permitLoading = false;
                    if (res.code === 200) {
                        this.permitData = res.data;
                        let arr = [];
                        let rowspan = [];
                        this.permitData.forEach((item) => {
                            for (let i = 0; i < item.HandlerList.length; i++) {
                                let rdata = {
                                    ...item,
                                    ...item.HandlerList[i],
                                };
                                rdata.combineNum = item.HandlerList.length; //长度
                                delete rdata.HandlerList;
                                // console.log(rdata,'rdata')
                                rdata.PermitList.forEach((v) => {
                                    // console.log(v,"vv")
                                    if (v.IsChecked) {
                                        this.permitResult.push(v.PermitId);
                                    }
                                });
                                this.permitResult.push();
                                arr.push(rdata);
                                // 生成合并信息的数组 [3, 0, 0, 2, 0, 4, 0, 0, 0] 其中的0代表隐藏
                                if (i == 0) {
                                    rowspan.push(item.HandlerList.length);
                                } else {
                                    rowspan.push(0);
                                }
                            }
                        });
                        // console.log(this.permitResult,"回显All权限")
                        this.permitDataTable = arr;
                        this.rowspan = rowspan;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((error) => {
                    this.$message.error("远程通讯失败");
                    this.permitLoading = false;
                    this.closePermitDialog();
                });
        },
        modifyPermit() {
            apiModifyRolePermit(this.roleId, this.permitResult.join(","))
                .then((res) => {
                    if (res.code === 200) {
                        this.$message.success("设置成功");
                        this.closePermitDialog();
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch(() => {
                    this.$message.error("远程通讯失败");
                });
        },
        //权限checkbox点击事件
        permitCheckBoxChange(val) {
            if (val.IsChecked) {
                //true add
                this.permitResult.push(val.PermitId);
            } else {
                //false del
                let index = this.permitResult.findIndex((v) => v == val.PermitId);
                this.permitResult.splice(index, 1);
            }
        },
        // 合并行
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if ([0].includes(columnIndex)) {
                const _row = this.rowspan[rowIndex];
                const _col = _row > 0 ? 1 : 0; // 如果这一行隐藏了，这列也隐藏
                return {
                    rowspan: _row,
                    colspan: _col,
                };
            }
        },
        closePermitDialog() {
            this.permitDialogVisible = false;
            this.permitData = [];
            this.permitDataTable = [];
            this.permitResult = []; //默认选中数据
            this.checkShow = false;
            this.rowspan = "";
            this.roleId = 0;
        },
    },
};
</script>