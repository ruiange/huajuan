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
/**
 * 更新个人资料
 * @param data
 */
export function updateUserInfoAPI(data) {
  return httpRequest.request({
    url: '/user',
    method: 'put',
    data: data,
  });
}

/*
确认扫码登录
POST /user/login-qrcode/confirm
接口ID：284079866
接口地址：https://app.apifox.com/link/project/6189677/apis/api-284079866*/
export function loginQrcodeConfirmAPI(data) {
  return httpRequest.request({
    url: '/user/login-qrcode/confirm',
    method: 'post',
    data: data,
  });
}
