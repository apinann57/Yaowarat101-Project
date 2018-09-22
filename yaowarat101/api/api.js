const express = require('express');
const router = express.Router();
const mysql = require('mysql'); 
const path = require('path');
const fs = require('fs');
const multer = require('multer');


/////////////////////// start config server mysql ////////////////////
const connection = mysql.createConnection({
	user: 'root',
	password: 'rootroot',
	host: 'localhost',
	database: 'yaowarat101'
});

connection.connect(function(err) {
	if(err){
		console.log(err.code);
		console.log(err.fatal);
	}
});
/////////////////////// end config server mysql ////////////////////


////////////////// start config directory file upload ////////////////
const dirProducts = '../image/products';
var fileName = '';

let storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, dirProducts);
	},
	filename: (req, file, cb) => {
		cb(null, fileName + path.extname(file.originalname));
	}
})
let upload = multer({ storage: storage });

router.post('/upload', upload.single('photo'), function (req, res) {
	if (!req.file) {
		console.log("No file received");
		return res.send({
			success: false
		});

	} else {
		console.log('file received');
		return res.send({
			success: true
		})
	}

});
////////////////// end config directory file upload ////////////////


////////////////////// start api for product table //////////////////////


///////////////////////// get all product
router.get('/products', function (req, res) {
	$query = 'SELECT * from ywr_products';
	connection.query($query, function(err, rows, fields) {
		if(err){
            console.log(err);
            return;
        }
        res.json(rows);
    });
})

//Search by Name
// app.get('/products/search/:value', function (req, res) {
// 	$query = 'SELECT * from ywr_products WHERE p_Name LIKE "%' + req.params.value + '%" OR p_Id LIKE "%' + req.params.value + '%" OR p_Type LIKE "%' + req.params.value + '%"';
// 	// console.log($query)
// 	connection.query($query, function(err, rows, fields) {
// 		if(err){
//             console.log(err);
//             return;
//         }
//         res.end(JSON.stringify(rows));
//     });
// })


/////////////////////// get product by product id
router.get('/products/:p_Id', function (req, res) {
	$query = 'SELECT * from ywr_products WHERE p_Id = ' + req.params.p_Id;
	connection.query($query, function(err, rows, fields) {
		if(err){
            console.log(err);
            return;
        }
        res.json(rows);
    });
})



/////////////////////// insert product
router.post('/products', function (req, res) {
	$p_Name = req.body.p_Name.toString();
	$p_Type = req.body.p_Type.toString();
	$p_PercentGold = req.body.p_PercentGold.toString();
	$p_Weight = req.body.p_Weight.toString();
	$p_Length = req.body.p_Length.toString();
	$p_Price = req.body.p_Price.toString();

	$query = 'INSERT INTO ywr_products (p_Type, p_Name, p_PercentGold, p_Weight, p_Length, p_Price) VALUES ("' + $p_Type + '","' + $p_Name + '","' + $p_PercentGold + '","' + $p_Weight + '","' + $p_Length + '","' + $p_Price + '")';
	connection.query($query, function(err, rows, fields){
    	if(err) console.log(err)
    	res.json(rows);
    });
})


////////////////////// update product by product id
router.put('/products', function (req, res) {
	$p_Id = req.body.p_Id.toString();
	$p_Name = req.body.p_Name.toString();
	$p_Type = req.body.p_Type.toString();
	$p_PercentGold = req.body.p_PercentGold.toString();
	$p_Weight = req.body.p_Weight.toString();
	$p_Length = req.body.p_Length.toString();
	$p_Price = req.body.p_Price.toString();

    $query = 'UPDATE ywr_products SET p_Type = "'+ $p_Type + '", p_Name = "'+ $p_Name + '", p_PercentGold = "'+ $p_PercentGold + '", p_Weight = "'+ $p_Weight + '", p_Length = "'+ $p_Length + '", p_Price = "'+ $p_Price + '" WHERE p_Id = ' + $p_Id


    connection.query($query, function(err, rows, fields){
    	if(err) console.log(err)
    	res.json(rows);
    });
})


