import Request from 'luch-request';

const BASE_API = import.meta.env.VITE_APP_API_URL;
const env = import.meta.env.VITE_APP_ENV;
const httpRequest = new Request({
  baseURL: BASE_API,
  timeout: 30000, //超时
  method: 'POST',
  header: {
    'Content-Type': 'application/json',
  },
});

// 请求队列
let requestList = [];
// 是否正在刷新中
let isRefreshToken = false;

//请求拦截器
httpRequest.interceptors.request.use(
  async (config) => {
    const token = uni.getStorageSync('token');
    if (token && !config.header.unauthenticatedLogin) {
      config.header.Authorization = token;
    }
    return config;
  },
  async (err) => {
    return Promise.reject(err);
  }
);

//响应拦截器
httpRequest.interceptors.response.use(
  async (response) => {
    uni.hideLoading();
    if (response.data.code !== 2000) {
      await uni.showToast({
        title: response.data.message,
        icon: 'none',
        duration: 4000,
      });
    }
    return response.data;
  },
  async (error) => {
    console.log(error);
    try {
      await uni.showToast({
        title: error.data.messages || '错误请求',
        icon: 'none',
        duration: 4000,
      });
    } catch (e) {
      console.log(e.message);
    }
    return Promise.reject(error);
  }
);

export default httpRequest;
