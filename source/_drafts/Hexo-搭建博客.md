---
title: Hexo 搭建博客
tags: 教程
---
使用 Hexo 快速搭建一个个人博客，并使用炫酷的主题。
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

### 1.3.1 111
### 1.3.2

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
{% note info %}  
配置文件有三个，  
/_config.yml  
/_config.fluid.yml  
/node_modules/hexo-theme-fluid/_config.yml  
其中第一个是 Hexo 的配置文件，优先级最高；  
然后第二个是 Fluid 的配置文件，这个文件在开始是没有的，需要我们自己创建，我们配置主题就是改动的这个文件； 
第三个里边是 Fluid 的默认配置 ，我们在 _config.fluid.yml 改动对应的配置时，它就吧默认配置覆盖了，所以不用动它。  
{% endnote %}

### 2.2.1 
