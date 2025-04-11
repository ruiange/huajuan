<script>


import {useAuthStore} from "./store/auth";



export default {
  onLaunch: function () {
    const AuthStore =  useAuthStore()
    const isLoggedIn  = AuthStore.isLoggedIn
    if(!isLoggedIn){
      AuthStore.LOGIN()
    }
    console.log(AuthStore.$state)
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
