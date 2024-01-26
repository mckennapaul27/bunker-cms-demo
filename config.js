export const main_url =
    process.env.NODE_ENV !== 'development'
        ? 'https://bunker-cms.vercel.app'
        : 'http://localhost:5000';
