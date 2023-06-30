<template>
    <Category :scene="scene" />
    <div v-show="scene == 0">
        <el-card style="margin:10px 0px">
            <el-button type="primary" icon="Plus" :disabled="categoryStore.c3Id ? false : true"
                @click="addAttr">添加属性</el-button>
            <el-table border style="margin: 10px 0px;" :data="attrArr">
                <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
                <el-table-column label="属性名称" align="center" width="120px" prop="attrName"></el-table-column>
                <el-table-column label="属性名称值" align="center">
                    <template #="{ row, $index }">
                        <el-tag style="margin: 5px;" v-for="(item, index) in row.attrValueList" :key="item.id">
                            {{ item.valueName }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="200px">
                    <template #="{ row, $index }">
                        <el-button type="primary" icon="Edit" @click="updataAttr(row)"></el-button>
                        
                        <el-popconfirm width="200px" :title="`确定删除${row.attrName}吗?`" @confirm="deleteAttr(row.id)">
                            <template #reference>
                                <el-button type="primary" icon="Delete"></el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
    <div v-show="scene == 1">
        <el-card style="margin:10px 0px">
            <el-form :inline="true" :model="attrParams">
                <el-form-item label="属性名称">
                    <el-input v-model="attrParams.attrName"></el-input>
                </el-form-item>
            </el-form>
            <el-button @click="addAttrValue" type="primary" icon="Plus"
                :disabled="attrParams.attrName ? false : true">添加属性值</el-button>
            <el-button @click="cancel">取消</el-button>
            <el-table border style="margin: 10px 0px;" :data="attrParams.attrValueList">
                <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
                <el-table-column label="属性值名称">
                    <template #="{ row, $index }">
                        <el-input :ref="(vc: any) => inputArr[$index] = vc" v-if="row.flag" @blur="toLook(row, $index)"
                            v-model="row.valueName" placeholder="请你输入属性值名称"></el-input>
                        <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="属性值操作">
                    <template #="{ row, $index }">
                        <el-button type="primary" size="small" icon="Delete"
                            @click="attrParams.attrValueList.splice($index, 1)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button type="primary" @click="save" :disabled="attrParams.attrValueList.length > 0 ? false : true">保存</el-button>
            <el-button @click="cancel">取消</el-button>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { watch, ref, reactive, nextTick,onBeforeUnmount } from "vue";
import useCategoryStore from "@/store/modules/category"
import { reqAttr, reqAddOrUpdataAttr,reqDeleteAttr } from "@/api/product/attr";
import { AttrResponseData, Attr, AttrValue } from "@/api/product/attr/type";
import { ElMessage } from "element-plus";
let categoryStore = useCategoryStore()
let attrArr = ref<Attr[]>([])
let attrParams = reactive<Attr>({
    attrName: '',
    attrValueList: [
    ],
    categoryId: "",
    categoryLevel: 3,
})
let inputArr = ref<any>([])
let scene = ref<number>(0)
watch(() => categoryStore.c3Id, () => {
    attrArr.value = []
    if (!categoryStore.c3Id) return
    getAttrList()
})
// 获取属性列表数据
const getAttrList = async () => {
    const { c1Id, c2Id, c3Id } = categoryStore
    let res: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
    if (res.code == 200) {
        attrArr.value = res.data
    }
}
// 添加属性按钮
const addAttr = () => {
    attrParams.attrName = ""
    attrParams.attrValueList = []
    scene.value = 1
    attrParams.categoryId = categoryStore.c3Id
}
const cancel = () => {
    scene.value = 0
}
// 添加属性值
const addAttrValue = () => {
    attrParams.attrValueList.push({
        valueName: "",
        flag: true
    })
    nextTick(() => {
        inputArr.value[attrParams.attrValueList.length - 1].focus()
    })
}
// 保存按钮事件回调
const save = async () => {
    let res = await reqAddOrUpdataAttr(attrParams)
    if (res.code == 200) {
        ElMessage.success(attrParams.id ? "修改成功" : "添加成功")
        scene.value = 0
        getAttrList()
    } else {
        ElMessage.error(attrParams.id ? "修改失败" : "添加失败")
    }
}
// 属性值输入框失去焦点事件
const toLook = (row: AttrValue, $index: number) => {
    if (row.valueName.trim() == "") {
        attrParams.attrValueList.splice($index, 1)
        ElMessage.error("属性值不能为空")
        return
    }
    let repeat = attrParams.attrValueList.find((item) => {
        if (item != row) {
            return row.valueName === item.valueName
        }
    })
    if (repeat) {
        ElMessage.error("属性值不能重复")
        return
    }
    row.flag = false
}
// 属性值编辑事件
const toEdit = (row: AttrValue, $index: number) => {
    row.flag = true
    nextTick(() => {
        inputArr.value[$index].focus()
    })
}
// 修改属性按钮事件
const updataAttr = (row: Attr) => {
    scene.value = 1
    // Object.assign是浅拷贝，这里使用JSON转换一下变为深拷贝
    Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}
// 删除属性按钮事件
const deleteAttr=async (attrId:number)=>{
    let res=await reqDeleteAttr(attrId)
    if(res.code==200){
        ElMessage.success("删除成功")
        getAttrList()
    }else{
        ElMessage.error("删除失败")
    }
}
onBeforeUnmount(()=>{
    categoryStore.$reset()
})
</script>

<style scoped></style>