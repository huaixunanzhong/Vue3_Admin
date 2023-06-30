<template>
    <div class="layout_container">
        <!-- 左侧菜单栏 -->
        <div class="layout_slider">
            <Logo></Logo>
            <el-scrollbar class="scrollbar">
                <el-menu :collapse="LayoutSettingStore.fold?true:false" :default-active="$route.path" class="menu" background-color="#001529" text-color="white">
                    <Menu :menuList="userStore.menuRoutes"></Menu>
                </el-menu>
            </el-scrollbar>
        </div>
        <!-- 顶部导航栏 -->
        <div class="layout_tabbar" :class="{fold:LayoutSettingStore.fold?true:false}">
            <Tabbar></Tabbar>
        </div>
        <!-- 内容展示区域 -->
        <div class="layout_main" :class="{fold:LayoutSettingStore.fold?true:false}">
            <Main></Main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"
import Logo from "./logo/index.vue"
import Menu from "./menu/index.vue"
import Main from "./main/index.vue"
import Tabbar from "./tabbar/index.vue"
import useUserStore from "@/store/modules/user.ts"
import useLayoutSettingStore from "@/store/modules/setting"
const LayoutSettingStore=useLayoutSettingStore()
let userStore = useUserStore()
const $route=useRoute()
</script>

<script lang="ts">
export default{
    name:"Layout"
}
</script>

<style scoped lang="scss">
.layout_container {
    width: 100%;
    height: 100vh;

    .layout_slider {
        width: $base-menu-width;
        height: 100vh;
        background-color: $base-menu-backgroundcolor;
        transition: all 0.3s;

        .scrollbar {
            width: 100%;
            height: calc(100% - $base-menu-logo-height);

            .el-menu {
                border-right: none;
            }
        }
    }

    .layout_tabbar {
        position: fixed;
        width: calc(100% - $base-menu-width);
        height: $base-tabbar-height;
        top: 0px;
        left: $base-menu-width;
        transition: all 0.3s;
        &.fold{
            width:calc(100vw - $base-menu-min-width);
            left: $base-menu-min-width;
        }
    }

    .layout_main {
        position: absolute;
        width: calc(100% - $base-menu-width);
        height: calc(100vh - $base-tabbar-height);
        top: $base-tabbar-height;
        left: $base-menu-width;
        padding: 20px;
        overflow: auto;
        transition: all 0.3s;
        &.fold{
            width:calc(100vw - $base-menu-min-width);
            left: $base-menu-min-width;
        }
    }
}
</style>