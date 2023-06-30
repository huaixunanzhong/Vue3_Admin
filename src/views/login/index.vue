<template>
    <div class="login_container">
        <el-row>
            <el-col :span="12" :xs="0"></el-col>
            <el-col :span="12" :xs="24">
                <el-form class="login_form">
                    <h1>Hello</h1>
                    <h2>欢迎来到硅谷学院</h2>
                    <el-form-item>
                        <el-input :prefix-icon="User" v-model="LoginForm.username"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input type="password" :prefix-icon="Lock" :show-password="true" v-model="LoginForm.password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button :loading="loading" type="primary" class="login_btn" @click="login">登录</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { User,Lock} from "@element-plus/icons-vue"
import { reactive,ref } from "vue";
import useUserStore from "@/store/modules/user"
import { ElNotification } from "element-plus";
import {useRouter} from "vue-router"
import {getTime} from "@/utils/time"
let $router=useRouter()
let userStore=useUserStore()
let LoginForm=reactive({
    username:"admin",
    password:"atguigu123"
});
let loading=ref(false)
const login=async()=>{
    loading.value=true
    try {
        await userStore.userLogin(LoginForm)
        $router.push("/")
        ElNotification({
            type:"success",
            title:`Hi,${getTime()}好`,
            message:"欢迎回来"
        })
        loading.value=false
    } catch (error) {
        ElNotification({
            type:"error",
            message:(error as Error).message
        })
        loading.value=false
    }
}
</script>

<style scoped lang="scss">
.login_container{
    width:100%;
    height:100vh;
    background: url("@/assets/images/background.jpg") no-repeat;
    background-size: cover;
    .login_form{
        position: relative;
        width: 80%;
        top: 30vh;
        background: url("@/assets/images/login_form.png") no-repeat;
        background-size: cover;
        padding: 40px;
        h1{
            font-size: 40px;
            color: white;
        }
        h2{
            font-size: 20px;
            color: white;
            margin: 20px 0;
        }
        .login_btn{
            width: 100%;
        }
    }
}
</style>