// .vitepress/theme/index.ts
import { h } from 'vue';
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import './custom.css';
import DebianNews from '../components/debian-news.vue'
import HomePage from '../components/HomePage.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {});
  },
  enhanceApp({ app, router, siteData }) {
    app.component('DebianNews', DebianNews)
    app.component('HomePage', HomePage)
  },

} satisfies Theme;
