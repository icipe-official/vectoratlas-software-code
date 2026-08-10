// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Vector Atlas help',
  tagline: 'Vector Atlas help site',
  url: process.env.READTHEDOCS_CANONICAL_URL ?? 'https://your-docusaurus-test-site.com', // ← updated
  baseUrl: process.env.HELP_BASE_URL ?? '/',
  trailingSlash: true, // ← add this
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/Animals-Mosquito-icon.png',

  organizationName: 'facebook',
  projectName: 'docusaurus',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        }
      }),
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Vector Atlas Help',
        logo: {
          alt: 'Vector Atlas Logo',
          src: 'img/vector-atlas-logo.svg',
          height: '100px',
          href: process.env.HELP_NAVBAR_HREF ?? 'https://vectoratlas.icipe.org/'
        },
      },
    })
};

module.exports = config;