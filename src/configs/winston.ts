const winston = require('winston');
const logger = new winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.File({ filename: './src/log/error.log', level: 'error' }),
    ],
    exitOnError: false
});
module.exports = logger;