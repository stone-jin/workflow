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
  headScripts: [
    { src: 'https://www.googletagmanager.com/gtag/js?id=G-9MLB73YXMR', async: true },
    { content: `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-9MLB73YXMR');`}
  ],
  navs: [
    null, // null 值代表保留约定式生成的导航，只做增量配置
    {
      title: '博客',
      path: 'https://blog.fedfans.com',
    }
  ],
  // more config: https://d.umijs.org/config
});