/////////////////////// delete product by product id
router.delete('/products/:p_Id', function (req, res) {
	$p_Id = req.params.p_Id.toString();
    $query = 'DELETE FROM ywr_products WHERE p_Id = ' + $p_Id


    // console.log($query)
    connection.query($query, function(err, rows, fields){
    	if(err) console.log(err)
    	res.json(rows);
    });
})

////////////////////// end api for product table //////////////////////



















////////////////////// start api for cart table //////////////////////


////////////////////// get product in cart by user id
router.get('/carts/:u_Id', function (req, res) {
	$query = 'SELECT * from ywr_cart WHERE u_Id = ' + req.params.u_Id;
	connection.query($query, function(err, rows, fields) {
		if(err){
            console.log(err);
            return;
        }
        res.json(rows);
    });
})


///////////////////// insert product in cart by user id
router.post('/carts/:u_Id', function (req, res) {
	$u_Id = req.params.u_Id;
	$p_Id = req.body.p_Id.toString();
	$p_Name = req.body.p_Name.toString();
	$p_Amount = req.body.p_Amount.toString();
	$p_Price = req.body.p_Price.toString();

	$query = 'INSERT INTO ywr_cart (u_Id, p_Id, p_Name, p_Amount, p_Price) VALUES ("' + $u_Id + '","' + $p_Id + '","' + $p_Name + '","' + $p_Amount + '","' + $p_Price + '")';
	connection.query($query, function(err, rows, fields){
    	if(err) console.log(err)
    	res.json(rows);
    });
})




////////////////////// update product by user id and product id
router.put('/carts/:u_Id', function (req, res) {
	$u_Id = req.params.u_Id;
	$p_Id = req.body.p_Id.toString();
	$p_Amount = req.body.p_Amount.toString();

    $query = 'UPDATE ywr_cart SET p_Amount = "'+ $p_Amount + '" WHERE u_Id = ' + $u_Id + ' AND p_Id = ' + $p_Id;


    connection.query($query, function(err, rows, fields){
    	if(err) console.log(err)
    	res.json(rows);
    });
})



/////////////////////// delete product in cart by user id and product Id
router.delete('/carts/:u_Id/:p_Id', function (req, res) {
	$p_Id = req.params.p_Id.toString();
	$u_Id = req.params.u_Id.toString();
    $query = 'DELETE FROM ywr_cart WHERE p_Id = ' + $p_Id + ' AND u_Id = ' + $u_Id;


    // console.log($query)
    connection.query($query, function(err, rows, fields){
    	if(err) console.log(err)
    	res.json(rows);
    });
})

////////////////////// end api for cart table ///////////////////////









////////////////////// start api for user table /////////////////////


router.get('/user', function (req, res) {
	$query = 'SELECT * from ywr_user';
	connection.query($query, function(err, rows, fields) {
		if(err){
            console.log(err);
            return;
        }
        res.json(rows);
    });
})


router.post('/user', function (req, res) {
	$u_Email = req.body.u_Email.toString();
	$u_Name = req.body.u_Name.toString();
	$u_Tel = req.body.u_Tel.toString();
	$u_Gender = req.body.u_Gender.toString();
	$u_Address = req.body.u_Address.toString();

	$query = 'INSERT INTO ywr_user (u_Email, u_Name, u_Tel, u_Gender, u_Address) VALUES ("' + $u_Email + '","' + $u_Name + '","' + $u_Tel + '","' + $u_Gender + '","' + $u_Address + '")';
	connection.query($query, function(err, rows, fields){
    	if(err) console.log(err)
    	res.json(rows);
    });
})


router.get('/user/email', function (req, res) {
	$query = 'SELECT u_Email,COUNT(u_Email) from ywr_user GROUP BY u_Email';
	connection.query($query, function(err, rows, fields) {
		if(err){
            console.log(err);
            return;
        }
        res.json(rows);
    });
})



////////////////////// end api for user table /////////////////////





module.exports = router;