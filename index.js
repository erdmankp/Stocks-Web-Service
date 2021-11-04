const express = require('express');
const mysql = require('mysql');
const service = express();
const fs = require('fs');
const json = fs.readFileSync('credentials.json', 'utf8');
const credentials = JSON.parse(json);
const connection = mysql.createConnection(credentials);

service.use(express.json());
service.use((request, response, next) => {
    response.set('Access-Control-Allow-Origin', '*');
    next();
});

service.options('*', (request, response) => {
    response.set('Access-Control-Allow-Headers', 'Content-Type');
    response.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    response.sendStatus(200);
});

connection.connect(error => {
    if (error) {
        console.error(error);
        process.exit(1);
    }
});

service.options('*', (request, response) => {
    response.set('Access-Control-Allow-Headers', 'Content-Type');
    response.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
    response.sendStatus(200);
});



service.get('/report.html', (request, response) => {
    response.sendFile("report.html", {
        root: __dirname
    });
});


service.post('/:symbol/:id', (request, response) => {
    if (request.body.hasOwnProperty('id') && request.body.hasOwnProperty('symbol') &&
        request.body.hasOwnProperty('likes') && request.body.hasOwnProperty('dislikes') &&
        request.body.hasOwnProperty('price_target') && request.body.hasOwnProperty('analysis')) {
        const parameters = [
            parseInt(request.body.id),
            request.body.symbol,
            parseInt(request.body.likes),
            parseInt(request.body.dislikes),
            parseInt(request.body.price_target),
            request.body.analysis
        ];

        const query = 'INSERT INTO symbol(id, symbol, likes, dislikes, price_target, analysis) VALUES (?, ?, ?, ?, ?, ?)';
        connection.query(query, parameters, (error, result) => {
            if (error) {
                response.status(500);
                response.json({
                    ok: false,
                    results: error.message,
                });
            } else {
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


service.get('/:symbol', (request, response) => {

    const parameters = [
        request.params.symbol,
        parseInt(request.params.id),
    ];
    const query = 'SELECT * FROM symbol WHERE symbol = ? AND is_deleted = 0'
    connection.query(query, parameters, (error, rows) => {
        if (error) {
            response.status(500);
            response.json({
                ok: false,
                results: error.message,
            });
        } else {
            const symbols = rows.map(rowToMemory);
            response.json({
                ok: true,
                results: rows.map(rowToMemory),
            });
        }
    });
});

service.get('/:symbol/:id', (request, response) => {
    const parameters = [
        parseInt(request.params.id),
        request.params.symbol,
    ];
    const query = 'SELECT * FROM symbol WHERE id = ? AND symbol = ?  AND is_deleted = 0'
    connection.query(query, parameters, (error, rows) => {
        if (error) {
            response.status(500);
            response.json({
                ok: false,
                results: error.message,
            });
        } else {
            const symbols = rows.map(rowToMemory);
            response.json({
                ok: true,
                results: rows.map(rowToMemory),
            });
        }
    });
});


service.patch('/:symbol/:id', (request, response) => {
    if (request.body.hasOwnProperty('id') && request.body.hasOwnProperty('symbol') &&
        request.body.hasOwnProperty('likes') && request.body.hasOwnProperty('dislikes') &&
        request.body.hasOwnProperty('price_target') && request.body.hasOwnProperty('analysis')) {

        const parameters = [
            parseInt(request.body.likes),
            parseInt(request.body.dislikes),
            parseInt(request.body.price_target),
            request.body.analysis,
            parseInt(request.body.id),
            request.body.symbol,
        ];

        const query = 'UPDATE symbol SET likes = ?, dislikes = ?, price_target = ?, analysis = ?  WHERE id = ? AND symbol = ?';
        connection.query(query, parameters, (error, result) => {
            if (error) {
                response.status(500);
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
    } else {
        response.status(400);
        response.json({
            ok: false,
            results: 'Incomplete memory.',
        });
    }
});

service.patch('/:symbol/:id/like', (request, response) => {
    if (request.body.hasOwnProperty('id') && request.body.hasOwnProperty('symbol') &&
        request.body.hasOwnProperty('likes') && request.body.hasOwnProperty('dislikes') &&
        request.body.hasOwnProperty('price_target') && request.body.hasOwnProperty('analysis')) {

        const parameters = [
            parseInt(request.body.likes) + 1,
            parseInt(request.body.dislikes),
            parseInt(request.body.price_target),
            request.body.analysis,
            parseInt(request.body.id),
            request.body.symbol,
        ];

        const query = 'UPDATE symbol SET likes = ?, dislikes = ?, price_target = ?, analysis = ? WHERE id = ? AND symbol = ?';

        connection.query(query, parameters, (error, result) => {
            if (error) {
                response.status(500);
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
    } else {
        response.status(400);
        response.json({
            ok: false,
            results: 'Incomplete memory.',
        });
    }
});

service.patch('/:symbol/:id/dislike', (request, response) => {
    if (request.body.hasOwnProperty('id') && request.body.hasOwnProperty('symbol') &&
        request.body.hasOwnProperty('likes') && request.body.hasOwnProperty('dislikes') &&
        request.body.hasOwnProperty('price_target') && request.body.hasOwnProperty('analysis')) {

        const parameters = [
            parseInt(request.body.likes),
            parseInt(request.body.dislikes) + 1,
            parseInt(request.body.price_target),
            request.body.analysis,
            parseInt(request.body.id),
            request.body.symbol,
        ];

        const query = 'UPDATE symbol SET likes = ?, dislikes = ?, price_target = ?, analysis = ? WHERE id = ? AND symbol = ?';

        connection.query(query, parameters, (error, result) => {
            if (error) {
                response.status(500);
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
    } else {
        response.status(400);
        response.json({
            ok: false,
            results: 'Incomplete memory.',
        });
    }
});

service.delete('/:symbol/:id', (request, response) => {
    const parameters = [
        request.params.symbol,
        parseInt(request.params.id),
    ];
    const query = 'UPDATE symbol SET is_deleted = 1 WHERE symbol = ? AND id = ?';
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

service.delete('/:symbol', (request, response) => {
    const parameters = [
        request.params.symbol,
    ];
    const query = 'UPDATE symbol SET is_deleted = 1 WHERE symbol = ?';
    connection.query(query, symbol, (error, result) => {
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

function rowToMemory(row) {
    return {
        id: row.id,
        symbol: row.symbol,
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