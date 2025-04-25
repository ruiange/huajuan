/**
 * 上传文件到指定路径
 * @param {string} file - 文件路径
 * @param {string} path - 上传路径
 * @returns {Promise<string|boolean>} - 成功时返回文件的URL，失败时返回false
 */
const uploadUtil = async (file, path) => {
  const { data } = await uni.uploadFile({
    url: `${import.meta.env.VITE_APP_API_URL}/upload`,
    filePath: file,
    name: 'file', // 服务端接收字段名
    formData: {
      path, // 上传路径
    },
  });
  try {
    const dataInfo = JSON.parse(data);
    if ('url' in dataInfo) {
      return dataInfo.url;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
};

export default uploadUtil;
