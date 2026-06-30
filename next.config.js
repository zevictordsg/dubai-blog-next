/** @type {import('next').NextConfig} */
const nextConfig = {
  // Otimizações de produção
  compress: true,
  poweredByHeader: false,

  images: {
    // Domínios permitidos para Next.js Image Optimization
    remotePatterns: [
      // WordPress headless CMS
      { protocol: 'https', hostname: 'cms.gapcapitalrealestate.com.br' },
      { protocol: 'http',  hostname: 'cms.gapcapitalrealestate.com.br' },
      // CDN / uploads do WordPress em domínio próprio
      { protocol: 'https', hostname: '**.wordpress.com' },
      // Durante desenvolvimento local
      { protocol: 'http',  hostname: 'localhost' },
      { protocol: 'http',  hostname: '127.0.0.1' },
    ],
    // Formatos modernos gerados automaticamente pelo Next.js
    formats: ['image/avif', 'image/webp'],
  },

  // Headers de segurança básicos
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options',  value: 'nosniff' },
          { key: 'X-Frame-Options',          value: 'DENY' },
          { key: 'Referrer-Policy',          value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',       value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      // Cache agressivo para assets estáticos
      {
        source: '/imagens/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },

  // Redirecionar www → sem www (ajustar conforme domínio final)
  async redirects() {
    return [
      {
        source:      '/:path*',
        has:         [{ type: 'host', value: 'www.gapcapitalrealestate.com.br' }],
        destination: 'https://gapcapitalrealestate.com.br/:path*',
        permanent:   true,
      },
    ]
  },
}

module.exports = nextConfig
