/**
 * 生成随机数
 * @param min
 * @param max
 * @returns {*}
 * @constructor
 */
export const GenerateRandomNumbers = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const imageUrls = [
  'https://s1.locimg.com/2025/04/15/227d29295a9ef.png',
  'https://s1.locimg.com/2025/04/15/29738c71b8d1d.png',
  'https://s1.locimg.com/2025/04/15/78a1174057ac2.png',
  'https://s1.locimg.com/2025/04/15/6abe434ef3d24.png',
  'https://s1.locimg.com/2025/04/15/3e154fb12e5c3.png',
  'https://s1.locimg.com/2025/04/15/eeba8e1f11085.png',
  'https://s1.locimg.com/2025/04/15/f6b578e635130.png',
];

/**
 * 生成随机头像
 * @returns {string}
 */
export const generateRandomAvatar = () => {
  return imageUrls[GenerateRandomNumbers(0, imageUrls.length - 1)];
};
