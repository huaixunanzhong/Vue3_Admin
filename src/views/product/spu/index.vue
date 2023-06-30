<template>
    <Category :scene="scene" />
    <el-card style="margin: 10px 0px;">
        <!-- spu -->
        <div v-show="scene == 0">
            <el-button type="primary" icon="Plus" :disabled="category.c3Id ? false : true" @click="addSpu">添加SPU</el-button>
            <el-table style="margin: 10px 0px;" border :data="records">
                <el-table-column label="序号" type="index" align="center" width="100px"></el-table-column>
                <el-table-column label="SPU名称" prop="spuName"></el-table-column>
                <el-table-column label="SPU描述" prop="description" show-overflow-tooltip></el-table-column>
                <el-table-column label="SPU操作" width="300px">
                    <template #="{ row, $index }">
                        <el-button type="primary" icon="Plus" title="添加SKU" size="small" @click="addSku(row)"></el-button>
                        <el-button type="primary" icon="Edit" title="修改SPU" size="small"
                            @click="updataSpu(row)"></el-button>
                        <el-button type="primary" icon="View" title="查看SKU列表" size="small"
                            @click="findSku(row)"></el-button>
                        <el-popconfirm :title="`你确定要删除${row.spuName}?`" @confirm="deleteSpu(row)">
                            <template #reference>
                                <el-button type="primary" icon="Delete" title="删除SPU" size="small"></el-button>
                            </template>
                        </el-popconfirm>

                    </template>
                </el-table-column>
            </el-table>
            <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
                :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total"
                @current-change="getHasSpu" @size-change="changeSize" />
        </div>
        <!-- spu表单 -->
        <SpuForm ref="spu" v-show="scene == 1" @changeScene="changeScene"></SpuForm>
        <!-- sku表单 -->
        <SkuFrom ref="sku" v-show="scene == 2" @changeScene="changeScene"></SkuFrom>
        <el-dialog v-model="show" title="SKU列表">
            <el-table border :data="skuArr">
                <el-table-column type="index" label="sku名字" prop="skuName" width="100px"></el-table-column>
                <el-table-column label="sku价格" prop="price"></el-table-column>
                <el-table-column label="sku重量" prop="weight"></el-table-column>
                <el-table-column label="sku图片" prop="imgUrl">
                    <template #="{ row, $index }">
                        <img :src="row.skuDefaultImg" style="width: 100px;height: 100px;">
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </el-card>
</template>

<script setup lang="ts">
import SpuForm from "./spuForm.vue"
import SkuFrom from "./skuForm.vue"
import { ref, watch,onBeforeUnmount } from "vue"
import useCategoryStore from "@/store/modules/category"
import { reqHasSpu, reqSukList,reqRemoveSpu } from "@/api/product/spu"
import { HasSpuResponseData, Records, SpuData, SkuData } from "@/api/product/spu"
import { ElMessage } from "element-plus"
let category = useCategoryStore()
// 切换场景值
let scene = ref<number>(0)
let pageNo = ref<number>(1)
let pageSize = ref<number>(3)
let records = ref<Records>([])
let total = ref<number>(0)
// 获取子组件spu实例
let spu = ref<any>()
let sku = ref<any>()
let skuArr = ref<SkuData[]>([])
let show = ref<boolean>(false)
watch(() => category.c3Id, () => {
    if (!category.c3Id) return
    getHasSpu()
})
// 获取spu数据
const getHasSpu = async (pager = 1) => {
    pageNo.value = pager
    let res: HasSpuResponseData = await reqHasSpu(pageNo.value, pageSize.value, category.c3Id)
    if (res.code == 200) {
        records.value = res.data.records
        total.value = res.data.total
    }
}
// 改变当前展示数据条数
const changeSize = () => {
    getHasSpu()
}
// 添加spu事件回调
const addSpu = () => {
    scene.value = 1
    spu.value.initAddSpu(category.c3Id)
}
// 修改spu按钮回调
const updataSpu = (row: SpuData) => {
    scene.value = 1
    spu.value.initHasSpuData(row)

}
// 添加sku
const addSku = (row: SpuData) => {
    scene.value = 2
    sku.value.initSkuData(category.c1Id, category.c2Id, row)
}
// 查看spu
const findSku = async (row: SpuData) => {
    let res = await reqSukList((row.id as number))
    if (res.code == 200) {
        skuArr.value = res.data
        show.value = true
    }
}
// 删除spu
const deleteSpu=async (row:SpuData)=>{
    console.log(row.id)
    let res=await reqRemoveSpu((row.id as number))
    if(res.code==200){
        ElMessage.success("删除成功")
        getHasSpu(records.value.length>1?pageNo.value:pageNo.value-1)
    }else{
        ElMessage.error("删除失败")
    }
}
// 子组件修改父组件场景值回调
const changeScene = (obj: any) => {
    scene.value = obj.flag
    if (obj.params == "update") {
        getHasSpu(pageNo.value)
    } else {
        getHasSpu()
    }
}
onBeforeUnmount(()=>{
    category.$reset()
})
</script>

<style scoped></style>