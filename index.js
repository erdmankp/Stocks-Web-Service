const express = require('express');
const mysql = require('mysql');
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

service.post('/:ticker/:id', (request, response) => {
if (request.body.hasOwnProperty('id') && request.body.hasOwnProperty('ticker') &&
request.body.hasOwnProperty('likes') && request.body.hasOwnProperty('dislikes') &&
request.body.hasOwnProperty('price_target') && request.body.hasOwnProperty('analysis')){
const parameters = [
    parseInt(request.body.id),
    request.body.ticker,
    request.body.likes,
    request.body.dislikes,
    request.body.price_target,
    request.body.analysis
];

const query = 'INSERT INTO ticker(id, ticker, likes, dislikes, price_target, analysis) VALUES (?, ?, ?, ?, ?, ?)';
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

} else {
    response.status(400);
    response.json({
      ok: false,
      results: 'Incomplete memory.',
    });
  }
});

service.get('/:ticker', (request, response) => {
    const parameters = [
        request.params.ticker,
        parseInt(request.params.id),
    ];
    const query = 'SELECT * FROM ticker WHERE ticker = ? AND is_deleted = 0'
    connection.query(query, parameters, (error, rows) => {
        if (error){
            response.status(500);
            response.json({
                ok: false,
                results: error.message,
            });
        }else{
            const tickers = rows.map(rowToMemory);
            response.json({
                ok: true,
                results: rows.map(rowToMemory),
            });
        }
    });  
});

service.get('/:ticker/:id', (request, response) => {
    const parameters =[
	    parseInt(request.params.id),
	    request.params.ticker,
];
    const query = 'SELECT * FROM ticker WHERE id = ? AND ticker = ?  AND is_deleted = 0'
    connection.query(query, parameters, (error, rows) => {
        if (error){
            response.status(500);
            response.json({
                ok: false,
                results: error.message,
            });
        }else{
            const tickers = rows.map(rowToMemory);
            response.json({
                ok: true,
                results: rows.map(rowToMemory),
            });
        }
    });  
});


service.patch('/:ticker/:id', (request, response) => {
    if (request.body.hasOwnProperty('id') && request.body.hasOwnProperty('ticker') &&
request.body.hasOwnProperty('likes') && request.body.hasOwnProperty('dislikes') &&
request.body.hasOwnProperty('price_target') && request.body.hasOwnProperty('analysis')){
    
    const parameters = [
        request.body.likes,
        request.body.dislikes,
        request.body.price_target,
        request.body.analysis,
        parseInt(request.body.id),
        request.body.ticker,
    ];
    
    const query = 'UPDATE ticker SET likes = ?, dislikes = ?, price_target = ?, analysis = ?, WHERE id = ? AND ticker = ?';
    
    connection.query(query, parameters, (error, result) => {
        if (error){
            response.status(500);
            response.json({
                ok: false,
                results: error.message,
            });
        }else{
            response.json({
                ok: true,
            });
        }
    });  
} else {
    response.status(400);
    response.json({
      ok: false,
      results: 'Incomplete memory.',
    });
  }
});

service.patch('/:ticker/:id/like', (request, response) => {
    if (request.body.hasOwnProperty('id') && request.body.hasOwnProperty('ticker') &&
request.body.hasOwnProperty('likes') && request.body.hasOwnProperty('dislikes') &&
request.body.hasOwnProperty('price_target') && request.body.hasOwnProperty('analysis')){
    
    const parameters = [
        request.body.likes + 1,
        request.body.dislikes,
        request.body.price_target,
        request.body.analysis,
        parseInt(request.body.id),
        request.body.ticker,
    ];
    
    const query = 'UPDATE ticker SET likes = ?, dislikes = ?, price_target = ?, analysis = ? WHERE id = ? AND ticker = ?';
    
    connection.query(query, parameters, (error, result) => {
        if (error){
            response.status(500);
            response.json({
                ok: false,
                results: error.message,
            });
        }else{
            response.json({
                ok: true,
            });
        }
    });  
} else {
    response.status(400);
    response.json({
      ok: false,
      results: 'Incomplete memory.',
    });
  }
});

service.patch('/:ticker/:id/dislike', (request, response) => {
    if (request.body.hasOwnProperty('id') && request.body.hasOwnProperty('ticker') &&
request.body.hasOwnProperty('likes') && request.body.hasOwnProperty('dislikes') &&
request.body.hasOwnProperty('price_target') && request.body.hasOwnProperty('analysis')){
    
    const parameters = [
        request.body.likes,
        request.body.dislikes + 1,
        request.body.price_target,
        request.body.analysis,
        parseInt(request.body.id),
        request.body.ticker,
    ];
    
    const query = 'UPDATE ticker SET likes = ?, dislikes = ?, price_target = ?, analysis = ? WHERE id = ? AND ticker = ?';
    
    connection.query(query, parameters, (error, result) => {
        if (error){
            response.status(500);
            response.json({
                ok: false,
                results: error.message,
            });
        }else{
            response.json({
                ok: true,
            });
        }
    });  
} else {
    response.status(400);
    response.json({
      ok: false,
      results: 'Incomplete memory.',
    });
  }
});

service.delete('/:ticker/:id', (request, response) => {
    const parameters = [
        request.params.ticker,
        parseInt(request.params.id),
    ];
    const query = 'UPDATE ticker SET is_deleted = 1 WHERE ticker = ? AND id = ?';
    connection.query(query, parameters, (error, result) => {
      if (error) {
        response.status(404);
        response.json({
          ok: false,
          results: error.message,
        });
      } else {
        response.json({
          ok: true,
        });
      }
    });
  });

service.delete('/:ticker', (request, response) => {
    const parameters = [
        request.params.ticker,
    ];
    const query = 'UPDATE ticker SET is_deleted = 1 WHERE ticker = ?';
    connection.query(query, ticker, (error, result) => {
      if (error) {
        response.status(404);
        response.json({
          ok: false,
          results: error.message,
        });
      } else {
        response.json({
          ok: true,
        });
      }
    });
  });

function rowToMemory(row){
	return{
		id: row.id,
		ticker: row.ticker,
		likes: row.likes,
		dislikes: row.dislikes,
		price_target: row.price_target,
		analysis: row.analysis
	};
}

const port = 5000;
service.listen(port, () => {
  console.log(`We're live on port ${port}!`);
});
