import httpRequest from '../http';

/**
 * 查询个人资料
 * @param data
 */
export function getUserInfoAPI(data) {
  return httpRequest.request({
    url: '/user',
    method: 'get',
    data: data,
  });
}
