/* -------------------------------------------------------------------------- */
/*                                     Dates                                  */
/* -------------------------------------------------------------------------- */
// * To create a new Date object use the Date() constructor:
// * 1. with no arguments -> Date() creates a Date instance containing the current time (up to milliseconds) and date.
// * 2. with one integer argument -> Date(m) creates a Date instance containing the time and date corresponding to the Epoch time.
// * 3. with a string argument -> Date(dateString) returns the Date object that results after parsing dateString with Date.parse.
// * 4. with two or more integer arguments -> Date(i1, i2, i3, i4, i5, i6) reads the arguments as year, month, day, hours, minutes, seconds,
// * milliseconds and instantiates the corresponding Date object.

// Creates a Date object with the current date and time from the user's browser
var now = new Date();
now.toString() === 'Mon Apr 11 2016 16:10:41 GMT-0500 (Central Daylight Time)'; // false

// Creates a Date object at the Unix Epoch (i.e., '1970-01-01T00:00:00.000Z')
var epoch = new Date(0);
epoch.toISOString() === '1970-01-01T00:00:00.000Z'; // true

// Creates a Date object with the date and time 2,012 milliseconds after the Unix Epoch (i.e., '1970-01-01T00:00:02.012Z').
var ms = new Date(2012);
date2012.toISOString() === '1970-01-01T00:00:02.012Z'; // true

// Creates a Date object with the first day of February of the year 2012 in the local timezone.
var one = new Date(2012, 1);
one.toString() === 'Wed Feb 01 2012 00:00:00 GMT-0600 (Central Standard Time)'; // true

// Creates a Date object with the first day of the year 2012 in the local timezone. (Months are zero-based).
var zero = new Date(2012, 0);
zero.toString() === 'Sun Jan 01 2012 00:00:00 GMT-0600 (Central Standard Time)'; // true

// Creates a Date object with the first day of the year 2012, in UTC.
var utc = new Date(Date.UTC(2012, 0));
utc.toString() === 'Sat Dec 31 2011 18:00:00 GMT-0600 (Central Standard Time)'; // true
utc.toISOString() === '2012-01-01T00:00:00.000Z'; // true

// Parses a string into a Date object (ISO 8601 format added in ECMAScript 5.1)
// Implementations should assumed UTC because of ISO 8601 format and Z designation
var iso = new Date('2012-01-01T00:00:00.000Z');
iso.toISOString() === '2012-01-01T00:00:00.000Z'; // true

// Parses a string into a Date object (RFC in JavaScript 1.0)
var local = new Date('Sun, 01 Jan 2012 00:00:00 -0600');
local.toString() === 'Sun Jan 01 2012 00:00:00 GMT-0600 (Central Standard Time)'; // true

// Parses a string in no particular format, most of the time. Note that parsing
// logic in these cases is very implementation-dependent, and therefore can vary across browsers and versions.
var anything = new Date('11/12/2012');
anything.toString() === 'Mon Nov 12 2012 00:00:00 GMT-0600 (Central Standard Time)'; // true

// Rolls values outside of a specified range to the next value.
var rollover = new Date(2012, 12, 32, 25, 62, 62, 1023);
rollover.toString() === 'Sat Feb 02 2013 02:03:03 GMT-0600 (Central Standard Time)'; // true;
// note that the month rolled over to Feb; first the month rolled over to Jan based on the month 12 (11 being December),
// then again because of the day 32 (January having 31 days).

// Special dates for years in the range 0-99
var special1 = new Date(12, 0);
special1.toString() === 'Mon Jan 01 1912 00:00:00 GMT-0600 (Central Standard Time)'; // true

// If you actually wanted to set the year to the year 12 CE, you'd need to use the setFullYear() method:
special1.setFullYear(12);
special1.toString() === 'Sun Jan 01 12 00:00:00 GMT-0600 (Central Standard Time)'; // true

/* -------------------------------------------------------------------------- */
/*                            Convert to a string format                      */
/* -------------------------------------------------------------------------- */
var date1 = new Date();
date1.toString(); // "Fri Apr 15 2016 07:48:48 GMT-0400 (Eastern Daylight Time)"

var date1 = new Date();
date1.toTimeString(); // "07:48:48 GMT-0400 (Eastern Daylight Time)"

var date1 = new Date();
date1.toDateString(); // "Thu Apr 14 2016"

var date1 = new Date();
date1.toLocaleDateString(); // "4/14/2016"

var date1 = new Date();
date1.toUTCString(); // "Fri, 15 Apr 2016 11:48:48 GMT"

var date1 = new Date();
date1.toGMTString(); // "Thu, 14 Apr 2016 23:49:08 GMT"

var date1 = new Date();
date1.toISOString(); // "2016-04-14T23:49:08.596Z"

/* -------------------------------------------------------------------------- */
/*                            Convert to JSON                                 */
/* -------------------------------------------------------------------------- */
var date1 = new Date();
date1.toJSON();

/* -------------------------------------------------------------------------- */
/*                            Creating a Date from UTC                        */
/* -------------------------------------------------------------------------- */

var birthday = new Date(Date.UTC(2000, 0, 1));
console.log(birthday);

