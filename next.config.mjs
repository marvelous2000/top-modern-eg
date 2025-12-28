import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** <!-- Import failed: type - ENOENT: no such file or directory, access 'C:\Users\Huawei\.gemini\type' --> {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false, // Keep this false to catch real errors
  },
  eslint: {
    ignoreDuringBuilds: false, // Keep this false to catch real errors
  },
  images: {
    unoptimized: true,
  },
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  experimental: {
    serverComponentsExternalPackages: ['@supabase/ssr'],
  },
  transpilePackages: [],
}

export default withNextIntl(nextConfig)
