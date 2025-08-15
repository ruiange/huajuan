import httpRequest from '../http';


export function getGameServerListApi() {
  return httpRequest.request({
    url: '/jiuYin/syncServer',
    method: 'get'
  });
}
