// Jan 1st 1970 00:00:00 am

// More info: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
var date = new Date();

console.log(date);
console.log(date.getTime()); // Timestamp
console.log(`year: ${date.getYear() +1900}\nmonth: ${date.getMonth()}\nday: ${date.getDay()}\nhour: ${date.getHours()}\nminute: ${date.getMinutes()}\nsecond: ${date.getSeconds()}`);


var moment = require('moment');

date = moment();
console.log(date);
console.log(date.format()); // default format
console.log(date.format('hh:mm:ss')); // patterns
// More info: https://momentjs.com/docs/#/displaying/
console.log(date.format('MMM'));
console.log(date.format('MMM Do YYYY'));
date.add(100,'year').add(13,'day').subtract(3,'month');
console.log(date.format('MMM Do YYYY'));