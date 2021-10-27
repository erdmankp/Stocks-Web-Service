const express = require('express');

const service = express();

var tickers = {
};

service.post('/:ticker/:id', (request, response) => {
var ticker = request.params.ticker.toLowerCase();
var id = parseInt(request.params.id.toLowerCase());
if (tickers.hasOwnProperty(ticker)){
var new_analysis = {
    ticker: ticker,
    id: words[word].definitions.length,
    likes: 0,
    dislikes: 0,
    price_target: 0,
    buy_signals: ,
    sell_signals: ,
    analysis: ,
}
tickers[ticker].analyses.push(new_analysis);
} else{
    var new_analysis = {
        ticker: ticker,
        analyses: [
            {
                id: 0,
                likes: 0,
                dislikes: 0,
                price_target: 0,
                buy_signals: 0,
                sell_signals: 0,
                analysis: ,
            }
        ]
    }
    tickers[ticker] = new_analysis;
}

response.json({
    ok:true,
    result: {
        ticker: ticker,
        id: words[word].definitions.length-1,
        likes: 0,
        dislikes 0,
        price_target: 0,
        buy_signals: 0,
        sell_signals: 0,
        analysis: ,
        
    },
});
});

service.get('/:ticker', (request, response) => {
    var ticker = request.params.ticker;
    
        if (tickers.hasOwnProperty(ticker)){
    response.json({
    ok: true,
    result: {
     ticker: ticker,
     definitions: tickers[ticker].analyses,
    }
    });
}else{
    response.status(404);
    response.json({
      ok: false,
      results: `No such ticker: ${ticker}`,
    });
}
}
});

service.patch('/:ticker/:id/like', (request, response) => {
    var ticker = request.ticker.word;
    var id = parseInt(request.params.id);
    if (tickers.hasOwnProperty(ticker)){
    tickers[ticker].analyses[id].likes += 1;
    response.json({
        ok: true,
        result: {
            word: word,
            id: id,
            likes: tickers[ticker].analyses[id].likes,
        }
    })}else{
        response.status(404);
        response.json({
          ok: false,
          results: `No such ticker: ${ticker}`,
        });
    }
});

service.patch('/:ticker/:id', (request,response) => {
    var ticker = request.params.ticker;
    var id = parseInt(request.params.id);
    //var new_analysis = 
    if (tickers.hasOwnProperty(tickers)){
    //tickers[ticker].analyses[id].analysis = new_analysis;
    response.json({
        ok: true,
        result: {
            analysis: tickers[ticker].analyses[id].analysis,
        }
})}else{
    response.status(404);
        response.json({
          ok: false,
          results: `No such ticker: ${ticker}`,
        });
}
});

service.delete('/:ticker/:id', (request, response) => {
    var ticker = request.params.ticker;
    var id = parseInt(request.params.id);
    if (tickers.hasOwnProperty(ticker)){
    tickers[ticker].analyses.splice(id, 1);
    response.json({
        ok: true,
        result: {
            word: word,
            id: id,
        }
    })
}else{
    response.status(404);
        response.json({
          ok: false,
          results: `No such ticker: ${ticker}`,
        });
}
});

service.delete('/:ticker', (request, response) => {
    var ticker = request.params.ticker;
    if (tickers.hasOwnProperty(ticker)){
    tickers[ticker] = null;
    response.json({
        ok: true,
        result: {
            ticker: ticker,
        }
    })
}else{
    response.status(404);
        response.json({
          ok: false,
          results: `No such ticker: ${ticker}`,
        });
}
});

const port = 5000;
service.listen(port, () => {
  console.log(`We're live on port ${port}!`);
});