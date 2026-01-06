const morgan = require('morgan');

// Custom logger format
const loggerFormat = process.env.NODE_ENV === 'production'
  ? 'combined'
  : 'dev';

const logger = morgan(loggerFormat);

module.exports = logger;

