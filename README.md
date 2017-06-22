# node-poloniex

[![Build Status](https://secure.travis-ci.org/you21979/node-poloniex.png?branch=master)](https://travis-ci.org/you21979/node-poloniex)
[![Coverage Status](https://coveralls.io/repos/github/you21979/node-poloniex/badge.svg?branch=master)](https://coveralls.io/github/you21979/node-poloniex?branch=master)

## install

``` bash
npm i @you21979/poloniex.com
```

## api document

* https://poloniex.com/support/api/

### request limit

* public api
* 6 request/sec

```
Please note that making more than 6 calls per second to the public API, or repeatedly and needlessly fetching excessive amounts of data, can result in your IP being banned.
```

* private api
* 6 request/sec

```
Please note that there is a default limit of 6 calls per second. If you require more than this, please consider optimizing your application using the push API, the "moveOrder" command, or the "all" parameter where appropriate. If this is still insufficient, please contact support to discuss a limit raise.
```

## spec

* O public api
* O trade api
* O push api


Tuning Network Parameter
------------------------

* Attention! Global Parameter
* Setting - KeepAlive Connection
* Setting - Timeout Second 

``` javascript
var poloniex = require('@you21979/poloniex.com');

var appInitialize = function(){
    poloniex.Constant.OPT_KEEPALIVE = true;
    poloniex.Constant.OPT_TIMEOUT_SEC = 3;
}

var main = function(){
    appInitialize();
}

main()
```

## Error Handling

* simple error control

``` javascript
api.balances().catch(function(e){
    console.log(e.message)
})
```

* technical error control

``` javascript
var errors = require('@you21979/poloniex.com/errors')
api.balances()
    .catch(errors.HttpApiError, function (reason) {
        // API ERROR
        console.log(reason.message, "API", reason.error_code)
    })
    .catch(errors.StatusCodeError, function (reason) {
        // HTTP STATUS ERROR(404 or 500, 502, etc...)
        console.log("HTTP StatusCodeError " + reason.statusCode, "HTTP", reason.statusCode)
    })
    .catch(errors.RequestError, function (reason) {
        // REQUEST ERROR(SYSTEMCALL, TIMEOUT)
        console.log(reason.message, "SYSCALL", reason.error.code)
    })
    .catch(function(e){
        // OTHER ERROR
        console.log(e.message)
    })
```

License
-------

MIT License


Donate
------

```
bitcoin:1DWLJFxmPQVSYER6pjwdaVHfJ98nM76LiN 
monacoin:MCEp2NWSFc352uaDc6nQYv45qUChnKRsKK 
```
