'use strict';

var chai = require('chai');
var should = chai.should();
var app = require('../src/app.js');

describe('ssl verification', function() {
  describe('has expired', function() {
    it('should exist', function() {
      app.should.have.property('isExpired');
    });
    it('should return false if there is no date.', function() {
      app.isExpired().should.be.false;
    });
    it('should return false if date is in the future.', function() {
      var nextYear = new Date().getFullYear() + 1;
      var date = new Date(
        nextYear, new Date().getMonth(), new Date().getDate()
      );
      app.isExpired(date).should.be.false;
    });
    it('should return true if date is in the past.', function() {
      var lastYear = new Date().getFullYear() - 1;
      var date = new Date(
        lastYear, new Date().getMonth(), new Date().getDate()
      );
      app.isExpired(date).should.be.true;
    });
  });

  describe('is going to expire soon', function() {
    var days = 10;
    it('should exist', function() {
      app.should.have.property('isSoonExpiring');
    });
    it('should return false if there is no date.', function() {
      app.isSoonExpiring().should.be.false;
    });
    it('should return true if date is soon.', function() {
      var futureDays = new Date().getDate() + days - 1;
      var date = new Date(
        new Date().getFullYear(), new Date().getMonth(), futureDays
      );
      app.isSoonExpiring(date, days).should.be.true;
    });
    it('should return false if date is not soon.', function() {
      var nextYear = new Date().getFullYear() + 1;
      var date = new Date(
        nextYear, new Date().getMonth(), new Date().getDate()
      );
      app.isSoonExpiring(date, days).should.be.false;
    });
    it('should return false if date is in the past.', function() {
      var past = new Date();
      var lastYear = past.getFullYear() - 1;
      var date = new Date(
        lastYear, new Date().getMonth(), new Date().getDate()
      );
      app.isSoonExpiring(date, days).should.be.false;
    });
  });

  describe('is going to expire later', function() {
    var days = 40;
    it('should exist', function() {
      app.should.have.property('isLaterExpiring');
    });
    it('should return false if there is no date.', function() {
      app.isLaterExpiring().should.be.false;
    });
    it('should return false if date is before.', function() {
      var futureDays = new Date().getDate() + days - 1;
      var date = new Date(
        new Date().getFullYear(), new Date().getMonth(), futureDays
      );
      app.isLaterExpiring(date, days).should.be.false;
    });
    it('should return true if date is equal.', function() {
      var futureDays = new Date().getDate() + days;
      var date = new Date(
        new Date().getFullYear(), new Date().getMonth(), futureDays
      );
      app.isLaterExpiring(date, days).should.be.true;
    });
    it('should return false if date is after.', function() {
      var nextYear = new Date().getFullYear() + 1;
      var date = new Date(
        nextYear, new Date().getMonth(), new Date().getDate()
      );
      app.isLaterExpiring(date, days).should.be.false;
    });
    it('should return false if date is in the past.', function() {
      var past = new Date();
      var lastYear = past.getFullYear() - 1;
      var date = new Date(
        lastYear, new Date().getMonth(), new Date().getDate()
      );
      app.isLaterExpiring(date, days).should.be.false;
    });
  });

  describe('is grade sufficient', function() {
    it('should exist', function() {
      app.should.have.property('isGradeSufficient');
    });

    it('should return true if no grades are given', function() {
      app.isGradeSufficient().should.be.true;
    });

    it('should return false if grade is not given', function() {
      app.isGradeSufficient('F').should.be.false;
    });

    it('should return true if A is above F', function() {
      app.isGradeSufficient('F', 'A').should.be.true;
    });

    it('should return false if F is above A', function() {
      app.isGradeSufficient('A', 'F').should.be.false;
    });

    it('should return true if C equals C', function() {
      app.isGradeSufficient('C', 'C').should.be.true;
    });

    it('should return true if W is above C', function() {
      app.isGradeSufficient('C', 'W').should.be.true;
    });

    it('should return false if C is above W', function() {
      app.isGradeSufficient('W', 'C').should.be.false;
    });

    it('should return true if X is above W', function() {
      app.isGradeSufficient('W', 'X').should.be.true;
    });
  });

  describe('load file', function() {
    it('should exist', function() {
      app.should.have.property('loadFile');
    });

    it('should send error', function(done) {
      app.loadFile('', null, null, null, function(err, options) {
        should.exist(err);
        done();
      });
    });

    it('should process', function(done) {
      app.loadFile('src/mail.html', {}, 'a', 'a', function(err, options) {
        should.not.exist(err);
        should.exist(options);
        done();
      });
    });
  });
});
