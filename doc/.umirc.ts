import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'Stone Jin 解决方案',
  mode: 'site',
  base: '/',
  publicPath: '/',
  locales: [['zh-CN', '中文']],
  /* exportStatic: {
    htmlSuffix: true,
    dynamicRoot: true,
    supportWin: true// boolean;
  },*/
  navs: [
    null, // null 值代表保留约定式生成的导航，只做增量配置
    {
      title: '博客',
      path: 'https://blog.fedfans.com',
    }
  ],
  // more config: https://d.umijs.org/config
});
