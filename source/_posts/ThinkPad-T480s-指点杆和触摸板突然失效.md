---
title: ThinkPad T480s 指点杆和触摸板突然失效
date: 2026-05-05 23:28:19
tags: 
    - ThinkPad 
    - Ubuntu 
---


在 ThinkPad T480s 使用 Ubuntu 时偶尔出现指点杆或触摸板失效的问题，可以使用命令：  

``` bash
sudo modprobe -r psmouse && sudo modprobe psmouse
```

这个命令会直接重置 TrackPoint 和触摸板控制器  
