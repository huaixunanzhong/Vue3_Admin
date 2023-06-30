<template>
    <div class="logo_container" v-if="setting.logoHidden">
        <img :src="setting.logo">
        <p>{{setting.title}}</p>
    </div>
</template>

<script setup lang="ts">
import setting from '@/setting';

</script>

<script lang="ts">
export default{
    name:"Logo"
}
</script>

<style scoped lang="scss">
.logo_container{
    width: 100%;
    height: $base-tabbar-height;
    display: flex;
    align-items: center;
    padding: 10px;
    img{
        width: 40px;
        height: 40px;
    }
    p{
        font-size: $base-menu-title-fontSize;
        color: white;
        margin-left: 10px;
    }
}
</style>