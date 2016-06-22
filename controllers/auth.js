var mongoose = require('mongoose');
var path = require('path');
var User = mongoose.model('user');
var Order = mongoose.model('order');
var Product = mongoose.model('product');
var bodyParser = require('body-parser');
var Response = require('../helpers/response.js');
var errors = require('../helpers/errors.js');
var common = require('../helpers/common.js');
var mail = require("../helpers/mail.js");


//User Signup
exports.signup = function (req, res, next) {
  debugger;
  var registeringUser = req.params.user;
  console.log("got data");
  console.log(registeringUser);
  if(typeof registeringUser.phone == 'undefined' || registeringUser.phone == ''){
    console.log("f");
    res.send(new Response.respondWithData(400,"Phone number missing"));
    return next();
  }

  User.findOne({ 'phone': registeringUser.phone }, function(err, existingUser){
     if (err) {
       res.send(new Response.respondWithData(400,"Error looking up user"));
       return next();
     } else if(existingUser){
       res.send(new Response.respondWithData(400,"User already exists with this mobile number"));
       return next();
     } else {
        User.findOne({'email': registeringUser.email}, function(err, exists){
          if (err) {
            res.send(new Response.respondWithData(400,"Error looking up user"));
            return next();
          } else if(exists){
            res.send(new Response.respondWithData(400,"User exists with this email address"));
            return next();
          } else {
            User.create(registeringUser, function (err, newUser) {
              if (err) {
                errors.processError(err, req, res);
              } else {
                console.log("creating");
                newUser.createSession(function (err, loggedInUser) {
                  if (err) {
                    res.send(new Response.respondWithData(400,"Error logging in the new user: " + err.message));
                    return next();
                  } else {
                    console.log("added user");
                    res.send(200, {newUser: loggedInUser});
                    return next();
                  }
                });
              }
            });
          }
        })
     }
   });
 }


//Login into app
exports.login = function (req, res, next) {
  debugger;
  var phone = req.body.phone;
  var password = req.body.password;

  createNewSession(phone, password, function (err, user) {
    console.log(phone + password);
    console.log(user);
    if (err) {
      res.send(new Response.respondWithData("Username/Password invalid."));
      return next();
    } else {
      if (user) {
        console.log("login sucess");
        res.send({user: user});
        return next();
      } else {
        res.send(new Response.respondWithData("User not found."));
        return next();
      }
    }
  });
};

var createNewSession = function (phone, password, callback) {
  // Fetch the user from the database
  User
    .findOne({'phone' : phone})
    .exec(function(err, user) {
      console.log("ses:" +user);
      // Look up the user
      if (err) {
        if (callback) {
          err.message = "Error finding user profile";
          return callback(err);
        }
      } else if (!user) {
        console.log("not user");
        if (callback) {
          return callback({message: "Invalid username or password"});
        }
      }

      // Compare passwords
      if (!user.password(password)) {
        // Wrong passwowrd
        console.log("wrong pwd");
        return callback({message: "Wrong password"});
      }

      // Authenticated!
      // Create a new session and return the profile
      user.createSession(function(err, loggedInUser) {
        if (err) {
          console.log("err");
          err.message = "Error saving user data";
          return callback(err);
        }
        // TOOD: Use schema methods (statics) to filter user model
        return callback(null, loggedInUser);
      });
    });
};

//logout of the app
exports.logout = function(req, res, next) {
  req.user.accessToken = '';
  req.user.save(function(err) {
    if (err) {
      return next(new Response.respondWithData(err));
    } else {
      console.log("logout success");
      next(res.send(200));
      return next();
    }
  });
 };

 //Forgot password
 exports.forgotPassword = function(req, res, next){
 var email = req.params.email;
 console.log(email)
 User.findOne({'email':email}, function(err, user){
   if(err){
     res.send(new Response.respondWithData('Error looking up for email'));
     return next();
   } else if(user) {
     mail.sendMail(user.email, 0, user.name, user._id, function(result){
         if(result == 1){
           res.send(new Response.respondWithData('Error sending mail'));
           return next();
         } else {
         res.send(new Response.respondWithData('Mail Sent'));
         return next();
       }
       });
   } else {
     console.log("no user");
      res.send(new Response.respondWithData("User not found"));
     return next();
   }
 })

 }

 //sending the password file
 exports.sendPasswordFile = function(req, res, next) {
   debugger;
  var id = req.params.id;
  var _password = req.body._password;
   console.log("Got id");
   var link = "http:///api/sendfile"+id;
   console.log("got link");
  User.findById(id,function(err,user){
    if(user != null && user != "" ){
     res.sendFile(path.join(__dirname, '../views', 'index.html'));
    console.log("sent!!");
    }
   else {
     console.log("no user");
     res.send(new Response.respondWithData("Sorry ,You are not an authorised user"));
     return next();
   }
 });
 }
