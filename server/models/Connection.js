var pg = require('pg').types.setTypeParser(1114, function(stringValue) {
  return new Date(stringValue + "+0000");
});
var Sequelize = require('sequelize');
var sequelize = new Sequelize('test', 'postgres', '123456', {
  host: 'localhost',
  dialect: 'postgres',
	timezone: '-05:00'
});

module.exports.Sequelize = Sequelize;
module.exports.sequelize = sequelize;