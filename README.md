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

```javascript
var Chart = require('bulkhead-chart');
```

### 1

```javascript
var model = {},
	rest = {
		a: 1,
		b: 2,
		c: 3
	};

var result = new Chart(model).from(rest)
	.copy('a')
	.then().copy('b')
.convert();
```

The output is:

```javascript
{}
```

### 2

```javascript
var model = {
		b: undefined,
		c: 7
	},
	rest = {
		a: 1,
		b: 2,
		c: 3
	};

var result = new Chart(model).from(rest)
	.copy('a')
	.then().copy('b')
.convert();
```

The output is:

```javascript
{}
```

### 3

```javascript
var model = {},
	rest = {
		a: 1,
		b: 2,
		c: undefined
	};

var result = new Chart(model).from(rest)
	.copy('a')
	.then().copy('c', 7)
.convert();
```

The output is:

```javascript
{}
```

### 4

```javascript
var model = {
		a: undefined,
		b: 7,
		c: 4
	},
	rest = {
		a: 1,
		b: 2,
		c: undefined
	};

var result = new Chart(model).from(rest)
	.overwrite('a')
	.overwrite('b')
	.then().overwrite('c', 3)
.convert();
```

The output is:

```javascript
{}
```

### 5

```javascript
var model = {},
	rest = {
		a: 1,
		b: 2,
		c: 3
	};

var result = new Chart(model).from(rest)
	.copy('a')
	.then().copy('b').into('c')
.convert();
```

The output is:

```javascript
{}
```

### 6

```javascript
var model = {},
	rest = {
		a: 1,
		b: undefined,
		c: 3
	};

var result = new Chart(model).from(rest)
	.copy('a')
	.then().copy('b', 8).into('c')
.convert();
```

The output is:

```javascript
{}
```

### 7

```javascript
var model = {
		a: 6,
		b: 5,
		c: 4
	},
	rest = {
		a: 1,
		b: 2,
		c: 3
	};

var result = new Chart(model).from(rest)
	.overwrite('a')
	.then().overwrite('b').into('c')
.convert();
```

The output is:

```javascript
{}
```

### 8

```javascript
var model = {
		a: undefined,
		b: undefined,
		c: 8
	},
	rest = {
		a: 1,
		b: 2,
		c: 3
	};

var result = new Chart(model).from(rest)
	.copy('a')
	.then().copy('b').into('c')
.convert();
```

The output is:

```javascript
{}
```

### 9

```javascript
var model = {},
	rest = {
		a: 1,
		b: 2,
		c: {
			d: 6
		}
	};

var result = new Chart(model).from(rest)
	.copy('a')
	.and(model.d).from(rest.c)
		.copy('d')
.convert();
```

The output is:

```javascript
{}
```

### 10

```javascript
var model = {
		d: {
			d: 5
		}
	},
	rest = {
		a: 1,
		b: 2,
		c: {
			d: 6
		}
	};

var result = new Chart(model).from(rest)
	.copy('a')
	.and(model.d).from(rest.c)
		.copy('d')
.convert();
```

The output is:

```javascript
{}
```

### 11

```javascript
var model = {
		a: 6,
		d: {
			d: 5
		}
	},
	rest = {
		a: 1,
		b: 2,
		c: {
			d: 6
		}
	};

var result = new Chart(model).from(rest)
	.overwrite('a')
	.and(model.d).from(rest.c)
		.overwrite('d')
.convert();
```

The output is:

```javascript
{}
```

### 12

```javascript
var model = {},
	rest = {
		a: 1,
		b: 2,
		c: {
			d: 6
		}
	};

var result = new Chart(model).from(rest)
	.copy('a')
	.then().copy('c')
.convert();
```

The output is:

```javascript
{}
```

### 13

```javascript
var model = {
		c: {
			d: 5
		}
	},
	rest = {
		a: 1,
		b: 2,
		c: {
			d: 6,
			e: 7
		}
	};

var result = new Chart(model).from(rest)
	.copy('a')
	.then().copy('c')
.convert();
```

The output is:

```javascript
{}
```

### 14

```javascript
var model = {
		c: {
			d: 5
		}
	},
	rest = {
		a: 1,
		b: 2,
		c: {
			d: 6,
			e: 7
		}
	};

var result = new Chart(model).from(rest)
	.copy('a')
	.then().copy('c')
.convert();
```

The output is:

```javascript
{}
```

### 15

```javascript
var model = {},
	rest = {
		a: 1,
		b: 2,
		c: {
			d: 6,
			e: 7,
			f: {
				g: 8
			}
		}
	};

var result = new Chart(model).from(rest)
	.copy('a')
	.and(model.custom).from(rest.c)
		.copy('*')
.convert();
```

The output is:

```javascript
{}
```

### 16

```javascript
var model = {
		c: {
			d: 5,
			f: {
				i: 9
			}
		}
	},
	rest = {
		a: 1,
		b: 2,
		c: {
			d: 6,
			e: 7,
			f: {
				g: 8
			}
		}
	};

var result = new Chart(model).from(rest)
	.copy('a')
	.and(model.custom).from(rest.c)
		.copy('*')
.convert();
```