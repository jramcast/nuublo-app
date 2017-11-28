import  winston = require('winston');

// Exports a winston logger with a timestamp
export default new winston.Logger({
    transports: [
        new (winston.transports.Console)({ 'timestamp': true })
    ]
});