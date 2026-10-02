hexo.extend.injector.register('head_begin', '<script src="https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/autoload.js"></script>', 'default');
// 看板娘容器上游默认 z-index:1，会被正文卡片 #board(3)、navbar(1030) 盖住；
// 抬到导航栏之上、搜索弹窗(1040)之下。waifu.css 由 CDN 运行时插入，需 !important 保证覆盖。
hexo.extend.injector.register('head_begin', '<style>#waifu, #waifu-toggle { z-index: 1031 !important; }</style>', 'default');