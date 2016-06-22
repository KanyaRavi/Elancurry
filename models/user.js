var mongoose = require('mongoose');
var path = require('path');
var common = require('../helpers/common.js');
var validator = require("validator");

/*User Schema*/
var userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  email:{
    type: String
  },
  _salt: {
  type: String
  },
 _password: {
  type: String
  },
  address: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  },
  accessToken:{
    type:String
  }
}, {collection: 'user'});
//Virtual properties
userSchema.path('name').validate(function (value) {
  return value && (value.length >= 3 && value.length <= 64);
}, 'Name should be between 3 and 64 characters long.');



userSchema.path('email').validate(function (value) {
  return validator.isEmail(value);
}, 'Invalid email');

userSchema.virtual('password')
  .get(function () {
    return function (password) {
      return (common.sha512(password + this._salt) === this._password);
    }
  })
  .set(function (value) {
    var salt = common.rand(512);
    this._salt = salt;
    this._password = common.sha512(value + salt);
  });

userSchema.set('toObject', { getters: true, virtuals: true });
userSchema.set('toJSON', { getters: true, virtuals: true });

// Instance methods
userSchema.methods.toJSON = function () {
  return {
    _id: this.id,
    name: this.name,
    phone: this.phone,
    email: this.email,
    address: this.address,
    createdAt: this.createdAt,
    lastLogin: this.lastLogin,
    accessToken: this.accessToken,
  };
};

userSchema.methods.update = function (updates, options, cb) {
  var userToUpdate = this;
  if (typeof options !== 'object' && typeof options === 'function') {
    cb = options;
  }
  var editableFields = ['name', 'email', 'phone', 'address'];
  editableFields.forEach(function (field) {
    if (typeof field === 'String' && updates[field] !== undefined) {
      userToUpdate[field] = updates[field];
    }
  });
  userToUpdate.save(cb);
};

userSchema.methods.createSession = function (cb) {
  this.lastLogin = new Date();
  this.accessToken = common.rand();
  this.save(cb);
};




/**
 * Static Methods
 */

// Method to create a user object
userSchema.statics.create = function (userObject, callback) {
  //var self = this;
  //var newUser = new self(userObject);
  //newUser.save(function (error, createdUser) {
  //  callback(error, createdUser);
  //});
  new this(userObject).save(callback); //8-)
};

// Method to fetch a user based on authentication key passed in request
userSchema.statics.findByAuthKey = function (authKey, callback) {
  this.findOne({ accessToken: authKey }, callback);
};

// Ensure that the thumb rules for user model are followed by... ALL
userSchema.pre('save', function (next) {
  // When there is a problem, populate err and
  // let it passed on to the next() at the end
  var err = null;

  // 1. Validation #1

  next(err);
});

mongoose.model('user', userSchema);
