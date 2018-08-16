var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Inventory = require('../models/inventory');
var Item = require('../models/item');
var Inventorytransaction = require('../models/inventorytransaction');
var Verifytoken = require('./loginadmin');
var checkAuth=require('./../middleware/check-auth');
var inventoryRouter = express.Router();

///Create router for  register the new user.

inventoryRouter
  .route('/inventory')
  .post(checkAuth, function (req, res) {
    if (!req.body) {
      res.json({ success: false, msg: 'Please Enter Required Data.' });
    } else {
      var counter;
      Inventory.find().exec(function (err, results) {
        var count = results.length;
        counter = count + 1;
        savedata(counter);
      });
    }
      function savedata(counter) {
        var myDateString = Date();
        var cc = counter;
        console.log('cc', cc);
        // var area = new Area(req.body);
          var inventory = new Inventory({
            id: cc,
            item: req.body.item,
            item_Qty: req.body.item_Qty,
            vendor_Name: req.body.vendor_Name,
            created_by: req.body.admin_id,
            created_at: myDateString,
            updated_by: null,
            updated_at: myDateString,
            status: true
          });
          inventory.save(function (err, inventory) {
            if (err) {

              res.status(400).send(err);
              return;
            }
            checkTransactionTable(req);
            // res.json(inventory);
            //res.json({ success: true, msg: 'Successful created new inventory.' });
          });
      }
    function checkTransactionTable(req) {
      var counter1;
      var counterc;

      Inventorytransaction.find().exec(function (err, results) {
        var count = results.length;
        counterc = count + 1;

      });
      Inventorytransaction.find({ item: req.body.item }).exec(function (err, results) {
        var ccc = results.length;
        console.log(" Transaction=========================", ccc);

        counter1 = ccc;
        console.log('counter1', counter1);
        var myDateString = Date();
        var qty_day_open = parseInt(req.body.item_Qty);
        var qty_day_consumed = 0;
        var qty_day_close = qty_day_open - qty_day_consumed;
        if (counter1 === 0) {
          var inventorytransaction = new Inventorytransaction({
            id: counterc,
            item: req.body.item,
            qty_day_open: qty_day_open,
            qty_day_consumed: qty_day_consumed,
            qty_day_close: qty_day_close,
            created_by: req.body.admin_id,
            created_at: myDateString,
            updated_by: null,
            updated_at: myDateString,
            status: true
          });

          inventorytransaction.save(function (err, inventory) {
            if (err) {
              res.status(400).send(err);
              return;
            }
            res.json(inventory);
            // res.json({ success: true, msg: 'Successful created new inventorytransaction.' }, );
          });
        }
        else {
          console.log(" UPDATE TRANSACTION =========================== ");
          var inventorytransactionId = req.body.item;
          Inventorytransaction.findOne({ item: inventorytransactionId }, function (err, inventorytransaction) {

            if (err) {
              res.status(500).send(err);
              return;
            }
            var myDateString = Date();
            var qty_day_open = parseInt(inventorytransaction.qty_day_close);
            var item_Qty = parseInt(req.body.item_Qty);
            var qty_Added = qty_day_open + item_Qty;
            var qty_day_consumed = parseInt(inventorytransaction.qty_day_consumed);;
            var qty_Avialable = qty_Added - qty_day_consumed;
            if (inventorytransaction) {
              inventorytransaction.qty_day_open = qty_Added;
              inventorytransaction.qty_day_consumed = qty_day_consumed;
              inventorytransaction.qty_day_close = qty_Avialable;
              inventorytransaction.updated_by = req.body.admin_id;
              inventorytransaction.updated_at = myDateString;
              inventorytransaction.save();

              res.json(inventorytransaction);
              return;
            }

            res.status(404).json({
              message: 'Unable to found.'
            });
          });
        }
      });
    }
  })


  //Create router for fetching All subservice.
  .get(checkAuth, function (req, res) {

    Inventory.
      find().
      populate('item').
      exec(function (err, inventories) {
        if (err) {
          res.status(500).send(err);
          return;
        }
        console.log('The Inventory  is %s', inventories);
        res.json(inventories);
      });

  });



//Create router for fetching All inventorytransaction.
inventoryRouter
  .route('/inventorytransaction')
  .get(checkAuth, function (req, res) {

    Inventorytransaction.
      find().
      populate('item').
      exec(function (err, Inventorytransactions) {
        if (err) {
          res.status(500).send(err);
          return;
        }
        console.log('The Inventorytransaction  is %s', Inventorytransactions);
        res.json(Inventorytransactions);
      });

  });


