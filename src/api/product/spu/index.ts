// SPU管理模块的接口
import request from "@/utils/request"
// ts接口类型
import {SkuInfoData,HasSpuResponseData,AllTradeMark,SpuHasImg,SaleAttrResponseData,AllSaleAttrResponseData,SpuData,SkuData} from "./type"
enum API{
    // 获取已有的SPU的数据
    HASSPU_URL="/admin/product/",
    // 获取全部品牌的数据
    ALLTRADEMARK_URL="/admin/product/baseTrademark/getTrademarkList",
    // 获取某个Spu下的售卖商品照片信息
    IMAGE_URL="/admin/product/spuImageList/",
    // 获取某个spu下全部的已有的销售属性接口地址
    SPUHASSALEATTR_URL="/admin/product/spuSaleAttrList/",
    // 获取整个项目全部的销售属性
    ALLSALEATTR_URL="/admin/product/baseSaleAttrList",
    // 追加新的SPU
    ADDSPU_URL="/admin/product/saveSpuInfo",
    // 更新已有的SPU
    UPDATASPU_URL="/admin/product/updateSpuInfo",
    // 追加一个新的sku
    ADDSKU_URL="/admin/product/saveSkuInfo",
    // 查看某一个spu下全部售卖的商品
    SKUINFO_URL="/admin/product/findBySpuId/",
    // 删除已有的spu
    REMOVESPU_URL="/admin/product/deleteSku/"
}
// 获取某一个三级分类下已有的SPU数据
export const reqHasSpu=(page:number,limit:number,category3Id:string|number)=>request.get<any,HasSpuResponseData>(API.HASSPU_URL+`${page}/${limit}/?category3Id=${category3Id}`)
// 获取全部品牌的数据
export const reqAllTradeMark=()=>request.get<any,AllTradeMark>(API.ALLTRADEMARK_URL)
// 获取某个spu下的售卖商品照片数据
export const reqSpuImageList=(spuId:number)=>request.get<any,SpuHasImg>(API.IMAGE_URL+`${spuId}`)
// 获取已有销售属性接口
export const reqSpuHasSaleAttr=(spuId:number)=>request.get<any,SaleAttrResponseData>(API.SPUHASSALEATTR_URL+`${spuId}`)
// 获取全部的销售属性接口
export const reqAllSaleAttr=()=>request.get<any,AllSaleAttrResponseData>(API.ALLSALEATTR_URL)
// 发送新的SPU
export const reqAddOrUpdataSpu=(data:SpuData)=>{
    if(data.id){
        return request.post<any,any>(API.UPDATASPU_URL,data)
    }else{
        return request.post<any,any>(API.ADDSPU_URL,data)
    }
}
// 追加新的sku数据
export const reqAddSku=(data:SkuData)=>request.post<any,any>(API.ADDSKU_URL,data)
// 查看某一个spu下全部售卖的商品
export const reqSukList=(skuId:number|string)=>request.get<any,SkuInfoData>(API.SKUINFO_URL+skuId)
// 删除已有spu
export const reqRemoveSpu=(skuId:number|string)=>request.delete<any,any>(API.REMOVESPU_URL+skuId)