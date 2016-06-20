var mysql = require('mysql');
var inquirer = require('inquirer');
var prompt = require('prompt')

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: "jennaroe83?", //Your password
    database: "Bamazon"
})

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

var initialPrompt = function(){
 	inquirer.prompt([{
 		name: "Item",
 		type: "input",
 		message: "Enter the Id of the Item you would like to Purchase"
         }, {
		name: "Quantity",
		type: "input",
		message: "How Many would you like Purchase?",

 		validate: function(value) {
             if (isNaN(value) == false) {
                 return true;
             } else {
                return false;
            	   }
        	 	}
		}]).then(function(response){
			console.log(response);
			});
};
	
// connection.query('SELECT ProductName from items', function(err, data){
// 	if (err) throw err;
// 	console.log(data);
// });

// connection.query('SELECT Price from items', function(err, data){
// 	if (err) throw err;
// 	console.log(data);
// });