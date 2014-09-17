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
function Mapping(chart, target, source, fromProperty, toProperty, mode, defaultValue, conditions) {
	this.chart = chart;
	this.target = target;
	this.source = source;
	this.fromProperty = fromProperty;
	this.toProperty = toProperty;
	this.defaultValue = defaultValue;
	this.mode = mode || 0;
	this.conditions = [];
	this.when(conditions);
}

/**
 * 
 */
Mapping.modes = {
	copy: 0,		// 
	overwrite: 1	// 
};

/**
 * 
 * @param source
 */
Mapping.prototype.from  = function(source) {
	this.source = source;
	return this;
};

/**
 * Copies a property of the source to the target, provided the target's property is undefined
 * @param copy
 */
Mapping.prototype.copy = function(copy, defaultValue) {
	this.fromProperty = copy;
	this.toProperty = copy;
	this.defaultValue = defaultValue;
	this.mode = Mapping.modes.copy;
	return this;
};

/**
 * Copies a property of the source to the target, overwriting the value of the target's property
 * @param copy
 */
Mapping.prototype.overwrite = function(copy, defaultValue) {
	this.fromProperty = copy;
	this.toProperty = copy;
	this.defaultValue = defaultValue;
	this.mode = Mapping.modes.overwrite;
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
 * @param copy
 */
Mapping.prototype.when = function() {
	var args = Array.prototype.slice.call(arguments, 0);
	var result = [];
	for(var i in args) {
		result.concat(args[i]);
	}
	this.conditions.concat(result);
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
Mapping.protocol.convert = function(errorHandler) {
	
};

/**
 * 
 */
Mapping.protocol.invert = function(errorHandler) {
	
};

/**
 * 
 * @param dotNotation
 * @returns
 */
var parse = function() {
	var result = null;
	return result;
};