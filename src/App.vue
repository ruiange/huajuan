<script>


import {useAuthStore} from "./store/auth";



export default {
  onLaunch: function () {
    const AuthStore =  useAuthStore()
    AuthStore.LOGIN()
  },
  onShow: function () {
  },
  onHide: function () {
  },
}
</script>

<style>
/*每个页面公共css */
page{
  background: #F7F8FA;
}
view{
  box-sizing: border-box;
}
</style>
