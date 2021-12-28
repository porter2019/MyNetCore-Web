<template>
    <el-upload :action="action" :data="data" :name="name" :headers="headers" :before-upload="beforeUpload" :on-exceed="onExceed" :on-success="onSuccess" :file-list="files" :limit="max">
        <!-- <div class="slot">
            <i class="el-icon-upload" />
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </div> -->
        <el-button type="primary" size="small">上传<i class="el-icon-upload el-icon--right"></i></el-button>
        <div v-if="!notip" slot="tip" class="el-upload__tip">
            <div style="display: inline-block;">
                <el-alert :title="`上传文件支持 ${ ext.join(' / ') } 格式，单个文件大小不超过 ${ size }MB，且文件数量不超过 ${ max } 个`" type="info" show-icon :closable="false" />
            </div>
        </div>
    </el-upload>
</template>

<script>
const tokenHeaderName = process.env.VUE_APP_TOKEN_HEADER_NAME || "AccessToken"
export default {
    name: "FileUpload",
    props: {
        // action: {
        //     type: String,
        //     required: true
        // },
        headers: {
            type: Object,
            default: function () {
                return {
                    [tokenHeaderName]: this.$store.state.user.token,
                };
            },
        },
        data: {
            type: Object,
            default: () => {},
        },
        name: {
            type: String,
            default: "file",
        },
        size: {
            type: Number,
            default: 2,
        },
        max: {
            type: Number,
            default: 3,
        },
        files: {
            type: Array,
            default: () => [],
        },
        notip: {
            type: Boolean,
            default: true,
        },
        ext: {
            type: Array,
            default: () => ["zip", "rar", "jpg", "png", "jpeg", "doc", "docx", "dotx", "ppt", "pptx", "potx", "pptm", "csv", "xls", "xlsx", "xlsm", "xlsb", "xlt", "xltm", "xlsm", "xla", "xlm", "xlw", "pdf", "txt"],
        },
    },
    data() {
        return {
            action: this.$global.UploadAction,
        };
    },
    methods: {
        beforeUpload(file) {
            const fileName = file.name.split(".");
            const fileExt = fileName[fileName.length - 1];
            const isTypeOk = this.ext.indexOf(fileExt) >= 0;
            const isSizeOk = file.size / 1024 / 1024 < this.size;
            if (!isTypeOk) {
                this.$message.error(`上传文件只支持 ${this.ext.join(" / ")} 格式！`);
            }
            if (!isSizeOk) {
                this.$message.error(`上传文件大小不能超过 ${this.size}MB！`);
            }
            return isTypeOk && isSizeOk;
        },
        onExceed() {
            this.$message.warning("文件上传超过限制");
        },
        onSuccess(res, file) {
            this.$emit("on-success", res, file);
        },
    },
};
</script>

<style lang="scss" scoped>
::v-deep .el-upload-dragger {
    width: auto;
    height: auto;
    overflow: unset;
    // &.is-dragover {
    //     border-width: 1px;
    // }
}
.el-upload-dragger {
    border: none !important;
}
.slot {
    width: 300px;
    height: 160px;
}
</style>
