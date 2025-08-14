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
// 请求阶段的等待队列：当检测到登录中时，后续请求在 request 拦截器中暂停，待登录完成后继续
// 结构：Array<{ resolve: Function, reject: Function }>
let loginWaiters = [];
// 是否正在刷新 Token（当前未启用刷新逻辑，仅预留）
let isRefreshToken = false;

// 请求拦截器：在请求发出前统一处理
// - 自动从本地获取 token 并注入到 Authorization 头
// - 通过在调用处设置 `config.header.unauthenticatedLogin = true` 可跳过鉴权（如登录接口）
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
    // 请求在发出前的配置阶段即抛错（一般较少见）
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
    const originalConfig = error?.config || {};

    // 401 处理：触发登录并在成功后重放请求
    if (statusCode === 401) {
      // 针对匿名/登录接口自身的 401，直接抛出，避免死循环
      if (originalConfig?.header?.unauthenticatedLogin) {
        return Promise.reject(error);
      }
      // 若已在登录/刷新中，则把当前请求加入队列，等待完成后重放
      if (isRefreshToken) {
        // 登录过程中：将当前请求加入待重放队列，并阻止继续发起
        return new Promise((resolve, reject) => {
          requestList.push({ resolve, reject, config: originalConfig });
        });
      }

      // 首个 401 触发登录
      isRefreshToken = true;
      try {
        const ok = await loginLogic();
        if (!ok) {
          // 登录失败：拒绝所有排队请求
          requestList.forEach(({ reject }) => reject(new Error('登录失败')));
          requestList = [];
          throw error;
        }

        // 重放队列中的请求
        const pending = requestList.slice();
        requestList = [];
        pending.forEach(({ resolve, reject, config }) => {
          const retryConfig = { ...config };
          retryConfig.header = retryConfig.header || {};
          if (retryConfig._retried) {
            return reject(new Error('重复重试已被阻止'));
          }
          retryConfig._retried = true;
          httpRequest.request(retryConfig).then(resolve).catch(reject);
        });

        // 重试当前请求
        const retryCurrent = { ...originalConfig };
        retryCurrent.header = retryCurrent.header || {};
        if (retryCurrent._retried) {
          throw error;
        }
        retryCurrent._retried = true;
        return httpRequest.request(retryCurrent);
      } catch (loginErr) {
        // 登录异常：拒绝所有排队请求并抛出
        requestList.forEach(({ reject }) => reject(loginErr));
        requestList = [];
        throw loginErr;
      } finally {
        isRefreshToken = false;
        // 唤醒在请求阶段因登录中被暂停的请求
        loginWaiters.forEach(({ resolve }) => resolve());
        loginWaiters = [];
      }
    }

    console.log(statusCode, 'statusCode');
    try {
      // 网络异常或非 2xx HTTP 状态码会进入此处
      // 尽量从后端返回体中提取更友好的错误信息
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
  return await AuthStore.LOGIN(); //ture 登录成功 false 登录失败
};

// 导出统一的 http 实例，供业务模块按需导入使用
export default httpRequest;
