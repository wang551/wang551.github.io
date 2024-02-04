---
title: Hexo 博客搭建指南
tags: 教程
date: 2023-09-09 19:46:18
---

使用 Hexo 快速搭建个人博客，并使用炫酷的主题。
<!--more-->
# 1 安装并配置 Hexo
## 1.1 前提
你需要安装 Node.js、Git，详情见 Hexo 官方文档：[安装前提](https://hexo.io/zh-cn/docs/#安装前提)  

## 1.2 安装 Hexo
安装完成后，就可以安装 Hexo 了：
```bash
npm install -g hexo-cli
```
然后就安装完成了。

## 1.3 配置 Hexo
要把 Hexo 调教成你的样子，修改配置文件是必不可少的，Hexo 的配置在博客目录下的 `_config.yml` 文件内，你可以通过修改此文件来配置 Hexo 。  

这里就不详细说了，具体请看[官方配置文档](https://hexo.io/zh-cn/docs/configuration)。

# 2 更换主题
## 2.1 安装 Fluid
在博客目录执行
```bash
npm install --save hexo-theme-fluid
```
然后修改 Hexo 配置文件，指定主题为 Fluid。
```yaml
# ./_config.yml
theme: fluid  # 指定主题

language: zh-CN  # 指定语言，会影响主题显示的语言，按需修改
```

## 2.2 配置 Fluid
这里要先说一下配置文件的优先级  
官网这样解释：  
{% blockquote https://hexo.io/zh-cn/docs/configuration 配置 %}
Hexo 在合并主题配置时，Hexo 配置文件中的 theme_config 的优先级最高，其次是 _config.[theme].yml 文件，最后是位于主题目录下的 _config.yml 文件
{% endblockquote %}  
也就是说，你在修改主题配置的时候，只需要把主题文件夹相应部分复制到`/_config.fluid.yml`内然后修改就可以覆盖默认配置了。  

关于 Fluid 的配置这里就不多赘述了，[官网](https://hexo.fluid-dev.com/docs/)有详细的帮助文档。  

# 部署到 GitHub Pages
现在的网站只是在你的电脑上，要想让别人访问你的网站，你可以托管到 GitHub Pages，