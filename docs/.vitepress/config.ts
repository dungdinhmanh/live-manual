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
      { text: 'Salsa', link: 'https://salsa.debian.org/live-team/live-manual' },
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

    lastUpdated: {
      text: 'Last updated',
      formatOptions: { dateStyle: 'medium' },
    },

    docFooter: {
      prev: 'Previous page',
      next: 'Next page',
    },

    socialLinks: [
      {
        icon: {
          // GitLab tanuki logo (Salsa is a GitLab instance run by Debian)
          svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.955 13.587l-1.342-4.135-2.664-8.189c-.135-.423-.73-.423-.867 0L16.418 9.45H7.582L4.919 1.263c-.135-.423-.73-.423-.867 0L1.387 9.452.045 13.587a.924.924 0 0 0 .331 1.023L12 23.054l11.625-8.443a.92.92 0 0 0 .33-1.024" fill="currentColor"/></svg>',
        },
        link: 'https://salsa.debian.org/live-team/live-manual',
        ariaLabel: 'Salsa (Debian GitLab)',
      },
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