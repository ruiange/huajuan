const ci = require('miniprogram-ci');
const path = require('path');
const readline = require('readline');
const axios = require('axios');
const semver = require('semver');

const { upload } = require('miniprogram-ci');
require('dotenv').config();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const saveVersion = async (version) => {
  const { code } = await axios({
    url: `${process.env.VITE_APP_API_URL}/mini/v`,
    method: 'post',
    data: {
      version,
      desc: '机器人上传',
    },
  });
  if(code===2000){
    console.log('保存成功');
  }
};

const uploadMini = async () => {
  const { data: onlineVersion } = await axios({
    url: `${process.env.VITE_APP_API_URL}/mini/v`,
    method: 'get',
  });

  console.log(onlineVersion.data.version, 'vsrsion');
  const oldVersion = onlineVersion.data.version;
  const newVersion = semver.inc(oldVersion, 'patch');

  await rl.question('请输入版本号：', (version) => {
    if (!version) {
      version = newVersion;
    }
    console.log(`上传版本号: ${version}`);
    // 使用绝对路径
    const projectPath = path.resolve(__dirname, '../dist/build/mp-weixin');
    const privateKeyPath = path.resolve(__dirname, './private.wxbf1c228ee7bb0bef.key');

    const project = new ci.Project({
      appid: 'wxbf1c228ee7bb0bef',
      type: 'miniProgram',
      projectPath: projectPath,
      privateKeyPath: privateKeyPath,
      ignores: ['node_modules/**/*'],
    });

    ci.upload({
      project,
      version: version,
      desc: `机器人上传`,
      setting: {
        es6: true,
      },
      onProgressUpdate: console.log,
    })
      .then((uploadResult) => {
        console.log('上传成功', uploadResult);
        saveVersion(version);
        rl.close();
      })
      .catch((err) => {
        console.error('上传失败', err);
        rl.close();
      });
  });
};
uploadMini().then((r) => {});
