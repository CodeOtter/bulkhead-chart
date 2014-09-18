_ = require('lodash');

/**
 * 
 * @param target
 * @param source
 * @param fromProperty
 * @param toProperty
 * @returns
 */
function Chart(target, source, fromProperty, toProperty) {
	this.map = [new Mapping(this, target, source, fromProperty, toProperty)];
};

/**
 * 
 * @param source
 * @returns
 */
Chart.prototype.from = function(source) {
	var result = this.map[this.map.length - 1];
	result.from(source);
	return result;
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
	this.mode = mode || Mapping.modes.copy;
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
 * @param instruction
 */
Mapping.canWrite = function(instruction) {
	return instruction.mode == Mapping.modes.overwrite || (instruction.mode == Mapping.modes.copy && instruction.target[instruction.toProperty] === undefined);
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
	var result = _.flatten(arguments);
	if(result.length > 0 && result[0] !== undefined) {
		this.conditions = this.conditions.concat(result);
	}
	return this;
};

/**
 * 
 * @param target
 * @returns
 */
Mapping.prototype.and = function(target) { 
	this.chart.map.push(new Mapping(this.chart, target));
	return this.chart;
};

/**
 * 
 * @returns
 */
Mapping.prototype.then = function() {
	var instruction = new Mapping(this.chart, this.target, this.source);
	this.chart.map.push(instruction);
	return instruction;
};

/**
 * 
 */
Mapping.prototype.convert = function(errorHandler) {
	var value;
	for(var i in this.chart.map) {
		var instruction = this.chart.map[i];

		if(instruction.fromProperty === '*') {
			// We're doing a recursive copy
			populate(instruction.target, instruciton.source, instruciton.mode);
		} else {
			// Determine the value to use
			if(instruction.source[instruction.fromProperty] === undefined) {
				value = instruction.defaultValue;
			} else {
				value = instruction.source[instruction.fromProperty];
			}

			if(Mapping.canWrite(instruction)) {
				// Put the value into the target
				instruction.target[instruction.toProperty] = value;
			}
		}

	}

	return this.chart.map[0].target;
};

/**
 * 
 * @param dotNotation
 * @returns
 */
var populate = function(target, source, mode) {
	_.merge(target, source, function(target, source) {
		if(source instanceof Object) {
			// Recruse into the object and merge that as well
			populate(target, source, mode);
		} else {
			return mode == Mapping.modes.overwrite || (mode == Mapping.modes.copy && target === undefined) ? source : target;
		}
	});
};

module.exports = Chart;