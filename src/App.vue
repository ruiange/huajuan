<script>
  import { useAuthStore } from './store/auth';

  export default {
    onLaunch: function () {
      const AuthStore = useAuthStore();
      const isLoggedIn = AuthStore.isLoggedIn;
      if (!isLoggedIn) {
        AuthStore.LOGIN();
      }
    },
    onShow: function () {},
    onHide: function () {},
  };
</script>

<style>
  /*每个页面公共css */
  page {
    background: #f7f8fa;
  }
  view {
    box-sizing: border-box;
  }
</style>
