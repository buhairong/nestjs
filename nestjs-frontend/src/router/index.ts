import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { App } from 'vue'

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    component: () => import("@/views/login/login.vue"),
  },
  {
    path: "/reg",
    component: () => import("@/views/login/reg.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export function setupRouter(app: App<Element>) {
  app.use(router)
}
