const fs = require("fs");
const csv = require("csv-parser");
const {mapValues} = require("lodash");
const moment = require("moment");

const parser = csv();

module.exports = function (file, cb) {
  const data = [];

  fs.createReadStream(file)
    .pipe(parser)
    .on("data", function (row) {
      data.push(transformRow(row));
    })
    .on("end", function () {
      cb(data);
    });
};

function transformRow(row) {
  row.registrationRequired = !!row.registrationRequired;
  row.fee = parseFloat(row.fee.replace(",", "."));
  return mapValues(row, parseDate);
}

function parseDate(date) {
  const parsedDate = moment(date, moment.ISO_8601, "de");
  if (parsedDate.isValid()) {
    return parsedDate;
  }
  return date;
}

/**
 * @typedef {Object} PostData
 * @property {moment} start
 * @property {moment} end
 * @property {string} title
 * @property {string} for
 * @property {string} where
 * @property {boolean} registrationRequired
 * @property {moment} registrationUntil
 * @property {string} registrationAt
 * @property {number} fee
 * @property {string} other
 */