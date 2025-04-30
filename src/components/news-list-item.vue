<script setup>
  const props = defineProps({
    info: {
      type: Object,
      default() {
        return {};
      },
    },
  });
  const openDetail = () => {
    uni.navigateTo({
      url: `/pages/news/9yinDetail?id=${props.info._id}&type=${props.info.type}`,
    });
  };
</script>

<template>
  <view class="list-item-container" @click="openDetail">
    <!--    <image-->
    <!--      class="img"-->
    <!--      mode="widthFix"-->
    <!--      src="https://readdy.ai/api/search-image?query=Realistic%20game%20screenshot%2C%20photorealistic%20fantasy%20game%20character%2C%20high-detail%203D%20rendering%2C%20prominent%20main%20subject%2C%20clear%20and%20sharp%2C%20subject%20fills%2080%20percent%20of%20frame%2C%20isolated%20on%20light%20blue%20background%2C%20centered%20composition%2C%20soft%20lighting%2C%20subtle%20shadows%2C%20video%20game%20art%20style%2C%20vibrant%20colors%2C%20female%20character%20with%20magical%20elements&width=200&height=200&seq=1&orientation=squarish"-->
    <!--    ></image>-->

    <view class="right-info">
      <view class="title">{{ info.title }} </view>

      <view class="bottom-info">
        <view style="margin-right: 10px">{{ info.type }}</view>
        <view style="margin-right: 10px">{{ info.time }}</view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="less">
  .list-item-container {
    width: 100%;
    background: #fff;
    padding: 20rpx;
    margin-bottom: 20rpx;
    border-radius: 10rpx;
    display: flex;
  }
  .img {
    width: 200rpx;
    height: 200rpx;
    border-radius: 12rpx;
    overflow: hidden;
    flex-shrink: 0;
    margin-right: 20rpx;
  }
  .right-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .title {
    font-weight: 700;
    color: #333;
    font-size: 29rpx;
    flex-shrink: 0;
  }
  .bottom-info {
    color: #999;
    font-size: 24rpx;
    display: flex;
    align-items: center;
  }
</style>
