/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['api.dicebear.com'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Добавьте эту настройку для поддержки клиентской маршрутизации
  experimental: {
    appDir: true,
  },
};

export default nextConfig;
