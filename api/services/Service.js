/**
 * 
 */
module.exports = function Chart() {

	var map = [];

	/**
	 * 
	 */
	this.create = function(into) {
		var mapping = new Chart(this, null, null, null, into);
		map.push(mapping);
		return mapping;
	};
};

/**
 * 
 * @param from
 * @param to
 * @param transform
 * @param into
 * @returns
 */
function Mapping(chart, from, to, transform, into) {
	this.chart;
	this.from = rest;
	this.to = orm;
	this.transform = transform;
	this.into = into;
}

/**
 * 
 * @param from
 */
Mapping.prototype.from  = function(from) {
	this.from = from;
	return this;
};

/**
 * 
 * @param to
 */
Mapping.prototype.to = function(to) {
	this.to = to;
	return this;
};

/**
 * 
 * @param map
 */
Mapping.prototype.by = function(map) {
	this.to = map;
	this.from = map;
	return this;
};

/**
 * 
 * @param transform
 */
Mapping.prototype.transform = function(transform) {
	this.transform = transform;
	return this;
};

/**
 * 
 * @param into
 */
Mapping.prototype.into = function(into) {
	this.into = into;
	return this;
};

/**
 * 
 * @param transform
 * @returns
 */
Mapping.prototype.and = function(transform) {
	return this.chart.create(transform);
};

/**
 * 
 * @param transform
 * @returns
 */
Mapping.prototype.then = function(transform) {
	return this.chart.from(this.chart, null, null, this.transform, this.into);
};

/**
 * 
 */
Mapping.prototype.asIs = function() {
	
};

/**
 * 
 * @param dotNotation
 * @returns
 */
Mapping.parse = function(dotNotation, target) {
	var result = null;
	return result;
};
/*
var player = new Player()

var result = require('bulkhead-chart').create(player).from(req.data)
	.by('username')
	.then().by('status')
	.and(player.class).from(req.data.class)
	.asIs()
	.go();
*/