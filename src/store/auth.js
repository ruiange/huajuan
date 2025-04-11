import { defineStore } from 'pinia';
import { loginAPI } from '../api/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: uni.getStorageSync('token') || '',
    userInfo: uni.getStorageSync('userInfo') || null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    getUserInfo: (state) => state.userInfo,
  },

  actions: {
    setToken(token) {},
    setUserInfo(info) {},
    /**
     * 发起登录请求
     * @returns {Promise<void>}
     * @constructor
     */
    async LOGIN() {
      console.log('开始登录');
      const { code } = await uni.login();
      console.log(code);
      const {data,code:resCode} = await loginAPI({ code })
      console.log(data,resCode)
      if(resCode===2000){
        uni.setStorageSync('token', data.token);
        uni.setStorageSync('userInfo', data.userInfo);
        this.setToken(data.token)
        this.setUserInfo(data.userInfo)
      }
    },

    logout() {},
  },
});
