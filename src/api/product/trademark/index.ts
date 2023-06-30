import request from "@/utils/request";
import type {TradeMarkResponseData,TradeMark} from "./type"

enum API {
    TRADEMARK_URL="/admin/product/baseTrademark/",
    ADDTRADEMARK_URL="/admin/product/baseTrademark/save",
    UPDATEDTRADEMARK_URL="/admin/product/baseTrademark/update",
    DELETETRADEMARK_URL="/admin/product/baseTrademark/remove/"
}

export const reqHasTrademark=(page:number,limit:number)=>request.get<any,TradeMarkResponseData>(API.TRADEMARK_URL+`${page}/${limit}`)

export const reqAddOrUpdateTrademark=(data:TradeMark)=>{
    if(data.id){
        return request.post<any,any>(API.UPDATEDTRADEMARK_URL,data)
    }else{
        return request.post<any,any>(API.ADDTRADEMARK_URL,data)
    }
}

export const reqDeleteTradeMark=(id:number)=>request.delete<any,any>(API.DELETETRADEMARK_URL+id)