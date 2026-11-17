import type { Config } from 'tailwindcss';
const config: Config = { content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'], theme: { extend: { colors: { ink: '#101426', muted: '#747b91', violet: '#7657f6', aqua: '#43d6c5' }, boxShadow: { soft: '0 12px 40px rgba(33, 35, 70, .08)' } } }, plugins: [] };
export default config;
