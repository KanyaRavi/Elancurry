var mongoose = require('mongoose');
var path = require('path');
var common = require('../helpers/common.js');
var validator = require("validator");

var productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  unit: {
    type: String
  },
  price:{
    type: Number
  },
  image:{
    type: String
  },
  description:{
    type: String
  },
  active:{
    type: Boolean
  },
  createdAt:{
    type: Date,
    default: Date.now
  },
  updatedAt:{
    type: Date
  },
  productType:{
    type: String,
    required: true
  }
},{collection: 'product'});

//Virtual properties

productSchema.set('toObject', { getters: true, virtuals: true });
productSchema.set('toJSON', { getters: true, virtuals: true });

// Instance methods
productSchema.methods.toJSON = function () {
  return {
    _id: this.id,
    title: this.title,
    unit: this.unit,
    price: this.price,
    image: this.image,
    description: this.description,
    active: this.active,
    productType: this.productType,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

productSchema.methods.update = function (updates, options, cb) {
  var userToUpdate = this;
  if (typeof options !== 'object' && typeof options === 'function') {
    cb = options;
  }
  var editableFields = ['title', 'unit', 'price', 'description' , 'image',  'active', 'updatedAt'];
  editableFields.forEach(function (field) {
    if (typeof field === 'String' && updates[field] !== undefined) {
      userToUpdate[field] = updates[field];
    }
  });
  userToUpdate.save(cb);
};


// Method to generate list of supported categories
// - needed in validation of whistle category property
productSchema.statics.list = function (callback) {
  this.find({}).select('name').lean().exec(callback);
};

/**
 * Static Methods
 */

// Method to create a user object
productSchema.statics.create = function (productObject, callback) {
  //var self = this;
  //var newUser = new self(userObject);
  //newUser.save(function (error, createdUser) {
  //  callback(error, createdUser);
  //});
  new this(productObject).save(callback); //8-)
};

productSchema.pre('save', function (next) {
  // When there is a problem, populate err and
  // let it passed on to the next() at the end
  var err = null;

  // 1. Validation #1

  next(err);
});

mongoose.model('product', productSchema);
