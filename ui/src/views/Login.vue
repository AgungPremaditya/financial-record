<template>
  <link rel="stylesheet" href="./style/Login.css" />
  <div class="center">
    <h1>Login</h1>
    <form @submit.prevent="submit">
      <div class="txt_field">
        <input type="text" v-model="payload.username" required />
        <span></span>
        <label>Username</label>
      </div>
      <div class="txt_field" style="margin-bottom: 3em">
        <input type="password" v-model="payload.password" required />
        <span></span>
        <label>Password</label>
      </div>
      <input type="submit" value="Login" />
      <div class="signup_link">Not a member? <a href="#">Signup</a></div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const router = useRouter();
    const payload = ref({
      username: "",
      password: "",
    });

    const submit = () => {
      localStorage.setItem("auth-key", JSON.stringify(payload.value));
      router.replace({ name: "home" });
    };

    return {
      payload,
      submit,
    };
  },
});
</script>
