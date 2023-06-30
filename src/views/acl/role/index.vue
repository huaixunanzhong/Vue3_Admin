<template>
    <el-card>
        <el-form class="form">
            <el-form-item label="职位搜索">
                <el-input placeholder="请你输入搜索职位关键字" v-model="keyword"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :disabled="keyword ? false : true" @click="search">搜索</el-button>
                <el-button type="primary" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <el-card style="margin: 10px 0px;">
        <el-button type="primary" icon="Plus" @click="addRole">添加职位</el-button>
        <el-table border style="margin: 10px 0px;" :data="allRoleArr">
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="ID" prop="id"></el-table-column>
            <el-table-column label="职位名称" prop="roleName"></el-table-column>
            <el-table-column label="创建时间" prop="createTime"></el-table-column>
            <el-table-column label="更新时间" prop="updateTime"></el-table-column>
            <el-table-column label="操作" width="280px">
                <template #="{ row, $index }">
                    <el-button type="primary" size="small" icon="User" @click="rolewait">分配权限</el-button>
                    <el-button type="primary" size="small" icon="Edit" @click="updateRole(row)">编辑</el-button>
                    <el-button type="primary" size="small" icon="Delete">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
            :background="true" layout="prev, pager, next, jumper,->,total, sizes" :total="total"
            @current-change="getAllRole" @size-change="sizeChange" />

    </el-card>
    <!-- 对话框 -->
    <el-dialog v-model="dialogVisible" :title="roleParams.id?'修改职位':'添加职位'">
        <el-form :model="roleParams" :rules="rules" ref="form">
            <el-form-item label="职位名称" prop="roleName">
                <el-input v-model="roleParams.roleName"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="save">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from "vue"
import { reqAllRole,reqAddOrUpdateRole } from "@/api/acl/role"
import type { AllRoleResponseData, Records, Role } from "@/api/acl/role"
import useLayoutSettingStore from "@/store/modules/setting"
import { ElMessage } from "element-plus"
let settingStore = useLayoutSettingStore()
let pageNo = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(1)
// 关键字
let keyword = ref<string>("")
// 全部的角色
let allRoleArr = ref<Records>([])
// 控制对话框
let dialogVisible = ref<boolean>(false)
// 收集角色数据
let roleParams = reactive<Role>({
    roleName: ''
})
// 获取form组件实例
let form =ref<any>()
onMounted(() => {
    getAllRole()
})
// 获取全部的角色信息|改变页码的回调
const getAllRole = async (pager = 1) => {
    pageNo.value = pager
    let res: AllRoleResponseData = await reqAllRole(pageNo.value, pageSize.value, keyword.value)
    if (res.code == 200) {
        allRoleArr.value = res.data.records
        total.value = res.data.total
    }
}
// 分页下拉菜单回调
const sizeChange = () => {
    getAllRole()
}
// 搜索按钮的回调
const search = () => {
    getAllRole()
    keyword.value = ""
}
// 重置按钮的回调
const reset = () => {
    settingStore.refresh = !settingStore.refresh
}
// 添加职位回调
const addRole = () => {
    dialogVisible.value = true
    Object.assign(roleParams,{
        roleName:'',
        id:0
    })
    nextTick(()=>{
        form.value.clearValidate('roleName')
    })
}
// 编辑职位回调
const updateRole = (row: Role) => {
    dialogVisible.value = true
    Object.assign(roleParams,row)
    nextTick(()=>{
        form.value.clearValidate('roleName')
    })
}
// 校验规则的回调方法
const validatorRoleName=(rule:any,value:any,callBack:any)=>{
    if(value.trim().length>2){
        callBack()
    }else{
        callBack(new Error("职位名称至少两位"))
    }
}
// 表单校验规则
const rules = {
    roleName: [
        {required:true,trigger:"blur",validator:validatorRoleName}
    ]
}
// 对话框确定按钮回调
const save=async ()=>{
    await form.value.validate()
    let res:any=await reqAddOrUpdateRole(roleParams)
    if(res.code==200){
        ElMessage.success(roleParams.id?"修改成功":"添加成功")
        dialogVisible.value = false
        getAllRole(roleParams.id?pageNo.value:1)
    }
}
// 分配权限按钮回调
const rolewait=()=>{
    ElMessage.success("老陈正在努力开发此模块中......")
}
</script>

<style scoped>
.form {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>