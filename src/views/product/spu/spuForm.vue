<template>
    <el-form label-width="120px">
        <el-form-item label="SPU名称">
            <el-input placeholder="请你输入SPU名称" v-model="spuParams.spuName"></el-input>
        </el-form-item>
        <el-form-item label="SPU品牌">
            <el-select placeholder="请你选择品牌" v-model="spuParams.tmId">
                <el-option v-for="(item, index) in AllTradeMark" :key="item.id" :label="item.tmName"
                    :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="SPU描述">
            <el-input placeholder="请你输入描述" type="textarea" v-model="spuParams.description"></el-input>
        </el-form-item>
        <el-form-item label="SPU照片">
            <el-upload v-model:file-list="imgList" action="/api/admin/product/fileUpload" list-type="picture-card"
                :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :before-upload="handleUpload">
                <el-icon>
                    <Plus />
                </el-icon>
            </el-upload>
            <el-dialog v-model="dialogVisible">
                <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%;height: 100%;" />
            </el-dialog>
        </el-form-item>
        <el-form-item label="SPU销售属性">
            <el-select v-model="saleAttrIdAndValueName" :placeholder="unSelectSaleAttr.length?`还未选择${unSelectSaleAttr.length}个`:'无'" style="margin-right: 10px;">
                <el-option :value="`${item.id}:${item.name}`" v-for="(item,index) in unSelectSaleAttr" :key="item.id" :label="item.name"></el-option>
            </el-select>
            <el-button type="primary" icon="Plus" :disabled="saleAttrIdAndValueName?false:true" @click="addSaleAttr">添加销售属性</el-button>
            <el-table border style="margin: 10px 0px;" :data="saleAttr">
                <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
                <el-table-column label="属性名" width="120px" prop="saleAttrName"></el-table-column>
                <el-table-column label="属性值">
                    <template #="{ row, $index }">
                        <el-tag style="margin: 0px 5px;" v-for="(tag,index) in row.spuSaleAttrValueList" :key="tag.id" class="mx-1" closable :disable-transitions="false"
                            @close="row.spuSaleAttrValueList.splice(index,1)">
                            {{ tag.saleAttrValueName }}
                        </el-tag>
                        <el-input @blur="toLook(row)" placeholder="请你输入属性值" v-if="row.flag==true" style="width: 100px;" v-model="row.saleAttrValue" size="small" />
                        <el-button @click="toEdit(row)" v-else type="primary" size="small" icon="Plus"></el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px">
                    <template #="{row,$index}">
                        <el-button type="primary" icon="Delete" size="small" @click="saleAttr.splice($index,1)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="save" :disabled="saleAttr.length>0?false:true">保存</el-button>
            <el-button @click="cancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import type { SaleAttrValue,TradeMark, SpuImg, SpuData, SaleAttr, allSaleAttr, AllTradeMark, SpuHasImg, SaleAttrResponseData, AllSaleAttrResponseData } from "@/api/product/spu"
