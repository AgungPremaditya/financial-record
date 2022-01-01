<template>
  <div v-if="loading">
    <h1><center>Loading...</center></h1>
  </div>
  <div>
    <h1>Income</h1>
    <LineChart
      :chart-data="{
        labels: incomeChartDate,
        datasets: [
          {
            data: incomeChartData,
            backgroundColor: '#0079AF',
          },
        ],
      }"
    ></LineChart>
    <h1>Expense</h1>
    <LineChart
      :chart-data="{
        labels: expenseChartDate,
        datasets: [
          {
            data: expenseChartData,
            backgroundColor: '#0079AF',
          },
        ],
      }"
    ></LineChart>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref, computed, onMounted } from "vue";
import { LineChart } from "vue-chart-3";
import { date, string } from "yup/lib/locale";

import { useApi } from "../utils/api";
import { useAuth } from "../utils/auth";

export default defineComponent({
  components: { LineChart },
  setup() {
    const { loading, data, get } = useApi("dashboard");

    get();

    const incomeChartDate = computed(() => {
      let dateArray: string[] = [];
      data.value.income.forEach((element: { date: string }) => {
        dateArray.push(new Date(element.date).toLocaleDateString());
      });

      return dateArray;
    });

    const incomeChartData = computed(() => {
      let dataArray: number[] = [];
      data.value.income.forEach((element: { total: number }) => {
        dataArray.push(element.total);
      });

      return dataArray;
    });

    const expenseChartDate = computed(() => {
      let dateArray: string[] = [];
      data.value.expense.forEach((element: { date: string }) => {
        dateArray.push(new Date(element.date).toLocaleDateString());
      });

      return dateArray;
    });

    const expenseChartData = computed(() => {
      let dataArray: number[] = [];
      data.value.expense.forEach((element: { total: number }) => {
        dataArray.push(element.total);
      });

      return dataArray;
    });

    return {
      loading,
      incomeChartDate,
      incomeChartData,
      expenseChartDate,
      expenseChartData,
      data,
    };
  },
});
</script>

<style></style>
