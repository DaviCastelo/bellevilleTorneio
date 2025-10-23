/** @type {import('next').NextConfig} */
const nextConfig = {
  // Desabilita Turbopack para evitar problemas de compatibilidade
  experimental: {
    turbo: false,
  },
}

module.exports = nextConfig
