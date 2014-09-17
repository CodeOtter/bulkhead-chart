_ = require('lodash');


/**
 * 
 */
module.exports = function Chart() {

	var map = [];

	/**
	 * 
	 */
	this.create = function(target, source, fromProperty, toProperty) {
		var mapping = new Mapping(this, target, source, fromProperty, toProperty);
		map.push(mapping);
		return mapping;
	};
};

/**
 * 
 * @param chart
 * @param target
 * @param source
 * @param fromProperty
 * @param toProperty
 * @returns
 */
function Mapping(chart, target, source, fromProperty, toProperty) {
	this.chart = chart;
	this.target = target;
	this.source = source;
	this.fromProperty = fromProperty;
	this.toProperty = toProperty;
}

/**
 * 
 * @param source
 */
Mapping.prototype.from  = function(source) {
	this.source = source;
	return this;
};

/**
 * 
 * @param copy
 */
Mapping.prototype.copy = function(copy) {
	this.fromProperty = copy;
	this.toProperty = copy;
	return this;
};

/**
 * 
 * @param toProperty
 */
Mapping.prototype.into = function(toProperty, defaultValue) {
	this.toProperty = toProperty;
	if(this.toProperty === undefined) {
		this.toProperty = defaultValue;
	}
	return this;
};

/**
 * 
 * @param target
 * @returns
 */
Mapping.prototype.and = function(target) {
	return this.chart.create(target);
};

/**
 * 
 * @returns
 */
Mapping.prototype.then = function() {
	return this.chart.create(this.target, this.source);
};

/**
 * 
 */
Mapping.prototype.asIs = function() {
	var targetKeys = Object.keys(this.target),
		sourceKeys = Object.keys(this.source),
		target, source;
	
	if(targetKeys.length == 0) {
		// Dealing with a blank object, most likely converting ORM to REST
		target = this.source;
		source = this.target;
	} else {
		// Dealing with populated objects, most likely converting REST to ORM
		target = this.target;
		source = this.source;
	}
	
	// Iterate through each property of the target
	_.each(target, function(element, index) {
		// Confirm the source has the property
		if(element instanceof Array) {
			
		} else if(element instanceof Object) {
			
		} else {
			
		}	
	});
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

var result = require('bulkhead-chart')
	.create(player).from(req.data)
	.copy('username').into('email')
	.then().copy('status')
	.and(player.class).from(req.data.class)
	.asIs()
	.go();
*/