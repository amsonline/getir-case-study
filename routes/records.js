var express = require('express');
const { ConsoleWriter } = require('istanbul-lib-report');
const outputResults = require('../services/outputResults');
const moment = require('moment');
var router = express.Router();

var db = require('../services/db');

router.post('/', function(req, res, next) {
  
  // Check to see if all fields are present inside the payload
  if (typeof req.body.startDate === 'undefined'
    || typeof req.body.endDate === 'undefined'
    || typeof req.body.minCount === 'undefined'
    || typeof req.body.maxCount === 'undefined') {
      res.status(400).send(outputResults([], -101, "Request payload should contain startDate, endDate, minCount and maxCount."));
      return;
  }

  // Validate startDate
  if (!moment(req.body.startDate, "YYYY-MM-DD", true).isValid()) {
    res.status(400).send(outputResults([], -111, "startDate is invalid. It should be in YYYY-MM-DD format."));
    return;
  }

  // Validate endDate
  if (!moment(req.body.endDate, "YYYY-MM-DD", true).isValid()) {
    res.status(400).send(outputResults([], -112, "endDate is invalid. It should be in YYYY-MM-DD format."));
    return;
  }

  // Validate minCount
  if (req.body.minCount < 0) {
    res.status(400).send(outputResults([], -121, "minCount is invalid. It should be a number greater or equal to 0."));
    return;
  }

  // There is no need to validate maxCount like we did for minCount, as the last validation rule (checking minCount <= maxCount) will do the same

  // startDate should be less than or equal to endDate
  var startDate = new Date(req.body.startDate);
  var endDate = new Date(req.body.endDate);
  if (startDate > endDate) {
    res.status(400).send(outputResults([], -113, "startDate should be less than or equal to endDate."));
    return;
  }

  // minCount should be less than or equal to maxCount
  if (req.body.minCount > req.body.maxCount) {
    res.status(400).send(outputResults([], -114, "minCount should be less than or equal to maxCount."));
    return;
  }

  db.connectToServer().then(dbo => {
    dbo.collection("records").aggregate([
      {
        $addFields: {
          totalCount: {$sum: "$counts"}
        }
      },
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate
          },
          totalCount: {
            $gte: req.body.minCount,
            $lte: req.body.maxCount
          }
        }
      },
      {
        $project: {
          _id: 0, key: 1, createdAt: 1, totalCount: 1
        }
      }
    ]).toArray((error, results) => {
      if (error) {
        res.status(500).send(outputResults([], 500, `An internal error has been occurred (code ${error.code}).`));
        return;
      }
      res.send(outputResults(results));
    });
  }).catch(err => {
    console.error("An error has been occurred...", err);
    res.send(outputResults([], 500, "An unexpected error has been occurred."));
  });
});

module.exports = router;
