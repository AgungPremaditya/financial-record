<template>
  <Loading v-if="loading"></Loading>
  <div v-if="!loading" class="container mt-4">
    <div class="row m-0 mt-4">
      <div class="col-1"></div>
      <div class="col-10">
        <div class="card">
          <div class="card-header">Detail</div>
          <div class="card-body">
            <div class="row mb-4">
              <div class="col-9">
                <h3 class="card-title">{{ data.name }}</h3>
              </div>
              <div class="col-3 d-flex justify-content-end">
                <div>
                  <button
                    @click="remove(data.id)"
                    type="button"
                    class="btn btn-danger btn-sm px-2"
                    :disabled="loading"
                  >
                    <FontAwesomeIcon icon="trash-alt" class="me-2" />
                    Delete
                  </button>
                </div>
                <router-link
                  :to="{ name: 'walletUpdate', params: { id: data.id } }"
                >
                  <button
                    type="button"
                    class="btn btn-primary btn-sm ms-3 px-2"
                  >
                    <FontAwesomeIcon icon="edit" class="me-2" />
                    Edit
                  </button>
                </router-link>
              </div>
            </div>
            <table class="table">
              <tbody>
                <tr>
                  <th scope="row">Wallet Name</th>
                  <td style="width: 0.2rem">:</td>
                  <td>{{ data.name }}</td>
                </tr>
                <tr>
                  <th scope="row">Initial Value</th>
                  <td style="width: 0.2rem">:</td>
                  <td>{{ currencyFormatter.format(data.initValue) }}</td>
                </tr>
                <tr>
                  <th scope="row">Type</th>
                  <td style="width: 0.2rem">:</td>
                  <td>{{ data.type }}</td>
                </tr>
                <tr>
                  <th style="width: 12rem; border-bottom: none" scope="row">
                    Account Number
                  </th>
                  <td style="width: 0.2rem; border-bottom: none">:</td>
                  <td style="border-bottom: none">
                    {{ data.accountNumber }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRoute } from "vue-router";
import { useApi } from "../../utils/api";
import Loading from "../../components/Loading.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import router from "../../router";

library.add(faTrashAlt, faEdit);

export default defineComponent({
  setup() {
    const route = useRoute();
    const { loading, data, error, del, get } = useApi("wallet");
    get(parseInt(`${route.params.id}`));

    // Remove
    const remove = (id: number) => {
      del(id).then(() => {
        router.push({ name: "wallet" });
      });
    };

    // Format Currency
    const currencyFormatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    });

    return {
      loading,
      currencyFormatter,
      data,
      remove,
    };
  },
  components: { FontAwesomeIcon, Loading },
});
</script>
