<template>
  <view>
    <view class="name-box mt20">
      <input
        :focus="true"
        :maxlength="17"
        v-model="UserInfo.name"
        @nicknamereview="nicknamereview"
        type="nickname"
        class="input"
        placeholder="请输入昵称 "
      />
      <view v-show="UserInfo.name" style="padding: 10rpx" @click.stop="deleteKeyword">
        <view class="close f-center">
          <text class="single icon-guanbi close-icon"></text>
        </view>
      </view>
    </view>
    <view class="btn-box">
      <view class="btn f-center" @click="saveInfo">保存</view>
    </view>
  </view>
</template>

<script setup>
  import { ref } from 'vue';
  import { onLoad, onShow } from '@dcloudio/uni-app';
  import { useAuthStore } from '../../store/auth';
  import { updateUserInfoAPI } from '../../api/user';
  const UserInfo = ref({
    name: '',
  });
  const deleteKeyword = () => {
    UserInfo.value.name = '';
  };
  const saveInfo = async () => {
    await uni.showLoading({
      title: '保存中',
    });
    const { data } = await updateUserInfoAPI(UserInfo.value);
    console.log(data.userInfo);
    AuthStore.setUserInfo(data.userInfo);
    uni.hideLoading();
    await uni.navigateBack({
      delta: 1,
    });
  };
  const nicknamereview = (res) => {
    console.log(res);
    console.log(res.detail);
    console.log(UserInfo.value);
  };
  const userIfo = ref({});
  const AuthStore = useAuthStore();

  onLoad(() => {
    userIfo.value = AuthStore.userInfo;
    console.log(userIfo.value);
  });
</script>

<style scoped lang="less">
  .name-box {
    width: 100%;
    background-color: #fff;
    padding: 20rpx 30rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .input {
      height: 56rpx;
    }
  }
  .btn-box {
    width: 100%;
    margin-top: 40rpx;

    .btn {
      color: #6e6e6e;
      font-weight: 800;
      width: 600rpx;
      height: 78rpx;
      margin: auto;
      background: linear-gradient(90deg, #d8d9ff 11%, #fdeeec 100%);
      border-radius: 44rpx;
      //box-shadow: 0 4rpx 4rpx 0 rgba(0, 0, 0, 0.25);
      box-sizing: border-box;
      padding-bottom: 10rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      &:active {
        opacity: 0.8;
        transform: scale(0.95);
      }
    }
  }
  .close {
    width: 35rpx;
    height: 35rpx;
    background: #ccced2;
    border-radius: 50%;
    flex-shrink: 0;

    .single {
      font-size: 18rpx;
      color: #fff;
    }
  }
</style>
