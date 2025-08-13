import requestX from '../http'


/*
解析抖音
*/
export function analyzeTheDouyinAddressApi(data) {
    console.log('解析')
    return requestX.request({
        url: `/douyin`,
        method: 'POST',
        data: data
    });
}


/*
保存抖音数据
*/
export function saveDouyinDataApi(data) {
    console.log('保存')
    return requestX.request({
        url: `/douyin/save`,
        method: 'POST',
        data: data
    });
}

 /*
数据库获取抖音数据
*/
export function getDouyinDataApi(data) {
    console.log('获取')
    return requestX.request({
        url: `/douyin/get`,
        method: 'GET',
        params: data
    });
}