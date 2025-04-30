import httpRequest from '../http';


export function getNews9yinListApi(data) {
  return httpRequest.request({
    url: '/news9yin',
    method: 'get',
    data: data,
  });
}
export function getNews9yinDetailApi(data) {
  return httpRequest.request({
    url: '/news9yin/detail',
    method: 'get',
    data: data,
  });
}