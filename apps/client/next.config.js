const path = require('path');
const { withSentryConfig } = require('@sentry/nextjs');

const withTM = require("next-transpile-modules")([
  "@lettercms/ui",
  "@lettercms/models",
  "@lettercms/sdk",
  "@lettercms/icons"
]);

const isDev = process.env.NODE_ENV !== 'production';

const appConfig = withTM({
  swcMinify: true,
  compiler: {
    removeConsole: !isDev,
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  poweredByHeader: false,
  env: {
    FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
    ASSETS_BASE: isDev ? 'http://localhost:3003' : 'https://cdn.jsdelivr.net/gh/lettercms/lettercms/apps/cdn'
  },
   async headers() {
    return [
      {
        source: '/api/revalidate',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'POST,OPTIONS,HEAD'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Origin,X-Requested-With,Content-Type,Accept,Authorization'
          },
        ]
      }
    ];
  }
});

const sentryWebpackPluginOptions = {
  silent: true
}

if (isDev)
  module.exports = appConfig;
else
  module.exports = withSentryConfig({
    ...appConfig,
    sentry: {
      hideSourceMaps: true,
      widenClientFileUpload: true
    },
  }, sentryWebpackPluginOptions);
