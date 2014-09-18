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
				.merge('a', 5)
				.then().merge('b').into('bb')
				.then().write('c', 4)
				.then().write('d').into('dd')
				.then().merge('e').when(function(from, to) { return true; })
				.also(model, 'child').from(rest.child)
					.merge('a', 6)
					.then().merge('b').into('bb')
					.then().write('c', 7)
					.then().write('d').into('dd')
					.then().merge('e').when(function(from, to) { return true; })
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

		it('should merge submitted data into a blank object', function(done) {

			var model = {},
				rest = {
					a: 1,
					b: 2,
					c: 3
				};

			var result = new Chart(model).from(rest)
				.merge('a')
				.then().merge('b')
			.convert();

			assert.ok(Object.keys(result).length == 2);
			assert.ok(result.a == 1);
			assert.ok(result.b == 2);

			done();
		});
		
		it('should merge submitted data into an established object', function(done) {

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
				.merge('a')
				.then().merge('b')
			.convert();

			assert.ok(Object.keys(result).length == 3);
			assert.ok(result.a == 1);
			assert.ok(result.b == 2);
			assert.ok(result.c == 7);
			done();
		});
		
		it('should merge submitted data from default values', function(done) {

			var model = {},
				rest = {
					a: 1,
					b: 2,
					c: undefined
				};

			var result = new Chart(model).from(rest)
				.merge('a')
				.then().merge('c', 7)
			.convert();
			
			assert.ok(Object.keys(result).length == 2);
			assert.ok(result.a == 1);
			assert.ok(result.c == 7);
			done();
		});
		
		it('should write established data from submitted data', function(done) {

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
				.write('a')
				.then().write('b')
				.then().write('c', 3)
			.convert();
			
			assert.ok(Object.keys(result).length == 3);
			assert.ok(result.a == 1);
			assert.ok(result.b == 2);
			assert.ok(result.c == 3);
			done();
		});
		
		it('should merge based on custom remapping', function(done) {

			var model = {},
				rest = {
					a: 1,
					b: 2,
					c: 3
				};

			var result = new Chart(model).from(rest)
				.merge('a')
				.then().merge('b').into('c')
			.convert();
			
			assert.ok(Object.keys(result).length == 2);
			assert.ok(result.a == 1);
			assert.ok(result.c == 2);

			done();
		});
		
		it('should merge default values based on custom remapping', function(done) {

			var model = {},
				rest = {
					a: 1,
					b: undefined,
					c: 3
				};

			var result = new Chart(model).from(rest)
				.merge('a')
				.then().merge('b', 8).into('c')
			.convert();
			
			assert.ok(Object.keys(result).length == 2);
			assert.ok(result.a == 1);
			assert.ok(result.c == 8);

			done();
		});
		
		it('should write based on custom remapping', function(done) {

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
				.write('a')
				.then().write('b').into('c')
			.convert();
			
			assert.ok(Object.keys(result).length == 3);
			assert.ok(result.a == 1);
			assert.ok(result.b == 5);
			assert.ok(result.c == 2);

			done();
		});
		
		it('should merge based on custom remapping into an established object', function(done) {

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
				.merge('a')
				.then().merge('b').into('c')
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
				.merge('a')
				.also(model, 'd').from(rest.c)
					.merge('d')
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
				.merge('a')
				.also(model, 'd').from(rest.c)
					.merge('d')
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
				.write('a')
				.also(model, 'd').from(rest.c)
					.write('d')
			.convert();
			
			assert.ok(Object.keys(result).length == 2);
			assert.ok(result.a == 1);
			assert.ok(Object.keys(result.d).length == 1);
			assert.ok(result.d.d == 6);
			done();
		});
		
		it('should merge child', function(done) {

			var model = {},
				rest = {
					a: 1,
					b: 2,
					c: {
						d: 6
					}
				};

			var result = new Chart(model).from(rest)
				.merge('a')
				.then().merge('c')
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
				.merge('a')
				.then().merge('c')
			.convert();
			
			assert.ok(Object.keys(result).length == 2);
			assert.ok(result.a == 1);
			assert.ok(Object.keys(result.c).length == 2);
			assert.ok(result.c.d == 5);
			assert.ok(result.c.e == 7);
			done();
		});
		
		it('should write a child', function(done) {

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
				.merge('a')
				.then().write('c')
			.convert();
			
			assert.ok(Object.keys(result).length == 2);
			assert.ok(result.a == 1);
			assert.ok(Object.keys(result.c).length == 2);
			assert.ok(result.c.d == 6);
			assert.ok(result.c.e == 7);
			done();
		});
		
		it('should custom merge child from other source', function(done) {

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
				.merge('a')
				.also(model, 'custom').from(rest.c)
					.merge('*')
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
				.merge('a')
				.also(model, 'c').from(rest.c)
					.merge('*')
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
		
		it('should merge an nonexistant array', function(done) {

			var model = {},
				rest = {
					a: [2, 3, 4]
				};
		
			var result = new Chart(model).from(rest)
				.merge('a')
			.convert();

			assert.ok(Object.keys(result).length == 1);
			assert.ok(result.a.length == 3);
			assert.ok(result.a[0] == 2);
			assert.ok(result.a[1] == 3);
			assert.ok(result.a[2] == 4);
			done();
		});
		
		it('should write an array', function(done) {

			var model = {
					a: 7
				},
				rest = {
					a: [2, 3, 4]
				};
		
			var result = new Chart(model).from(rest)
				.write('a')
			.convert();

			assert.ok(Object.keys(result).length == 1);
			assert.ok(result.a.length == 3);
			assert.ok(result.a[0] == 2);
			assert.ok(result.a[1] == 3);
			assert.ok(result.a[2] == 4);
			done();
		});
		
		it('should merge into blank array', function(done) {

			var model = {
					a: []
				},
				rest = {
					a: [2, 3, 4]
				};
		
			var result = new Chart(model).from(rest)
				.merge('a')
			.convert();

			assert.ok(Object.keys(result).length == 1);
			assert.ok(result.a.length == 3);
			assert.ok(result.a[0] == 2);
			assert.ok(result.a[1] == 3);
			assert.ok(result.a[2] == 4);
			done();
		});
		
		it('should merge primitives with established array', function(done) {

			var model = {
					a: [6, 7, 8]
				},
				rest = {
					a: [2, 3, 4]
				};
		
			var result = new Chart(model).from(rest)
				.merge('a')
			.convert();

			assert.ok(Object.keys(result).length == 1);
			assert.ok(result.a.length == 6);
			assert.ok(result.a[0] == 6);
			assert.ok(result.a[1] == 7);
			assert.ok(result.a[2] == 8);
			assert.ok(result.a[3] == 2);
			assert.ok(result.a[4] == 3);
			assert.ok(result.a[5] == 4);
			done();
		});
		
		it('should merge primitive subarrays', function(done) {

			var model = {
					a: [
					    [6, 7, 8]
					]
				},
				rest = {
					a: [
					    [2, 3, 4],
					    [10, 11, 12]
					]
				};
		
			var result = new Chart(model).from(rest)
				.merge('a')
			.convert();

			assert.ok(Object.keys(result).length == 1);
			assert.ok(result.a.length == 2);
			assert.ok(result.a[0][0] == 6);
			assert.ok(result.a[0][1] == 7);
			assert.ok(result.a[0][2] == 8);
			assert.ok(result.a[0][3] == 2);
			assert.ok(result.a[0][4] == 3);
			assert.ok(result.a[0][5] == 4);
			assert.ok(result.a[1][0] == 10);
			assert.ok(result.a[1][1] == 11);
			assert.ok(result.a[1][2] == 12);
			done();
		});
		
		it('should write primitive subarrays', function(done) {

			var model = {
					a: [
					    [6, 7, 8]
					]
				},
				rest = {
					a: [
					    [2, 3, 4],
					    [10, 11, 12]
					]
				};

			var result = new Chart(model).from(rest)
				.write('a')
			.convert();

			assert.ok(Object.keys(result).length == 1);
			assert.ok(result.a.length == 2);
			assert.ok(result.a[0][0] == 2);
			assert.ok(result.a[0][1] == 3);
			assert.ok(result.a[0][2] == 4);
			assert.ok(result.a[1][0] == 10);
			assert.ok(result.a[1][1] == 11);
			assert.ok(result.a[1][2] == 12);
			done();
		});

		it('should merge object arrays into undefined', function(done) {

			var model = {},
				rest = {
					a: [
					    {
					    	first: 'bob',
					    	last: 'test'
					    }
					]
				};

			var result = new Chart(model).from(rest)
				.merge('a')
			.convert();

			assert.ok(Object.keys(result).length == 1);
			assert.ok(result.a.length == 1);
			assert.ok(result.a[0].first == 'bob');
			assert.ok(result.a[0].last == 'test');
			done();
		});
		
		it('should write object arrays into undefined', function(done) {

			var model = {},
				rest = {
					a: [
					    {
					    	first: 'bob',
					    	last: 'test'
					    }
					]
				};

			var result = new Chart(model).from(rest)
				.write('a')
			.convert();

			assert.ok(Object.keys(result).length == 1);
			assert.ok(result.a.length == 1);
			assert.ok(result.a[0].first == 'bob');
			assert.ok(result.a[0].last == 'test');
			done();
		});
		
		it('should merge object arrays into established object array', function(done) {

			var model = {
					a: [
					    {
					    	first: 'ted',
					    	last: 'coder'
					    }
					]
				},
				rest = {
					a: [
					    {
					    	first: 'bob',
					    	last: 'tester'
					    }
					]
				};

			var result = new Chart(model).from(rest)
				.merge('a')
			.convert();

			assert.ok(Object.keys(result).length == 1);
			assert.ok(result.a.length == 2);
			assert.ok(result.a[0].first == 'ted');
			assert.ok(result.a[0].last == 'coder');
			assert.ok(result.a[1].first == 'bob');
			assert.ok(result.a[1].last == 'tester');
			
			done();
		});
		
		it('should write object arrays into established object array', function(done) {

			var model = {
					a: [
					    {
					    	first: 'ted',
					    	last: 'coder'
					    }
					]
				},
				rest = {
					a: [
					    {
					    	first: 'bob',
					    	last: 'tester'
					    }
					]
				};

			var result = new Chart(model).from(rest)
				.write('a')
			.convert();

			assert.ok(Object.keys(result).length == 1);
			assert.ok(result.a.length == 1);
			assert.ok(result.a[0].first == 'bob');
			assert.ok(result.a[0].last == 'tester');
			
			done();
		});
		
		it('should merge model arrays into established model array', function(done) {

			var model = {
					a: [
					    {
					    	id: 1,
					    	first: 'ted',
					    	last: 'coder'
					    }
					]
				},
				rest = {
					a: [
					    {
					    	id: 1,
					    	first: 'bob',
					    	last: 'tester',
					    	status: '5'
					    }
					]
				};

			var result = new Chart(model).from(rest)
				.merge('a')
			.convert();

			assert.ok(Object.keys(result).length == 1);
			assert.ok(result.a.length == 1);
			assert.ok(result.a[0].first == 'ted');
			assert.ok(result.a[0].last == 'coder');
			assert.ok(result.a[0].id == 1);
			assert.ok(result.a[0].status == '5');
			
			done();
		});
		
		it('should write model arrays into established model array', function(done) {

			var model = {
					a: [
					    {
					    	id: 1,
					    	first: 'ted',
					    	last: 'coder'
					    },
					    {
					    	id: 2,
					    	first: 'ed',
					    	last: 'artist'
					    }
					]
				},
				rest = {
					a: [
					    {
					    	id: 1,
					    	first: 'bob',
					    	last: 'tester',
					    	status: '5'
					    }
					]
				};

			var result = new Chart(model).from(rest)
				.write('a')
			.convert();

			assert.ok(Object.keys(result).length == 1);
			assert.ok(result.a.length == 2);
			assert.ok(result.a[1].first == 'ed');
			assert.ok(result.a[1].last == 'artist');
			assert.ok(result.a[1].id == 2);
			assert.ok(result.a[1].status == undefined);
			assert.ok(result.a[0].first == 'bob');
			assert.ok(result.a[0].last == 'tester');
			assert.ok(result.a[0].id == 1);
			assert.ok(result.a[0].status == '5');
			
			done();
		});
		
		it('should handle complex case when blank', function(done) {

			var model = {},
				rest = {
					
				
				};

			var result = new Chart(model).from(rest)
				.write('heroName').into('name')
				.then().set('level', 1)
				.then().set('status', 0)
				.then().set('type', 0)
			.convert();

			done();
		});
	});
});