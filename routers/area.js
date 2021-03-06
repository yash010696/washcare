var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Area = require('../models/area');
var Verifytoken = require('./loginadmin');
var checkAuth=require('./../middleware/check-auth');
var areaRouter = express.Router();

//Create router for  register the new area.
areaRouter
  .route('/area')
  .post(checkAuth, function (req, res) {
    if (!req.body) {
      res.json({ success: false, msg: 'Please Enter Required Data.' });
    } else {
      var counter;
      Area.find().exec(function (err, results) {
        var count = results.length;
        counter = count + 1;
        savedata(counter);
      });
    }
    function savedata(counter) {
      var cc = counter;
      var area = new Area({
        id: cc,
        name: req.body.name,
        code: req.body.code,
        created_by: req.body.admin_id,
        updated_by: null,
        status: true,
        state: true
      });
      area.save(function (err) {
        if (err) {
          res.status(400).send(err);
          return;
        }
        res.json({ success: true, msg: 'Successful created new area.' });
      });
    }
  })
  //Create router for fetching All areas.
  .get(checkAuth, function (req, res) {
    Area.find({ state: true },function (err, areas) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      console.log(areas);
      res.json(areas);
    });
  });
areaRouter
  .route('/areas/:areaId')
  .get(checkAuth, function (req, res) {
    var areaId = req.params.areaId;
    Area.findOne({ id: areaId }, function (err, area) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      // console.log(area);
      res.json(area);
    });
  })
  .put(checkAuth, function (req, res) {
    var areaId = req.params.areaId;
    Area.findOne({ _id: areaId }, function (err, area) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      if (area) {
        area.name = req.body.name;
        area.code = req.body.code;
        area.status = req.body.status;
        area.updated_by = req.body.updated_by;
        area.save();
        res.json(area);
        return;
      }

      res.status(404).json({
        message: 'Unable to found.'
      });
    });
  })
  areaRouter
  .route('/areass/:areaId')
  .put(checkAuth, function (req, res) {
    var areaId = req.params.areaId;
    Area.findOne({ _id: areaId }, function (err, area) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      if (area) {
        area.state = false;
       
        area.save();
        res.json(area);
        return;
      }

      res.status(404).json({
        message: 'Unable to found.'
      });
    });
  })
module.exports = areaRouter;