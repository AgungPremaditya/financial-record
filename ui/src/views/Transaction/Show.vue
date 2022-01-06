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
                <button type="button" class="btn btn-danger btn-sm px-2">
                  <FontAwesomeIcon icon="trash-alt" class="me-2" />
                  Delete
                </button>
                <button type="button" class="btn btn-primary btn-sm ms-3 px-2">
                  <FontAwesomeIcon icon="edit" class="me-2" />
                  Edit
                </button>
              </div>
            </div>
            <table class="table">
              <tbody>
                <tr>
                  <th scope="row">Transaction Name</th>
                  <td style="width: 0.2rem">:</td>
                  <td>{{ data.name }}</td>
                </tr>
                <tr>
                  <th scope="row">Date</th>
                  <td style="width: 0.2rem">:</td>
                  <td>{{ dateFormat(data.date) }}</td>
                </tr>
                <tr>
                  <th scope="row">Value</th>
                  <td style="width: 0.2rem">:</td>
                  <td>{{ currencyFormatter.format(data.value) }}</td>
                </tr>
                <tr>
                  <th scope="row">Type</th>
                  <td style="width: 0.2rem">:</td>
                  <td
                    class="fw-bold"
                    :class="
                      data.type === 'INCOME' ? 'text-primary' : 'text-danger'
                    "
                  >
                    {{ data.type }}
                  </td>
                </tr>
                <tr>
                  <th scope="row">Category</th>
                  <td style="width: 0.2rem">:</td>
                  <td>{{ data.category }}</td>
                </tr>
                <tr>
                  <th scope="row">Wallet Name</th>
                  <td style="width: 0.2rem">:</td>
                  <td class="fw-bold">
                    <router-link
                      :to="{
                        name: 'walletShow',
                        params: { id: data.walletId },
                      }"
                      >{{ data.wallet.name }}</router-link
                    >
                  </td>
                </tr>
                <tr>
                  <th style="width: 12rem; border-bottom: none" scope="row">
                    Detail
                  </th>
                  <td style="width: 0.2rem; border-bottom: none">:</td>
                  <td style="border-bottom: none">
                    {{ data.detail }}
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

library.add(faTrashAlt, faEdit);

export default defineComponent({
  setup() {
    const route = useRoute();
    console.log(route.params.id);
    const dateFormat = (date: string) => {
      return new Date(date).toLocaleDateString("en-EN", {
        weekday: "long",
        month: "long",
        year: "numeric",
        day: "numeric",
      });
    };
    const currencyFormatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    });
    const { loading, data, error, get } = useApi(
      `transaction/${route.params.id}`
    );
    get();
    return {
      loading,
      currencyFormatter,
      dateFormat,
      data,
    };
  },
  components: { FontAwesomeIcon, Loading },
});
</script>
