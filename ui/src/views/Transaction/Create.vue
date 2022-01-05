<template>
  <Loading v-if="loading"></Loading>
  <div class="row m-0 mt-4" v-if="!loading">
    <div class="col-2"></div>
    <div class="col-8">
      <div class="card">
        <div class="card-header">Create</div>
        <div class="card-body">
          <h3 class="card-title mb-4">Transaction</h3>

          <div class="alert alert-danger" role="alert" v-if="errors">
            {{ errors }}
          </div>

          <div class="alert alert-danger" role="alert" v-if="data.length === 0">
            You don't have any wallet, please add wallet first
          </div>
          <form
            @submit.prevent="submit"
            :validation-schema="transactionInputSchema"
          >
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
              <label for="type" class="form-label">Type</label>
              <select
                id="type"
                class="form-select"
                v-model="payload.type"
                required
              >
                <option value="INCOME">INCOME</option>
                <option value="EXPENSE">EXPENSE</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="date" class="form-label">Date</label>
              <input
                type="date"
                class="form-control"
                id="date"
                v-model="payload.date"
                required
              />
            </div>
            <div class="mb-3">
              <label for="category" class="form-label">Category</label>
              <input
                type="text"
                class="form-control"
                id="category"
                v-model="payload.category"
                required
              />
            </div>
            <div class="mb-3">
              <label for="value" class="form-label">Value</label>
              <input
                type="number"
                class="form-control"
                id="value"
                v-model="payload.value"
                required
              />
            </div>
            <div class="mb-3">
              <label for="name" class="form-label">Wallet</label>
              <select class="form-select" v-model="payload.walletId" required>
                <option v-for="item in data" :value="item.id">
                  {{ item.name }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label for="detail" class="form-label">Detail</label>
              <textarea
                class="form-control"
                v-model="payload.detail"
                rows="7"
              ></textarea>
            </div>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="loading || data.length === 0"
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
import { defineComponent, ref, watchEffect } from "vue";
import { useApi } from "../../utils/api";
import { useRouter } from "vue-router";
import * as yup from "yup";
import Loading from "../../components/Loading.vue";

// Login Schema Validation
const transactionInputSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  type: yup.string().required("Type is required"),
  date: yup.string().required("Date is required"),
  category: yup.string().required("Category is required"),
  value: yup.number().required("Value is required"),
  walletId: yup.number().required("Wallet is required"),
});

export default defineComponent({
  setup() {
    const payload = ref({
      name: "",
      type: "",
      date: "",
      category: "",
      detail: "",
      value: 0,
      walletId: 0,
    });
    const router = useRouter();
    const errors = ref();
    const { loading, data, get } = useApi("wallet");
    get();
    const { post } = useApi("transaction");
    const submit = () => {
      transactionInputSchema
        .validate(payload.value)
        .then(() => errors.value)
        .catch((err) => {
          errors.value = err.message;
        });
      post(payload.value)
        .then(() => {
          router.push({ name: "transaction" });
        })
        .finally(() => (loading.value = false));
    };
    return {
      transactionInputSchema,
      errors,
      payload,
      data,
      loading,
      submit,
    };
  },
  components: { Loading },
});
</script>
<style></style>
