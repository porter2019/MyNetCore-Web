<template>
    <!-- <ul class="el-upload-list el-upload-list--text">
        <li v-for="(item, index) in attachList" :key="index" class="el-upload-list__item">
            <a class="el-upload-list__item-name" target="_blank" :href="item.FileWebPath"><i class="el-icon-document"></i>{{ item.FileName }}</a>
        </li>
    </ul> -->
    <div class="attachList">
        <ul class="ec-form-img-list">
            <li v-for="(item, index) in (attachList || [])" :key="index">
                <a :href="item.FileWebPath" target="_blank">
                    <i class="el-icon-document"></i>
                    {{ item.FileName }}
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "FilePreview",
    props: {
        attachList: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {};
    },
    computed: {},
    created() {},
    mounted() {},
    methods: {},
};
</script>

<style lang="scss" scoped>
.attachList {
    width: 100%;
    .ec-form-img-list {
        width: 100%;
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        li {
            text-align: left;
            margin-right: 40px;
            a {
                text-decoration: none;
                color: #0076ff;
                font-size: 14px;
            }
        }
    }
}
</style>
