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

var createPrivateApi = module.exports = function(api_key, secret_key, user_agent){
    var url = function(){ return constant.OPT_TRADEAPI_URL };
    var base_nonce = new Date() / 1000 |0;
    var nonce = function(){
        base_nonce = base_nonce + 1;
        return base_nonce
    }
    var query = function(method, params){
        return lp.req(createPostOption(url(), nonce(), api_key, secret_key, user_agent, method, params)).
            then(JSON.parse).then(function(v){
                if(v.error) throw(new Error(v.error));
                else return v
            });
    };
    return {
        query : query,
        balances : function(){
            return query("returnBalances", {})
        },
        completeBalances : function(){
            return query("returnCompleteBalances", {})
        },
        depositAddresses : function(){
            return query("returnDepositAddresses", {})
        },
        generateNewAddress : function(currency){
            return query("generateNewAddress", {
                currency : currency,
            })
        },
        depositsWithdrawals : function(start, end){
            return query("returnDepositsWithdrawals", {
                start : start,
                end : end,
            })
        },
        openOrders : function(pair){
            return query("returnOpenOrders", {
                currencyPair : pair || 'all',
            })
        },
        tradeHistory : function(start, end, pair){
            return query("returnTradeHistory", {
                currencyPair : pair || 'all',
                start : start,
                end : end,
            })
        },
        orderTrades : function(orderNumber){
            return query("returnOrderTrades", {
                orderNumber : orderNumber,
            })
        },
        buy : function(pair, rate, amount){
            return query("buy", {
                currencyPair : pair,
                rate : rate,
                amount : amount,
            })
        },
        sell : function(pair, rate, amount){
            return query("sell", {
                currencyPair : pair,
                rate : rate,
                amount : amount,
            })
        },
        cancelOrder : function(orderNumber){
            return query("cancelOrder", {
                orderNumber : orderNumber,
            })
        },
    };
}

