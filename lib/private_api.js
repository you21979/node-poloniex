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
            return api.query("returnBalances", {})
        },
        completeBalances : function(){
            return api.query("returnCompleteBalances", {})
        },
        depositAddresses : function(){
            return api.query("returnDepositAddresses", {})
        },
        generateNewAddress : function(currency){
            return api.query("generateNewAddress", {
                currency : currency,
            })
        },
    };
}

