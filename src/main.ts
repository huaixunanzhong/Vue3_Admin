import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import "@/styles/index.scss"
// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'virtual:svg-icons-register'
import gloablComonents from '@/components'
// element-plus暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css'
import router from './router'
import "./permission"
import pinia from './store'
import App from '@/App.vue'

const app = createApp(App)
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(gloablComonents)
app.use(router)
app.use(pinia)
app.mount('#app')
