<template>
  <view class="list">
    <view class="list-item">
      <image class="avatar" src="https://s1.locimg.com/2025/04/04/f62de45385cd1.gif"></image>
      <view class="btn">
        <button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
          更换头像
        </button>
        <image
          src="https://s1.locimg.com/2025/04/10/57b6c2c68f18d.png"
          style="width: 24rpx;height: 24rpx; margin-left: 3rpx"
          mode="widthFix"
        ></image>
      </view>
    </view>

    <view class="list-item list-item-info" @click="editName">
      <view class="item-info">
        <view class="label">昵称</view>
        <view class="value">xxxxxxxxxxxxx</view>
      </view>
      <image
        src="https://s1.locimg.com/2025/04/10/57b6c2c68f18d.png"
        style="width: 24rpx;height: 24rpx; margin-left: 3rpx"
        mode="widthFix"
      ></image>
    </view>

  </view>
</template>

<script setup>
  const onChooseAvatar = async (res) => {
    await uni.showLoading({
      title: '上传中',
    });
    console.log(res);
    uni.hideLoading();
  };
  const editName = () => {
    uni.navigateTo({
      url: '/pages/my/name',
    });
  };
</script>

<style scoped lang="less">
  .list {
    width: 100%;
    .list-item {
      width: 100%;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20rpx;
      .avatar {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
      }
      .btn {
        font-size: 28rpx;
        color: rgba(90, 143, 255, 0.9);
        display: flex;
        align-items: center;
      }
    }
    .list-item-info {
      margin-top: 20rpx;
      display: flex;
      align-items: center;
      .item-info {
        display: flex;
        align-items: center;
        font-size: 28rpx;
        .label {
          color: #333333;
          width: 100rpx;
        }
        .value {
          color: #999;
        }
      }
    }
  }
  .avatar-wrapper {
    margin: 0; /* 移除默认的外边距 */
    border: none !important; /* 移除默认的边框 */
    background: none; /* 移除默认的背景 */
    font: inherit; /* 继承字体样式，不使用默认的按钮字体 */
    color: inherit; /* 继承文字颜色，不使用默认的按钮文字颜色 */
    cursor: pointer; /* 保持指针手形图标，这是按钮的常见视觉提示 */
    outline: none; /* 去除焦点时的轮廓线 */
    padding: 10rpx;
    box-sizing: border-box;

    &:after {
      border: none !important; /* 移除默认的边框 */
    }
  }
</style>
