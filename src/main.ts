import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Im[ot Toaster]
import 'vue-toastification/dist/index.css'

// Import specific icons or whole packs
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

// Import Floating Vue for Tool Tips
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'

library.add(faPlus)
library.add(fas)

const app = createApp(App)

app.use(FloatingVue)
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')