import { reqAllTradeMark, reqSpuImageList, reqSpuHasSaleAttr, reqAllSaleAttr,reqAddOrUpdataSpu } from "@/api/product/spu"
import { ElMessage } from "element-plus";
import { ref,computed } from "vue"
let $emit = defineEmits(['changeScene'])
let AllTradeMark = ref<TradeMark[]>([])
let imgList = ref<SpuImg[]>([])
let saleAttr = ref<SaleAttr[]>([])
let allSaleAttr = ref<allSaleAttr[]>([])
// 存储已有的spu对象
let spuParams = ref<SpuData>({
    category3Id: "",//收集的三级分类的id
    spuName: "",//spu的名字
    description: "",//spu的描述
    tmId: "",//品牌id
    spuImageList: [],
    spuSaleAttrList: [],
})
// 控制预览弹窗
let dialogVisible = ref<boolean>(false)
// 存储上传的图片地址
let dialogImageUrl = ref<string>("")
// 将来收集还未选择的销售属性的id和属性值的名字
let saleAttrIdAndValueName=ref<String>("")
const cancel = () => {
    $emit("changeScene", {flag:0,params:"update"})
}
// 初始化请求回调事件
const initHasSpuData = async (spu: SpuData) => {
    spuParams.value = spu
    // 获取全部品牌
    let res: AllTradeMark = await reqAllTradeMark()
    // 获取某一个品牌旗下全部售卖商品的图片
    let res1: SpuHasImg = await reqSpuImageList((spu.id as number))
    // 获取品牌已有售卖属性
    let res2: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
    // 获取品牌全部的销售属性
    let res3: AllSaleAttrResponseData = await reqAllSaleAttr()
    // 存储全部品牌数据
    AllTradeMark.value = res.data
    imgList.value = res1.data.map(item => {
        return {
            name: item.imgName,
            url: item.imgUrl
        }
    })
    saleAttr.value = res2.data
    allSaleAttr.value = res3.data
}
// 上传图片预览
const handlePictureCardPreview = (file: any) => {
    dialogImageUrl.value = file.url
    dialogVisible.value = true
}
// 删除图片的回调
const handleRemove = () => {

}
// 图片上传前的钩子
const handleUpload = (file: any) => {
    if (file.type == "image/png" || file.type == "image/jpeg" || file.type == "image/gif") {
        if (file.size / 1024 / 1024 < 3) {
            return true
        } else {
            ElMessage.error("上传文件务必小于3M")
            return false
        }
    } else {
        ElMessage.error("上传图片的格式应该为png|jpeg|gif")
        return false
    }
}
// 计算出当前spu未拥有的销售属性
let unSelectSaleAttr=computed(()=>{
    let unSelectArr=allSaleAttr.value.filter(item=>{
        return saleAttr.value.every(item1=>{
            return item.name!=item1.saleAttrName
        })
    })
    return unSelectArr
})
// 添加销售属性的回调
const addSaleAttr=()=>{
    const  [baseSaleAttrId,saleAttrName]=saleAttrIdAndValueName.value.split(":")
    let newSaleAttr:SaleAttr={
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList:[]
    }
    saleAttr.value.push(newSaleAttr)
    saleAttrIdAndValueName.value=""
}
// 编辑销售属性值
const toEdit=(row:SaleAttr)=>{
    row.flag=true
    row.saleAttrValue=""
}
// 新增销售属性值失焦的回调
const toLook=(row:SaleAttr)=>{
    const {baseSaleAttrId,saleAttrValue}=row
    let newSaleAttrValue:SaleAttrValue={
        baseSaleAttrId,
        saleAttrValueName:(saleAttrValue as string)
    }
    // 非法情况1
    if((saleAttrValue as string).trim()==""){
        ElMessage.error("销售属性值不能为空")
        return
    }
    let repeat=row.spuSaleAttrValueList.find(item=>{
        return item.saleAttrValueName==saleAttrValue
    })
    // 非法情况2
    if(repeat){
        ElMessage.error("销售属性值不可以重复")
        return
    }
    row.spuSaleAttrValueList.push(newSaleAttrValue)
    row.flag=false
}
// 保存按钮事件回调
const save=async ()=>{
    spuParams.value.spuImageList=imgList.value.map(item=>{
        return {
            imgName:item.name,
            imgUrl:(item.response&&item.response.data)||item.url
        }
    })
    spuParams.value.spuSaleAttrList=saleAttr.value
    let res=await reqAddOrUpdataSpu(spuParams.value)
    if(res.code==200){
        ElMessage.success(spuParams.value.id?"修改成功":"添加成功")
        $emit('changeScene',{flag:0,params:spuParams.value.id?"update":"add"})
    }else{
        ElMessage.error(spuParams.value.id?"修改失败":"添加失败")
    }
}
// 初始化添加新的spu
const initAddSpu=async (c3Id:number|string)=>{
    Object.assign(spuParams,{
    category3Id: "",//收集的三级分类的id
    spuName: "",//spu的名字
    description: "",//spu的描述
    tmId: "",//品牌id
    spuImageList: [],
    spuSaleAttrList: [],
})
    imgList.value=[]
    saleAttr.value=[]
    saleAttrIdAndValueName.value=""
    spuParams.value.category3Id=c3Id
    // 获取全部品牌
    let res: AllTradeMark = await reqAllTradeMark()
    // 获取品牌全部的销售属性
    let res1: AllSaleAttrResponseData = await reqAllSaleAttr()
    console.log(res)
    AllTradeMark.value = res.data
    allSaleAttr.value = res1.data

}
//对父暴露方法
defineExpose({ initHasSpuData,initAddSpu })
</script>

<style lang="scss" scoped></style>