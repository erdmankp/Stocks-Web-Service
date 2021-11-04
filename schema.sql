DROP TABLE IF EXISTS symbol;

CREATE TABLE symbol (
id SERIAL PRIMARY KEY,
symbol TEXT,
likes INT,
dislikes INT,
price_target INT,
buy_signal INT,
sell_signal INT,
analysis TEXT,
is_deleted INT DEFAULT 0,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
