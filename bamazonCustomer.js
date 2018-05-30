// Requiring mysql
var mysql = require("mysql");

// Requiring inquirer npm package
var inquirer = require("inquirer");

// Requiring color npm package
var colors = require("colors");

// Requiring console.table npm package
require("console.table")

// Creating the connection information
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"

});

// connectiong to server and my sql database
connection.connect(function(err) {
    if (err) throw err;
    console.log(("Connected as id " + connection.threadId + "\n").underline.green);
    
    displayProducts();
});

var bamazonProducts;

// Displaying all the products to the customer.
function displayProducts(){
    connection.query(
        "SELECT * FROM products",
        function(err, res) {
            if (err) throw err; 
            
            bamazonProducts = res;

            console.log("\nWelcome to bamazon! These are the products we currently have in stock: \n");
            for (var i = 0; i < res.length; i++){
                console.log("=====================================".rainbow);
                console.log("");
                console.log(("Product ID: " + res[i].id).blue);
                console.log("");
                console.log(("Product Name: " + res[i].product_name).blue);
                console.log("");
                console.log(("Stock Quantity: " + res[i].stock_quantity).blue);
                console.log("");
                console.log(( "Price: " + res[i].price).blue);
                console.log("");
                console.log("======================================".rainbow);

            }
            promptUser();

        });

}


function promptUser() {

    inquirer.prompt(
        {
            name: "confirm",
            type: "confirm",
            message: "Would you like to purchase a product from bamazon?"

        }).then(function(answer){

            if (answer.confirm){

                placeOrder();
            }
            else {
                console.log("");
                console.log("Okay, We'll see you next time!".red);
                console.log("");
            }
        });
      
}     

function placeOrder(){

    inquirer.prompt(
        {
            name: "productId",
            type: "input",
            message: "Please select an ID of the product you would like to buy?",
            validate: function(value){
                return isNaN(value) === false && parseInt(value) > 0
            }
            
        }).then(function(answer){

            var proId = answer.productId;

            connection.query("SELECT * FROM products WHERE ?",
            {id: proId}, function(err, res){
            console.log(("\n You have selected product with id number: " + res[0].id + "\n").yellow);
                
            // Asking the user how many units they want to buy
            inquirer.prompt({   
                name: "productQuantity",
                type: "input",
                message: "How many units of the product would like to buy?",
                validate: function(value) {
                    return isNaN(value) === false && parseInt(value) > 0;
                }

            }).then(function(response){

                var units = response.productQuantity;

                // Once the customer has placed the order,
                // your application should check if your store has enough of the product to meet the customer's request.
                if (units <= res[0].stock_quantity){

                    console.log("===================================================".rainbow);
                    console.log("");
                    console.log(("You would like to buy " + units).yellow);
                    console.log("");
                    var remainingStock = res[0].stock_quantity - units;
                    console.log("");
                    console.log(("Inventory Remaining: " + remainingStock).cyan);
                    console.log("");
                    console.log(("Price: $" + units * res[0].price + ".00").rainbow);
                    console.log("");

                }
                else {
                    console.log(("Insufficient stock").yellow);
                    
                }
                // Updating stock
                connection.query("UPDATE products SET stock_quantity= " + remainingStock +
                "WHERE id = " +res[0].id, function(err, res){
                    if (res) {
                        console.log(res);
                    }
                    else {
                        console.log(("Thank you for shoping with bamazon").blue);
                        console.log("");
                    }    
                    
                    connection.end();

                })
                 
            });
   
            
            });  

        });

}

    
    
        
    
    
  




