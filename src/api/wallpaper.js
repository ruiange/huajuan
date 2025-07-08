import httpRequest from '../http';

export function getWallpaperApi(data) {
  return httpRequest.request({
    url: `/wallpaper`,
    method: 'GET',
    data: data,
  });
}
