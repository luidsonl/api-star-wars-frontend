/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'export', // Removido para suportar rotas dinâmicas client-side sem pré-renderização estática de todos os IDs
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
