<template>
  <view class="content">
    <!-- 使用帮助 -->
    <view class="help-card">
      <view class="help-title">
        <text class="iconfont icon-help"></text>
        <text>视频/图片去水印使用帮助</text>
      </view>
      <view class="help-steps">
        <view class="step">1. 复制抖音视频链接到输入框</view>
        <view class="step">2. 点击"解析视频"按钮</view>
        <view class="step">3. 等待解析完成</view>
        <view class="note">注: 解析内容均来自互联网，本小程序不对内容进行负责</view>
      </view>
    </view>

    <!-- 输入区域 -->
    <view class="input-area">
      <textarea class="url-input" placeholder="请输入视频地址" v-model="videoUrl" />

      <view class="button-group">
        <button class="btn btn-clipboard" @click="readClipboard">读取剪贴板</button>
        <button class="btn btn-analyze" @click="analyzeVideo">解析视频/图片</button>
      </view>

      <!-- 分享按钮组 -->
      <view class="share-group">
        <button class="share-btn" open-type="share">分享给朋友</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';
  import { analyzeTheDouyinAddressApi, saveDouyinDataApi } from '@/api/douyin';

  const videoUrl = ref('7.48 拉布布动态壁纸 私信粉丝群壁纸教程免费领咯文件发群里啦# lalulu # 拉布布 # 动态高清壁纸 # iphone壁纸 # 开灯壁纸  https://v.douyin.com/bDVR03H9iEI/ 复制此链接，打开抖音搜索，直接观看视频！ 10/06 god:/ D@H.Vy ');

  // 读取剪贴板内容
  const readClipboard = () => {
    uni.getClipboardData({
      success: (res) => {
        videoUrl.value = res.data;
      },
      fail: () => {
        uni.showToast({
          title: '读取剪贴板失败',
          icon: 'none',
        });
      },
    });
  };

  // 解析视频
  // 分享功能
  onShareAppMessage(() => {
    return {
      title: '抖音无水印视频/图片下载工具',
      path: '/pages/douyin/index',
    };
  });
  onShareTimeline(() => {
    return {
      title: '抖音无水印视频/图片下载工具',
      path: '/pages/douyin/index',
    };
  });

  const analyzeVideo = async () => {
    if (!videoUrl.value) {
      await uni.showToast({
        title: '请输入视频地址',
        icon: 'none',
      });
      return;
    }

    let progress = 0;
    const interval = setInterval(() => {
      progress += getRandomInt(1, 10); // 每次增加的百分比
      if (progress > 100) {
        progress = 100;
      }
      uni.showLoading({
        title: `解析进度${progress}%`,
        icon: 'loading',
      });
    }, 500); // 每500毫秒更新一次

    try {
      const { code, data } = await analyzeTheDouyinAddressApi({
        url: videoUrl.value,
      });

      if (code !== 2000) {
        clearInterval(interval); // 清除定时器
        uni.hideLoading();
        await uni.showToast({
          title: '解析失败',
          icon: 'none',
        });

        return;
      }

      uni.setStorageSync('douyin', data);

      const { data: saveData } = await saveDouyinDataApi(data);

      clearInterval(interval); // 清除定时器
      if (code === 2000) {
        uni.hideLoading();
        await uni.showToast({
          title: '解析成功',
          icon: 'success',
        });
      }
      await uni.navigateTo({
        url: `/pages/douyin/douyin?pageType=1&dataId=${saveData}`,
      });
    } catch (e) {
      clearInterval(interval); // 清除定时器
      uni.hideLoading();
      await uni.showToast({
        title: '解析失败',
        icon: 'none',
      });
    }
  };

  const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
</script>

