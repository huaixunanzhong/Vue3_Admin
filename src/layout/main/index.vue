<template>
    <router-view v-slot="{Component }"> 
        <transition name="fade">
            <component :is="Component" v-if="flag"></component>
        </transition>
    </router-view>
</template>

<script setup lang="ts">
import {nextTick, ref, watch} from "vue"
import useLayoutSettingStore from "@/store/modules/setting.ts"
let LayoutSettingStore=useLayoutSettingStore()
let flag=ref(true)
watch(()=>LayoutSettingStore.refresh,()=>{
    flag.value=false
    nextTick(()=>{
        flag.value=true
    })
})

</script>

<script lang="ts">
export default{
    name:"Main"
}
</script>

<style scoped>
.fade-enter-from{
    opacity: 0;
    transform: scale(0);
}
.fade-enter-active{
    transition: all 0.3s;
}
.fade-enter-to{
    opacity: 1;
    transform: scale(1);
}

</style>