//Create router for fetching Single user.
inventoryRouter
  .route('/inventories/:inventoryId/:itemId')
  .get(checkAuth, function (req, res) {

    console.log('GET /inventory/:inventoryId');

    var inventoryId = req.params.inventoryId;

    Inventory.
      findOne({ id: inventoryId }).
      populate('item').
      exec(function (err, inventory) {
        if (err) {
          res.status(500).send(err);
          return;
        }
        console.log('The Inventory  is %s', inventory);
        res.json(inventory);
      });

  })

//Create router for Updating .
// .put(passport.authenticate('jwt', { session: false}),function (req, res) {

// console.log('PUT /inventories/:inventoryId');

// var inventoryId = req.params.inventoryId;
// var pre_Qty;
// Inventory.findOne({ _id: inventoryId }, function (err, inventory) {

//   // if (err) {
//   //   res.status(500).send(err);
//   //   return;
//   // }
//   pre_Qty = parseInt(inventory.item_Qty);
//   var myDateString = Date();
//   if (inventory) {
//     inventory.item = req.body.item;
//     inventory.item_Qty = req.body.item_Qty;
//     inventory.vendor_Name = req.body.vendor_Name;
//     inventory.status = req.body.status;
//     inventory.updated_by = req.body.updated_by;
//     inventory.updated_at =myDateString


//     inventory.save();

//     // res.json(inventory);
//     // return;
//   }

//   // res.status(404).json({
//   //   message: 'Unable to found.'
//   // });
// });
// var itemId = req.params.itemId;
// Inventorytransaction.findOne({ item: itemId }, function (err, inventorytransaction) {

//   // if (err) {
//   //   res.status(500).send(err);
//   //   return;
//   // }
//   var myDateString = Date();
//   var qty_day_open = parseInt(inventorytransaction.qty_day_close);
//   var item_Qty = parseInt(req.body.item_Qty);
//   if(item_Qty>pre_Qty){
//   var new_item_Qty = item_Qty - pre_Qty;
//   var qty_Added = qty_day_open + new_item_Qty;
//   }
//   else{
//     var new_item_Qty = pre_Qty - item_Qty;
//     var qty_Added = qty_day_open - new_item_Qty;
//   }
//   // var qty_Added = qty_day_open + new_item_Qty;
//   var qty_day_consumed = parseInt(inventorytransaction.qty_day_consumed);;
//   var qty_Avialable = qty_Added - qty_day_consumed;
//   if (inventorytransaction) {
//     inventorytransaction.qty_day_open = qty_Added;
//     inventorytransaction.qty_day_consumed = qty_day_consumed;
//     inventorytransaction.qty_day_close = qty_Avialable;
//     inventorytransaction.updated_by = req.body.updated_by;
//     inventorytransaction.updated_at = myDateString;
//     inventorytransaction.save();

//     res.json(inventorytransaction);
//     return;
//   }

//   // res.status(404).json({
//   //   message: 'Unable to found.'
//   // });
// });
// })

//Create router for fetching Single Inventorytransaction.
inventoryRouter
  .route('/inventorytransactions/:inventorytransactionId')
  .get(checkAuth, function (req, res) {

    console.log('GET /inventorytransactionId/:inventorytransactionId');

    var inventorytransactionId = req.params.inventorytransactionId;

    Inventorytransaction.
      findOne({ id: inventorytransactionId }).
      populate('item').
      exec(function (err, inventorytransaction) {
        if (err) {
          res.status(500).send(err);
          return;
        }
        console.log('The Inventory  is %s', inventorytransaction);
        res.json(inventorytransaction);
      });

  })

//Create router for Updating .
// .put(passport.authenticate('jwt', { session: false}),function (req, res) {

// console.log('PUT /inventories/:inventorytransactionId');

// var inventorytransactionId = req.params.inventorytransactionId;

// Inventorytransaction.findOne({ id: inventorytransactionId }, function (err, inventorytransaction) {

//   if (err) {
//     res.status(500).send(err);
//     return;
//   }
//   var myDateString = Date();
//   if (inventorytransaction) {
//     inventorytransaction.vendor_Name = req.body.vendor_Name;
//     inventorytransaction.updated_by = req.body.updated_by;
//     inventorytransaction.updated_at =myDateString


//     inventorytransaction.save();

//     res.json(inventorytransaction);
//     return;
//   }

//   res.status(404).json({
//     message: 'Unable to found.'
//   });
// });
// })



module.exports = inventoryRouter;