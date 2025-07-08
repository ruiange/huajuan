import { createApp } from 'vue';
import App from './App.vue';
import pinia from './store';

const app = createApp(App);

app.use(pinia); // 确保在挂载应用之前调用 app.use(pinia)
app.mount('#app');
