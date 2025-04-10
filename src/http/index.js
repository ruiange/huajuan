import Request from 'luch-request'

const BASE_API = import.meta.env.VITE_APP_API_URL
const env = import.meta.env.VITE_APP_ENV
const httpRequest = new Request({
  baseURL: BASE_API,
  timeout: 30000, //超时
  method: 'POST',
  header: {
    'Content-Type': 'application/json',
  },
});

const tokenName = `${env}_token`
const refreshTokenName = `${env}_refreshToken`
const userInfoName = `${env}_userInfo`
const phoneBindName = `${env}_phoneBind`

// 请求队列
let requestList = [];
// 是否正在刷新中
let isRefreshToken = false;


//请求拦截器
httpRequest.interceptors.request.use(
  async (config) => {
    const tokenName = `${env}_token`
    const token = uni.getStorageSync(tokenName);
    if (token&&!config.header.unauthenticatedLogin) {
      config.header.Authorization =  token;
    }
    return config
  },
  async (err) => {
    return Promise.reject(err)
  }
)

//响应拦截器
httpRequest.interceptors.response.use(
  async (response) => {
    if (response.data.code === 2000) {
      return response.data
    }
    uni.hideLoading()
    await uni.showToast({
      title: response.data.message || '请求错误',
      duration: 3000,
      icon: 'none',
    })

    return response.data

  },
  async (error) => {
    return Promise.reject(error)
  }
)


export default httpRequest