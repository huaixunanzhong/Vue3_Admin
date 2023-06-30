<template>
    <el-form label-width="100px">
        <el-form-item label="SKU名称">
            <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)">
            <el-input placeholder="价格（元）" v-model="skuParams.price"></el-input>
        </el-form-item>
        <el-form-item label="重量(g)">
            <el-input placeholder="重量(g)" v-model="skuParams.weight"></el-input>
        </el-form-item>
        <el-form-item label="SKU描述">
            <el-input type="textarea" placeholder="SKU描述" v-model="skuParams.skuDesc"></el-input>
        </el-form-item>
        <el-form-item label="平台属性">
            <el-form :inline="true">
                <el-form-item v-for="(item,index) in attrArr" :key="item.id" :label="item.attrName">
                    <el-select v-model="item.attrIdAndValueId">
                        <el-option :value="`${item.id}:${attrValue.id}`" :label="attrValue.valueName" v-for="(attrValue,index) in item.attrValueList" :key="attrValue.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-form-item>
        <el-form-item label="销售属性">
            <el-form :inline="true">
                <el-form-item :label="item.saleAttrName" v-for="(item,index) in saleArr" :key="item.id" >
                    <el-select v-model="item.saleIdAndValueId">
                        <el-option :value="`${item.id}:${saleAttrValue.id}`" v-for="(saleAttrValue,index) in item.spuSaleAttrValueList" :key="saleAttrValue.id" :label="saleAttrValue.saleAttrValueName"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-form-item>
        <el-form-item label="图片名称">
            <el-table border :data="imgArr" ref="table">
                <el-table-column type="selection" width="80px" align="center"></el-table-column>
                <el-table-column label="图片">
                    <template #="{row,$index}">
                        <img :src="row.imgUrl" style="width: 100px;height: 100px;">
                    </template>
                </el-table-column>
                <el-table-column label="名称" prop="imgName"></el-table-column>
                <el-table-column label="操作">
                    <template #="{row,$index}">
                        <el-button type="primary" size="small" @click="handler(row)">设置默认</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-from-item>
            <el-button type="primary" @click="save">保存</el-button>
            <el-button @click="cancel">取消</el-button>
        </el-from-item>
    </el-form>
</template>

<script setup lang="ts">
import { reqAttr } from "@/api/product/attr"
import { reqSpuImageList,reqSpuHasSaleAttr,reqAddSku } from "@/api/product/spu"
import { ref,reactive } from "vue"
import type {SkuData} from "@/api/product/spu/type"
import { ElMessage } from "element-plus"
let $emit=defineEmits(["changeScene"])
// 平台属性
let attrArr=ref<any>([])
// 销售属性
let saleArr=ref<any>([])
// 照片墙数据
let imgArr=ref<any>([])
// 收集sku数据
let skuParams=reactive<SkuData>(
    {
    category3Id: "",
    spuId: "",
    tmId: "",
    skuName: "",
    price: "",
    weight: "",
    skuDesc: "",
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
    skuDefaultImg: "",
}
)
// table节点
let table=ref<any>()
// 取消按钮回调
const cancel=()=>{
    $emit("changeScene",{flag:0,params:"update"})
}
// 初始化sku
const initSkuData=async (c1Id:number|string,c2Id:number|string,spu:any)=>{
    skuParams.category3Id=spu.category3Id
    skuParams.spuId=spu.id
    skuParams.tmId=spu.tmId
    let res=await reqAttr(c1Id,c2Id,spu.category3Id)
    let res1=await reqSpuHasSaleAttr(spu.id)
    let res2=await reqSpuImageList(spu.id)
    attrArr.value=res.data
    saleArr.value=res1.data
    imgArr.value=res2.data
}
// 获取默认图片数据
const handler=(row:any)=>{
    imgArr.value.forEach((item:any)=>{
        table.value.toggleRowSelection(item,false)
    })
    table.value.toggleRowSelection(row,true)
    skuParams.skuDefaultImg=row.imgUrl
}
// 保存按钮回调
const save=async ()=>{
    skuParams.skuAttrValueList=attrArr.value.reduce((prev:any,next:any)=>{
        if(next.attrIdAndValueId){
            let [attrId,valueId]=next.attrIdAndValueId.split(":")
            prev.push({
                attrId,
                valueId
            })
        }
        return prev
    },[])
    skuParams.skuSaleAttrValueList=saleArr.value.reduce((prev:any,next:any)=>{
        if(next.saleIdAndValueId){
            let [saleAttrId,saleAttrValueId]=next.saleIdAndValueId.split(":")
            prev.push({
                saleAttrId,
                saleAttrValueId
            })
        }
        return prev
    },[])
    let res:any=await reqAddSku(skuParams)
    if(res.code==200){
        ElMessage.success("添加成功")
        $emit("changeScene",{flag:0,params:""})
    }else{
        ElMessage.success("添加失败")
    }
}
defineExpose({initSkuData})
</script>

<style lang="scss" scoped></style>