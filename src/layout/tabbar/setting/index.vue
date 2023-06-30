<template>
    <el-button size="small" circle="true" icon="Refresh" @click="updatRefresh"></el-button>
    <el-button size="small" circle="true" icon="FullScreen" @click="fullScreen"></el-button>
    <el-popover placement="bottom" title="主题设置" :width="300" trigger="hover">
        <el-form>
            <el-form-item label="主题颜色">
                <el-color-picker @change="setColor" v-model="color" show-alpha :predefine="predefineColors" />
            </el-form-item>
            <el-form-item label="暗黑模式">
                <el-switch @change="darkChange" v-model="dark" class="mt-2" style="margin-left: 24px;--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" inline-prompt active-icon="Moon" inactive-icon="Sunny" />
            </el-form-item>
        </el-form>
        <template #reference>
            <el-button size="small" circle="true" icon="Setting"></el-button>
        </template>
    </el-popover>
    <img :src="userStore.avatar" style="width:24px;height:24px;margin: 0 10px;">
    <el-dropdown>
        <span class="el-dropdown-link">
            {{ userStore.username }}
            <el-icon class="el-icon--right">
                <arrow-down />
            </el-icon>
        </span>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script setup lang="ts">
import { ref } from "vue"
import useLayoutSettingStore from "@/store/modules/setting.ts"
import useUserStore from "@/store/modules/user"
import { useRouter } from "vue-router";
let $router = useRouter()
let LayoutSettingStore = useLayoutSettingStore()
let userStore = useUserStore()
// 控制暗黑模式开关
let dark=ref<boolean>(false)

// 刷新
const updatRefresh = () => {
    LayoutSettingStore.refresh = !LayoutSettingStore.refresh
}
// 全屏
const fullScreen = () => {
    let full = document.fullscreenElement
    if (!full) {
        document.documentElement.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
}
// 退出登录
const logout = async () => {
    await userStore.userLogout()
    $router.push({ path: "/login" })
}
// 主题颜色选择
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#90ee90',
    '#00ced1',
    '#1e90ff',
    '#c71585',
    'rgba(255, 69, 0, 0.68)',
    'rgb(255, 120, 0)',
    'hsv(51, 100, 98)',
    'hsva(120, 40, 94, 0.5)',
    'hsl(181, 100%, 37%)',
    'hsla(209, 100%, 56%, 0.73)',
    '#c7158577',
])
// 切换暗黑模式的回调
const darkChange=()=>{
    let html=document.documentElement
    dark.value?html.className="dark":html.className=""
}
// 设置主题颜色
const setColor=()=>{
    const html=document.documentElement
    html.style.setProperty('--el-color-primary', color.value)
}
</script>
<script lang="ts">
export default {
    name: "Setting"
}
</script>

<style scoped></style>