# 网易云音乐下崽器

因为不满网上那堆网易云音乐解析器，烂的要命，所以自己写了一个，主要是把歌单给下到我爸车上，方便他听歌。

求求🥺各位大佬动动小手点一下右上角的star谢谢喵🙏

> 注意：当前main分支除非`有人发新issue提出新增功能`或`完全用不了了`，否则我懒得再更新了。目前我着重开发[v2分支](https://github.com/Groupguanfang/music-list-downloader/tree/v2)，v2分支是新版本，正在开发中。

> v2分支是网页版，main分支是命令行版。

> v2分支基础功能开发好之后，我会将v2分支设为默认分支。

## 音乐id获取方法

在任何网易云客户端播放某一首歌，点击分享按钮 - 复制链接，然后粘贴到浏览器地址栏，地址栏里面的id就是歌曲id。比如：

```
https://music.163.com/song?id=354745&userid=1370360255
```

这个地址里面的`354745`就是歌曲id，注意不是后面的那串`userid`后面的数字！这是用户id，没用的。

## 命令行使用

首先环境必须得有`node`和`npm`，或者`yarn` `pnpm`随便哪个。

第一步：创建一个空目录，然后进入这个目录，再创建一个config目录，config目录下面创建`cookie.txt`，然后退回到上层目录再运行:
```bash
pnpx music-list-downloader download-list 歌单id 下崽目录路径
```
例如：
```bash
pnpx music-list-downloader download-list 3779629 ./config/music
```
这样就会下载歌单id为3779629的歌单到`./config/music`目录下。

## 下载单首歌曲

0.0.3版本开始支持下载单首歌曲，使用方法如下：
```bash
pnpx music-list-downloader download-music 歌曲id 下崽目录路径
```

例如：
```bash
pnpx music-list-downloader download-music 354745 ./config/music
```

就会下载id为354745的歌曲到`./config/music`目录下。

## 网页版使用

仍在v2分支开发中，稳定后应该会和命令行版并存，但是会更着重于网页版。

## 说明

- 本工具仅供学习交流使用，不得用于商业用途。

## License & Author

- Author: [Naily Zero](https://github.com/Groupguanfang)
- License: [MIT](./LICENSE)
