import request from "@/utils/request"
import type { AllRoleResponseData,Role } from "./type"
enum API{
    // 获取全部职位地址
    ALLROLE_URL="/admin/acl/role/",
    // 添加职位
    ADDROLE_URL="/admin/acl/role/save",
    // 更新职位
    UPDATEROLE_URL="/admin/acl/role/update"
}
export const reqAllRole=(page:number,limit:number,roleName:string)=>request.get<any,AllRoleResponseData>(API.ALLROLE_URL+`${page}/${limit}/?roleName=${roleName}`)
// 添加or更新职位
export const reqAddOrUpdateRole=(data:Role)=>{
    if(data.id){
        return request.put<any,any>(API.UPDATEROLE_URL,data)
    }else{
        return request.post<any,any>(API.ADDROLE_URL,data)
    }
}




