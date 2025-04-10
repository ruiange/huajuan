import { defineStore } from 'pinia';
import { loginAPI } from '../api/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
    userInfo: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
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
      await loginAPI({ code })
    },

    logout() {},
  },
});
