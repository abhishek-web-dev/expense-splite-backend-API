const moment = require('moment');
const momenttz = require('moment-timezone');
const timeZone = 'Asia/Calcutta';


let now = () => {
  return moment.utc().format();
};

let getLocalTime = () => {
  return moment().tz(timeZone).format("YYYY-MM-DD HH:mm:ss");
};

let getLocalDate = () => {
  return moment().tz(timeZone).format("dddd, MMMM D YYYY" );
};

let getCurrentYear = () => {
  return moment.utc().format('YYYY');
};

console.log(getLocalTime() );

let convertToLocalTime = (time) => {
  return momenttz.tz(time, timeZone).format('LLLL');
};


module.exports = {
  now: now,
  getLocalTime: getLocalTime,
  convertToLocalTime: convertToLocalTime,
  getCurrentYear: getCurrentYear,
  getLocalDate: getLocalDate
};