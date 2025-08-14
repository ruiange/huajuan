import { defineStore } from 'pinia';
import { loginAPI } from '../api/auth';
import { getUserInfoAPI } from '../api/user';

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
    setToken(token) {
      this.token = token;
    },
    setUserInfo(info) {
      this.userInfo = info;
    },
    async UPDATE_INFO() {
      await uni.showLoading({
        title: '加载中...',
      })
     try{
       const { data } = await getUserInfoAPI();
       this.setUserInfo(data.userInfo);
       uni.hideLoading()
     }catch (e) {
       uni.hideLoading()
       console.log(e.message);
       this.logout()
       await this.LOGIN()
     }
    },
    /**
     * 发起登录请求
     * @returns {Promise<boolean>}
     * @constructor
     */
    async LOGIN() {
      console.log('开始登录');
      await uni.showLoading({
        title: '登录中...',
      });
      const { code } = await uni.login();
      console.log(code,'code=========')
      const { data, code: resCode } = await loginAPI({ code });
      console.log(resCode,'rescode===========')
      if (resCode === 2000) {
        uni.setStorageSync('token', data.token);
        uni.setStorageSync('userInfo', data.userInfo);
        this.setToken(data.token);
        this.setUserInfo(data.userInfo);
        await uni.hideLoading();
        await uni.showToast({
          title: '登录成功',
          icon: 'none',
          duration: 4000,
        });
        console.log('登录结束');
        return true
      }else{
        uni.hideLoading();
        await uni.showToast({
          title: '登录失败',
          icon: 'none',
          duration: 4000,
        });
        return false
      }

    },

    logout() {
      uni.removeStorageSync('token');
      uni.removeStorageSync('userInfo');
      this.token = '';
      this.userInfo = null;

    },
  },
});
