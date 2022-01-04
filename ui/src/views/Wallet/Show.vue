<template>
  <Loading v-if="loading"></Loading>
  <div v-if="!loading" class="container mt-4">
    <div class="row m-0 mt-4">
      <div class="col-1"></div>
      <div class="col-10">
        <div class="card">
          <div class="card-header">Detail</div>
          <div class="card-body">
            <h3 class="card-title mb-4">{{ data.name }}</h3>
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

export default defineComponent({
  setup() {
    const route = useRoute();
    console.log(route.params.id);
    const currencyFormatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    });
    const { loading, data, error, get } = useApi(`wallet/${route.params.id}`);
    get();
    return {
      loading,
      currencyFormatter,
      data,
    };
  },
  components: { Loading },
});
</script>
