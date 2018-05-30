// Importing sql and database
var mysql = require("mysql");

// Requiring console.table npm package
require("console.table");

// Requiring colors npm package
var colors = require("colors");

// Requiring inquirer npm package
var inquirer = require("inquirer");

// Creating connection path to sql and database
var connection = mysql.createConnection({
    host: "localhost",

    prot: 3306,

    user: "root",

    password: "",

    database: "bamazon_db"
});

// Connecting with mysql and database

connection.connect(function(err){
    if (err) throw err;
    console.log("");
    console.log("======================================================".rainbow);
    console.log(("Connected as ID " + connection.threadId + "\n").green);
    console.log("======================================================".rainbow);

    menuOptions();
});

// Displaying menu options to the supervisor
function menuOptions(){

    inquirer.prompt({
        name: "name",
        type: "list",
        message: "What would you like to do",
        choices: ["View Product Sales by Department", "Create New Department"]
    }).then(function(data){
        
        // If the supervisor choses View Product Sales by Department
        if(data.name === "View Product Sales by Department"){
            connection.query('SET SESSION sql_mode = "STRICT_TRANS_TABLES,NO_ZERO_IN_DATE"',
            function(err, res){

                showSales();
            });

        }

        // else if supervisor choses Create New Department
        else if(data.name === "Create New Department"){
            newDept();
        }
        else {
            console.log("Okay. See you next time!".yellow);
        }
    });
}

// Showing the Sales function
function showSales() {

    var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(product_sales) AS product_sales, SUM(product_sales) - departments.over_head_costs AS total_profit FROM departments INNER JOIN products ON departments.department_name = products.department_name GROUP BY departments.department_name ORDER BY departments.department_id";
    connection.query(query, function(err, results){
        if (err){
            console.log(err);
            return;
        }else {
            console.log("");
            console.log("======================================================".rainbow);
            console.log("");
            console.log("Product Sales by Department: ".america);
            console.log("");
            console.log("=============================================================================".rainbow);
            console.log("");
            console.table(results);
            console.log("=============================================================================".rainbow);
            console.log("");

        }

        menuOptions();
    });
}


// Creating new department function
function newDept(){
    inquirer.prompt(
        {
            name: "newDept",
            type: "input",
            message: "What's the name of the new department?"
        },

        {
            name: "overHeadCost",
            type: "input",
            message: "What's the overhead cost of the new department?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }).then(function(data){
            var query = "INSERT INTO departments (department_name, over_head_costs) VALUES (?, ?)";

            connection.query(query, [data.newDept, data.overHeadCost], function (err, results){
                console.log("");
                console.log("======================================================".rainbow);
                console.log("");
                console.log(("You added " + data.newDept + " as a new department.").green);
                console.log("");
                console.log("======================================================".rainbow);
                console.log("");

                menuOptions();
            });
        });
        
        connection.end();
    
}

// menuOptions();
