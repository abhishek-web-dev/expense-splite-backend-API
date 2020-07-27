'use strict';
const logger = require('pino')({timestamp:false});
const time = require('./timeLib');

// myErrorFunction is a definition of how the errors will be formatted in our system
let captureError = (errorMessage, errorOrigin, errorLevel) => {
  let currentTime = time.getLocalTime();

  let errorResponse = {
    timestamp: currentTime,
    errorMessage: errorMessage,
    errorOrigin: errorOrigin,
    errorLevel: errorLevel
  };

  logger.error(errorResponse);
 //return errorResponse;
}; // end captureError

let captureInfo = (message, origin, importance) => {
  let currentTime = time.getLocalTime();

  let infoMessage = {
    timestamp: currentTime,
    message: message,
    origin: origin,
    level: importance
  };

  logger.info(infoMessage);
 // return infoMessage;
}; // end infoCapture

module.exports = {
  error: captureError,
  info: captureInfo
};
