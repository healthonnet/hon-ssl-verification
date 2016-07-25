'use strict';

var fs = require('fs');

module.exports = {
  isExpired: function(time) {
    if (!time) {
      return false;
    }

    return (time < Date.now());
  },

  isSoonExpiring: function(time, period) {
    period = period || 7;
    if (!time) {
      return false;
    }
    var future = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() + period
    );

    return (time > Date.now() && time < future);
  },

  isLaterExpiring: function(time, period) {
    period = period || 30;
    if (!time) {
      return false;
    }
    var future = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() + period
    );

    return (
      time > Date.now() &&
      time.getFullYear() === future.getFullYear() &&
      time.getMonth() === future.getMonth() &&
      time.getDate() === future.getDate()
    );
  },

  isGradeSufficient: function(minimumGrade, grade) {
    if (!minimumGrade && !grade) {
      return true;
    }

    if (!grade) {
      return false;
    }

    var grades = ['A+', 'A', 'A-', 'B', 'C', 'D', 'E', 'F', 'T', 'M'];

    return grades.indexOf(grade) <= grades.indexOf(minimumGrade);
  },

  loadFile: function(fileName, mailOptions, domainName, expiry, callback) {
    fs.readFile(fileName, 'utf-8', function(err, data) {
      if (err) {
        return callback(err);
      }
      mailOptions.html = data.replace(/#DOMAIN_NAME#/, domainName);
      mailOptions.html = mailOptions.html.replace(/#EXPIRY#/, expiry);
      return callback(null, mailOptions);
    });
  },
};
