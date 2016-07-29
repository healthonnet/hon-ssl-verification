'use strict';

require('dotenv').config({silent: true});
var ssllabs = require('node-ssllabs');
var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');
var moment = require('moment');
var fs = require('fs');
var app = require('./src/app.js');
var whois = require('whois-json');

var minimumGrade = process.env.MINIMUM_GRADE || 'C';
var soonAlert = process.env.ALERT_MONTHLY || 30;
var laterAlert = process.env.ALERT_DAILY || 7;

var options = {
  host: process.env.DOMAIN_NAME,
  publish: false,
  startNew: true,
};

var mailOptions = {
  from: process.env.MAIL_FROM || '',
  to: process.env.MAIL_TO || '',
  'h:Reply-To': process.env.MAIL_FROM || '',
};
var nodemailerMailgun = nodemailer.createTransport(mg({
  auth: {
    api_key: process.env.MAIL_API,
    domain: process.env.MAIL_URI,
  }
}));

// Scan for certificate
ssllabs.scan(options, function(err, host) {
  var expiry = new Date(host.endpoints[0].details.cert.notAfter);
  var grade = host.endpoints[0].grade;
  var result = {
    type: 'SSL',
    grade: grade,
    expiry: expiry.toString(),
  };

  // Output results
  if (process.env.VERBOSE) {
    console.log(JSON.stringify(result, null, 2));
  }

  // Certificate has expired
  if (app.isExpired(expiry)) {
    console.error('Certificate expired ' + expiry.toString());
    if (process.env.EXIT_ON_EXPIRED_DATE) {
      process.exit(1);
    }
  }

  // Certificate is going to expire soon
  if (app.isSoonExpiring(expiry, soonAlert)) {
    mailOptions.subject = 'SSL Certificate verification - ' +
      process.env.DOMAIN_NAME +
      ' - SSL certificate is going to expires in less than ' +
      soonAlert + ' days';
    if (process.env.VERBOSE) {
      console.log(mailOptions.subject);
    }
    if (process.env.MAIL_URI) {
      app.loadFile(
        'src/mail.html',
        mailOptions,
        process.env.DOMAIN_NAME,
        'less than ' + laterAlert + ' days',
        function(err, options) {
        if (err) {
          console.error('Couldn\'t load file for sending email.');
          process.exit(1);
        }
        nodemailerMailgun.sendMail(options, function(err, info) {
          if (err) {
            console.error('Couldn\'t send email.');
            process.exit(1);
          }
          console.log('Email has been sent.');
        });
      });
    }
  }

  // Certificate is going to expire later
  if (app.isSoonExpiring(expiry, laterAlert)) {
    mailOptions.subject = 'SSL Certificate verification - ' +
      process.env.DOMAIN_NAME +
      ' - SSL certificate is going to expires in ' + laterAlert + ' days';
    if (process.env.VERBOSE) {
      console.log(mailOptions.subject);
    }
    if (process.env.MAIL_URI) {
      app.loadFile(
        'src/mail.html',
        mailOptions,
        process.env.DOMAIN_NAME,
        laterAlert + ' days',
        function(err, options) {
        if (err) {
          console.error('Couldn\'t load file for sending email.');
          process.exit(1);
        }
        nodemailerMailgun.sendMail(options, function(err, info) {
          if (err) {
            console.error('Couldn\'t send email.');
            process.exit(1);
          }
          console.log('Email has been sent.');
        });
      });
    }
  }

  // Grade verification
  if (!app.isGradeSufficient(minimumGrade, grade)) {
    console.log('Certificate has not met minimum grade requirement (' +
      minimumGrade + ') with grade: ' + grade);
    if (process.env.EXIT_ON_INSUFFICIENT_GRADE) {
      process.exit(1);
    }
  }
});

// Scan for DNS validity
whois(process.env.DOMAIN_NAME, function(err, data) {
  var expiry = new Date(Date.parse(data.registryExpiryDate));
  var result = {
    type: 'DNS',
    expiry: expiry.toString(),
  };

  // Output results
  if (process.env.VERBOSE) {
    console.log(JSON.stringify(result, null, 2));
  }

  // DNS is going to expire soon
  if (app.isSoonExpiring(expiry, soonAlert)) {
    mailOptions.subject = 'DNS verification - ' +
      process.env.DOMAIN_NAME +
      ' - DNS is going to expires in less than ' +
      soonAlert + ' days';
    if (process.env.VERBOSE) {
      console.log(mailOptions.subject);
    }
    if (process.env.MAIL_URI) {
      app.loadFile(
        'src/mail-dns.html',
        mailOptions,
        process.env.DOMAIN_NAME,
        'less than ' + laterAlert + ' days',
        function(err, options) {
        if (err) {
          console.error('Couldn\'t load file for sending email.');
          process.exit(1);
        }
        nodemailerMailgun.sendMail(options, function(err, info) {
          if (err) {
            console.error('Couldn\'t send email.');
            process.exit(1);
          }
          console.log('Email has been sent.');
        });
      });
    }
  }

  // Certificate is going to expire later
  if (app.isSoonExpiring(expiry, laterAlert)) {
    mailOptions.subject = 'DNS verification - ' +
      process.env.DOMAIN_NAME +
      ' - DNS is going to expires in ' + laterAlert + ' days';
    if (process.env.VERBOSE) {
      console.log(mailOptions.subject);
    }
    if (process.env.MAIL_URI) {
      app.loadFile(
        'src/mail-dns.html',
        mailOptions,
        process.env.DOMAIN_NAME,
        laterAlert + ' days',
        function(err, options) {
        if (err) {
          console.error('Couldn\'t load file for sending email.');
          process.exit(1);
        }
        nodemailerMailgun.sendMail(options, function(err, info) {
          if (err) {
            console.error('Couldn\'t send email.');
            process.exit(1);
          }
          console.log('Email has been sent.');
        });
      });
    }
  }
});
