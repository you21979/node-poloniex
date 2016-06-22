"use strict";
var verify = require('@you21979/simple-verify')
var querystring = require('querystring');
var constant = require('./constant');
var lp = require('./system').lp;

var createHeader = function(api_key, secret_key, user_agent, data){
    return {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': user_agent,
        'Key': api_key,
        'Sign': verify.sign('sha512', secret_key, data),
    };
}

var createPostOption = function(url, nonce, api_key, secret_key, user_agent, method, params){
    params['command'] = method;
    params['nonce'] = nonce;
    var qs = querystring.stringify(params);
    return {
        url: url,
        method: 'POST',
        form: qs,
        headers: createHeader(api_key, secret_key, user_agent, qs),
        timeout : Math.floor(constant.OPT_TIMEOUT_SEC * 1000),
    };
}

var TradeApi = function(api_key, secret_key, user_agent){
    this.url = constant.OPT_TRADEAPI_URL;
    this.nonce = new Date() / 1000 |0;
    this.api_key = api_key;
    this.secret_key = secret_key;
    this.user_agent = user_agent;
}

var mergeParams = function(a, b){
    var w = {};
    Object.keys(a || {}).forEach(function(key){
        w[key] = a[key]
    })
    Object.keys(b || {}).forEach(function(key){
        w[key] = b[key]
    })
    return w
}

TradeApi.prototype.query = function(method, mustparams, options){
    var params = mergeParams(mustparams, options);
    return lp.req(createPostOption(this.url, this.incrementNonce(), this.api_key, this.secret_key, this.user_agent, method, params)).
        then(JSON.parse).then(function(v){
            if(v.error) throw(new Error(v.error));
            else return v
        });

}
TradeApi.prototype.incrementNonce = function(){
    return ++this.nonce;
}

TradeApi.prototype.balances = function(options){
    return this.query("returnBalances", {}, options || {})
}
TradeApi.prototype.completeBalances = function(options){
    return this.query("returnCompleteBalances", {}, options || {})
}
TradeApi.prototype.depositAddresses = function(options){
    return this.query("returnDepositAddresses", {}, options || {})
}
TradeApi.prototype.generateNewAddress = function(currency, options){
    return this.query("generateNewAddress", {
        currency : currency,
    }, options || {})
}
TradeApi.prototype.depositsWithdrawals = function(start, end, options){
    return this.query("returnDepositsWithdrawals", {
        start : start,
        end : end,
    }, options || {})
}
TradeApi.prototype.openOrders = function(pair, options){
    return this.query("returnOpenOrders", {
        currencyPair : pair || 'all',
    }, options || {})
}
TradeApi.prototype.tradeHistory = function(start, end, pair, options){
    return this.query("returnTradeHistory", {
        currencyPair : pair || 'all',
        start : start,
        end : end,
    }, options || {})
}
TradeApi.prototype.orderTrades = function(orderNumber, options){
    return this.query("returnOrderTrades", {
        orderNumber : orderNumber,
    }, options || {})
}
TradeApi.prototype.buy = function(pair, rate, amount, options){
    return this.query("buy", {
        currencyPair : pair,
        rate : rate,
        amount : amount,
    }, options || {})
}
TradeApi.prototype.sell = function(pair, rate, amount, options){
    return this.query("sell", {
        currencyPair : pair,
        rate : rate,
        amount : amount,
    }, options || {})
}
TradeApi.prototype.cancelOrder = function(orderNumber, options){
    return this.query("cancelOrder", {
        orderNumber : orderNumber,
    }, options || {})
}
TradeApi.prototype.moveOrder = function(orderNumber, rate, options){
    return this.query("moveOrder", {
        orderNumber : orderNumber,
        rate : rate,
    }, options || {})
}
TradeApi.prototype.withdraw = function(currency, amount, address, options){
    return this.query("withdraw", {
        currency : currency,
        amount : amount,
        address : address,
    }, options || {})
}
TradeApi.prototype.x = function(options){
    return this.query("", {}, options || {})
}

var createPrivateApi = module.exports = function(api_key, secret_key, user_agent){
    return new TradeApi(api_key, secret_key, user_agent);
}

