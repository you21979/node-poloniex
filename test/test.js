'use strict';
var assert = require('assert');
var les = require("local-echoserver");
var verify = require("@you21979/simple-verify");
var qstring = require("querystring");
var Promise = require("bluebird");
var px = require('..');

describe('test', function () {
    describe('private api test', function () {
        var constant = px.Constant;
        var config = {apikey : "",secretkey : "", useragent : "tradebot"}
        before(function() {
            return verify.createKeyPair().then(function(res){
                config.apikey = res.key
                config.secretkey = res.secret
            })
        })
        it('getInfo and auth', function () {
            return les(function(url){
                constant.OPT_TRADEAPI_URL = url + '/tradingApi'
                var papi = px.createPrivateApi(config.apikey, config.secretkey, config.useragent);
                return papi.balances()
            }, function(res, headers, method, url, body){
                assert(method === 'POST');
                assert(url === '/tradingApi');
                assert(headers['key'] === config.apikey)
                assert(headers['user-agent'] === config.useragent)
                assert(headers['sign'])
                var param = qstring.parse(body)
                assert(param.command === 'returnBalances');
                assert(param.nonce);
                var result = JSON.stringify({
                });
                res.end(result);
            })
        })
    })
    describe('public api test', function () {
        var constant = px.Constant;
        var api = px.PublicApi;
        it('orderBook', function () {
            return les(function(url){
                constant.OPT_RESTAPI_URL = url + '/public'
                return api.orderBook('BTC_DOGE', 10)
            }, function(res, headers, method, url, body){
                assert(method === 'GET');
                assert(url === '/public?command=returnOrderBook&currencyPair=BTC_DOGE&depth=10');
                var result = JSON.stringify({
  asks: 
   [ [ '0.00000031', 62576333.672501 ],
     [ '0.00000032', 86008862.705766 ],
     [ '0.00000033', 51686832.666866 ],
     [ '0.00000034', 48967567.793157 ],
     [ '0.00000035', 42216037.136607 ],
     [ '0.00000036', 25496811.814934 ],
     [ '0.00000037', 42358853.798304 ],
     [ '0.00000038', 83398673.276121 ],
     [ '0.00000039', 60113614.295838 ],
     [ '0.00000040', 44065500.398529 ] ],
  bids: 
   [ [ '0.00000030', 77721782.107048 ],
     [ '0.00000029', 125127953.04313 ],
     [ '0.00000028', 52762712.718874 ],
     [ '0.00000027', 40022233.678512 ],
     [ '0.00000026', 76967635.109861 ],
     [ '0.00000025', 16746902.493462 ],
     [ '0.00000024', 17012941.875002 ],
     [ '0.00000023', 4452640.3783011 ],
     [ '0.00000022', 3009470.7272727 ],
     [ '0.00000021', 821170.80952412 ] ]
                });
                res.end(result);
            })
        })
        it('ticker', function () {
            return les(function(url){
                constant.OPT_RESTAPI_URL = url + '/public'
                return api.ticker()
            }, function(res, headers, method, url, body){
                assert(method === 'GET');
                assert(url === '/public?command=returnTicker');
                var result = JSON.stringify({
  BTC_DOGE:
   { id: 27,
     last: '0.00000031',
     lowestAsk: '0.00000031',
     highestBid: '0.00000030',
     percentChange: '-0.03125000',
     baseVolume: '61.46248395',
     quoteVolume: '199170991.71724257',
     isFrozen: '0',
     high24hr: '0.00000033',
     low24hr: '0.00000030' },
  BTC_EMC2:
   { id: 28,
     last: '0.00000184',
     lowestAsk: '0.00000184',
     highestBid: '0.00000183',
     percentChange: '-0.01075268',
     baseVolume: '3.38760403',
     quoteVolume: '1877761.88135006',
     isFrozen: '0',
     high24hr: '0.00000188',
     low24hr: '0.00000176' },
                });
                res.end(result);
            })
        })
    })
})
