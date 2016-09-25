# kernewek
> A Cornish-english dictionary

[![Build Status](https://travis-ci.org/danreeves/kernewek.svg?branch=master)](https://travis-ci.org/danreeves/kernewek)
[![Coverage Status](https://coveralls.io/repos/github/danreeves/kernewek/badge.svg?branch=master)](https://coveralls.io/github/danreeves/kernewek?branch=master)

```javascript
const kernewek = require('kernewek');
kernewek.filter(word => word.english === 'dictionary');

[ { cornish: 'gerlever', english: 'dictionary' },
  { cornish: 'gerlyver', english: 'dictionary' } ]
```
