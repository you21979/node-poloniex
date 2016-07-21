"use strict";
var constant = require('./constant');
var autobahn = require('autobahn');

var createStreamApi = module.exports = function(pairs, receiver){
    var pairs = (pairs instanceof Array) ? pairs : [pairs];
    var instance = {
        close : function(){},
        debuglog : function(){},
        isReconnect : false,
    };
    var f = function(pair, receiver, instance){
        var uri = constant.OPT_WEBSOCKET_URL;
        var conn = new autobahn.Connection({
            url: uri,
            realm: "realm1"
        });
        conn.onopen = function(session) {
            instance.debuglog(['opened', uri]);
            instance.isReconnect = true;
            pairs.forEach(function(pair){
                session.subscribe(pair, function(args, kwargs){
                    if(args.length) receiver({type:"market", pair:pair, message:args, sub:kwargs});
                });
            })
            session.subscribe('ticker', function(args, kwargs){
                receiver({type:"ticker",message:args, sub:kwargs});
            });
            session.subscribe('trollbox', function(args, kwargs){
                receiver({type:"trollbox",message:args, sub:kwargs});
            });
        }
        conn.onclose = function () {
            instance.debuglog(['closed', uri]);
            if(instance.isReconnect){
                f(pair, receiver, instance);
            }
        }
        conn.open();
        instance.close = function(){
            instance.isReconnect = false;
            conn.close();
        }
    }
    f(pairs, receiver, instance);
    return instance;
}

