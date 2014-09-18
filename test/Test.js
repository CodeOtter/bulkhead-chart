var Suite = require('bulkhead-test'),
	assert = require('assert'),
	Chart = require('../api/services/Service');
describe.only('Bulkhead Chart plugin', function() {
	Suite.lift();

	describe('Chart Service', function() {
		
		it('should properly populate the instructions array', function(done) {
			var model = {
					child: {}
				},
				rest = {
					child: {}
				};

			var chart = new Chart(model).from(rest)
				.copy('a', 5)
				.then().copy('b').into('bb')
				.then().overwrite('c', 4)
				.then().overwrite('d').into('dd')
				.then().copy('e').when(function(from, to) { return true; })
				.and(model, 'child').from(rest.child)
					.copy('a', 6)
					.then().copy('b').into('bb')
					.then().overwrite('c', 7)
					.then().overwrite('d').into('dd')
					.then().copy('e').when(function(from, to) { return true; })
			.chart;

			function testValue(instruction, target, source, fromProperty, toProperty, defaultValue, mode, conditionLength) {
				assert.ok(instruction.target === target);
				assert.ok(instruction.source === source);
				assert.ok(instruction.fromProperty === fromProperty);
				assert.ok(instruction.toProperty === toProperty);
				assert.ok(instruction.defaultValue === defaultValue);
				assert.ok(instruction.mode === mode);
				assert.ok(instruction.conditions.length === conditionLength);
			}

			assert.ok(chart.map.length == 10);
			testValue(chart.map[0], model, rest, 'a', 'a', 5, 0, 0);
			testValue(chart.map[1], model, rest, 'b', 'bb', undefined, 0, 0);
			testValue(chart.map[2], model, rest, 'c', 'c', 4, 1, 0);
			testValue(chart.map[3], model, rest, 'd', 'dd', undefined, 1, 0);
			testValue(chart.map[4], model, rest, 'e', 'e', undefined, 0, 1);
			testValue(chart.map[5], model.child, rest.child, 'a', 'a', 6, 0, 0);
			testValue(chart.map[6], model.child, rest.child, 'b', 'bb', undefined, 0, 0);
			testValue(chart.map[7], model.child, rest.child, 'c', 'c', 7, 1, 0);
			testValue(chart.map[8], model.child, rest.child, 'd', 'dd', undefined, 1, 0);
			testValue(chart.map[9], model.child, rest.child, 'e', 'e', undefined, 0, 1);

			done();
		});

		it('should copy submitted data into a blank object', function(done) {

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

			assert.ok(Object.keys(result).length == 2);
			assert.ok(result.a == 1);
			assert.ok(result.b == 2);

			done();
		});
		
		it('should copy submitted data into an established object', function(done) {

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

			assert.ok(Object.keys(result).length == 3);
			assert.ok(result.a == 1);
			assert.ok(result.b == 2);
			assert.ok(result.c == 7);
			done();
		});
		
		it('should copy submitted data from default values', function(done) {

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
			
			assert.ok(Object.keys(result).length == 2);
			assert.ok(result.a == 1);
			assert.ok(result.c == 7);
			done();
		});
		
		it('should overwrite established data from submitted data', function(done) {

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
				.then().overwrite('b')
				.then().overwrite('c', 3)
			.convert();
			
			assert.ok(Object.keys(result).length == 3);
			assert.ok(result.a == 1);
			assert.ok(result.b == 2);
			assert.ok(result.c == 3);
			done();
		});
		
		it('should copy based on custom remapping', function(done) {

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
			
			assert.ok(Object.keys(result).length == 2);
			assert.ok(result.a == 1);
			assert.ok(result.c == 2);

			done();
		});
		
		it('should copy default values based on custom remapping', function(done) {

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
			
			assert.ok(Object.keys(result).length == 2);
			assert.ok(result.a == 1);
			assert.ok(result.c == 8);

			done();
		});
		
		it('should overwrite based on custom remapping', function(done) {

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
			
			assert.ok(Object.keys(result).length == 3);
			assert.ok(result.a == 1);
			assert.ok(result.b == 5);
			assert.ok(result.c == 2);

			done();
		});
		
		it('should copy based on custom remapping into an established object', function(done) {

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
			
			assert.ok(Object.keys(result).length == 3);
			assert.ok(result.a == 1);
			assert.ok(result.b == undefined);
			assert.ok(result.c == 8);

			done();
		});

		it('should perform custom child mapping', function(done) {

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
				.and(model, 'd').from(rest.c)
					.copy('d')
			.convert();

			assert.ok(Object.keys(result).length == 2);
			assert.ok(result.a == 1);
			assert.ok(Object.keys(result.d).length == 1);
			assert.ok(result.d.d == 6);
			done();
		});
		
		it('should perform custom child mapping on an established object', function(done) {

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
				.and(model, 'd').from(rest.c)
					.copy('d')
			.convert();
			
			assert.ok(Object.keys(result).length == 2);
			assert.ok(result.a == 1);
			assert.ok(Object.keys(result.d).length == 1);
			assert.ok(result.d.d == 5);
			done();
		});
		
		it('should perform custom child mapping and overwriting on an established object', function(done) {

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
				.and(model, 'd').from(rest.c)
					.overwrite('d')
			.convert();
			
			assert.ok(Object.keys(result).length == 2);
			assert.ok(result.a == 1);
			assert.ok(Object.keys(result.d).length == 1);
			assert.ok(result.d.d == 6);
			done();
		});
		
		it('should copy child', function(done) {

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
			
			assert.ok(Object.keys(result).length == 2);
			assert.ok(result.a == 1);
			assert.ok(Object.keys(result.c).length == 1);
			assert.ok(result.c.d == 6);
			done();
		});
		
		it('should mixin a child', function(done) {

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
			
			assert.ok(Object.keys(result).length == 2);
			assert.ok(result.a == 1);
			assert.ok(Object.keys(result.c).length == 2);
			assert.ok(result.c.d == 5);
			assert.ok(result.c.e == 7);
			done();
		});
		
		it('should overwrite a child', function(done) {

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
				.then().overwrite('c')
			.convert();
			
			assert.ok(Object.keys(result).length == 2);
			assert.ok(result.a == 1);
			assert.ok(Object.keys(result.c).length == 2);
			assert.ok(result.c.d == 6);
			assert.ok(result.c.e == 7);
			done();
		});
		
		it('should custom copy child from other source', function(done) {

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
				.and(model, 'custom').from(rest.c)
					.copy('*')
			.convert();
			
			assert.ok(Object.keys(result).length == 2);
			assert.ok(result.a == 1);
			assert.ok(Object.keys(result.custom).length == 3);
			assert.ok(result.custom.d == 6);
			assert.ok(result.custom.e == 7);
			assert.ok(Object.keys(result.custom.f).length == 1);
			assert.ok(result.custom.f.g == 8);
			done();
		});
		
		it('should custom mixin child from other source into an established object', function(done) {

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
				.and(model, 'c').from(rest.c)
					.copy('*')
			.convert();

			assert.ok(Object.keys(result).length == 2);
			assert.ok(result.a == 1);
			assert.ok(Object.keys(result.c).length == 3);
			assert.ok(result.c.d == 5);
			assert.ok(result.c.e == 7);
			assert.ok(Object.keys(result.c.f).length == 2);
			assert.ok(result.c.f.g == 8);
			assert.ok(result.c.f.i == 9);
			done();
		});
	});
});