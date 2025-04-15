import httpRequest from '../http';

/**
 * 微信登录
 * @param data
 */
export function loginAPI(data) {
  return httpRequest.request({
    url: '/mini/login',
    method: 'post',
    data: data,
  });
}

