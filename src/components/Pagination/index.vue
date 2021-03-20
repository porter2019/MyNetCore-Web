<template>
    <div :class="{'hidden':hidden}" class="pagination-container">
        <el-pagination :background="background" :current-page.sync="currentPage" :page-size.sync="pageSize" :layout="layout" :page-sizes="pageSizes" :total="total" v-bind="$attrs" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
</template>

<script>

export default {
    name: "Pagination",
    props: {
        total: {
            required: true,
            type: Number,
        },
        currentpage: {
            type: Number,
            default: 1,
        },
        pagesize: {
            type: Number,
            default: 20,
        },
        pageSizes: {
            type: Array,
            default() {
                return [10, 20, 30, 50];
            },
        },
        layout: {
            type: String,
            default: "total, sizes, prev, pager, next, jumper",
        },
        background: {
            type: Boolean,
            default: true,
        },
        autoScroll: {
            type: Boolean,
            default: true,
        },
        hidden: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        currentPage: {
            get() {
                return this.currentpage;
            },
            set(val) {
                this.$emit("update:currentpage", val);
            },
        },
        pageSize: {
            get() {
                return this.pagesize;
            },
            set(val) {
                this.$emit("update:pagesize", val);
            },
        },
    },
    methods: {
        handleSizeChange(size) {
            this.$emit("size-change", size);
            // if (this.autoScroll) {
            //   scrollTo(0, 800)
            // }
        },
        handleCurrentChange(index) {
            this.$emit("current-change", index);
            // if (this.autoScroll) {
            //   scrollTo(0, 800)
            // }
        },
    },
};
</script>

<style scoped>
.pagination-container {
    background: #fff;

    /* padding: 20px 15px; */
    margin-top: 20px;
}
.pagination-container.hidden {
    display: none;
}
</style>