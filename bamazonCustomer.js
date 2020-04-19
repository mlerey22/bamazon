const mysql = require("mysql");
const inquirer = require("inquirer");


var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "ThisisforDB22.",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.table("connected as id " + connection.threadId);
    queryAllProducts();
    //   queryIndieSongs();
});



function queryAllProducts() {
    var query = connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);
        next();
    })

}

function next() {
    inquirer
        .prompt([
            // Here we create a basic text prompt.
            {
                type: "input",
                message: "What is the ID of the product you would like to buy?",
                name: "productChoice"
            },
            {
                type: "input",
                message: "How many would you like to buy?",
                name: "productAmount"
            }
        ])
        .then(function (inquirerResponse) {
            // If the inquirerResponse confirms, we displays the inquirerResponse's username and pokemon from the answers.
            var queryID = inquirerResponse.productChoice;
            var amount = parseInt(inquirerResponse.productAmount);
            console.log(amount)
            // console.log("\nWelcome you want to buy " + inquirerResponse.productChoice);
            // console.log("You want " + inquirerResponse.productAmount);


            queryChoice();
            function queryChoice() {
                var query = connection.query("SELECT * FROM products Where item_id =?", [queryID], function (err, res) {
                    var stock = parseInt(res[0].stock_quantity)
                    var newStock = stock - amount;
                    // console.log(stock)
                    if (err) throw err;
                    if (stock < amount) {
                        console.log("We do not have that much in stock, please select less or another product")
                    } else {
                        updateProduct(queryID, newStock);
                     
                    }
                })
            }
        });
}

function updateProduct(queryID, newStock) {
    console.log("Updating product...\n");
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: newStock
            },
            {
                item_id: queryID
            }
        ],
        function (err, res) {
            if (err) throw err;
            console.log("Order Placed!\n");
            // 
        }
    );
    connection.end();
}