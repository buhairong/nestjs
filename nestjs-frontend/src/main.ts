import { createApp } from 'vue'
import App from './App.vue'
import { setupStore } from './store'
import { setupRouter } from './router'
import "bootstrap/dist/js/bootstrap"

function bootstrap() {
  const app = createApp(App)

  setupRouter(app)
  setupStore(app)

  app.mount("#app")
}

bootstrap()
