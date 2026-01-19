import "../utils/env"
const appConfig = {
    PORT: process.env.PORT as string,
    VERSION: process.env.VERSION as string,
    BASEROUTE: process.env.BASEROUTE as string,

    DATABASE_URL: process.env.DATABASE_URL as string,
    // REDIS_URL: process.env.REDIS_URL,

    ENC_KEY_SECRET: process.env.ENC_KEY_SECRET as string,
    CIPHER_KEY_SECRET: process.env.CIPHER_KEY_SECRET as string,
    API_KEY_SECRET: process.env.API_KEY_SECRET as string,
    API_KEY: process.env.API_KEY as string,

    NODE_ENV: process.env.NODE_ENV as string,

    WHITELIST: process.env.WHITELIST
        ? process.env.WHITELIST.split(",").map((s) => s.trim())
        : []
}

export default appConfig