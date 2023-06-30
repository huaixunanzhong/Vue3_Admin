import { defineStore } from "pinia";
import { reqLogin, reqUserInfo, reqLogout } from "@/api/user";
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from "@/utils/token";
import type { UserState } from "./types/type"
import type { loginFormData,loginResponseData,userInfoResponseData } from "@/api/user/type"
import { constantRoutes } from "@/router/routes"


let useUserStore = defineStore("User", {
    state: (): UserState => {
        return {
            token: GET_TOKEN(),
            menuRoutes: constantRoutes,
            username: "",
            avatar: ""
        }
    },
    actions: {
        async userLogin(data: loginFormData) {
            let res: loginResponseData = await reqLogin(data)
            if (res.code === 200) {
                this.token = (res.data as string)
                SET_TOKEN((res.data as string))
                return "ok"
            } else {
                return Promise.reject(new Error(res.data))
            }
        },
        async userInfo() {
            let res:userInfoResponseData = await reqUserInfo()
            if (res.code === 200) {
                this.username = res.data.name
                this.avatar = res.data.avatar
                return 'ok'
            } else {
                return Promise.reject(new Error(res.message))
            }
        },
        async userLogout() {
            let res:any = await reqLogout()
            if (res.code == 200) {
                this.username = ""
                this.avatar = ""
                this.token = ""
                REMOVE_TOKEN()
                return "ok"
            }else{
                return Promise.reject(new Error(res.message))
            }
        }
    },
    getters: {

    }
})

export default useUserStore