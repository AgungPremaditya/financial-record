<template>
  <link rel="stylesheet" href="./style/Login.css" scoped />
  <div class="center">
    <h1>Sign In</h1>
    <form @submit.prevent="submit" :validation-schema="loginFormSchema">
      <div class="txt_field">
        <input type="text" v-model="payload.email" required />
        <span></span>
        <label>Email</label>
      </div>
      <div class="txt_field" style="margin-bottom: 1em">
        <input type="password" v-model="payload.password" required />
        <span></span>
        <label>Password</label>
      </div>
      <div class="error_text" style="margin-bottom: 2em" v-if="errors">
        {{ errors }}
      </div>
      <button type="submit" class="btnInput" :disabled="loading">Login</button>
      <div class="signup_link">
        Not a member? <router-link to="/register">Signup</router-link>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import * as yup from "yup";

import { useApi } from "../utils/api";
import { useAuth } from "../utils/auth";

// Login Schema Validation
const loginFormSchema = yup.object().shape({
  email: yup.string().required("Email is required").email("Email is invalid"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 character")
    .required("Password is required"),
});

export default defineComponent({
  setup() {
    const { loading, data, post } = useApi("auth/login");
    const { setUser } = useAuth();
    const router = useRouter();

    const payload = ref({
      email: "",
      password: "",
    });

    const errors = ref();

    const submit = () => {
      loginFormSchema
        .validate(payload.value)
        .then(() => errors.value)
        .catch((err) => {
          errors.value = err.message;
        });

      post(payload.value).then(() => {
        console.log(data.value);

        setUser(data.value);
        if (!data.value) {
          errors.value = "Email or Password is wrong";
        }
        router.replace({ name: "home" });
      });
    };

    return {
      loginFormSchema,
      payload,
      errors,
      loading,
      submit,
    };
  },
});
</script>
