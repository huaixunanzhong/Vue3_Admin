import request from "@/utils/request"
import type {UserResponseData,User,AllRoleResponseData,SetRoleData} from "./type"
enum API{
    // 获取已有用户信息地址
    AllUSER_URL="/admin/acl/user/",
    // 添加一个新的用户信息
    ADDUSER_URL="/admin/acl/user/save",
    // 更新一个已有的用户信息
    UPDATEUSER_URL="/admin/acl/user/update",
    // 获取全部职位和当前账号已有职位
    ALLROLE_URL="/admin/acl/user/toAssign/",
    // 设置职位
    SETROLE_URL="/admin/acl/user/doAssignRole",
    // 删除用户
    REMOVEUSER_URL="/admin/acl/user/remove/",
    // 批量删除用户
    DELETEUSER_URL="/admin/acl/user/batchRemove"
}
export const reqHasUserList=(page:number,limit:number,username:string)=>request.get<any,UserResponseData>(API.AllUSER_URL+`${page}/${limit}/?username=${username}`)
// 添加或者更新一个用户信息
export const reqAddOrUpdateUser=(data:User)=>{
    if(data.id){
        return request.put<any,any>(API.UPDATEUSER_URL,data)
    }else{
        return request.post<any,any>(API.ADDUSER_URL,data)
    }
}
// 获取全部职位和当前账号已有职位
export const reqAllRole=(userId:number)=>request.get<any,AllRoleResponseData>(API.ALLROLE_URL+userId)
// 设置职位
export const reqSetUserRole=(data:SetRoleData)=>request.post<any,any>(API.SETROLE_URL,data)
// 删除用户
export const reqRemoveUser=(userId:number)=>request.delete<any,any>(API.REMOVEUSER_URL+userId)
// 批量删除用户
export const reqDeleteUser=(idList:number[])=>request.delete<any,any>(API.DELETEUSER_URL,{data:idList})















