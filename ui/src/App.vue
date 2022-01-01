<script lang="ts">
import { defineComponent, computed } from "vue";
import Navbar from "./components/Navbar.vue";
export default defineComponent({
  components: { Navbar },
});
</script>

<template>
  <div v-if="$route.name !== 'login'">
    <Navbar />
  </div>
  <router-view></router-view>
</template>

<style></style>
