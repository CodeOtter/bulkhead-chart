bulkhead-chart
==============

A Bulkhead plugin for SailsJS apps that allows easy mapping from API inputs to ORM properties and vice versa.

## Installation

`npm install bulkhead bulkhead-chart`

Then, in the `config/bootstrap.js` file of your SailsJS project directory, replace the default `cb()` with:

```javascript
require('bulkhead').plugins.initialize(sails, cb);
```

## Usage

Bulkhead-chart utilizes a fluent pattern to handle the modality of conversion in more human-readable fashion:

```
var defaultValue = 0;
var result = new Chart(result).from({
		a: 1,
		b: 2,
		c: 3,
		child: {
			a: 4,
			b: 5,
			c: 6
		}
	})
	.set('newProp', 1)
	.then().merge('a', defaultValue)
	.then().write('b', defaultValue)
	.then().write('c').into('newC')
	.also(result, 'child').from(source.child)
		.merge('a') 
		.then().merge('b').when(function(from, to) { return from == 7; })
		.then().merge('c').via(function(from, to) { return from + 2; })
	.convert();
```

Now let's analyze what the methods of each instruction does.

| Method  | Usage                                                                | Traditional Equivalent                                                                                       |
|---------|----------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| from    | `var result = new Chart(result).from({...})`                         | `var result = {};`                                                                                           |
| set     | `.set('newProp', 1)`                                                 | `result.newProp = 1;`                                                                                        |
| then    | `.then()`                                                            | `;`                                                                                                          |
| merge   | `.merge('a', defaultValue)`                                          | `if(result.a === undefined) result.a = source.a || defaultValue;`                                            |
| write   | `.then().write('b', defaultValue)`                                   | `result.b = source.b || defaultValue;`                                                                       |
| into    | `.then().write('c').into('newC')`                                    | `result.newC = source.c;`                                                                                    |
| also    | `.also(result, 'child').from(source.child)`                          | `result.child = source.child || {};`                                                                         | 
| when    | `.then().merge('a').when(function(from, to) { return from == 7; })`  | `if(result.child.a === undefined && source.child.a == 7) result.child.a = source.child.a;`                   |
| via     | `.then().merge('b').via(function(from, to) { return from + 2; })`    | `if(result.child.b === undefined) result.child.b = source.child.b + 2;`                                      |
| as      | `.then().write('someObject').as(SomeClass)`                          | `if(result.child.someObject === undefined) result.child.someObject = new SomeClass(source.child.someObject)` |
| convert | `.convert()`                                                         |                                                                                                              |

## Methods

### from(source)
Sets the source object to convert from.

### set(propertyName, defaultValue)
Sets a property on the result from a specified value.

### then()
Creates a new instruction.

### merge(propertyName, defaultValue)
Copies the value of a property from the source to the result only if the result property is undefined.
For arrays, it will merge the contents of two arrays into one array.  (Like ```[].concat```)
For objects, it copies the value of each property from the source to the result only if the result property is undefined.

### write(propertyName, defaultValue)
Copies the value of a property from the source to the result.
For arrays, it will replace the target array with the source array.
For objects, it will replace the target object with the source object.

### into(propertyName)
Manually specify what property to modify on the result.

### also(result, property)
Changes which result property (presumably an object) to apply all subsequent instructions to. 

### when(callback(from, to) { return ... })
Performs a modification only if a condition is met.

### via(callback(from, to) { return ... })
Performs a custom transformation when property is being modified.

### convert()
Executions the mapping instructions.

### as(object) ```Experimental```
Creates an new instance of an object based on source properties, then uses that instance to modifies the result property.
 
## Examples

Check out the [tests](test/Test.js) to see examples and results.