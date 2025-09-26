import { createRouter, createWebHistory } from "vue-router"
import Landing from "../views/Landing.vue"
import Authors from "../views/Authors.vue"
import Books from "../views/Books.vue"
import Login from "../views/Login.vue"

const routes = [
  { path: "/", name: "Landing", component: Landing },
  { 
    path: "/authors", 
    name: "Authors", 
    component: Authors,
    meta: { requiresAuth: true } // 🔒 treba login
  },
  { 
    path: "/books", 
    name: "Books", 
    component: Books,
    meta: { requiresAuth: true } // 🔒 treba login
  },
  { path: "/login", name: "Login", component: Login }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ✅ Route guard
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem("token")

  if (to.meta.requiresAuth && !isLoggedIn) {
    // ako ruta zahtijeva login, a korisnik nije prijavljen
    next("/login")
  } else {
    next()
  }
})

export default router
