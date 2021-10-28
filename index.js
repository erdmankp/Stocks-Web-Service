const express = require('express');

const service = express();
service.use(express.json());
const fs = require('fs');

const json = fs.readFileSync('credentials.json', 'utf8');
const credentials = JSON.parse(json);
var tickers = {
};

const connection = mysql.createConnection(credentials);
connection.connect(error => {
  if (error) {
    console.error(error);
    process.exit(1);
  }
});

// TODO: issue queries.

service.post('/:ticker/:id', (request, response) => {
if (request.body.hasOwnPropert('id') && request.body.hasOwnPropert('ticker') &&
request.body.hasOwnPropert('likes') && request.body.hasOwnPropert('dislikes') &&
request.body.hasOwnPropert('price_target') && request.body.hasOwnPropert('analysis')){
const parameters = [
    request.body.id,
    request.body.ticker,
    request.body.likes,
    request.body.dislikes,
    request.body.price_target,
    request.body.analysis
];
const query = 'INSERT INTO tickers(id, ticker, likes, dislikes, price_target, analysis) VALUES (?, ?, ?, ?, ?, ?)';
connection.query(query, parameters, (error, result) => {
if(error){
    response.status(500);
    response.json({
        ok: false,
        results: error.message,
    });
}else{
    response.json({
        ok: true,
        results: result.insertId,
    });
}
});
}
});

service.get('/:ticker', (request, response) => {
    var ticker = request.params.ticker;
    const query = 'SELECT * FROM tickers WHERE ticker = ?'
    connection.query(query, parameters, (error, rows) => {
        if (error){
            response.status(500);
            response.json({
                ok: false,
                results: error.message,
            });
        }else{
            const tickers = row.map(rowToMemory);
            response.json({
                ok: true,
                results: rows.map(rowToMemory),
            })
        }      
});
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
    var holder_ticker = {ticker: ticker, id: id};
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