// 配置layout组件的小仓库
import { defineStore } from "pinia";
const useLayoutSettingStore=defineStore('SettingStore',{
    state:()=>{
        return {
            fold:false,
            refresh:true,
        }
    }
})

export default useLayoutSettingStore