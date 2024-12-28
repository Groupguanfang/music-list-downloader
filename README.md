# 网易云音乐下崽器

因为不满网上那堆网易云音乐解析器，烂的要命，所以自己写了一个，主要是把歌单给下到我爸车上，方便他听歌。

V1版本在main分支，纯node.js命令行实现的，对普通大众来说较为难用，（当时没有想太多，只是我自己方便用的），v2版本是一个前后端分离的网页版，普通大众也能用。

## ✨ 特性

- 🏠 使用[vitesse-naily](https://github.com/nailyjs/vitesse-naily)作为模版构建
- ⚡️ 下载歌曲直接出`.mp3`文件，无需忍受加密格式的困扰😕
- 🥇 不限制后端，任何人都可以搭建自己的服务给他人共享自己的网易云帐号给他人下歌
- 🪨 内部有一套公共的适配层，理论上只要适配了整个`MusicController`接口，就可以支撑起整个App，因此以后可以很方便的接入其他音乐平台如QQ音乐、酷狗音乐等
- 🎵 如果你想，可以使用内置简陋的音乐播放器来听歌（2333
- 🌞 黑白双煞⚔️亮暗双主题 + 多语言支持，夜间使用不瞎眼
- 🎦 拥有桌面端electron版本，同时未来会考虑出uni-app版本

## 📦 客户端版本

下崽器得益于`electron`框架，支持`Windows`、`macOS`、`Linux`中运行；点击前往[release](https://github.com/Groupguanfang/music-list-downloader/releases)页面下载对应版本即可。

得益于`naily`框架 + `unplugin-rpc`插件的跨平台性，后端不仅仅支持传统`http`协议，也支持了electron的`ipc`协议。

因此客户端内已经内置了一个基于`ipc`协议的后端服务，无需手动填写后端地址即可直接使用（当然，如果你想，也可以手动填写后端地址也是支持的）。

## 💻 网页版演示

由于这个项目带点敏感属性，目前暂时可能没有计划部署到线上（也有可能后期静态版出来之后会部署到`github pages`），当前请自行clone到本地运行。

## 💫 如何运行

首先得有`node.js` + `pnpm`环境，如果没有请自行谷歌搜索如何安装，这里不再赘述。

### 准备

打开控制台，安装依赖:

```bash
pnpm install
```

然后运行这个命令开始编译：

```bash
# 编译网页版
pnpm build

# 编译electron版本
pnpm build:electron
```

网页版产物和electron产物都在`dist`目录下，但是产物的目录结构和编译格式都不一样，具体不一样的地方在：

#### 网页版

- 网页版会使用`vite-ssg`编译，产物拥有多个`.html`页面，有利于搜索引擎收录
- 网页版会编译后端，后端产物在`dist/backend`目录下

#### electron版本

- 网页版会直接使用`vite build`编译，并且除`dist`目录外，还会编译出`dist_electron`，主进程和预加载脚本在`dist_electron`中

如果你编译了electron版本，想要启动网页版，请重新执行`pnpm build`编译网页版后再启动，否则可能会报错。

### 启动网页版

下崽器无论如何都得需要一个后端支撑。目前，暂时只能使用`pnpm preview`来启动网页版。

未来会在前端出一个检测功能，如果后端请求失败，则让用户自行填写可用的后端服务地址，这样也可以完全静态化部署到任何地方（如`github pages`）。

```bash
# 启动网页版，同时会启动后端+前端
pnpm preview
```

### 只启动后端服务

`naily`框架伸缩自由，后端服务可以单独启动。你可以通过指定环境变量`PORT`来指定后端服务启动的端口，默认是`1000`。

```bash
# 指定端口为1001
PORT=1001 pnpm preview:backend
# 直接启动，默认端口为1000
pnpm preview:backend
```

## ✍️ 说明

本工具仅供学习交流使用，不得用于商业用途。

## 📄 License & Author

- Author: [Naily Zero](https://github.com/Groupguanfang)
- License: MIT
