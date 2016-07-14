'use strict';

var ssllabs = require('node-ssllabs');

var grades = ['A+', 'A', 'A-', 'B', 'C', 'D', 'E', 'F', 'T', 'M'];
var minimumGrade = process.env.MINIMUM_GRADE || 'C';

var options = {
  host: process.env.DOMAIN_NAME,
  publish: false,
  startNew: true,
};

ssllabs.scan(process.env.DOMAIN_NAME, function(err, host) {
  var date = new Date(host.endpoints[0].details.cert.notAfter);
  var grade = host.endpoints[0].grade;
  var result = {
    grade: grade,
    expiry: date.toString(),
  };
  console.log(JSON.stringify(result, null, 2));
  if (date < new Date()) {
    console.error('Certificate expired ' + date.toString());
    process.exit(1);
  }
  if (grades.indexOf(grade) > grades.indexOf(minimumGrade)) {
    console.error('Certificate has not met minimum grade requirement (' +
      minimumGrade + ') with grade: ' + grade);
    process.exit(1);
  }
});
