<script lang="ts">
import { defineComponent } from "vue";
import Navbar from "./components/Navbar.vue";
export default defineComponent({
  components: { Navbar },
});
</script>

<template>
  <div v-if="$route.name !== 'login' && $route.name !== 'register'">
    <Navbar />
  </div>
  <router-view />
</template>

<style></style>
