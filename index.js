const express = require('express');

const service = express();

var tickers = {
};
service.use(express.json());


service.post('/:ticker/:id', (request, response) => {
var ticker = request.params.ticker.toLowerCase();
var id = parseInt(request.params.id.toLowerCase());
var holder_ticker = {ticker: ticker, id: id, likes:0, dislikes:0};
Object.assign(holder_ticker, request.body);
if (tickers.hasOwnProperty(ticker)){
    tickers[ticker].analyses.push(holder_ticker);
} else{
    var new_ticker = {
        ticker: ticker,
        analyses: [
            {

            }
        ]
    }
    tickers[ticker] = new_ticker;
    tickers[ticker].analyses.push(holder_ticker);
}

response.json({
    ok:true,
    result: {
        ticker: ticker,
        id: id,
        likes: 0,
        dislikes: 0,
        price_target: 0,
        //analysis: tickers[ticker].analyses[id].analysis,
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
     analyses: tickers[ticker].analyses,
    }
    });
}else{
    response.status(404);
    response.json({
      ok: false,
      results: `No such ticker: ${ticker}`,
    });
}
});

service.get('/:ticker/:id', (request, response) => {
    var ticker = request.params.ticker;
    var id = parseInt(request.params.id);
        if (tickers.hasOwnProperty(ticker)){
    response.json({
    ok: true,
    result: {
     ticker: ticker,
     analyses: tickers[ticker].analyses[id],
    }
    });
}else{
    response.status(404);
    response.json({
      ok: false,
      results: `No such ticker: ${ticker}`,
    });
}
});

service.patch('/:ticker/:id/like', (request, response) => {
    var ticker = request.params.ticker;
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
    var holder_ticker = {};
    console.log(request.body);
    Object.assign(holder_ticker, request.body);
    if (tickers.hasOwnProperty(ticker)){
    tickers[ticker].analyses[id] = holder_ticker;
    response.json({
        ok: true,
        result: {
            analysis: tickers[ticker].analyses,
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