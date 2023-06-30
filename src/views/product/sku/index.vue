<template>
    <el-card>
        <el-table border :data="skuArr" style="margin: 10px 0px;">
            <el-table-column label="序号" width="80px" type="index" align="center"></el-table-column>
            <el-table-column label="名称" width="150px" prop="skuName"></el-table-column>
            <el-table-column label="描述" prop="skuDesc"></el-table-column>
            <el-table-column label="图片">
                <template #="{ row, $index }">
                    <img :src="row.skuDefaultImg" style="width: 100px;height: 100px;">
                </template>
            </el-table-column>
            <el-table-column label="重量" prop="weight"></el-table-column>
            <el-table-column label="价格" prop="price"></el-table-column>
            <el-table-column label="操作" width="250px" fixed="right">
                <template #="{ row, $index }">
                    <el-button type="primary" size="small" :icon="row.isSale == 0 ? 'Top' : 'Bottom'"
                        @click="updateSale(row)"></el-button>
                    <el-button type="primary" size="small" icon="Edit" @click="updateSku"></el-button>
                    <el-button type="primary" size="small" icon="InfoFilled" @click="findSku(row)"></el-button>
                    <el-popconfirm :title="`确定删除${row.skuName}?`" @confirm="deleteSku(row.id)">
                        <template #reference>
                            <el-button type="primary" size="small" icon="Delete"></el-button>
                        </template>
                    </el-popconfirm>
                    
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
            :background="true" layout="prev, pager, next, jumper,->,total, sizes" :total="total"
            @size-change="handleSizeChange" @current-change="getHasSku" />
    </el-card>
    <el-drawer v-model="drawer">
        <template #header>
            <h4>查看商品的详情</h4>
        </template>
        <template #default>
            <el-row style="margin: 10px 0px;">
                <el-col :span="4">名称</el-col>
                <el-col :span="20">{{ skuInfo.skuName }}</el-col>
            </el-row>
            <el-row style="margin: 10px 0px;">
                <el-col :span="4">描述</el-col>
                <el-col :span="20">{{ skuInfo.skuDesc }}</el-col>
            </el-row>
            <el-row style="margin: 10px 0px;">
                <el-col :span="4">价格</el-col>
                <el-col :span="20">{{ skuInfo.price }}</el-col>
            </el-row>
            <el-row style="margin: 10px 0px;">
                <el-col :span="4">平台属性</el-col>
                <el-col :span="20">
                    <el-tag style="margin: 5px;" v-for="item in skuInfo.skuAttrValueList" :key="item.id">{{ item.valueName
                    }}</el-tag>
                </el-col>
            </el-row>
            <el-row style="margin: 10px 0px;">
                <el-col :span="4">销售属性</el-col>
                <el-col :span="20">
                    <el-tag style="margin: 5px;" v-for="item in skuInfo.skuSaleAttrValueList" :key="item.id">{{
                        item.saleAttrValueName }}</el-tag>
                </el-col>
            </el-row>
            <el-row style="margin: 10px 0px;">
                <el-col :span="4">商品图片</el-col>
                <el-col :span="20">
                    <el-carousel :interval="4000" type="card" height="200px">
                        <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                            <img :src="item.imgUrl" style="width: 100%;height: 100%;">
                        </el-carousel-item>
                    </el-carousel>
                </el-col>
            </el-row>
        </template>
    </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { reqSkuList, reqOnSale, reqCancelSale, reqSaleInfo, reqDeleteSku } from "@/api/product/sku"
import type { SkuData, SkuInfoData } from "@/api/product/sku/type"
import { ElMessage } from "element-plus"
let pageNo = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
let skuArr = ref<SkuData[]>([])
let drawer = ref<boolean>(false)
let skuInfo = ref<any>({})
onMounted(() => {
    getHasSku()
})
// 获取已有sku列表数据
const getHasSku = async (pager = 1) => {
    pageNo.value = pager
    let res = await reqSkuList(pageNo.value, pageSize.value)
    if (res.code == 200) {
        total.value = res.data.total
        skuArr.value = res.data.records
    }
}
// 分页器
const handleSizeChange = () => {
    getHasSku()
}
// sku的上架与下架
const updateSale = async (row: SkuData) => {
    if (row.isSale == 1) {
        await reqCancelSale((row.id as number))
        ElMessage.success("下架成功")
        getHasSku(pageNo.value)
    } else {
        await reqOnSale((row.id as number))
        ElMessage.success("上架成功")
        getHasSku(pageNo.value)
    }
}
// 修改
const updateSku = () => {
    ElMessage.success("程序员正在努力更新中...")
}
// 查看详情
const findSku = async (row: SkuData) => {
    drawer.value = true
    let res: SkuInfoData = await reqSaleInfo((row.id as number))
    if (res.code == 200) {
        skuInfo.value = res.data
        console.log(res)
    }
}
// 删除已有Sku
const deleteSku =async (id: number) => {
    let res:any = await reqDeleteSku(id)
    if (res.code == 200) {
        ElMessage.success("删除成功")
        getHasSku(skuArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
    } else {
        ElMessage.error("系统数据不可删除")
    }
}
</script>

<style scoped>
.el-carousel__item h3 {
    color: #475669;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
    text-align: center;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}
</style>