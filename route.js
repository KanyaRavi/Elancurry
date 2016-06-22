var authController = require('./controllers/auth.js');
var productController = require('./controllers/product.js');
var orderController = require('./controllers/order.js');
var path = require('path');

module.exports = function (app){

  app.get('/', function(req, res) {
    res.send(200, {Welcome: true});
  });

  app.post('/api/user/signup',authController.signup);
  app.post('/api/user/login',authController.login);
  app.del('/api/user/logout',needsAuth,authController.logout);
  app.get('/api/user/forgotpassword/:email',authController.forgotPassword);
  app.get('/api/user/sendfile/:id',authController.sendPasswordFile);

  //Product
  app.post('/api/product/create',productController.createProduct);
  app.get('/api/product/list',productController.getProduct);

  //Orders
  app.post('/api/orders/purchase',orderController.orderItems);
}

function needsAuth(req, res, next) {
  return isAuthenticated(req, res, next);
}

function isAuthenticated(req, res, next) {
  var authKey = req.headers.authorization;
  if (!authKey) {
    res.send(new Response.respondWithData("Authentication required"));
    return false;
  }
  req.db.model("user").findByAuthKey(authKey, function(err, user) {
    if (err) {
	  res.send(new Response.respondWithData("Authentication required"));
	  return;
	}

	if (!user) {
      res.send(new Response.respondWithData("Authentication required"));

    } else {
      req.user = user;
      return next();
    }
  });
}
