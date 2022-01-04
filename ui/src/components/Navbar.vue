<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <span class="navbar-brand fw-bold">Financial Record</span>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/transaction">
              Transaction
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/wallet">Wallet</router-link>
          </li>
        </ul>
        <div class="nav-item me-4">
          <button
            type="button"
            @click="signOut()"
            class="btn"
            :disabled="loading"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import { useApi } from "../utils/api";
import { useAuth } from "../utils/auth";
export default defineComponent({
  setup() {
    const { user, logout } = useAuth();
    const { post, loading } = useApi("auth/logout");
    const router = useRouter();
    const signOut = () => {
      post()
        .then(() => {
          router.replace("/login");
          logout();
        })
        .catch(() => {
          loading.value = false;
        });
    };
    return { user, signOut, loading };
  },
});
</script>
