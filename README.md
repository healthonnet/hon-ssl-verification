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

### Options

* `DOMAIN_NAME` domain to test
* `MINIMUM_GRADE` minimum grade to pass (default `C`)

License
-------

Copyright (C) 2016 Health On the Net

This program is distributed under the MIT (X11) License: http://www.opensource.org/licenses/mit-license.php
