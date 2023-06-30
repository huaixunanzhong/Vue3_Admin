<template>
    <el-icon style="margin-right:10px;" @click="changeIcon">
        <component :is="LayoutSettingStore.fold ? 'Fold' : 'Expand'"></component>
    </el-icon>
    <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item v-for="(item,index) in $route.matched" :key="item.path" v-show="item.meta.title" :to="item.path">
            <el-icon>
                <component :is="item.meta.icon"></component>
            </el-icon>
            <span>{{item.meta.title}}</span>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"
import useLayoutSettingStore from "@/store/modules/setting"
const LayoutSettingStore = useLayoutSettingStore()
const changeIcon = () => {
    LayoutSettingStore.fold = !LayoutSettingStore.fold
}
const $route=useRoute()

</script>
<script lang="ts">
export default {
    name: "Breadcrumb"
}
</script>

<style scoped></style>