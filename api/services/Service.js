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
function Mapping(chart, target, source, fromProperty, toProperty, mode, defaultValue, conditions, transformer, factory) {
	this.chart = chart;
	this.target = target;
	this.source = source;
	this.fromProperty = fromProperty;
	this.toProperty = toProperty;
	this.mode = mode || Mapping.modes.merge;
	this.defaultValue = defaultValue;
	this.conditions = [];
	this.when(conditions);
	this.transformer = undefined;
	this.convertTransformer = undefined;
	this.revertTransformer = undefined;
	this.factory = undefined;
}

/**
 * 
 */
Mapping.modes = {
	merge: 0,	// 
	write: 1,	//
	set: 2		// 
};

/**
 * 
 * @param instruction
 */
Mapping.canWrite = function(instruction) {
	return instruction.mode == Mapping.modes.set || instruction.mode == Mapping.modes.write || (instruction.mode == Mapping.modes.merge && instruction.target[instruction.toProperty] === undefined);
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
 * @param merge
 */
Mapping.prototype.merge = function(merge, defaultValue) {
	this.fromProperty = merge;
	this.toProperty = merge;
	this.defaultValue = defaultValue;
	this.mode = Mapping.modes.merge;
	return this;
};

/**
 * Copies a property of the source to the target, overwriting the value of the target's property
 * @param merge
 */
Mapping.prototype.write = function(merge, defaultValue) {
	this.fromProperty = merge;
	this.toProperty = merge;
	this.defaultValue = defaultValue;
	this.mode = Mapping.modes.write;
	return this;
};

/**
 * Copies a property of the source to the target, overwriting the value of the target's property
 * @param merge
 */
Mapping.prototype.set = function(merge, defaultValue) {
	this.fromProperty = merge;
	this.toProperty = merge;
	this.defaultValue = defaultValue;
	this.mode = Mapping.modes.set;
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
 * @param via
 */
Mapping.prototype.via = function(convertTransformer, revertTransformer) {
	this.transformer = convertTransformer;
	this.convertTransformer = convertTransformer;
	this.revertTransformer = revertTransformer;
	return this;
};

/**
 * 
 * @param factory
 * @returns {Mapping}
 */
Mapping.prototype.as = function(factory) {
	this.factory = factory;
	return this;
};


/**
 * 
 * @param merge
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
Mapping.prototype.also = function(parent, property, defaultValue) {
	if(defaultValue === undefined) {
		defaultValue = {};
	}

	if(parent[property] === undefined) {
		parent[property] = defaultValue;
	}

	this.chart.map.push(new Mapping(this.chart, parent[property]));
	return this.chart;
};

/**
 * 
 * @returns
 */
Mapping.prototype.then = function() {
	var instruction = new Mapping(this.chart, this.target, this.source, undefined, undefined, undefined, undefined, undefined, undefined, this.factory);
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
			// We're doing a recursive merge
			populate(instruction.target, instruction.source, instruction.mode);
		} else {
			// Determine the value to use
			if(instruction.source[instruction.fromProperty] === undefined || instruction.mode === Mapping.modes.set) {
				value = instruction.defaultValue;
			} else {
				var from = instruction.source[instruction.fromProperty];

				if(from instanceof Array) {
					// Copying from an array property
					if(instruction.target[instruction.toProperty] === undefined || 
					(!(instruction.target[instruction.toProperty] instanceof Array) && instruction.mode == Mapping.modes.write)) {
						instruction.target[instruction.toProperty] = [];
					}
					populate(instruction.target[instruction.toProperty], from, instruction.mode, instruction.defaultValue, instruction.factory);
					if(instruction.transformer) {
						// Transformation found, use it
						instruction.target[instruction.toProperty] = instruction.transformer(from, instruction.target[instruction.toProperty]);
					}
					continue;
				} else if(from instanceof Object) {
					// Copying from an object property
					if(instruction.target[instruction.toProperty] === undefined) {
						if(instruction.factory) {
							// Create new factory instance
							instruction.target[instruction.toProperty] = new this.factory();
						} else {
							// Create basic object
							instruction.target[instruction.toProperty] = {};
						}
					}
					populate(instruction.target[instruction.toProperty], from, instruction.mode, instruction.defaultValue);
					if(instruction.transformer) {
						// Transformation found, use it
						instruction.target[instruction.toProperty] = instruction.transformer(from, instruction.target[instruction.toProperty]);
					}
					continue;
				} else {
					// Copying from a primitive
					value = from;
				}
			}

			if(Mapping.canWrite(instruction)) {
				// Put the value into the target
				if(instruction.transformer) {
					value = instruction.transformer(value, instruction.target[instruction.toProperty]);
				}
				instruction.target[instruction.toProperty] = value;
			}
		}

	}

	return this.chart.map[0].target;
};

/**
 * 
 */
Mapping.prototype.revert = function(errorHandler) {
	throw new Error('Not implemented yet');
};

/**
 * 
 * @param dotNotation
 * @returns
 */
var populate = function(target, source, mode, defaultValue, factory) {
	
	/**
	 * 
	 * @param target
	 * @param source
	 * @returns
	 */
	function mergeIterator(target, source) {
		if(source instanceof Function) {
			// Protects against malicious overwriting
			return source;
		} else if(source instanceof Object) {
			// Recurse into the object and merge that as well
			populate(target, source, mode);
		} else {
			// Dealing with a primitive
			if(mode == Mapping.modes.set) {
				return defaultValue;
			} else if(mode == Mapping.modes.write || (mode == Mapping.modes.merge && target === undefined)) {
				return source;
			} else { 
				return target;
			}
		}
	}

	if(source instanceof Array) {
		// Merging arrays
		var writeArray = [];

		for(var i in source) {
			if(source[i] instanceof Array) {
				// Dealing with an array, prepare for recursion
				if(mode == Mapping.modes.merge) {
					// Merge the array
					if(target[i] === undefined) {
						target[i] = [];
					}

					populate(target[i], source[i], mode);
				} else if(mode == Mapping.modes.write) {
					// Overwrite the array
					var to = [];
					populate(to, source[i], mode);
					target[i] = to;
				}
			} else if(source[i] instanceof Object) {
				// Dealing with an object
				var found = false;

				if(source[i].id !== undefined) {
					// Dealing with a unique ID, map accordingly
					for(var j in target) {
						if(target[j].id == source[i].id) {
							if(factory) {
								// Merge the target into the factory
								target[j] = _.merge(factory, target[j], mergeIterator);
							}
							_.merge(target[j], source[i], mergeIterator);
							if(mode == Mapping.modes.write) {
								writeArray.push(target[j]);
							}
							found = true;
							break;
						}					
					}
				}
			
				if(!found) {
					// Source not found, create it
					var entity;

					if(factory) {
						entity = new factory();
					} else {
						entity = {};
					}

					_.merge(entity, source[i], mergeIterator);

					if(mode == Mapping.modes.merge) {
						target.push(entity);
					} else if(mode == Mapping.modes.write) {
						writeArray.push(entity);
					}
				}
			} else {
				// Dealing with a primitive
				if(mode == Mapping.modes.merge) {
					target.push(source[i]);
				} else if(mode == Mapping.modes.write) {
					writeArray.push(source[i]);
				}
			}
		}

		if(writeArray.length > 0) {
			// Write requests were found, recreate the target array
			target.length = 0;
			for(var i in writeArray) {
				target.push(writeArray[i]);
			}
		}
	} else {
		if(factory) {
			// Merge the target into the factory
			target = _.merge(new factory(), target, mergeIterator);
		}
		_.merge(target, source, mergeIterator);
	}
};
module.exports = Chart;