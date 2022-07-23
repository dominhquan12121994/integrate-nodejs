// config private key, username, password
const baseConfig = {
    MONGO_URL: "mongodb://localhost:27017/mine-force",
    REDIS_HOST: "localhost",
    REDIS_PORT: 6389,
    REDIS_PASS: '',
    VERIFY_TOKEN: '',
    JWT_SECRET: '',
    JWT_REFRESH_SECRET: '',
    URL_IGNORE_TOKENS: [],
    DOMAIN_FORWARD_DATA: [],
    IS_RUN_WORKER: true,
};

module.exports = baseConfig;
