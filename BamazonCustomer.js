var mysql = require('mysql');
var inquirer = require('inquirer');
var prompt = require('prompt')

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: "jennaroe83?", //Your password
    database: "Bamazon"
});

connection.connect(function(err){
	if (err) {
		throw err;
	} 

	console.log('Connected as id ' + connection.threadId);
	start();
});

var start = function () {
connection.query('SELECT * from items', function(err, data){
	if (err) throw err; 
		console.log('*****************************');
		console.log("Welcome to Bamazon!");
		console.log('*****************************');
		console.log("Available products:");
		console.log('');
	for (var i = 0; i < data.length; i++) {

    console.log("itemID: " + data[i].ItemID + "|" + "ProductName: " + data[i].ProductName + "|" + "Price: $" + data[i].Price + "|" + "\n");
		}
	// console.log(data);
		initialPrompt();
	})
};

var initialPrompt = function(err, rows, fields){
 	inquirer.prompt([{
 		name: "Item",
 		type: "input",
 		message: "Enter the Id of the Item you would like to Purchase",
 			validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
            	console.log("Please enter a valid Item Id")
                return false;
            	}
        	}
       }, {
		name: "Quantity",
		type: "input",
		message: "How Many would you like Purchase?",

 		validate: function(value) {
             if (isNaN(value) == false) {
                 return true;
             } else {
             	console.log("Please enter a valid Quantity")
                return false;
            	   }
        	 	}
		}]).then(function(answers){
  			connection.query('SELECT StockQuantity, Price FROM items WHERE ItemID=' + answers.Item, function(err, data, rows, fields){

   				if(err) throw err;

   				var stock = parseInt(data[0].StockQuantity);
   				var price = parseFloat(data[0].Price);
   				var Qty = parseInt(answers.Quantity);

   				if(stock >= Qty){

   					var total = (Qty * price).toFixed(2);

   					console.log("Order Total: $" + total);

   					// stock = stock - Qty;

   					var updateStock = stock - Qty;
                    console.log("There are " + updateStock + " left in stock");
                    console.log("Thank you for your Business");
                    update(updateStock, answers.Item)

   				} else if (stock < Qty){
   					console.log("Sorry, not enough in stock to complete transaction");
   				 	console.log("Please choose another Item")
   				 	initialPrompt();
   				 }

	   })
	})
};
connection.end();
function update(stock, ItemID){
     	connection.query('UPDATE items SET StockQuantity = ' + stock + ' WHERE ItemID = "' + ItemID+'"', function(err, rows, data){
     		if (err) throw err;
     	});
     }

	

