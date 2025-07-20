export default () => ({
    db: {
        host: process.env.DB_HOST || 'mongodb://localhost:27017/MCADOCS',
        name: process.env.DB_NAME || 'MCADOCS',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'Asdfghjklqwertyuiopzxcvbnm1010203042323',
        expirationTime: process.env.JWT_EXPIRATION_TIME || '3600', // 1 hour
        refreshExpirationTime: process.env.JWT_REFRESH_EXPIRATION_TIME || '30d'
    },
})