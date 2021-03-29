<template>
    <div class="image-preview-list">
        <el-image v-for="(img ,index) in (attachList || [])" :key="index" :src="img.FileWebPath" fit="cover" :style="`width:${realWidth};height:${realHeight};`" :preview-src-list="[img.FileWebPath]">
            <div slot="error" class="image-slot">
                <svg-icon name="image-load-fail" />
            </div>
        </el-image>

    </div>
</template>

<script>
export default {
    name: "ImagesPreview",
    props: {
        attachList: {
            type: [Object, Array],
            default: () => {},
        },
        width: {
            type: [Number, String],
            default: "",
        },
        height: {
            type: [Number, String],
            default: "",
        },
    },
    data() {
        return {
            dialogVisible: false,
        };
    },
    computed: {
        realWidth() {
            return typeof this.width == "string" ? this.width : `${this.width}px`;
        },
        realHeight() {
            return typeof this.height == "string" ? this.height : `${this.height}px`;
        },
    },
    created() {},
    mounted() {},
    methods: {},
};
</script>

<style lang="scss" scoped>
.image-preview-list {
    widows: 100%;
    display: flex;
}
.el-image {
    margin: 10px;
    border-radius: 5px;
    background-color: #ebeef5;
    box-shadow: 0 0 5px 1px #ccc;
    ::v-deep .el-image__inner {
        transition: all 0.3s;
        cursor: pointer;
        &:hover {
            transform: scale(1.2);
        }
    }
    ::v-deep .image-slot {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        color: #909399;
        font-size: 30px;
    }
}
</style>
