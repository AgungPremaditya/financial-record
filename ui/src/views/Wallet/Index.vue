<template>
  <Loading v-if="loading"></Loading>
  <div class="row m-0 mt-4">
    <div class="col-1"></div>
    <div class="col-10">
      <div class="card">
        <div class="card-header">Data Table</div>
        <div class="card-body">
          <div class="row mb-4">
            <div class="col-9">
              <h3 class="card-title">Wallet</h3>
            </div>
            <div class="col-3 d-flex justify-content-end">
              <router-link to="/wallet/create">
                <button class="btn btn-primary" type="button">
                  + Add New Wallet
                </button>
              </router-link>
            </div>
          </div>
          <div v-if="loading"><h2>LOADING</h2></div>
          <div class="row my-4">
            <div class="col-8"></div>
            <div class="col-4">
              <input
                type="text"
                class="form-control"
                placeholder="Search..."
                v-model="searchQuery"
              />
            </div>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Item</th>
                <th scope="col">Value</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="transaction in searchedItem">
                <td>
                  <div class="fw-bolder text-primary">
                    <router-link to="/"> {{ transaction.name }} </router-link>
                  </div>
                  <div class="text-muted">{{ transaction.type }}</div>
                </td>
                <td class="fw-bolder">
                  {{ currencyFormatter.format(transaction.initValue) }}
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
import { defineComponent, computed, ref, watch } from "vue";
import { useApi } from "../../utils/api";
import Loading from "../../components/Loading.vue";

export default defineComponent({
  setup() {
    const { loading, data, get } = useApi("wallet");
    get();
    const searchQuery = ref("");
    const searchedItem = computed(() => {
      return data.value.filter((item: { name: string }) => {
        return (
          item.name.toLowerCase().indexOf(searchQuery.value.toLowerCase()) != -1
        );
      });
    });
    const currencyFormatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    });
    return {
      loading,
      currencyFormatter,
      searchQuery,
      searchedItem,
    };
  },
  components: { Loading },
});
</script>
