var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Price = require('../models/price');
var Service = require('./service');
// var Subservice = require('./subservice');
var Servicecategory = require('./servicecategory');
var Servicetype = require('./servicetype');
var Verifytoken = require('./loginadmin');
var checkAuth=require('./../middleware/check-auth');
var priceRouter = express.Router();

//Create router for  register the new subservice.
priceRouter
  .route('/price')
  .post(checkAuth, function (req, res) {
    if (!req.body) {
      res.json({ success: false, msg: 'Please Enter Required Data.' });
    }
    else {
      var counter;
      Price.find().exec(function (err, results) {
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
      var price = new Price({
        id: cc,
        price: req.body.price,
        servicetype: req.body.servicetype,
        service: req.body.service,
        // subservice:req.body.subservice,
        servicecategory: req.body.servicecategory,
        garment: req.body.garment,
        created_by: req.body.admin_id,
        created_at: myDateString,
        updated_by: null,
        updated_at: myDateString,
        status: true
      });
      price.save(function (err) {
        if (err) {
          res.status(400).send(err);
          return;
        }
        res.json({ success: true, msg: 'Successful created new.' });
      });
    }
  })

  .get(checkAuth, function (req, res) {


    // Price.find(function (err, prices) {

    //   if (err) {
    //     res.status(500).send(err);
    //     return;
    //   }
    //   console.log(prices);
    //   res.json(prices);
    // });

    Price.
      find().
      populate('servicetype service  servicecategory garment').
      exec(function (err, prices) {
        if (err) {
          res.status(500).send(err);
          return;
        }
        console.log('The Price  is %s', prices);
        res.json(prices);
      });
  });

priceRouter
.route('/pos/pricedetails/:serviceid')
.get(passport.authenticate('jwt',{session:false}),function(req,res){
  
  var serviceId = req.params.serviceid;
  Price.find({service: serviceId})
  .populate('servicetype service servicecategory garment').exec(function(error,pricelist){
      if(error){
        res.status(404).send(error);
        return;
      }
      res.send(pricelist);
  })
});

//Create router for fetching Single subservice.
priceRouter
  .route('/prices/:priceId')
  .get(checkAuth, function (req, res) {

    console.log('GET /price/:priceId');

    var priceId = req.params.priceId;

    // Price.findOne({ id: priceId }, function (err, price) {

    //   if (err) {
    //     res.status(500).send(err);
    //     return;
    //   }

    //   console.log(price);

    //   res.json(price);

    // });
    Price.
      findOne({ id: priceId }).
      populate('servicetype service subservice servicecategory garment').
      exec(function (err, price) {
        if (err) {
          res.status(500).send(err);
          return;
        }
        res.json(price);
      });
  })

  //Create router for Updating subservice.
  .put(checkAuth, function (req, res) {

    console.log('PUT /price/:priceId');

    var priceId = req.params.priceId;
    console.log(" =================================================== ", req.body);

    Price.findOne({ _id: priceId }, function (err, price) {

      if (err) {
        res.status(500).send(err);
        return;
      }
      var myDateString = Date();
      if (price) {

        price.servicetype = req.body.servicetype,
          price.service = req.body.service,
          price.servicecategory = req.body.servicecategory,
          price.garment = req.body.garment,
          price.price = req.body.price,
          price.status = req.body.status;
        price.updated_by = req.body.updated_by;
        price.updated_at = myDateString

        price.save();

        res.json(price);
        return;
      }

      res.status(404).json({
        message: 'Unable to found.'
      });
    });
  })
module.exports = priceRouter;