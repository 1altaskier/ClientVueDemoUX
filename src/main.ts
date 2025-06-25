import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'vue-toastification/dist/index.css'

// Import specific icons or whole packs
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

library.add(faPlus)
library.add(fas)

const app = createApp(App)

app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')