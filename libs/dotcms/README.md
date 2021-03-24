# JavaScript SDK for DotCMS API's

This library allows you to interact with DotCMS API's easily from the browser, nodejs and React Native.

## Install

`npm install dotcms --save`

or

`yarn install dotcms`

## Usage

```javascript
import { initDotCMS } from 'dotcms';

const dotcms = initDotCMS({
    host: 'YOUR_DOTCMS_INSTANCE', // Non required, will be using in the requests if you pass it
    token: 'YOUR AUTH TOKEN'
});

// Example
dotcms.page
    .get({
        url: '/about-us'
    })
    .then((data) => {
        console.log(data);
    })
    .catch((err) => {
        console.error(err.status, err.message);
    });
```

## Documentation

[Full Documentation](https://dotcms.github.io/core-web/dotcms/)

## Running unit tests

Run `nx test dotcms` to execute the unit tests.


This library was generated with [Nx](https://nx.dev).
