import httpRequest from '../http';

/*
新增游戏账号信息
POST /gameAccount/
接口ID：284079863
接口地址：https://app.apifox.com/link/project/6189677/apis/api-284079863
*/
export function addGameAccountAPI(data) {
  return httpRequest.request({
    url: '/gameAccount/',
    method: 'post',
    data: data,
  });
}

/*
获取游戏账号信息
GET /gameAccount
接口ID：284263198
接口地址：https://app.apifox.com/link/project/6189677/apis/api-284263198*/
export function getGameAccountAPI() {
  return httpRequest.request({
    url: '/gameAccount',
    method: 'get',
  });
}


/*修改游戏账号信息
PUT /gameAccount/
接口ID：284263199
接口地址：https://app.apifox.com/link/project/6189677/apis/api-284263199*/
export function updateGameAccountAPI(data) {
  return httpRequest.request({
    url: '/gameAccount/',
    method: 'put',
    data: data,
  });
}
