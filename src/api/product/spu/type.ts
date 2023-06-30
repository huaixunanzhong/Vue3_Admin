// 服务器全部接口返回的数据类型
export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}

// SPU数据的类型
export interface SpuData {
    id?: number,//spuid,新增spu不需要携带
    spuName: string,//spu名称
    tmId: number | string,//品牌id
    description: string,//spu 描述
    spuImageList: null | SpuImg[],//图片墙数组
    category3Id: number | string,
    spuSaleAttrList: null | SaleAttr[],
    // "spuPosterList": null
}
// 数组，已有元素都是Spu类型
export type Records = SpuData[]
// 定义获取已有spu接口返回的数据ts类型
export interface HasSpuResponseData extends ResponseData {
    data: {
        records: Records,
        total: number,
        size: number,
        current: number,
        // orders: [],
        // optimizeCountSql: true,
        // hitCount: false,
        // countId: null,
        // maxLimit: null,
        searchCount: boolean,
        pages: number
    }
}

// 全部品牌数据的ts类型
export interface TradeMark {
    id: number,
    tmName: string,
    logoUrl: string
}

//全部品牌数据接口返回的ts类型
export interface AllTradeMark extends ResponseData {
    data: TradeMark[]
}

// 商品图片的ts类型
export interface SpuImg {
    id?: number,
    spuId?: number,
    imgName?: string,
    imgUrl?: string,
    name?: string,
    url?: string
}
// spu已有的图片接口返回数据类型
export interface SpuHasImg extends ResponseData {
    data: SpuImg[]
}

// 已有的销售属性值对象ts类型
export interface SaleAttrValue {
    id?: number,
    spuId?: number,
    baseSaleAttrId: number | string,
    saleAttrValueName: string,
    saleAttrName?: string,
    isChecked?: null
}
// 存储已有的销售属性值的数组类型
export type spuSaleAttrValueList = SaleAttrValue[]
// 销售属性对象ts类型
export interface SaleAttr {
    id?: number,
    spuId?: number
    baseSaleAttrId: number | string,
    saleAttrName: string,
    spuSaleAttrValueList: spuSaleAttrValueList,
    flag?: boolean,
    saleAttrValue?: string
}
// spu已有的销售属性接口返回数据ts类型
export interface SaleAttrResponseData extends ResponseData {
    data: SaleAttr[]
}
// 已有的全部的SPU返回数据类型
export interface allSaleAttr {
    id: number,
    name: string
}
export interface AllSaleAttrResponseData extends ResponseData {
    data: hasSaleAttr[]
}

export interface Attr {
    "attrId": number | string,
    "valueId": number | string,
}
export interface SaleAttr {
    "saleAttrId": number | string,
    "saleAttrValueId": number | string,
}
export interface SkuData {
    "category3Id": string | number,
    "spuId": string | number,
    "tmId": string | number,
    "skuName": string,
    "price": string | number,
    "weight": string | number,
    "skuDesc": string,
    "skuAttrValueList"?: Attr[],
    "skuSaleAttrValueList"?: SaleAttr[],
    "skuDefaultImg": string,
}

// 获取sku数据接口的ts类型
export interface SkuInfoData extends ResponseData{
    data:SkuData[]
}