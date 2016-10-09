var clean = require('./script/clean');
var genList = require('./script/genList');
var genSites = require('./script/genSites');
var genMail = require('./script/genMail');

clean(function () {
  genList.generate();
  genSites.generate();
  genMail.generate();
});