DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products (
 id INTEGER(11) NOT NULL AUTO_INCREMENT,
 product_name VARCHAR(50) NOT NULL,
 department_name VARCHAR(50) NOT NULL,
 price INTEGER (10) NOT NULL,
 stock_quantity INTEGER (10)NULL,
 PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("outdoor","camping", 250, 25);

INSERT INTO products (product_name,department_name, price, stock_quantity)
VALUES ("outdoor","camping", 50, 25);

INSERT INTO products (product_name,department_name, price, stock_quantity)
VALUES ("outdoor","camping", 50, 25);

INSERT INTO products (product_name,department_name, price, stock_quantity)
VALUES ("outdoor","camping", 30, 25);

INSERT INTO products (product_name,department_name, price, stock_quantity)
VALUES ("outdoor","camping", 250, 25);

INSERT INTO products (product_name,department_name, price, stock_quantity)
VALUES ("outdoor","camping", 50, 25);

INSERT INTO products (product_name,department_name, price, stock_quantity)
VALUES ("outdoor","camping", 150, 25);

INSERT INTO products (product_name,department_name, price, stock_quantity)
VALUES ("outdoor","camping", 70, 25);

INSERT INTO products (product_name,department_name, price, stock_quantity)
VALUES ("outdoor","camping", 250, 25);

INSERT INTO products (product_name,department_name, price, stock_quantity)
VALUES ("outdoor","camping", 250, 25);

SELECT * FROM products;