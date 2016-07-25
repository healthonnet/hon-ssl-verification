hon-ssl-verification
====================

Check good health of server and SSL certificate from a given domain name.

This package uses https://github.com/keithws/node-ssllabs which is an implementation
of the [SSL Labs](https://www.ssllabs.com) API.

Installation
------------

```bash
$ npm install
```

Usage
-----

```bash
$ DOMAIN_NAME="domain.to.test" npm start
```

Options
-------

| Variable        | Description    |
|-----------------|----------------|
| `DOMAIN_NAME`   | domain to test
| `MINIMUM_GRADE` | minimum grade to pass (default `C`)
| `ALERT_MONTHLY` | first alert date (default `30` days)
| `ALERT_DAILY`   | daily alerts (default `7` days)
| `MAIL_URI`      | resource to webmail server
| `MAIL_API`      | resource API key (optional)
| `MAIL_FROM`     | from email
| `MAIL_TO`       | email recipients
| `VERBOSE`       | output more details
| `EXIT_ON_EXPIRED_DATE` | if set, will return exit 1, if certificate has expired
| `EXIT_ON_INSUFFICIENT_GRADE` | if set, will return exit 1, if certificate does not meet the minimum grade

Developers
----------

* Pierre REPETTO-ANDIPATIN <pierre.repetto@healthonnet.org>

License
-------

Copyright (C) 2016 Health On the Net

This program is distributed under the MIT (X11) License: http://www.opensource.org/licenses/mit-license.php
