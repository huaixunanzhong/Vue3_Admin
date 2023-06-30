// 定义接口返回的ts类型
export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}
// 定义用户ts类型
export interface User {
    "id": number,
    "createTime": string,
    "updateTime": string,
    "username": string,
    "password": string,
    "name": string,
    "phone": null,
    "roleName": string
}
// 定义数组的ts类型
export type Records = User[]
// 定义获取用户接口返回数据的ts类型
export interface UserResponseData extends ResponseData {
    data: {
        records: Records,
        "total": number,
        "size": number,
        "current": number,
        "pages": number
    }

}
// 定义职位的ts类型
export interface Role{
    "id"?: number,
    "createTime": string,
    "updateTime": string,
    "roleName": string,
    "remark": null
}
// 定义全部职位ts类型
export type AllRole=Role[]
// 定义全部职位接口返回的数据类型
export interface AllRoleResponseData extends ResponseData{
    data:{
        assignRoles:AllRole,
        allRolesList:AllRole
    }
}
// 定义设置职位的数据太少类型
export interface SetRoleData{
    roleIdList: number[],
    userId: number
}










