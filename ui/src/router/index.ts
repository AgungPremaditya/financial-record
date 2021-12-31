import { createRouter, createWebHistory } from "vue-router";
import { useAuth, AUTH_KEY } from "../utils/auth";

const routes = [
  {
    path: "/",
    name: "home",
    component: import("../views/Home.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: import("../views/Login.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const { authenticating, user } = useAuth();

router.beforeEach((to, from, next) => {
  if (to.path === "/login") {
    if (authenticating.value) next("/");
    else next();
  } else {
    if (authenticating.value) {
      next();
    } else {
      next({ name: "login" });
    }
  }
});

export default router;
