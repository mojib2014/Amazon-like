DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
    id INTEGER(11) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price INTEGER(10) NOT NULL,
    stock_quantity INTEGER(10) NOT NULL,
    product_sales INTEGER(50) NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Toy Cars", "Kidds", 50, 200), ("Iphone7 Screen Protector", "Accessories", 12, 150),
("computers", "Technology", 340, 50), ("perfume", "Mens", 120, 60), 
("Candy", "Produce", 10, 100), ("Duck", "Kids", 15, 250),
("Iphone USB Cable", "Accessories", 20, 350), ("Notebook", "Office Supply", 8, 230),
("Shoe", "Mens", 150, 210), ("Shirts", "Mens", 23, 130), ("Sun Glasses", "Womens", 220, 159);

SELECT * FROM products;

CREATE TABLE departments (
    department_id INTEGER(11) AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    over_head_costs INTEGER(10) NOT NULL,
    PRIMARY KEY (department_id)
);
INSERT INTO departments (department_name, over_head_costs)
VALUES ("kids", 280), ("Technology", 600), 
("Produce", 100), ("Accessories", 200),
("Mens", 500);

SELECT * FROM departments;

SELECT departments.department_id, departments.department_name,
departments.over_head_costs, SUM(product_sales) AS product_sales,
SUM(product_sales) - departments.over_head_costs AS total_profit 
FROM departments INNER JOIN products ON departments.department_name = 
products.department_name GROUP BY departments.department_name ORDER BY 
departments.department_id;

SET SESSION sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE'