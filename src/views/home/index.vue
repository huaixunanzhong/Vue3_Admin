<template>
    <el-card>
        <div class="box">
            <img class="avatar" :src="userStore.avatar" >
            <div class="bottom">
                <h1 class="title">{{ getTime() }}好呀{{userStore.username}}</h1>
                <p class="subtitle">硅谷甄选运营平台</p>
            </div>
        </div>
    </el-card>
    <div class="bottoms">
        <svgIcon name="welcome" width="600px" height="300px" />
    </div>
</template>

<script setup lang="ts">
import useUserStore from "@/store/modules/user"
import {getTime} from "@/utils/time"
import { onMounted } from "vue"
let userStore=useUserStore()
onMounted(()=>{
    userStore.userInfo()
})


</script>

<style scoped lang="scss">
.box{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .avatar{
        width: 100px;
        height: 100px;
        border-radius: 50%;
    }
    .bottom{
        margin-left: 20px;
        .title{
            font-size: 30px;
            font-weight: 900;
            margin-bottom: 30px;
        }
        .subtitle{
            font-style: italic;
            color: skyblue;
        }
    }
}
.bottoms{
    width: 100%;
    height: calc(100% - 160px);
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>