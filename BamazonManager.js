var mysql = require('mysql');
var inquirer = require('inquirer');
var prompt = require('prompt')
// var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: "Testword123", //Your password
    database: "Bamazon"
});

connection.connect(function(err){
	if (err) {
		throw err;
	} 

	console.log('Connected as id ' + connection.threadId);
	start();
});

console.log('*****************************************');
console.log("Welcome to the Bamazon Managment Tool");
console.log('*****************************************');
console.log('');

var start = function(){
	inquirer.prompt([{
		name: "Menu",
		type: "rawlist",
		message: "Please select an Activity: ",
		choices: ['View Store Inventory', 'View Low Stock Items', 'Add to Inventory', 'Add New Items']
	}]).then(function(choice) {

        switch(choice.Menu) {
            case 'View Store Inventory': 
                stock();
                break;
            case 'View Low Stock':
                lowStock();
                break;
            case 'Add to Inventory':
                addStock();
                break;
            case 'Add New Items':
                newStock();
                break;
            } 
        }); 
	}  

var stock = function (){
	connection.query('SELECT * from items', function(err, data){
	if (err) throw err; 

		console.log('');
		console.log('*****************************');
		console.log("Store Inventory");
		console.log('*****************************');
		console.log('');

	for (var i = 0; i < data.length; i++) {

    	console.log("itemID: " + data[i].ItemID + "|" + "ProductName: " + data[i].ProductName + "|" + "Price: $" + data[i].Price + "|" + "Quantity: " + data[i].StockQuantity + "|" + "\n");
		}
		 startOver();
	})
};

var lowStock = function(){
	connection.query('SELECT * from items', function(err, data){
	if (err) throw err; 

		console.log('');
		console.log('*****************************');
		console.log("Low Stock");
		console.log('*****************************');
		console.log('');

		// var inventory = data[i].StockQuantity;

		for (var i = 0; i < data.length; i++) {
			if (data[i].StockQuantity < 5) {
    			console.log("itemID: " + data[i].ItemID + "|" + "ProductName: " + data[i].ProductName + "|" + "Quantity: " + data[i].StockQuantity + "|" + "\n");

				};
				startOver();
			}
		})
	}; 

var addStock = function(){
	connection.query('SELECT * from items', function(err, data){
	if (err) throw err; 

		console.log('');
		console.log('*****************************');
		console.log("Add to Current Stock");
		console.log('*****************************');
		console.log('');

	for (var i = 0; i < data.length; i++) {

    	console.log("itemID: " + data[i].ItemID + "|" + "ProductName: " + data[i].ProductName + "|" + "Quantity: " + data[i].StockQuantity + "|" + "\n");
			}

	inquirer.prompt([{
	 		name: "Item",
	 		type: "input",
	 		message: "Enter the Id of the Item you would increase",
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
			message: "How Many would you like Add?",

	 		validate: function(value) {
	             if (isNaN(value) == false) {
	                 return true;
	             } else {
	             	console.log("Please enter a valid Quantity")
	                return false;
	            	   }
	        	 	}
			}]).then(function(answers){
				connection.query('SELECT StockQuantity FROM items WHERE ItemID=' + answers.Item, function(err, data, rows, fields){

				if(err) throw err;

				var stock = parseInt(data[0].StockQuantity);
				var Qty = parseInt(answers.Quantity);

					var updateStock = stock + Qty;

                console.log("There are now " + updateStock + " in stock");

                update(updateStock, answers.Item);
	   			})
			});
			startOver();
		})

	};

function update(stock, ItemID){
     	connection.query('UPDATE items SET StockQuantity = ' + stock + ' WHERE ItemID = "' + ItemID +'"', function(err, rows, data){
     		if (err) throw err;
     	})
     };

var newStock = function(){
	inquirer.prompt([{
		name: "ItemID",
        type: "input",
        message: "Please Insert an Item Id"
    },  {  
        name: "ProductName",
        type: "input",
        message: "What is the name of the Product?"
    }, {
        name: "DepartmentName",
        type: "input",
        message: "What is the Department?"
    }, {
        name: "Price",
        type: "input",
        message: "What is the Price"
    }, {
    	name: "Quantity",
        type: "input",
        message: "What is the Quantity you would like to add?",
            validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
    }]).then(function(answer) {
        connection.query("INSERT INTO items SET ?", {
        	ItemID: answer.ItemID,
            ProductName: answer.ProductName,
            DepartmentName: answer.DepartmentName,
            Price: answer.Price,
            Quantity: answer.Quantity
        }, function(err, res) {
            console.log("Your item was added successfully!");
            startOver();
        });
    })
}
var startOver = function(){
	inquirer.prompt([{
		name: "anotherItem",
		type: "confirm",
		message: "Would you like to complete another transaction?"
	}]).then(function(answer){
		if (answer.anotherItem == true){
			initialPrompt();
		} else{
			connection.end();
			console.log('***************************************');
			console.log('Thank you for using the Bamazon Manager Portal!')
			console.log('Come Again Soon!!!')
			console.log('***************************************');
		}
	})
};






