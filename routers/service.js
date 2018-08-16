var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Service = require('../models/service');
var Verifytoken = require('./loginadmin');
var checkAuth=require('./../middleware/check-auth');
var serviceRouter = express.Router();

//Create router for  register the new service.
serviceRouter
  .route('/service')
  .post(checkAuth, function (req, res) {
    if (!req.body) {
      res.json({ success: false, msg: 'Please Enter Required Data.' });
    } else {
      var counter;
      Service.find().exec(function (err, results) {
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
      var code = req.body.code.toUpperCase();
      var service = new Service({
        id: cc,
        name: req.body.name,
        code: code,
        category: req.body.category,
        description: req.body.description,
        has_Sub_Service: true,
        created_by: req.body.admin_id,
        created_at: myDateString,
        updated_by: null,
        updated_at: myDateString,
        status: true,
        state: true
      });
      service.save(function (err) {
        if (err) {
          res.status(400).send(err);
          return;
        }
        res.json({ success: true, msg: 'Successful created new service.' });
      });
    }
  })

  //Create router for fetching All services.
  .get(checkAuth, function (req, res) {
    Service.find({ state: true },function (err, services) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.json(services);
    });
  });

  serviceRouter
  .route('/pos/services')
  .get(passport.authenticate('jwt',{session: false}), function(req,res){
    Service.find({status: true}, function(err, service){
      if(err){
        res.status(404).send(err);
        return;
      }
      res.json(service);
    })
  });

//Create router for fetching Single service.
serviceRouter
  .route('/services/:serviceId')
  .get(checkAuth, function (req, res) {
    console.log('GET /Services/:serviceId');
    var serviceId = req.params.serviceId;
    Service.findOne({ id: serviceId }, function (err, service) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      console.log(service);
      res.json(service);
    });
  })
  //Create router for Updating service.
  .put(checkAuth, function (req, res) {
    console.log('PUT /services/:serviceId');
    var serviceId = req.params.serviceId;
    Service.findOne({ _id: serviceId }, function (err, service) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      var myDateString = Date();
      var code = req.body.code.toUpperCase();
      if (service) {
            service.name = req.body.name,
            service.code = code,
            service.category = req.body.category,
            service.description = req.body.description,
            service.status = req.body.status;
            service.updated_by = req.body.updated_by;
            service.updated_at = myDateString
        service.save();
        res.json(service);
        return;
      }
      res.status(404).json({
        message: 'Unable to found.'
      });
    });
  })
  serviceRouter
  .route('/servicess/:serviceId')
  .put(checkAuth, function (req, res) {
    console.log('PUT /servicess/:serviceId');
    var serviceId = req.params.serviceId;
    Service.findOne({ _id: serviceId }, function (err, service) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      if (service) {
        service.state = false;
       
        service.save();
        res.json(service);
        return;
      }

      res.status(404).json({
        message: 'Unable to found.'
      });
    });
  })
module.exports = serviceRouter;