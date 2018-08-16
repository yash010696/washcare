var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const validator =require('validator');
var ObjectId = mongoose.Types.ObjectId;

var Admininfo = require('./admininfo');
var Inventorytransaction = require('./inventorytransaction');
var Item = require('./item');
var inventorySchema = new Schema({
  id: {
    type:Number,
    unique:true,
    default:1
  },
  item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item'
  },
  item_Qty: {
    type:String,
    required:true
  },
  vendor_Name: {
    type:String,
    required:true
  },
  created_by:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admininfo'
  },
  created_at:{
    type: String,
  },
  updated_by:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admininfo'
  },
  updated_at:{
    type: String
  },
  status:{
    type: Boolean
  }
}, { collection: 'inventories' });

module.exports = mongoose.model('Inventory', inventorySchema);
