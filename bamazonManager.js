// Using inquirer package
var inquirer = require("inquirer");

// Using mysql package
var mysql = require("mysql");

// Using colors package
var colors = require("colors");

// Requiring console.table npm package
require("console.table");

// Creating connection path
var connection = mysql.createConnection({
    host: "localhost",
    prot: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"

});

// Connecting to database and server
connection.connect(function(err){
    if (err) throw err;
    console.log(("Connected as id " + connection.threadId + "\n").green);

    showManagerOps();
});

// Listing the menu to the manager
function showManagerOps () {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory','Add New Product', 'Nothing'],
            name: 'managerOp'
        }
    ]).then(function (data) {
        if (data.managerOp === 'View Products for Sale') {
            // list every available item: the item IDs, names, prices, and quantities
            showInventory();
        }
        else if (data.managerOp === 'View Low Inventory') {
            // list all items with an inventory count lower than five.
            lowInventory();
        }
        else if (data.managerOp === 'Add to Inventory') {
            // display a prompt that will let the manager "add more" of any item currently in the store
            increaseStock();
        }
        else if (data.managerOp === 'Add New Product') {
            // add a completely new product to the store
            addNewItem();
        }
        else {
            console.log("");
            console.log("======================================".rainbow);
            console.log('Okay. See you next time!');
            console.log("======================================".rainbow);
        }
    })
}

function showInventory () {
    connection.query('SELECT * FROM `products`', function (error, results) {
        // if there's an error, print and return
        if (error) {
            console.log(error);
            return;
        }
        console.log("");
        console.log("======================================".rainbow);
        console.log('\nList of inventory items: \n'.yellow);
        console.log("");
        console.log("======================================".rainbow);
        console.log("");
        console.table(results);
        console.log("");
        console.log("======================================".rainbow);

        showManagerOps();
      });
}

function lowInventory () {
    connection.query('SELECT * FROM products', function (error, results) {
        // if there's an error, print and return
        if (error) {
            console.log(error);
            return;
        }
            console.log("");
            console.log("======================================".rainbow);
            console.log('\nList of inventory products low in stock: \n'.yellow);
            console.log("");
            console.log("======================================".rainbow);

        for (var i = 0; i < results.length; i++) {
            if (results[i].stock_quantity < 5) {

                console.log("");
                console.log("======================================".rainbow);
                console.log("Product ID: " + results[i].id);
                console.log("");
                console.log("Product Name: " + results[i].product_name);
                console.log("");
                console.log("Price: $" + results[i].price);
                console.log("");
                console.log("Stock Quantity: " + results[i].stock_quantity);
                console.log("");
                console.log("======================================".rainbow);
            }
        }

        showManagerOps();

      });
}

function increaseStock () {

    connection.query('SELECT * FROM `products`', function (error, results) { 
        if (error) {
            console.log(error);
            return;
        }

        var productNames = [];

        for (var i=0; i < results.length; i++) {
            productNames.push(results[i].product_name);
        }

        inquirer.prompt([
            {
                type: 'list',
                message: 'Which product would you like to replenish?',
                choices: productNames,
                name: 'addMore'
            }
        ]).then(function (data) {
            var product = data.addMore;

            inquirer.prompt([
                {
                    type: 'input',
                    message: 'How many units of ' + product + ' would you like to add to stock?',
                    validate: function (value) {
                        return isNaN(value) === false && parseInt(value) > 0
                    },
                    name: 'stockIncrease'
                }
            ]).then(function (data) {
                var stockIncrease = parseInt(data.stockIncrease);
                var currentStock;

                connection.query('SELECT * FROM `products` WHERE ?', [{product_name: product}], function (error, results) {
                    if (error) {
                        console.log(error);
                        return;
                    }
                    currentStock = parseInt(results[0].stock_quantity);

                    connection.query('UPDATE `products` SET stock_quantity = ? + ' + stockIncrease + ' WHERE product_name = ?', [currentStock, product], function (error, data) {
                        if (error) {
                            console.log(error);
                            return;
                        }

                        console.log("");
                        console.log("======================================".rainbow);
                        console.log(('You\'ve increased the stock quantity of ' + product + ' by ' + stockIncrease + '.').invarse);
                        console.log("");
                        console.log("======================================".rainbow);

                        showManagerOps();
                    })

                })
            })
    
        })
    })
}

function addNewItem () {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What\'s the name of your new product?',
            name: 'product_name'
        },
        {
            type: 'input',
            message: 'What department is your product a part of?',
            name: 'department_name'
        },
        {
            type: 'input',
            message: 'What\'s the price of your item?',
            name: 'price'
        },
        {
            type: 'input',
            message: 'How much of this product would you like to stock?',
            name: 'stock_quantity'
        }
    ]).then(function (data) {
        // update db
        connection.query('INSERT INTO `products` SET ?', data, function (error, result) {

            console.log("");
            console.log("======================================".rainbow);
            console.log('Your product has been added to the Bamazon inventory.'.green);
            console.log("======================================".rainbow);
            console.log("");           

            showManagerOps();
        })
    })

    connection.end()
}

