<template>
  <view class="content">
    <view>
      <block v-for="(item, index) in newsList" :key="index">
        <news-list-item :info="item"></news-list-item>
      </block>
    </view>
  </view>
</template>

<script setup>
  import { onLoad } from '@dcloudio/uni-app';
  import { getNews9yinListApi } from '../../api/news9yin';
  import { ref } from 'vue';
  import NewsListItem from '../../components/news-list-item.vue';

  onLoad(() => {
    getNewsList();
  });
  const newsList = ref([]);
  const getNewsList = async () => {
    const { data } = await getNews9yinListApi({
      pageNum: 1,
      pageSize: 15,
    });
    newsList.value = data.list;
    console.log(newsList.value);
  };
</script>

<style>
  .content {
    padding: 30rpx;
    background: #F5F7FA;
  }
</style>
