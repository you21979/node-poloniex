var poloniex = require('..')
var api = poloniex.PublicApi;

api.orderBook("BTC_XRP").then(function(res){
    return {
        asks : res.asks,
        bids : res.bids,
    }
}).then(console.log)



