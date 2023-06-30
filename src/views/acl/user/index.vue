<template>
    <el-card style="height: 80px;">
        <el-form class="form">
            <el-form-item label="用户名">
                <el-input placeholder="请你输入搜索的用户名" v-model="keyword"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :disabled="keyword?false:true" @click="search">搜索</el-button>
                <el-button type="primary" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <el-card style="margin: 10px 0px;">
        <el-button type="primary" @click="addUser">添加用户</el-button>
        <el-button type="primary" :disabled="selectIdArr.length?false:true" @click="deleteUser">批量删除</el-button>
        <el-table @selection-change="selectChange" border style="margin: 10px 0px;" :data="userInfo">
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column label="#" type="index" align="center"></el-table-column>
            <el-table-column label="ID" align="center" prop="id"></el-table-column>
            <el-table-column label="用户名字" align="center" prop="username"></el-table-column>
            <el-table-column label="用户名称" align="center" prop="name"></el-table-column>
            <el-table-column label="用户角色" align="center" prop="roleName"></el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime"></el-table-column>
            <el-table-column label="更新时间" align="center" prop="updateTime"></el-table-column>
            <el-table-column label="操作" align="center" width="300px">
                <template #="{ row, $index }">
                    <el-button type="primary" icon="User" size="small" @click="setRole(row)">分类角色</el-button>
                    <el-button type="primary" icon="Edit" size="small" @click="updateUser(row)">编辑</el-button>
                    
                    <el-popconfirm :title="`确定要删除${row.username}?`" style="width: 200px;" @confirm="removeUser(row.id)">
                        <template #reference>
                            <el-button type="primary" icon="Delete" size="small">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 7, 9, 11]"
            :background="true" layout="prev, pager, next, jumper,->,total, sizes," :total="total"
            @current-change="getHasUser" @size-change="hander" />
    </el-card>
    <!-- 抽屉结构：添加或者修改用户信息 -->
    <el-drawer v-model="drawer">
        <template #header>
            <h4>{{ userParams.id ? "修改用户" : "添加用户" }}</h4>
        </template>
        <template #default>
            <el-form :model="userParams" :rules="rules" ref="formRef">
                <el-form-item label="用户姓名" prop="username">
                    <el-input placeholder="请你输入用户姓名" v-model="userParams.username"></el-input>
                </el-form-item>
                <el-form-item label="用户昵称" prop="name">
                    <el-input placeholder="请你输入用户昵称" v-model="userParams.name"></el-input>
                </el-form-item>
                <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
                    <el-input placeholder="请你输入用户密码" v-model="userParams.password"></el-input>
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="confirm">确定</el-button>
            </div>
        </template>
    </el-drawer>
    <!-- 抽屉结构：分配角色 -->
    <el-drawer v-model="drawer1">
        <template #header>
            <h4>分配角色(职位)</h4>
        </template>
        <template #default>
            <el-form :model="userParams">
                <el-form-item label="用户姓名" prop="username">
                    <el-input :disabled="true" :value="userParams.username"></el-input>
                </el-form-item>
                <el-form-item label="职位列表" prop="name">
                    <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate"
                        @change="handleCheckAllChange">全选</el-checkbox>
                    <el-checkbox-group v-model="userRole" @change="handleCheckedCitiesChange">
                        <el-checkbox v-for="(item, index) in allRole" :key="item.id" :label="item">{{ item.roleName
                        }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="confirmClick">确定</el-button>
            </div>
        </template>
    </el-drawer>
</template>

<script setup lang="ts">
import useLayoutSettingStore from "@/store/modules/setting"
import { ref, onMounted, reactive, nextTick } from "vue"
import { reqDeleteUser, reqRemoveUser, reqHasUserList, reqAddOrUpdateUser, reqAllRole, reqSetUserRole } from "@/api/acl/user"
import type { UserResponseData, Records, User, AllRoleResponseData, AllRole, SetRoleData } from "@/api/acl/user/type"
import { ElMessage } from "element-plus"
let layoutSettingStore=useLayoutSettingStore()
let pageNo = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(1)
let userInfo = ref<Records>([])
// 全部职位
let allRole = ref<AllRole>([])
// 已有职位
let userRole = ref<AllRole>([])
// 全选
const checkAll = ref(false)
// 全选框不确定状态
let isIndeterminate = ref<boolean>(false)
let drawer = ref<boolean>(false)
let drawer1 = ref<boolean>(false)
let userParams = reactive<User>({
    id: 0,
    username: "",
    password: "",
    name: "",
})
let formRef = ref<any>()
// table选中的值
let selectIdArr=ref<User[]>([])
// 关键字
let keyword=ref<string>("")
onMounted(() => {
    getHasUser()
})
// 获取用户信息回调
const getHasUser = async (pager = 1) => {
    pageNo.value = pager
    let res: UserResponseData = await reqHasUserList(pageNo.value, pageSize.value,keyword.value)
    if (res.code == 200) {
        userInfo.value = res.data.records
        total.value = res.data.total
    }
}
// 页数变化回调
const hander = () => {
    getHasUser()
}
// 添加用户
const addUser = () => {
    drawer.value = true
    Object.assign(userParams, {
        id: 0,
        username: "",
        password: "",
        name: "",
    })
    nextTick(() => {
        formRef.value.clearValidate('username')
        formRef.value.clearValidate('name')
        formRef.value.clearValidate('password')
    })
}
// 取消
const cancel = () => {
    drawer.value = false
}
// 确定
const confirm = async () => {
    await formRef.value.validate()
    let res = await reqAddOrUpdateUser(userParams)
    drawer.value = false
    if (res.code == 200) {
        ElMessage.success(userParams.id ? "更新成功" : "添加成功")
        // getHasUser(userParams.id?pageNo.value:1)
        window.location.reload()
    } else {
        ElMessage.error(userParams.id ? "更新失败" : "添加失败");
    }
}
// 校验用户名字
const validatorUsername = (rule: any, value: any, callBack: any) => {
    // 用户名称，至少五位
    if (value.trim().length >= 5) {
        callBack()
    } else {
        callBack(new Error("用户名字至少五位"))
    }
}
// 校验用户昵称
const validatorname = (rule: any, value: any, callBack: any) => {
    // 用户名称，至少五位
    if (value.trim().length >= 5) {
        callBack()
    } else {
        callBack(new Error("用户昵称至少五位"))
    }
}
// 校验用户密码
const validatorPassword = (rule: any, value: any, callBack: any) => {
    // 用户名称，至少五位
    if (value.trim().length >= 6) {
        callBack()
    } else {
        callBack(new Error("用户密码至少五位"))
    }
}
// 表单校验规则对象
const rules = {
    username: [{ required: true, trigger: "blur", validator: validatorUsername }],
    name: [{ required: true, trigger: "blur", validator: validatorname }],
    password: [{ required: true, trigger: "blur", validator: validatorPassword }],
}
// 编辑用户
const updateUser = (row: User) => {
    drawer.value = true
    Object.assign(userParams, row)
    nextTick(() => {
        formRef.value.clearValidate('username')
        formRef.value.clearValidate('name')
    })

}
// 分类角色
const setRole = async (row: User) => {
    drawer1.value = true
    Object.assign(userParams, row)
    let res: AllRoleResponseData = await reqAllRole((row.id as number))
    if (res.code == 200) {
        allRole.value = res.data.allRolesList
        userRole.value = res.data.assignRoles
    }
}
// 全选回调
const handleCheckAllChange = (val: boolean) => {
    userRole.value = val ? allRole.value : []
    isIndeterminate.value = false
}
// 分选回调
const handleCheckedCitiesChange = (value: string[]) => {
    checkAll.value = allRole.value.length === value.length
    isIndeterminate.value = value.length > 0 && value.length < allRole.value.length
}
// 确定按钮回调（设置职位）
const confirmClick = async () => {
    let data: SetRoleData = {
        roleIdList: userRole.value.map((item: any) => item.id),
        userId: (userParams.id as number)
    }
    let res = await reqSetUserRole(data)
    if (res.code == 200) {
        ElMessage.success("分配角色成功")
        drawer1.value = false
        getHasUser(pageNo.value)
    }
}
// 删除用户
const removeUser=async (userId:number)=>{
    let res:any=await reqRemoveUser(userId)
    if(res.code==200){
        ElMessage.success("删除成功")
        getHasUser(userInfo.value.length>0?pageNo.value:pageNo.value-1)
    }
}
// table复选框change的时候的回调
const selectChange=(value:any)=>{
    selectIdArr.value=value
}
// 批量删除用户
const deleteUser=async ()=>{
    let idsList:any=selectIdArr.value.map((item)=>item.id)
    let res:any=await reqDeleteUser(idsList)
    if(res.code==200){
        ElMessage.success("删除成功")
        getHasUser(userInfo.value.length>1?pageNo.value:pageNo.value-1)
    }
}
// 搜索按钮的回调
const search=()=>{
    getHasUser()
    keyword.value=''
}
// 重置按钮回调事件
const reset=()=>{
    layoutSettingStore.refresh=!layoutSettingStore.refresh
}
</script>

<style scoped>
.form {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>