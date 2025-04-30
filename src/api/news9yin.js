import httpRequest from '../http';


export function getNews9yinListApi(data) {
  return httpRequest.request({
    url: '/news9yin',
    method: 'get',
    data: data,
  });
}