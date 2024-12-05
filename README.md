# 网易云音乐下崽器

## 介绍

因为不满网上那堆网易云音乐解析器，烂的要命，所以自己写了一个，主要是把歌单给下到我爸车上，方便他听歌。

## 命令行使用

首先环境必须得有`node`和`npm`，或者`yarn` `pnpm`随便哪个。

- 第一步：创建一个空目录，然后进入这个目录，再创建一个config目录，config目录下面创建`cookie.txt`，然后退回到上层目录再运行:
  ```bash
  pnpx music-list-downloader download-list 歌单id 下崽目录路径
  ```
  例如：
  ```bash
  pnpx music-list-downloader download-list 3779629 ./config/music
  ```
  这样就会下载歌单id为3779629的歌单到`./config/music`目录下。

## 说明

- 本工具仅供学习交流使用，不得用于商业用途。
