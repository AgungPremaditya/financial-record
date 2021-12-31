<template>
  <div v-if="loading">
    <h1><center>Loading...</center></h1>
  </div>
  <div>
    <h1>Income</h1>
    <LineChart
      :chart-data="{
        labels: chartDate,
        datasets: [
          {
            data: chartData,
            backgroundColor: '#0079AF',
          },
        ],
      }"
    ></LineChart>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref, computed } from "vue";
import { LineChart } from "vue-chart-3";
import { date, string } from "yup/lib/locale";

import { useApi } from "../utils/api";
import { useAuth } from "../utils/auth";

export default defineComponent({
  components: { LineChart },
  setup() {
    const { loading, data, get } = useApi("dashboard");

    get();

    const chartDate = computed(() => {
      let dateArray: string[] = [];
      data.value.income.forEach((element: { date: string }) => {
        dateArray.push(new Date(element.date).toLocaleDateString());
      });

      return dateArray;
    });

    const chartData = computed(() => {
      let dateArray: number[] = [];
      data.value.income.forEach((element: { _sum: { value: number } }) => {
        dateArray.push(element._sum.value);
      });

      return dateArray;
    });

    return {
      loading,
      chartDate,
      chartData,
    };
  },
});
</script>

<style></style>
