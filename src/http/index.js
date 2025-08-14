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

httpRequest.interceptors.request.use(
  async (config) => {
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
    // 401 自动登录与请求重放
    const statusCode = error?.statusCode ?? error?.data?.statusCode;
    const originalConfig = error?.config || {};

    // 在模块作用域内维护单例状态（通过闭包变量）
    if (typeof httpRequest.__isLoginInProgress === 'undefined') {
      httpRequest.__isLoginInProgress = false;
    }
    if (!httpRequest.__pending401Queue) {
      httpRequest.__pending401Queue = [];
    }

    if (statusCode === 401) {
      const requestUrl = originalConfig?.url || '';
      const isLoginApi = requestUrl.includes('/mini/login') || originalConfig?.header?.unauthenticatedLogin;

      // 已重试过或为登录接口本身，直接抛出
      if (originalConfig?._retry || isLoginApi) {
        return Promise.reject(error);
      }

      // 将当前请求加入等待队列，待登录完成后重放
      const retryPromise = new Promise((resolve, reject) => {
        httpRequest.__pending401Queue.push({
          config: { ...originalConfig, _retry: true },
          resolve,
          reject,
        });
      });

      // 触发单次登录流程
      if (!httpRequest.__isLoginInProgress) {
        httpRequest.__isLoginInProgress = true;
        loginLogic()
          .then((success) => {
            const queue = httpRequest.__pending401Queue.splice(0);
            if (success) {
              // 登录成功，重放所有 401 请求
              queue.forEach((pending) => {
                httpRequest
                  .request(pending.config)
                  .then(pending.resolve)
                  .catch(pending.reject);
              });
            } else {
              // 登录失败，全部拒绝
              queue.forEach((pending) => pending.reject(error));
            }
          })
          .catch(() => {
            const queue = httpRequest.__pending401Queue.splice(0);
            queue.forEach((pending) => pending.reject(error));
          })
          .finally(() => {
            httpRequest.__isLoginInProgress = false;
          });
      }

      // 不提示 401 的默认错误 Toast，交给登录流程与重放处理
      return retryPromise;
    }

    // 非 401 的错误统一提示
    try {
      await uni.showToast({
        title: error?.data?.messages || '错误请求',
        icon: 'none',
        duration: 4000,
      });
    } catch (e) {
      console.log(e?.message);
    }
    return Promise.reject(error);
  }
);

const loginLogic = async () => {
  const AuthStore = useAuthStore();
  return await AuthStore.LOGIN(); //true为登录成功，false为登录失败
};

export default httpRequest;
