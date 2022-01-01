<template>
  <link rel="stylesheet" href="./style/Login.css" scoped />
  <div class="center">
    <h1>Sign Up</h1>
    <form @submit.prevent="submit" :validation-schema="registerFormSchema">
      <div class="txt_field" style="margin-bottom: 2em">
        <input type="text" v-model="payload.name" required />
        <span></span>
        <label>Name</label>
      </div>
      <div class="txt_field" style="margin-bottom: 2em">
        <input type="text" v-model="payload.email" required />
        <span></span>
        <label>Email</label>
      </div>
      <div class="txt_field" style="margin-bottom: 2em">
        <input type="password" v-model="payload.password" required />
        <span></span>
        <label>Password</label>
      </div>
      <div class="error_text" style="margin-bottom: 2em" v-if="errors">
        {{ errors }}
      </div>
      <button type="submit" class="btnInput" :disabled="loading">Login</button>
      <div class="signup_link">
        Not a member? <router-link to="/login">Sign In</router-link>
      </div>
      <span v-if="loading"> Loading</span>
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
const registerFormSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().required("Email is required").email("Email is invalid"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 character")
    .required("Password is required"),
});

export default defineComponent({
  setup() {
    const { loading, data, post } = useApi("auth/register");
    const router = useRouter();

    const payload = ref({
      name: "",
      email: "",
      password: "",
    });

    const errors = ref();

    const submit = () => {
      registerFormSchema
        .validate(payload.value)
        .then(() => errors.value)
        .catch((err) => {
          errors.value = err.message;
        });

      post(payload.value).then(() => {
        console.log(data.value);

        router.push({ name: "login" });
      });
    };

    return {
      registerFormSchema,
      payload,
      errors,
      loading,
      submit,
    };
  },
});
</script>
