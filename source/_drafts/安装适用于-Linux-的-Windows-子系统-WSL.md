---
title: 安装适用于 Linux 的 Windows 子系统 (WSL)
tags: WSL Windows Linux 子系统
---

# 介绍

适用于 Linux 的 Windows 子系统 (WSL) 可以在 Windows 系统运行 Linux 环境，而无需单独的虚拟机或双引导。

# 安装

首先需要 Windows 10版本要高于 2004 或 Windows 11 版本。

打开具有管理员权限的 CMD 或 PowerShell，运行

```powershell
wsl --inatall
```

这个命令会启用 WSL 并默认安装 Ubuntu。

安装完毕后，重启系统

# 设置用户名和密码

在`开始`菜单打开 `Ubuntu`,命令行窗口会提示设置**用户名**和**密码**
![Ubuntu 命令行输入 UNIX 用户名](安装适用于-Linux-的-Windows-子系统-WSL/ubuntuinstall.png)

输入密码时屏幕**不会显示任何内容**。

# 文件访问

可以在 Windows 文件管理器找到 Ubuntu 的文件

![image-20250102142715997](安装适用于-Linux-的-Windows-子系统-WSL/image-20250102142715997.png)

在命令行中运行

```bash
explorer.exe .
```

可以打开当前命令行所在的文件夹。

# 最后

WSL 现在已经安装好了，可以搞事了😋。

# 参考

1. [适用于 Linux 的 Windows 子系统文档 | Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/wsl/)