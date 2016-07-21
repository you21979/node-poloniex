var poloniex = require('..');
var api = poloniex.PublicApi;

var PAIR = "BTC_XRP"

var view = function(book){
    var order_asc = function(a, b){
        var aa = parseFloat(a[0])
        var bb = parseFloat(b[0])
        return  (aa < bb) ? -1 :
                (aa > bb) ? 1 :
                            0 ;
    }
    var order_desc = function(a, b){
        var aa = parseFloat(a[0])
        var bb = parseFloat(b[0])
        return  (aa > bb) ? -1 :
                (aa < bb) ? 1 :
                            0 ;
    }
    var asks = Object.keys(book.asks).map(function(k){
        return [k, book.asks[k]]
    })
    var bids = Object.keys(book.bids).map(function(k){
        return [k, book.bids[k]]
    })
    return {
        asks : asks.sort(order_asc),
        bids : bids.sort(order_desc),
    }
}

var main = function(pair){

    var books = {}
    books[pair] = {}

    api.orderBook(pair, 20).then(function(book){
        books[pair].asks = book.asks.reduce(function(r,v){
            r[v[0]] = v[1].toString()
            return r
        }, {});
        books[pair].bids = book.bids.reduce(function(r,v){
            r[v[0]] = v[1].toString()
            return r
        }, {});
    })

    var modify = function(book, data){
        switch(data.type){
        case "bid":
            book.bids[data.rate] = data.amount
            break;
        case "ask":
            book.asks[data.rate] = data.amount
            break;
        }
    }
    var remove = function(book, data){
        switch(data.type){
        case "bid":
            delete book.bids[data.rate]
            break;
        case "ask":
            delete book.asks[data.rate] 
            break;
        }
    }

    var stream = poloniex.createStreamApi([pair], function(obj){
        if(obj.type === "market"){
            if(books[pair].bids){
                obj.message.forEach(function(w){
                    if(w.type === 'orderBookModify'){
                        modify(books[pair], w.data);
                    }
                    if(w.type === 'orderBookRemove'){
                        remove(books[pair], w.data);
                    }
console.log(view(books[pair]))
                })
            }
        }
    });
}

main(PAIR)
