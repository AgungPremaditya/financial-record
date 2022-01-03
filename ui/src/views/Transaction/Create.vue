<template>
  <div class="row m-0 mt-4">
    <div class="col-2"></div>
    <div class="col-8">
      <div class="card">
        <div class="card-header">Data Table</div>
        <div class="card-body">
          <h3 class="card-title mb-4">Transaction</h3>

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
              <label for="type" class="form-label">Type</label>
              <select id="type" class="form-select" v-model="payload.type">
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
              />
            </div>
            <div class="mb-3">
              <label for="category" class="form-label">Category</label>
              <input
                type="text"
                class="form-control"
                id="category"
                v-model="payload.category"
              />
            </div>
            <div class="mb-3">
              <label for="value" class="form-label">Value</label>
              <input
                type="number"
                class="form-control"
                id="value"
                v-model="payload.value"
              />
            </div>
            <div class="mb-3">
              <label for="name" class="form-label">Wallet</label>
              <select
                class="form-select"
                v-model="payload.walletId"
                v-for="item in data"
              >
                <option :value="item.id">{{ item.name }}</option>
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

    const { loading, data, get } = useApi("wallet");
    get();

    const { post } = useApi("transaction");

    const submit = () => {
      console.log(payload.value);
      loading.value = true;

      post(payload.value)
        .then(() => {
          router.push({ name: "transaction" });
        })
        .finally(() => (loading.value = false));
    };

    return {
      payload,
      data,
      loading,
      submit,
    };
  },
});
</script>
<style></style>