<style scoped lang="less">
  // 变量定义
  @primary-color: #1c2126;
  @primary-hover: #2c3136;
  @bg-color: #f8f9fa;
  @card-bg: #fff;
  @text-primary: #333;
  @text-secondary: #555;
  @text-light: #999;
  @border-color: #eaedf1;
  @shadow-color: rgba(0, 0, 0, 0.08);
  @border-radius: 16rpx;
  @btn-height: 88rpx;
  @btn-gradient: linear-gradient(to right, #d8d9ff, #e0e0fb, #f5ebf2, #fdeeec, #fdeeec);

  // 混入
  .card() {
    background-color: @card-bg;
    border-radius: @border-radius;
    padding: 30rpx;
    box-shadow: 0 4rpx 20rpx @shadow-color;
  }

  .button-base() {
    height: @btn-height;
    border-radius: @btn-height / 2;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30rpx;
    color: #fff;
    font-weight: 500;
    transition: all 0.3s;

    &:active {
      transform: translateY(2rpx);
    }
  }

  // 样式
  .content {
    padding: 30rpx;
    background-color: @bg-color;
    min-height: 100vh;
  }

  .help-card {
    .card();
    margin-bottom: 30rpx;

    .help-title {
      display: flex;
      align-items: center;
      margin-bottom: 24rpx;
      font-size: 34rpx;
      font-weight: bold;
      color: @text-primary;

      .iconfont {
        color: @primary-color;
        margin-right: 12rpx;
        font-size: 38rpx;
      }
    }

    .help-steps {
      color: @text-secondary;
      font-size: 28rpx;
      line-height: 1.6;
    }

    .step {
      margin-bottom: 16rpx;
      position: relative;
      padding-left: 10rpx;

      &::before {
        content: '';
        position: absolute;
        left: -5rpx;
        top: 14rpx;
        width: 8rpx;
        height: 8rpx;
        background-color: @primary-color;
        border-radius: 50%;
      }
    }

    .note {
      color: @text-light;
      font-size: 24rpx;
      margin-top: 16rpx;
      padding: 16rpx;
      background-color: #f5f7fa;
      border-radius: 8rpx;
      border-left: 6rpx solid #e1e5eb;
    }
  }

  .input-area {
    .card();

    .url-input {
      width: 100%;
      height: 300rpx;
      background-color: #f5f7fa;
      border-radius: 12rpx;
      padding: 24rpx 30rpx;
      margin-bottom: 30rpx;
      font-size: 28rpx;
      box-sizing: border-box;
      border: 2rpx solid @border-color;
      transition: all 0.3s;

      &:focus {
        border-color: @primary-color;
        box-shadow: 0 0 0 2rpx rgba(@primary-color, 0.1);
      }
    }
  }

  .button-group {
    display: flex;
    justify-content: space-between;
    margin-top: 30rpx;

    .btn {
      .button-base();
      flex: 1;
      margin: 0 12rpx;
      box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.1);

      &:first-child {
        margin-left: 0;
      }

      &:last-child {
        margin-right: 0;
      }
    }

    .btn-clipboard,
    .btn-analyze {
      background: @btn-gradient;
      color: #333;
      box-shadow: 0 0 10rpx 0 rgba(0, 0, 0, 0.1);

      &:active {
        filter: brightness(0.98);
      }
    }
  }

  .share-group {
    display: flex;
    justify-content: space-between;
    width: 90%;
    margin: 30rpx auto;
    align-items: center;

    .share-btn {
      .button-base();
      width: 80%;
      line-height: @btn-height;
      background: @btn-gradient;
      color: #333;
      box-shadow: 0 0 10rpx 0 rgba(0, 0, 0, 0.1);

      &:active {
        filter: brightness(0.98);
      }
    }
  }

  .poster-btn {
    background: linear-gradient(135deg, @primary-hover, #3c4146);

    &:active {
      background: linear-gradient(135deg, #3c4146, #4c5156);
    }
  }

  .share-icon {
    font-size: 36rpx;
    margin-right: 10rpx;
  }

  .share-canvas {
    position: fixed;
    top: -9999rpx;
    left: -9999rpx;
    width: 600rpx;
    height: 800rpx;
    z-index: -1;
  }
</style>
