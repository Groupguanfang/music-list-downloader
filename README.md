# 网易云音乐下崽器

因为不满网上那堆网易云音乐解析器，烂的要命，所以自己写了一个，主要是把歌单给下到我爸车上，方便他听歌。

V1版本在main分支，纯node.js命令行实现的，对普通大众来说较为难用，（当时没有想太多，只是我自己方便用的），v2版本是一个前后端分离的网页版，普通大众也能用。

## ✨ 特性

- 🏠 使用[vitesse-naily](https://github.com/nailyjs/vitesse-naily)作为模版构建
- ⚡️ 下载歌曲直接出`.mp3`文件，无需忍受加密格式的困扰😕
- 🥇 不限制后端，任何人都可以搭建自己的服务给他人共享自己的网易云帐号给他人下歌
- 🎵 如果你想，可以使用内置简陋的音乐播放器来听歌（2333
- 🌞 黑白双煞⚔️亮暗双主题 + 多语言支持，夜间使用不瞎眼

## 💻 演示

由于这个项目带点敏感属性，目前可能没有计划部署到线上，请自行clone到本地运行。

## 💫 如何运行

首先得有`node.js`环境，然后打开控制台，安装依赖：

```bash
npm install
```

项目使用的是`pnpm`,如果没有安装，可以安装一下:

```bash
npm install -g pnpm
```

然后运行这个命令开始编译：

```bash
pnpm build
```

编译完成后，运行这个命令启动服务：

```bash
pnpm preview
```

控制台会打印出服务的地址，打开浏览器访问即可。要注意的是，这个项目使用[vitesse-naily](https://github.com/nailyjs/vitesse-naily)作为模版，所以编译出来的产物并不是一个静态网站，而是一个需要运行在node.js环境下的服务，所以需要运行在node.js环境下。

## ✍️ 说明

- 本工具仅供学习交流使用，不得用于商业用途。

## License & Author

- Author: [Naily Zero](https://github.com/Groupguanfang)
- License: MIT
