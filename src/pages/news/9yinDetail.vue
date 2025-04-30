<template>
  <view class="content">
    <mp-html :content="content" />
  </view>
</template>

<script setup>
  import { ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import { getNews9yinDetailApi } from '../../api/news9yin';
  import mpHtml from 'mp-html/dist/uni-app/components/mp-html/mp-html';
  const id = ref('');
  const type = ref('');
  const title = ref('')
  onLoad((options) => {
    id.value = options.id;
    type.value = options.type === '系统公告' ? '1' : '2';
    console.log(id.value);
    getDetail();
  });
  const content = ref('');
  const info = ref('');
  const getDetail = async () => {
    const { data } = await getNews9yinDetailApi({ id: id.value, type: type.value });
    title.value = data.title;
    await uni.setNavigationBarTitle({
      title: title.value,
    });
    info.value = data;
    content.value = data.content;
  };
</script>

<style scoped>
  .content {
    padding: 30rpx;
    font-size: 28rpx;
    line-height: 60rpx;
  }
</style>
