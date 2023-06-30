// 定义接口返回数据ts类型
export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}
// 定义角色ts数据类型
export interface Role {
    "id"?: number,
    "createTime"?: string,
    "updateTime"?: string,
    "roleName": string,
    "remark"?: null
}
// 定义角色数组ts类型
export type Records = Role[]
// 定义角色接口返回数据ts类型
export interface AllRoleResponseData extends ResponseData {
    data: {
        records: Records,
        "total": number,
        "size": number,
        "current": number,
        "pages": number
    }
}
