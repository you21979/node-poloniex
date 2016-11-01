"use strict";
var qstring = require('querystring');
var objectutil = require('@you21979/object-util');
var constant = require('./constant');
var lp = require('./system').lp;

var createParameter = function(method, params){
    return qstring.stringify(objectutil.keyMerge({ command: method }, params));
}

var createHeader = function(user_agent){
    return {
        'User-Agent': user_agent,
    };
}

var createGetOption = function(url, user_agent, qs){
    return {
        url: url + '?' + qs,
        method: 'GET',
        headers: createHeader(user_agent),
        timeout : Math.floor(constant.OPT_TIMEOUT_SEC * 1000),
        transform : function(body){
            return JSON.parse(body)
        }
    };
}

var query = exports.query = function(method, params){
    var user_agent = '';
    var url = constant.OPT_RESTAPI_URL;
    return lp.req(createGetOption(url, user_agent, createParameter(method, params || {})))
}

var ticker = exports.ticker = function(){
    return query('returnTicker')
}

var volume24 = exports.volume24 = function(){
    return query('return24Volume')
}

var orderBook = exports.orderBook = function(pair, depth){
    return query('returnOrderBook', {
        currencyPair : pair,
        depth : depth || 10,
    })
}

var tradeHistory = exports.tradeHistory = function(pair, start, end){
    return query('returnTradeHistory', {
        currencyPair : pair,
        start : start,
        end : end,
    })
}

var chartData = exports.chartData = function(pair, start, end, period){
    return query('returnChartData', {
        currencyPair : pair,
        start : start,
        end : end,
        period : period,
    })
}

var currencies = exports.currencies = function(){
    return query('returnCurrencies')
}

var loanOrders = exports.loanOrders = function(currency){
    return query('returnLoanOrders', {
        currency : currency,
    })
}

