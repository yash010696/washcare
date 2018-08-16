var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Item = require('../models/item');
var Verifytoken = require('./loginadmin');
var checkAuth=require('./../middleware/check-auth');
var itemRouter = express.Router();

///Create router for  register the new user.

itemRouter
.route('/item')
.post(passport.authenticate('jwt', { session: false}),function (req, res) {
  

    if (!req.body) {
        res.json({ success: false, msg: 'Please Enter Required Data.' });
    } else { 
      
      var counter;

      Item.find().exec(function (err, results) {
        var count = results.length;
        counter=count +1;
        savedata(counter);
         
      });
        

    }    
    function savedata(counter){
      var myDateString = Date();
      var cc=counter;
       console.log('cc',cc);
      // var area = new Area(req.body);
      var item = new Item({
          id:cc,
          franchise:req.body.franchise,
          item_Name:req.body.item_Name,
          unit_Type:req.body.unit_Type,
          threshold_Qty:req.body.threshold_Qty,
          created_by:req.body.admin_id,
          created_at:myDateString,
          updated_by:null,
          updated_at:myDateString,
          status:true,
          state: true
        });
        item.save(function (err,item) {
          if (err) {
              res.status(400).send(err);
              return;
          }
          res.json({ success: true, msg: 'Successful created new item.' });
      });
  

    }
  
})


//Create router for fetching All subservice.
.get(passport.authenticate('jwt', { session: false}),function (req, res) {


  Item.find({ state: true },function (err, items) {

  if (err) {
    res.status(500).send(err);
    return;
  }
  console.log(items);
  res.json(items);
});

});

//Create router for fetching Single user.
itemRouter
.route('/items/:itemId')
.get(passport.authenticate('jwt', { session: false}),function (req, res) {

console.log('GET /items/:itemId');

var itemId = req.params.itemId;

Item.findOne({ id: itemId }, function (err, item) {

  if (err) {
    res.status(500).send(err);
    return;
  }

  console.log(item);

  res.json(item);

});
})

//Create router for Updating .
.put(passport.authenticate('jwt', { session: false}),function (req, res) {

console.log('PUT /items/:itemId');

var itemId = req.params.itemId;

Item.findOne({ _id: itemId }, function (err, item) {

  if (err) {
    res.status(500).send(err);
    return;
  }
  var myDateString = Date();
  if (item) {
    item.item_Name=req.body.item_Name,
    item.unit_Type=req.body.unit_Type,
    item.threshold_Qty = req.body.threshold_Qty;
    item.status = req.body.status;
    item.updated_by = req.body.updated_by;
    item.updated_at =myDateString

  
    item.save();

    res.json(item);
    return;
  }

  res.status(404).json({
    message: 'Unable to found.'
  });
});
})
itemRouter
.route('/itemss/:itemId')
.put(checkAuth, function (req, res) {
  console.log('PUT /itemss/:itemId');
  var itemId = req.params.itemId;
  Item.findOne({ _id: itemId }, function (err, item) {
    if (err) {
      res.status(500).send(err);
      return;
    }
    if (item) {
      item.state = false;
     
      item.save();
      res.json(item);
      return;
    }

    res.status(404).json({
      message: 'Unable to found.'
    });
  });
})
module.exports = itemRouter;