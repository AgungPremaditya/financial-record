<template>
  <div class="row m-0 mt-4">
    <div class="col-1"></div>
    <div class="col-10">
      <div class="card">
        <div class="card-header">Data Table</div>
        <div class="card-body">
          <h3 class="card-title">Income</h3>
          <div v-if="loading"><h2>LOADING</h2></div>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Item</th>
                <th scope="col">Type</th>
                <th scope="col">Value</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="transaction in data">
                <td>
                  <div class="fw-bolder text-primary">
                    <router-link to="/"> {{ transaction.name }} </router-link>
                  </div>
                  <div class="text-muted">{{ transaction.category }}</div>
                  <div class="text-muted">
                    {{ new Date(transaction.date).toLocaleDateString("id-ID") }}
                  </div>
                </td>
                <td
                  class="fw-bold"
                  :class="
                    transaction.type === 'INCOME'
                      ? 'text-primary'
                      : 'text-danger'
                  "
                >
                  {{ transaction.type }}
                </td>
                <td class="fw-bolder">
                  {{ currencyFormatter.format(transaction.value) }}
                </td>
                <td>
                  <button type="button" class="btn btn-danger btn-sm">
                    Delete
                  </button>
                  <button type="button" class="btn btn-primary btn-sm ms-4">
                    Edit
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useApi } from "../utils/api";

export default defineComponent({
  setup() {
    const { loading, data, get } = useApi("transaction");

    get();

    const currencyFormatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    });

    return {
      loading,
      data,
      currencyFormatter,
    };
  },
});
</script>
