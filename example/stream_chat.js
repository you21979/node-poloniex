var poloniex = require('..');

var api = poloniex.createStreamApi([], function(obj){
    if(obj.type === "trollbox"){
        console.log(obj.message[2] + ' : ' + obj.message[3])
    }
});
api.debuglog = console.log

