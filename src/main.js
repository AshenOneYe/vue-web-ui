import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router/router'
import App from './App.vue'
import { zhCn } from 'element-plus/es/locale'

const app = createApp(App)
app.use(router)
app.use(ElementPlus,{
  locale: zhCn
})
app.mount('#app')
