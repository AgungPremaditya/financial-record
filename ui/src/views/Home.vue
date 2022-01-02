<template>
  <div v-if="loading">
    <h1><center>Loading...</center></h1>
  </div>
  <div>
    <div class="row m-0 mt-4">
      <div class="col-1"></div>
      <div class="col-10">
        <div class="card">
          <div class="card-header">Chart</div>
          <div class="card-body">
            <h3 class="card-title mb-4">Income</h3>
            <LineChart
              :chart-data="{
                labels: incomeChartDate,
                datasets: [
                  {
                    data: incomeChartData,
                    backgroundColor: '#2637d9',
                    borderColor: '#e9ebfb',
                  },
                ],
              }"
            ></LineChart>
          </div>
        </div>
      </div>
    </div>
    <div class="row m-0 mt-4 mb-4">
      <div class="col-1"></div>
      <div class="col-10">
        <div class="card">
          <div class="card-header">Chart</div>
          <div class="card-body">
            <h3 class="card-title mb-4">Expense</h3>
            <LineChart
              :chart-data="{
                labels: expenseChartDate,
                datasets: [
                  {
                    data: expenseChartData,
                    backgroundColor: '#800000',
                    borderColor: '#ffe8e8',
                  },
                ],
              }"
            ></LineChart>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { LineChart } from "vue-chart-3";
import { useApi } from "../utils/api";

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