// Creating a Date from UTC
var utcDate = new Date(Date.UTC(2000, 0, 31, 12));
console.log(utcDate);

// Changing a Date object
// All Date object modifiers, such as setDate(...) and setFullYear(...) have an equivalent takes an argument
// in UTC time rather than in local time.
var date = new Date();
date.setUTCFullYear(2000, 0, 31);
date.setUTCHours(12, 0, 0, 0);
console.log(date);

// Avoiding ambiguity with getTime() and setTime()
var date = new Date(Date.UTC(2000, 0, 31, 12));
var timestamp = date.getTime();

//Alternatively
var timestamp2 = Date.UTC(2000, 0, 31, 12);
console.log(timestamp === timestamp2);

/* -------------------------------------------------------------------------- */
/*                            Formatting a JavaScript date                    */
/* -------------------------------------------------------------------------- */
var today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
});

// Custom
var DateObject = (function () {
    var monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    var date = function (str) {
        this.set(str);
    };
    date.prototype = {
        set: function (str) {
            var dateDef = str ? new Date(str) : new Date();
            this.day = dateDef.getDate();
            this.dayPadded = this.day < 10 ? '0' + this.day : '' + this.day;
            this.month = dateDef.getMonth() + 1;
            this.monthPadded = this.month < 10 ? '0' + this.month : '' + this.month;
            this.monthName = monthNames[this.month - 1];
            this.year = dateDef.getFullYear();
        },
        get: function (properties, separator) {
            var separator = separator ? separator : '-';
            ret = [];
            for (var i in properties) {
                ret.push(this[properties[i]]);
            }
            return ret.join(separator);
        },
    };
    return date;
})();

/* -------------------------------------------------------------------------- */
/*  Get the number of milliseconds elapsed since 1 January 1970 00:00:00 UTC  */
/* -------------------------------------------------------------------------- */
// get milliseconds using static method now of Date
console.log(Date.now());

// get milliseconds using method getTime of Date instance
console.log(new Date().getTime());

/* -------------------------------------------------------------------------- */
/*                           Get the current time and date                    */
/* -------------------------------------------------------------------------- */
var day = new Date().getDate();
var hours = new Date().getHours();
var hours = new Date().getHours();
var minutes = new Date().getMinutes();
var seconds = new Date().getSeconds();
var milliseconds = new Date().getMilliseconds();

// Convert the current time and date to a human-readable string
var now = new Date();
console.log(now.toUTCString());

// get milliseconds using static method now of Date
console.log(Date.now());

// get milliseconds using method getTime of Date instance
console.log(new Date().getTime());

/* -------------------------------------------------------------------------- */
/*                               Increment a Date Object                      */
/* -------------------------------------------------------------------------- */
var checkoutDate = new Date();
checkoutDate.setDate(checkoutDate.getDate() + 1);
console.log(checkoutDate);

var checkoutDate = new Date();
checkoutDate.setDate(checkoutDate.getDate() + 12);
console.log(checkoutDate);

// Add Work Days
function addWorkDays(startDate, days) {
    // Get the day of the week as a number (0 = Sunday, 1 = Monday, .... 6 = Saturday)
    var dow = startDate.getDay();
    var daysToAdd = days;
    // If the current day is Sunday add one day
    if (dow == 0) daysToAdd++;
    // If the start date plus the additional days falls on or after the closest Saturday calculate
    weekends;
    if (dow + daysToAdd >= 6) {
        //Subtract days in current working week from work days
        var remainingWorkDays = daysToAdd - (5 - dow);
        //Add current working week's weekend
        daysToAdd += 2;
        if (remainingWorkDays > 5) {
            //Add two days for each working week by calculating how many weeks are included
            daysToAdd += 2 * Math.floor(remainingWorkDays / 5);
            //Exclude final weekend if remainingWorkDays resolves to an exact number of weeks
            if (remainingWorkDays % 5 == 0) daysToAdd -= 2;
        }
    }
    startDate.setDate(startDate.getDate() + daysToAdd);
    return startDate;
}

/* -------------------------------------------------------------------------- */
/*                               Date Comparison                              */
/* -------------------------------------------------------------------------- */
var date1 = new Date();
var date2 = new Date(date1.valueOf() + 10);
console.log(date1.valueOf() === date2.valueOf());

var date1 = new Date();
var date2 = new Date();
console.log(date1 === date2);

var date1 = new Date();
var date2 = date1;
console.log(date1 === date2);

var date1 = new Date();
var date2 = new Date(date1.valueOf() + 10);
console.log(date1 < date2);

var date1 = new Date();
var date2 = new Date(date1.valueOf());
console.log(date1 <= date2);

/* -------------------------------------------------------------------------- */
/*                             Date Difference Calculation                    */
/* -------------------------------------------------------------------------- */
var date1 = new Date();
var date2 = new Date(date1.valueOf() + 5000);
var dateDiff = date1.valueOf() - date2.valueOf();
var dateDiffInYears = dateDiff / 1000 / 60 / 60 / 24 / 365; //convert milliseconds into years
console.log('Date difference in years : ' + dateDiffInYears);
