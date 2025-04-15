<template>
  <view class="container">
    <view class="title">正在扫码登录到花卷萌PC端</view>
    <view
      style="
        width: 100%;
        margin-top: 300rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      "
    >
      <image class="btn" src="/static/images/btn1.png" mode="widthFix" @click="handleLogin"></image>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { onLoad } from '@dcloudio/uni-app';
  import { ref } from 'vue';
  import { loginQrcodeConfirmAPI } from '../../api/user';
  const scene = ref('');
  onLoad((options) => {
    console.log('=================================');
    console.log(options.scene);
    if ('scene' in options) {
      scene.value = options.scene;
    } else {
      uni.navigateTo({
        url: '/pages/index/index',
      });
    }
    console.log('=================================');
  });

  /**
   * 确认登录
   */
  const handleLogin = async () => {
    const { code, data } = await loginQrcodeConfirmAPI({ scene: scene.value });
    console.log(code, data);
  };
</script>

<style scoped lang="less">
  .container {
    width: 100%;
    height: 100vh;
    background-color: red;
    flex-direction: column;
    background-image: url('https://s1.locimg.com/2025/04/15/a44b5d40caf7f.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    padding: 200rpx 30rpx 30rpx 30rpx;
  }
  .title {
    font-size: 35rpx;
    font-weight: 600;
    color: #fff;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }

  .btn {
    transition: transform 0.2s ease;
    &:active {
      transform: scale(0.95);
    }
  }
  .btn {
    width: 400rpx;
  }
</style>
