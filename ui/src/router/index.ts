import { createRouter, createWebHistory } from "vue-router";
import { useAuth, AUTH_KEY } from "../utils/auth";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/Register.vue"),
  },
  {
    path: "/transaction",
    name: "transaction",
    component: () => import("../views/Transaction/Index.vue"),
  },
  {
    path: "/transaction/create",
    name: "transactionCreate",
    component: () => import("../views/Transaction/Create.vue"),
  },
  {
    path: "/transaction/:id",
    name: "transactionShow",
    component: () => import("../views/Transaction/Show.vue"),
  },
  {
    path: "/wallet",
    name: "wallet",
    component: () => import("../views/Wallet/Index.vue"),
  },
  {
    path: "/wallet/create",
    name: "walletCreate",
    component: () => import("../views/Wallet/Create.vue"),
  },
  {
    path: "/wallet/:id",
    name: "walletShow",
    component: () => import("../views/Wallet/Show.vue"),
  },
  {
    path: "/wallet/update/:id",
    name: "walletUpdate",
    component: () => import("../views/Wallet/Update.vue"),
  },
  {
    path: "/transaction/update/:id",
    name: "transactionUpdate",
    component: () => import("../views/Transaction/Update.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const { authenticating, user } = useAuth();

router.beforeEach((to, from, next) => {
  if (to.path === "/login" || to.path === "/register") {
    if (authenticating.value) next("/");
    else next();
  } else {
    if (authenticating.value) {
      next();
    } else {
      next("/login");
    }
  }
});

export default router;
