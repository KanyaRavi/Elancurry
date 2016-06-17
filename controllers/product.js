var mongoose = require('mongoose');
var path = require('path');
var Product = mongoose.model('product');
var bodyParser = require('body-parser');
var Response = require('../helpers/response.js');
var errors = require('../helpers/errors.js');
var common = require('../helpers/common.js');
var mail = require("../helpers/mail.js");

//Product

exports.createProduct = function (req, res, next){
var createdProducts = req.params.products;
console.log("prod: " + createdProducts);
Product.create(createdProducts, function(err, product){
  if (err) {
    errors.processError(err, req, res);
  } else {
    console.log("creating");
        res.send(200, {newproducts: product});
        return next();
      }
    });
  }

exports.getProduct = function (req, res, next){
  //var data = req.params.data;
  console.log("data");
  Product.find({}).sort('productType').exec(function (err, details){
    if(err){
      res.send(new Response.respondWithData('Error fetching product details'));
      return next();
    }
    else{
      console.log("listed");
      res.send(details);
      return next();
    }
  });
}
