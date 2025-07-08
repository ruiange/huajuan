<script setup lang="ts">
  import { computed } from 'vue';

  const BarHeight = computed(() => {
    return uni.getSystemInfoSync().statusBarHeight as number;
  });
</script>

<template>
  <view class="container" :style="`height: ${BarHeight}px`"> </view>
</template>

<style scoped lang="less">
  .container {
    width: 100%;
    box-sizing: border-box;
  }
</style>
