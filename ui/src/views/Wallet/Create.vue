<template>
  <div class="row m-0 mt-4">
    <div class="col-2"></div>
    <div class="col-8">
      <div class="card">
        <div class="card-header">Create</div>
        <div class="card-body">
          <h3 class="card-title mb-4">Wallet</h3>

          <form @submit.prevent="submit">
            <div class="mb-3">
              <label for="name" class="form-label">Name</label>
              <input
                type="text"
                class="form-control"
                id="name"
                v-model="payload.name"
              />
            </div>
            <div class="mb-3">
              <label for="accountNumber" class="form-label">
                Account Number
              </label>
              <input
                type="text"
                class="form-control"
                id="accountNumber"
                v-model="payload.accountNumber"
              />
            </div>
            <div class="mb-3">
              <label for="type" class="form-label">Type</label>
              <select id="type" class="form-select" v-model="payload.type">
                <option value="BANK">BANK</option>
                <option value="EWALLET">E-WALLET</option>
                <option value="CONVENTIONAL">CONVENTIONAL</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="value" class="form-label">Initial Value</label>
              <input
                type="number"
                class="form-control"
                id="value"
                v-model="payload.initValue"
              />
            </div>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import router from "../../router";
import { useApi } from "../../utils/api";
import { useAuth } from "../../utils/auth";

export default defineComponent({
  setup() {
    const { user } = useAuth();

    const payload = ref({
      name: "",
      accountNumber: "",
      type: "",
      initValue: 0,
      userId: user!.value!.user.id,
    });

    const { loading, post } = useApi("wallet/create");

    const submit = () => {
      console.log(payload.value);
      loading.value = true;

      post(payload.value)
        .then(() => {
          router.push({ name: "wallet" });
        })
        .finally(() => (loading.value = false));
    };

    return {
      payload,
      loading,
      submit,
    };
  },
});
</script>
<style></style>
