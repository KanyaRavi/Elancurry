var mongoose = require('mongoose');
var path = require('path');
var common = require('../helpers/common.js');
var validator = require("validator");

//Item Schema //
var itemSchema = new mongoose.Schema({
  item_name: {
    type: String,
    required: true
  },
  item_price: {
    type: String
  },
  item_qty:{
    type: Number
  },
  item_unit: {
    type: String
  },
  item_totalamt: {
    type: Number
  }
});

itemSchema.set('toObject', { virtuals: true });
itemSchema.set('toJSON', { virtuals: true });

itemSchema.methods.toJSON = function () {
  return {
    item_id: this.item_id,
    item_name: this.item_name,
    item_price: this.item_price,
    item_qty: this.item_qty,
    item_unit: this.item_unit,
    iten_totalamt: this.item_totalamt
  };
};

/**
 * Static Methods
 */

// Method to create a user object
itemSchema.statics.create = function (itemObject, callback) {
  //var self = this;
  //var newDeal = new self(dealObject);
  //newDeal.save(function (error, createdDeal) {
  //  callback(error, createdDeal);
  //});
  new this(itemObject).save(callback); //8-)
};

// Ensure that the thumb rules for user model are followed by... ALL
itemSchema.pre('save', function (next) {
  // When there is a problem, populate err and
  // let it passed on to the next() at the end
  var err = null;

  // 1. Validation #1

  next(err);
});

/*User Schema*/

var orderSchema = new mongoose.Schema({
 user_id:{
    type:mongoose.Schema.Types.ObjectId, ref: 'user'
 },
 total:{
   type: Number
 },
 items:[itemSchema],
 purchaseDate: {
   type: Date,
   default: Date.now
 },
 status:{
   type: String
 },
 deliveryType: {
   type: String
 },
 invoice: {
   type: Number
 },
 paymentType: {
   type: String,
   required: true
 },
 payment_mihpayid:{
   type: String
 }
}, {collection: 'order'});

//Virtual properties

orderSchema.set('toObject', { getters: true, virtuals: true });
orderSchema.set('toJSON', { getters: true, virtuals: true });

// Instance methods
orderSchema.methods.toJSON = function () {
  return {
    _id: this.id,
    user_id: this.user_id,
    total: this.total,
    items: this.items,
    purchaseDate: this.purchaseDate,
    status: this.status,
    deliveryType: this.deliveryType,
    invoice: this.invoice,
    paymentType: this.paymentType,
    payment_mihpayid:this.payment_mihpayid
  };
};

orderSchema.methods.update = function (updates, options, cb) {
  var userToUpdate = this;
  if (typeof options !== 'object' && typeof options === 'function') {
    cb = options;
  }
  var editableFields = ['items', 'deliveryType' , 'paymentType'];
  editableFields.forEach(function (field) {
    if (typeof field === 'String' && updates[field] !== undefined) {
      userToUpdate[field] = updates[field];
    }
  });
  userToUpdate.save(cb);
};

orderSchema.methods.createSession = function (cb) {
  this.save(cb);
};


/**
 * Static Methods
 */

// Method to create a user object
orderSchema.statics.create = function (orderObject, callback) {
  //var self = this;
  //var newUser = new self(userObject);
  //newUser.save(function (error, createdUser) {
  //  callback(error, createdUser);
  //});
  new this(orderObject).save(callback); //8-)
};


// Ensure that the thumb rules for user model are followed by... ALL
orderSchema.pre('save', function (next) {
  // When there is a problem, populate err and
  // let it passed on to the next() at the end
  var err = null;

  // 1. Validation #1

  next(err);
});

mongoose.model('items', itemSchema);
mongoose.model('order', orderSchema);
