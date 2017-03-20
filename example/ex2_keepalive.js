var poloniex = require('..')
poloniex.Constant.OPT_KEEPALIVE = true

var api = poloniex.PublicApi;

api.orderBook("BTC_XRP").then(function(res){
    return {
        asks : res.asks,
        bids : res.bids,
    }
}).then(console.log)
api.orderBook("BTC_ETH").then(function(res){
    return {
        asks : res.asks,
        bids : res.bids,
    }
}).then(console.log)



