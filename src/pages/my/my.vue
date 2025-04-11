<template>
  <view class="my-top">
    <view class="user-info">
      <view class="user-info-left">
        <view class="avatar-box">
          <image class="avatar" src="https://s1.locimg.com/2025/04/04/f62de45385cd1.gif"></image>
        </view>
        <view class="user-info-details">
          <view class="user-name">喜羊羊</view>
          <view class="desc">来到花卷萌的第 100 天</view>
        </view>
      </view>

      <view class="edit-btn" @click="editInfo">编辑资料</view>
    </view>

    <div class="occupation"></div>
    <view class="jiuyin-box">
      <view class="box box1" @click="myGameAccount">
        <view class="box-left">
          <image class="box-icon" src="https://s1.locimg.com/2025/04/10/bb047117570a3.png"></image>
          <view>我的九阴</view>
        </view>
        <image
          src="https://s1.locimg.com/2025/04/10/57b6c2c68f18d.png"
          style="width: 30rpx"
          mode="widthFix"
        ></image>
      </view>
      <view class="box box2" @click="myAddress">我的地址</view>
    </view>
  </view>
</template>

<script setup >
  import { onShow } from '@dcloudio/uni-app';
  import { useAuthStore } from '../../store/auth';

  const myGameAccount = () => {
    console.log('=======')
    uni.navigateTo({
      url: '/pages/my/game/game',
    });
  };
  const myAddress = () => {
    uni.showToast({
      title: '开发中',
      icon: 'none',
    });
  };

  const editInfo = () => {
    uni.navigateTo({
      url: '/pages/my/info',
    });
  };

  onShow(()=>{
    const AuthStore =  useAuthStore()
    const isLoggedIn  = AuthStore.isLoggedIn
    console.log(isLoggedIn)
  })
</script>

<style scoped lang="less">
  .my-top {
    background: linear-gradient(to right, #d8d9ff, #e0e0fb, #f5ebf2, #fdeeec, #fdeeec);
    width: 100%;
    height: 700rpx;
    position: relative;

    .occupation {
      border: 1px solid red;
      position: absolute;
      width: 100%;
      height: 200rpx;
      left: 0;
      bottom: -10rpx;
      background: linear-gradient(to bottom, rgba(247, 248, 250, 0), rgba(247, 248, 250, 1));
    }

    padding-top: 150rpx;
  }

  .user-info {
    display: flex;
    width: 100%;
    padding: 30rpx;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    .user-info-left {
      display: flex;
      align-items: center;
      .avatar-box {
        width: 124rpx;
        height: 124rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(to top right, rgba(111, 122, 236, 1), rgba(111, 122, 236, 0));
        border-radius: 50%;
        overflow: hidden;

        .avatar {
          width: 120rpx;
          height: 120rpx;
          border-radius: 50%;
        }
      }

      .user-info-details {
        margin-left: 30rpx;

        .user-name {
          font-size: 34rpx;
          color: #333;
          font-weight: 600;
        }

        .desc {
          font-size: 28rpx;
          color: #999;
          margin-top: 10rpx;
        }
      }
    }
    .edit-btn {
      width: 200rpx;
      height: 60rpx;
      line-height: 60rpx;
      text-align: center;
      background: #fff;
      border-radius: 30rpx;
      color: #333;
      font-size: 28rpx;
    }
  }

  .jiuyin-box {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx;
    .box {
      width: 325rpx;
      height: 120rpx;
      border-radius: 20rpx;
      background-color: #fff;
    }
    .box1 {
      font-size: 34rpx;
      font-weight: 800;
      color: #000;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20rpx;
      background:
        linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)),
        url('https://9yin.woniu.com/static/act/202412/3/images/bg.jpg') center/cover no-repeat;
      .box-icon {
        width: 30rpx;
        height: 30rpx;
        margin-right: 8rpx;
      }
      .box-left {
        display: flex;
        align-items: center;
      }
    }
    .box2 {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 34rpx;
      font-weight: 800;
      color: #000;

      background:
        linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)),
        url('https://s1.locimg.com/2025/04/10/c15d3545441ca.jpg') center/cover no-repeat;
    }
  }
</style>
