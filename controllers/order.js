var mongoose = require('mongoose');
var path = require('path');
var Order = mongoose.model('order');
var Product = mongoose.model('product');
var User = mongoose.model('user');
var bodyParser = require('body-parser');
var Response = require('../helpers/response.js');
var errors = require('../helpers/errors.js');
var common = require('../helpers/common.js');
var mail = require("../helpers/mail.js");

//Ordering items
exports.orderItems = function (req, res, next){
  var orders = req.params.order;
  console.log(orders);
  Order.create(orders,function (err,items){
    if(err){
      errors.processError(err,req,res);
    }
    else{
       res.send({purchaseditem: items});
       console.log(items);
       return next();
    }
  });
}
