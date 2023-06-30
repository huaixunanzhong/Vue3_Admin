export interface ResponseData{
    code:number,
    message:string,
    ok:boolean
}
// 定义sku对象的ts类型
export interface Attr {
    id?:number
    "attrId": number | string,
    "valueId": number | string,
}
export interface SaleAttr {
    "saleAttrId": number | string,
    "saleAttrValueId": number | string,
}
export interface SkuData {
    "category3Id"?: string | number,
    "spuId"?: string | number,
    "tmId"?: string | number,
    "skuName"?: string,
    "price"?: string | number,
    "weight"?: string | number,
    "skuDesc"?: string,
    "skuAttrValueList"?: Attr[],
    "skuSaleAttrValueList"?: SaleAttr[],
    "skuDefaultImg"?: string,
    isSale?:number,
    id?:number
}
// 定义sku接口返回的数据ts类型
export interface SkuResponseData extends ResponseData{
    data:{
        records:SkuData[],
        total:number,
        size:number,
        current:number,
        orders:[],
        optimizeCountSql:boolean,
        hitCount:boolean,
        countId:null,
        maxLimit:null,
        searchCount:true,
        pages:number
    }
}
// 定义商品详情接口返回的数据ts类型
export interface SkuInfoData extends ResponseData{
    data:SkuData
}