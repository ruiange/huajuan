/**
 * HTTP 客户端封装（uni-app + luch-request）
 *
 * 功能:
 * - 统一 baseURL、超时、默认请求方法与头信息
 * - 在请求拦截器中注入本地存储的鉴权 Token
 * - 在响应拦截器中统一处理业务状态码与异常提示
 * - 预留刷新 Token 相关的状态变量（当前未启用）
 *
 * 环境变量:
 * - VITE_APP_API_URL: 后端基础地址
 * - VITE_APP_ENV: 运行环境标识（dev/test/prod 等）
 */
import Request from 'luch-request';
import { useAuthStore } from '../store/auth';

// 后端基础地址（由 Vite 注入的环境变量）
const BASE_API = import.meta.env.VITE_APP_API_URL;
// 当前运行环境（如 development/test/production）——当前文件未直接使用，保留以便扩展
const env = import.meta.env.VITE_APP_ENV;
// 创建请求实例，设置通用选项
const httpRequest = new Request({
  baseURL: BASE_API,
  // 请求超时时间（毫秒）
  timeout: 30000, //超时
  method: 'POST',
  header: {
    // 默认使用 JSON 报文
    'Content-Type': 'application/json',
  },
});

// 响应阶段的重放队列：在 401 登录中转时缓存待重放请求
// 结构：Array<{ resolve: Function, reject: Function, config: any }>
let requestList = [];

let loginWaiters = [];
// 是否正在刷新 Token（当前未启用刷新逻辑，仅预留）
let isRefreshToken = false;


httpRequest.interceptors.request.use(
  async (config) => {
    // 若正在登录中，则暂停后续非匿名请求，等待登录完成后再继续
    if (isRefreshToken && !config.header.unauthenticatedLogin) {
      await new Promise((resolve, reject) => {
        loginWaiters.push({ resolve, reject });
      });
    }

    // 从本地同步获取鉴权 Token
    const token = uni.getStorageSync('token');
    // 非匿名请求则在请求头中附加 Token（登录完成后会读取到最新 token）
    if (token && !config.header.unauthenticatedLogin) {
      config.header.Authorization = token;
    }
    return config;
  },
  async (err) => {
    return Promise.reject(err);
  }
);

// 响应拦截器：在收到后端响应后统一处理
// 约定：后端业务成功返回 code === 2000
// - 自动隐藏 Loading
// - 业务失败时弹出后端返回的 message
// - 始终返回 response.data，便于调用方直接使用
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
    console.log('错误请求==============');
    console.log(error);
    const statusCode = error?.statusCode ?? error?.data?.statusCode;
    console.log(statusCode, 'statusCode');
    try {
      await uni.showToast({
        title: error.data?.messages || '错误请求',
        icon: 'none',
        duration: 4000,
      });
    } catch (e) {
      console.log(e.message);
    }
    return Promise.reject(error);
  }
);

const loginLogic = async () => {
  const AuthStore = useAuthStore();
  return await AuthStore.LOGIN();
};


export default httpRequest;
