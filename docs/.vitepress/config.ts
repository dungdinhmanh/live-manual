import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Debian Live Manual',
  titleTemplate: ':title',
  description: 'The official guide to Debian Live systems — build and customize Debian-based live systems.',
  srcDir: '.',

  head: [
    ['link', { rel: 'icon', type: 'image/x-icon', href: 'https://www.debian.org/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#d70a53' }],
  ],

  themeConfig: {
    logo: {
      light: 'https://www.debian.org/Pics/debian.png',
      dark: 'https://www.debian.org/Pics/debian.png',
      alt: 'Debian',
    },

    siteTitle: 'Debian Live Manual',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'About', link: '/chapters/about-manual' },
      { text: 'GitHub', link: 'https://github.com/debian-live/live-manual' },
    ],

    sidebar: [
      {
        text: 'About',
        collapsed: false,
        items: [
          { text: 'About this manual', link: '/chapters/about-manual' },
          { text: 'About the Debian Live Project', link: '/chapters/about-project' },
        ],
      },
      {
        text: 'User',
        collapsed: false,
        items: [
          { text: 'Installation', link: '/chapters/installation' },
          { text: 'The basics', link: '/chapters/the-basics' },
          { text: 'Overview of tools', link: '/chapters/overview-of-tools' },
          { text: 'Managing a configuration', link: '/chapters/managing-a-configuration' },
        ],
      },
      {
        text: 'Customization',
        collapsed: false,
        items: [
          { text: 'Customization overview', link: '/chapters/customization-overview' },
          { text: 'Customizing package installation', link: '/chapters/customizing-package-installation' },
          { text: 'Customizing contents', link: '/chapters/customizing-contents' },
          { text: 'Customizing run time behaviours', link: '/chapters/customizing-run-time-behaviours' },
          { text: 'Customizing the binary image', link: '/chapters/customizing-binary' },
          { text: 'Customizing Debian Installer', link: '/chapters/customizing-installer' },
        ],
      },
      {
        text: 'Project',
        collapsed: false,
        items: [
          { text: 'Contributing to the project', link: '/chapters/contributing-to-project' },
          { text: 'Reporting bugs', link: '/chapters/bugs' },
          { text: 'Coding Style', link: '/chapters/coding-style' },
        ],
      },
      {
        text: 'Examples',
        collapsed: false,
        items: [
          { text: 'Examples', link: '/chapters/examples' },
        ],
      },
      {
        text: 'Appendix',
        collapsed: false,
        items: [
          { text: 'Style guide', link: '/chapters/style-guide' },
          { text: 'Metadata', link: '/chapters/metadata' },
        ],
      },
    ],

    search: {
      provider: 'local',
    },

    editLink: {
      pattern: 'https://github.com/debian-live/live-manual/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    lastUpdated: {
      text: 'Last updated',
      formatOptions: { dateStyle: 'medium' },
    },

    docFooter: {
      prev: 'Previous page',
      next: 'Next page',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/debian-live/live-manual' },
    ],

    footer: {
      message: 'Debian Live Manual — Released under GPL-3+. Debian is a registered trademark of Software in the Public Interest, Inc.',
      copyright: 'Copyright © 2006–2023 Debian Live Project',
    },
  },

  markdown: {
    lineNumbers: true,
  },

  css: {
    lightAndDarkMode: true,
  },
});