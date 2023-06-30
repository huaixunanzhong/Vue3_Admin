<template>
    <el-card>
        <el-button type="primary" size="default" icon="Plus" @click="addTradeMark">添加品牌</el-button>
        <el-table style="margin:10px 0px" :border="true" :data="trademarkArr">
            <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
            <el-table-column label="品牌名称">
                <template #="{ row, $index }">
                    <pre style="color:brown">{{ row.tmName }}</pre>
                </template>
            </el-table-column>
            <el-table-column label="品牌LOGO">
                <template #="{ row, $index }">
                    <img :src="row.logoUrl" style="width: 100px;height: 100px;">
                </template>
            </el-table-column>
            <el-table-column label="品牌操作">
                <template #="{ row, $index }">
                    <el-button type="primary" size="small" icon="Edit" @click="updataTradeMark(row)"></el-button>

                    <el-popconfirm :title="`确定删除${row.tmName}吗?`" width="200px" icon="Delete"
                        @confirm="removeTradeMark(row.id)">
                        <template #reference>
                            <el-button type="primary" size="small" icon="Delete"></el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页器组件 -->
        <el-pagination @current-change="getHasTrademark" @size-change="sizeChange" v-model:current-page="pageNo"
            v-model:page-size="limit" :page-sizes="[3, 5, 7, 9]" :background="true"
            layout="prev, pager, next, jumper,->,total, sizes" :total="total" />
    </el-card>
    <!-- 对话框 -->
    <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '修改品牌' : '添加品牌'">
        <el-form>
            <el-form-item label="品牌名称" label-width="80px">
                <el-input autocomplete="off" v-model="trademarkParams.tmName" />
            </el-form-item>
            <el-form-item label="品牌LOGO" label-width="80px">
                <el-upload class="avatar-uploader" action="api/admin/product/fileUpload" :show-file-list="false"
                    :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                    <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <UploadFilled />
                    </el-icon>
                </el-upload>
            </el-form-item>
        </el-form>
        <!-- 具名插槽footer -->
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="confirm">
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
import { ref, onMounted, reactive } from "vue"
import { reqHasTrademark, TradeMark, reqAddOrUpdateTrademark, reqDeleteTradeMark } from "@/api/product/trademark"
import { TradeMarkResponseData, Records } from "@/api/product/trademark/type"
let pageNo = ref<number>(1)
let limit = ref<number>(3)
let total = ref<number>(0)
let trademarkArr = ref<Records>([])
let dialogFormVisible = ref<boolean>(false)
let trademarkParams = reactive<TradeMark>({
    tmName: '',
    logoUrl: ''
})
const getHasTrademark = async (pager = 1) => {
    pageNo.value = pager
    let res: TradeMarkResponseData = await reqHasTrademark(pageNo.value, limit.value)
    if (res.code == 200) {
        total.value = res.data.total
        trademarkArr.value = res.data.records
    }
}
onMounted(() => {
    getHasTrademark()
})
const sizeChange = () => {
    getHasTrademark()
}
// 添加品牌按钮事件
const addTradeMark = () => {
    dialogFormVisible.value = true
    trademarkParams.id = 0
    trademarkParams.tmName = ""
    trademarkParams.logoUrl = ""
}

const cancel = () => {
    dialogFormVisible.value = false
}
const confirm = async () => {
    dialogFormVisible.value = false
    let res: any = await reqAddOrUpdateTrademark(trademarkParams)
    if (res.code == 200) {
        ElMessage.success(trademarkParams.id ? '修改品牌成功' : '添加品牌成功')
        getHasTrademark()
    } else {
        ElMessage.error(trademarkParams.id ? '修改品牌失败' : '添加品牌失败')
    }
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    // 限制文件格式
    if (rawFile.type == 'image/png' || rawFile.type == 'image/jpeg' || rawFile.type == 'image/gif') {
        // 限制文件大小
        if (rawFile.size / 1024 / 1024 < 4) {
            return true
        } else {
            ElMessage.error("上传文件大于4M")
            return false
        }
    } else {
        ElMessage.error('上传图片格式只能是png|jpeg|gif')
        return false
    }
}

const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
    trademarkParams.logoUrl = response.data
}

const updataTradeMark = (row) => {
    dialogFormVisible.value = true
    Object.assign(trademarkParams, row)
}

const removeTradeMark = async (id: number) => {
    let res = await reqDeleteTradeMark(id)
    if (res.code == 200) {
        ElMessage.success("删除品牌成功")
        getHasTrademark(trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
    } else {
        ElMessage.error("删除品牌失败")
    }
}

</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>