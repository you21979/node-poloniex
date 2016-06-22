# node-poloniex

## install

```
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
