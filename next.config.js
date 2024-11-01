/** @type {import('next').NextConfig} */

const allowedIframeEmbeddingUrls = process.env.NEXT_PUBLIC_IFRAME_ALLOWED_ORIGINS?.split(',')?.join(' ') || ''

const nextConfig = {
  reactStrictMode: true,

  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback, // if you miss it, all the other options in fallback, specified
      // by next.js will be dropped. Doesn't make much sense, but how it is
      fs: false, // the solution
    }

    return config
  },

  headers: () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self';",
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
      {
        source: '/iframe/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `frame-ancestors self ${allowedIframeEmbeddingUrls};`,
          },
          {
            key: 'Permissions-Policy',
            value:
              'payment=*, publickey-credentials-get=*, publickey-credentials-create=*, clipboard-read=*, clipboard-write=*',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
