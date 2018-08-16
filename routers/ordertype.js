var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Ordertype = require('../models/ordertype');
var Verifytoken = require('./loginadmin');
var ordertypeRouter = express.Router();

//Create router for  register the new role.
ordertypeRouter
    .route('/ordertype')
    .post(passport.authenticate('jwt', { session: false}),function (req, res) {
        if (!req.body) {
            res.json({ success: false, msg: 'Please Enter Required Data.' });
        } else { 
          
          var counter;

          Ordertype.find().exec(function (err, results) {
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
          console.log(" req.body ", req.body);
          var ordertype = new Ordertype({
              id:cc,
              order_type: req.body.order_type,
              created_by:req.body.admin_id,
              created_at:myDateString,
              updated_by:null,
              updated_at:myDateString,
              status:true
            });
            ordertype.save(function (err) {
              if (err) {
                  res.status(400).send(err);
                  return;
              }
              res.json({ success: true, msg: 'Successful created new ordertype.' });
          });
    
        }
      
    })


//Create router for fetching All roles.
  .get(passport.authenticate('jwt', { session: false}),function (req, res) {


    Ordertype.find(function (err, ordertypes) {

      if (err) {
        res.status(500).send(err);
        return;
      }
      console.log(ordertypes);
      res.json(ordertypes);
    });

  });

//Create router for fetching Single role.
ordertypeRouter
  .route('/ordertypes/:ordertypeId')
  .get(passport.authenticate('jwt', { session: false}),function (req, res) {

    console.log('GET /Ordertype/:ordertypeId');

    var ordertypeId = req.params.ordertypeId;

    Ordertype.findOne({ id: ordertypeId }, function (err, ordertype) {

      if (err) {
        res.status(500).send(err);
        return;
      }

      console.log(ordertype);

      res.json(ordertype);

    });
  })

  //Create router for Updating role.
  .put(passport.authenticate('jwt', { session: false}),function (req, res) {

    console.log('PUT /ordertypes/:ordertypeId');

    var ordertypeId = req.params.ordertypeId;

    Ordertype.findOne({ _id: ordertypeId }, function (err, ordertype) {

      if (err) {
        res.status(500).send(err);
        return;
      }
      var myDateString = Date();
      if (ordertype) {
        ordertype.order_type = req.body.order_type;
        ordertype.updated_by = req.body.updated_by;
        ordertype.status = req.body.status,
        ordertype.updated_at =myDateString
        
        ordertype.save();

        res.json(ordertype);
        return;
      }

      res.status(404).json({
        message: 'Unable to found.'
      });
    });
  })
  module.exports = ordertypeRouter;