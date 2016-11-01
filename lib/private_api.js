"use strict";
var verify = require('@you21979/simple-verify')
var objectutil = require('@you21979/object-util');
var qstring = require('querystring');
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

var createParameter = function(method, nonce, params){
    return qstring.stringify(objectutil.keyMerge({ command: method, nonce: nonce }, params));
}

var createPostOption = function(url, nonce, api_key, secret_key, user_agent, method, params){
    var qs = createParameter(method, nonce, params);
    return {
        url: url,
        method: 'POST',
        form: qs,
        headers: createHeader(api_key, secret_key, user_agent, qs),
        timeout : Math.floor(constant.OPT_TIMEOUT_SEC * 1000),
        transform : function(body){
            return JSON.parse(body)
        }
    };
}

var TradeApi = function(api_key, secret_key, user_agent){
    this.name = 'POLONIEX';
    this.url = constant.OPT_TRADEAPI_URL;
    this.nonce = new Date() * 1;
    this.api_key = api_key;
    this.secret_key = secret_key;
    this.user_agent = user_agent;
}

TradeApi.prototype.query = function(method, mustparams, options){
    var params = objectutil.keyMerge(mustparams, options);
    return lp.req(createPostOption(this.url, this.incrementNonce(), this.api_key, this.secret_key, this.user_agent, method, params)).
        then(function(v){
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
TradeApi.prototype.feeInfo = function(options){
    return this.query("returnFeeInfo", {}, options || {})
}
TradeApi.prototype.availableAccountBalances = function(options){
    return this.query("returnAvailableAccountBalances", {}, options || {})
}
TradeApi.prototype.tradableBalances = function(options){
    return this.query("returnTradableBalances", {}, options || {})
}
TradeApi.prototype.transferBalance = function(currency, amount, fromAccount, toAccount, options){
    return this.query("transferBalance", {
        currency : currency,
        amount : amount,
        fromAccount : fromAccount,
        toAccount : toAccount,
    }, options || {})
}
TradeApi.prototype.marginAccountSummary = function(options){
    return this.query("returnMarginAccountSummary", {}, options || {})
}
TradeApi.prototype.marginBuy = function(pair, rate, amount, options){
    return this.query("marginBuy", {
        currencyPair : pair,
        rate : rate,
        amount : amount,
    }, options || {})
}
TradeApi.prototype.marginSell = function(pair, rate, amount, options){
    return this.query("marginSell", {
        currencyPair : pair,
        rate : rate,
        amount : amount,
    }, options || {})
}
TradeApi.prototype.getMarginPosition = function(pair, options){
    return this.query("getMarginPosition", {
        currencyPair : pair || 'all',
    }, options || {})
}
TradeApi.prototype.closeMarginPosition = function(options){
    return this.query("closeMarginPosition", {}, options || {})
}
TradeApi.prototype.createLoanOffer = function(currency, amount, duration, autoRenew, lendingRate, options){
    return this.query("createLoanOffer", {
        currency : currency,
        amount : amount,
        duration : duration,
        autoRenew : autoRenew,
        lendingRate : lendingRate,
    }, options || {})
}
TradeApi.prototype.cancelLoanOffer = function(orderNumber, options){
    return this.query("cancelLoanOffer", {
        orderNumber : orderNumber,
    }, options || {})
}
TradeApi.prototype.openLoanOffers = function(options){
    return this.query("returnOpenLoanOffers", {}, options || {})
}
TradeApi.prototype.activeLoans = function(options){
    return this.query("returnActiveLoans", {}, options || {})
}
TradeApi.prototype.toggleAutoRenew = function(orderNumber, options){
    return this.query("toggleAutoRenew", {
        orderNumber : orderNumber,
    }, options || {})
}

var createPrivateApi = module.exports = function(api_key, secret_key, user_agent){
    return new TradeApi(api_key, secret_key, user_agent);
}

