DROP DATABASE IF EXISTS tickers;
DROP USER IF EXISTS tickers_user@localhost;

CREATE DATABASE tickers CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE USER tickers_user@localhost IDENTIFIED WITH mysql_native_password BY 'password';
GRANT ALL PRIVILEGES ON tickers.* TO tickers_user@localhost;

