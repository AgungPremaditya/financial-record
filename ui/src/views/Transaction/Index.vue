<template>
  <Loading v-if="loading"></Loading>
  <div v-if="!loading" class="row m-0 mt-4">
    <div class="col-1"></div>
    <div class="col-10">
      <div class="card">
        <div class="card-header">Data Table</div>
        <div class="card-body">
          <div class="row mb-4">
            <div class="col-9">
              <h3 class="card-title">Transaction</h3>
            </div>
            <div class="col-3 d-flex justify-content-end">
              <router-link to="/transaction/create">
                <button class="btn btn-primary" type="button">
                  + Add New Record
                </button>
              </router-link>
            </div>
          </div>
          <div v-if="loading"><h2>LOADING</h2></div>
          <div class="row my-4">
            <div class="col-3">
              <input
                type="text"
                class="form-control"
                placeholder="Start Date Filter"
                onfocus="(this.type='date')"
                v-model="payload.startDate"
              />
            </div>
            <div class="col-3">
              <input
                type="text"
                class="form-control"
                placeholder="End Date Filter"
                onfocus="(this.type='date')"
                v-model="payload.endDate"
              />
            </div>
            <div class="col-2"></div>
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
                <th scope="col">Type</th>
                <th scope="col">Value</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="transaction in searchQuery !== '' ? searchedItem : item"
              >
                <td>
                  <div class="fw-bolder text-primary">
                    <router-link
                      :to="{
                        name: 'transactionShow',
                        params: { id: transaction.id },
                      }"
                    >
                      {{ transaction.name }}
                    </router-link>
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
                  <button
                    @click="remove(transaction.id)"
                    type="button"
                    class="btn btn-danger btn-sm"
                    :disabled="loading"
                  >
                    <FontAwesomeIcon icon="trash-alt"></FontAwesomeIcon>
                  </button>

                  <router-link
                    :to="{
                      name: 'transactionUpdate',
                      params: { id: transaction.id },
                    }"
                  >
                    <button type="button" class="btn btn-primary btn-sm ms-4">
                      <FontAwesomeIcon icon="edit"></FontAwesomeIcon></button
                  ></router-link>
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
import { defineComponent, computed, ref } from "vue";
import { useApi } from "../../utils/api";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import Loading from "../../components/Loading.vue";

library.add(faTrashAlt, faEdit);

export default defineComponent({
  components: { FontAwesomeIcon, Loading },
  setup() {
    const { loading, data, get, del } = useApi("transaction");
    get();

    // Set start date and end date
    const date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 2)
      .toISOString()
      .split("T")[0];
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1)
      .toISOString()
      .split("T")[0];

    const payload = ref({
      startDate: firstDay,
      endDate: lastDay,
    });

    // Filter by date
    const item = computed(() => {
      return data.value.filter((transaction: { date: string }) => {
        return (
          new Date(transaction.date).toISOString().split("T")[0] >=
            payload.value.startDate &&
          new Date(transaction.date).toISOString().split("T")[0] <=
            payload.value.endDate
        );
      });
    });

    // Search
    const searchQuery = ref("");
    const searchedItem = computed(() => {
      return item.value.filter((item: { name: string }) => {
        return (
          item.name.toLowerCase().indexOf(searchQuery.value.toLowerCase()) != -1
        );
      });
    });

    // Format Currency
    const currencyFormatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    });

    // Remove
    const remove = (id: number) => {
      del(id).then(() => {
        window.location.reload();
      });
    };

    return {
      loading,
      currencyFormatter,
      payload,
      item,
      searchQuery,
      searchedItem,
      remove,
    };
  },
});
</script>
