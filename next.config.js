/** @type {import('next').NextConfig} */

const { version } = require('./package.json');

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['openweathermap.org'],
  },
  publicRuntimeConfig: {
    version,
  },
  i18n: {
    locales: ['id', 'en'],
    defaultLocale: 'id',
    localeDetection: false
  },
}
