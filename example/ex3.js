var poloniex = require('..')
var fs = require('fs');

var config = JSON.parse(fs.readFileSync("./account.json", "utf8"));

var api = poloniex.createPrivateApi(config.APIKEY, config.SECRET, "")
api.marginAccountSummary().then(function(res){
    console.log(res)
})


