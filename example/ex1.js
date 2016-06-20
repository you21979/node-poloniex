var poloniex = require('..')
var api = poloniex.PublicApi;

api.ticker().then(function(res){
    return Object.keys(res).map(function(k){
        return [k, res[k].last]
    })
}).then(console.log)



