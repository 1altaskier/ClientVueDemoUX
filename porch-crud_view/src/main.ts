import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'vue-toastification/dist/index.css'

//import { library } from '@fontawesome/fontawesome-svg-core'
//import '@fontawesome/fontawesome-free/css/all.min.css'
//import { faCheckSquare } from '@fontawesome/free-solid-svg-icons'npm install @fortawesome/free-brands-svg-icons

//library.add(faCheckSquare)

const app = createApp(App)

app.use(router)

//app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')