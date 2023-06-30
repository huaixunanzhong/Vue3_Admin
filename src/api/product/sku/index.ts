// sku模块接口
import request from "@/utils/request"
import type {SkuResponseData,SkuInfoData} from "./type"
enum API{
    // 获取全部sku的接口地址
    SKU_URL="/admin/product/list/",
    // 上架
    ONSALE_URL="/admin/product/onSale/",
    // 下架
    CANCELSALE_URL="/admin/product/cancelSale/",
    // 获取商品详情
    SALEINFO_URL="/admin/product/getSkuInfo/",
    // 删除sku
    DELETESKU_URL="/admin/product/deleteSku/"
}
// 获取商品的SKU列表
export const reqSkuList=(page:number,limit:number)=>request.get<any,SkuResponseData>(API.SKU_URL+`${page}/${limit}`)
// 上架sku
export const reqOnSale=(skuId:number)=>request.get<any,any>(API.ONSALE_URL+skuId)
// 下架sku
export const reqCancelSale=(skuId:number)=>request.get<any,any>(API.CANCELSALE_URL+skuId)
// 获取商品详情信息
export const reqSaleInfo=(skuId:number)=>request.get<any,SkuInfoData>(API.SALEINFO_URL+skuId)
// 删除已有sku
export const reqDeleteSku=(skuId:number)=>request.delete<any,any>(API.DELETESKU_URL+skuId)