<template>
  <Loading v-if="loading || payload.name === ''"></Loading>
  <div v-if="!loading" class="row m-0 mt-4">
    <div class="col-2"></div>
    <div class="col-8">
      <div class="card">
        <div class="card-header">Create</div>
        <div class="card-body">
          <h3 class="card-title mb-4">Wallet</h3>

          <div class="alert alert-danger" role="alert" v-if="errors">
            {{ errors }}
          </div>
          <form @submit.prevent="submit" :validation-schema="walletInputSchema">
            <div class="mb-3">
              <label for="name" class="form-label">Name</label>
              <input
                type="text"
                class="form-control"
                id="name"
                v-model="payload.name"
                required
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
                required
              />
            </div>
            <div class="mb-3">
              <label for="type" class="form-label">Type</label>
              <select
                id="type"
                class="form-select"
                v-model="payload.type"
                required
              >
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
                required
              />
            </div>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="loading || payload.name === ''"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useAuth } from "../../utils/auth";
import { useApi } from "../../utils/api";
import { useRoute } from "vue-router";

import router from "../../router";
import * as yup from "yup";
import Loading from "../../components/Loading.vue";

// Wallet Schema Validation
const walletInputSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  accountNumber: yup.string().required("Account Number is required"),
  type: yup.string().required("Type is required"),
  initValue: yup.number().required("Init value is required"),
});

export default defineComponent({
  setup() {
    const { user } = useAuth();
    const route = useRoute();
    const payload = ref({
      name: "",
      accountNumber: "",
      type: "",
      initValue: 0,
      userId: user!.value!.user.id,
    });
    const { data, get } = useApi(`wallet/${route.params.id}`);
    get().then(() => {
      payload.value.name = data.value.name;
      payload.value.accountNumber = data.value.accountNumber;
      payload.value.type = data.value.type;
      payload.value.initValue = data.value.initValue;
    });
    const errors = ref();
    const { loading, put } = useApi(`wallet/${route.params.id}`);
    const submit = () => {
      walletInputSchema
        .validate(payload.value)
        .then(() => errors.value)
        .catch((err) => {
          errors.value = err.message;
        });
      put(payload.value)
        .then(() => {
          router.push({ name: "wallet" });
        })
        .finally(() => (loading.value = false));
    };
    return {
      payload,
      loading,
      walletInputSchema,
      errors,
      submit,
    };
  },
  components: { Loading },
});
</script>
<style></style>
