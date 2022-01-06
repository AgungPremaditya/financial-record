import { createApp } from "vue";

// Import Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "../style/Login.css";

import App from "./App.vue";

// Import Router
import router from "./router";

// Import Chart
import {
  Chart,
  LineController,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";

// Register Chart
Chart.register(
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip
);

const app = createApp(App);

app.use(router);
app.mount("#app");

// createApp(App).use(router).mount("#app");
