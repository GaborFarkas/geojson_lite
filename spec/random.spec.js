GLOBAL.window = GLOBAL;

require('../src/gjl.js');

describe('gjl.random.generateCoords', function () {
	it('must be able to generate random coordinates between various bounds', function () {
		var bbox = [-180,-90,180,90];
		var coords = gjl.random.generateCoords(2, bbox);
		expect(coords[0]).not.toBeGreaterThan(180);
		expect(coords[0]).not.toBeLessThan(-180);
		expect(coords[1]).not.toBeGreaterThan(90);
		expect(coords[1]).not.toBeLessThan(-90);
		var bbox = [-180, -90, -10000, -5000, -2500, 180, 90, 10000, 5000, 2500];
		var coords = gjl.random.generateCoords(5, bbox);
		for (var i=0;i<bbox.length/2;++i) {
			expect(coords[i]).not.toBeGreaterThan(bbox[5+i]);
			expect(coords[i]).not.toBeLessThan(bbox[i]);
		}
	});
});

describe('gjl.random.generateBbox', function () {
	it('must be able to generate a random bounding box based on predefined constants and a stride', function () {
		var bbox = gjl.random.generateBbox(2);
		var expected = [-180,-90,180,90];
		for (var i=0;i<bbox.length;++i) {
			expect(bbox[i]).toEqual(expected[i]);
		}
		var bbox = gjl.random.generateBbox(5);
		var expected = [-180,-90,-10994,-10994,-10994,180,90,8848,8848,8848];
		for (var i=0;i<bbox.length;++i) {
			expect(bbox[i]).toEqual(expected[i]);
		}
	});
});

describe('gjl.random.generateArray', function () {
	it('creates an array of random coordinates, and encloses them into an array with a specified depth', function () {
		var bbox = [-180,-90,180,90];
		var coords = gjl.random.generateArray(1, 5, bbox);
		expect(coords.length).toEqual(5);
		coords = gjl.random.generateArray(2, 5, bbox);
		expect(coords[0].length).toEqual(5);
		coords = gjl.random.generateArray(4, 5, bbox);
		expect(coords[0][0][0].length).toEqual(5);
	});
});

describe('gjl.random.generatePropSample', function () {
	it('creates a properties sample based on predefined constants, and a number', function () {
		var propSample = gjl.random.generatePropSample(2);
		for (var i in propSample) {
			expect(propSample[i] === 'abc' || propSample[i] === 123).toBeTruthy();
		}
		propSample = gjl.random.generatePropSample(8);
		var testBuckets = {'null': 0, 'abc': 0, '123': 0, 'true': 0};
		for (i in propSample) {
			if (String(propSample[i]) in testBuckets) {
				testBuckets[String(propSample[i])] ++;
			}
		}
		for (i in testBuckets) {
			expect(testBuckets[i]).toEqual(2);
		}
	});
});

describe('gjl.random.generateProperties', function () {
	it('generates a properties object based on a property sample', function () {
		var propSample = {a: null, b: false, c: 'abc', d:123};
		var propObj = gjl.random.generateProperties(propSample);
		expect(propObj.a).toBeNull();
		expect(typeof propObj.b).toEqual('boolean');
		expect(typeof propObj.c).toEqual('string');
		expect(typeof propObj.d).toEqual('number');
	});
});

describe('gjl.random.generateProperty', function () {
	it('generates a boolean, if the sample is a boolean', function () {
		var prop = gjl.random.generateProperty(false);
		expect(typeof prop).toEqual('boolean');
	});
	it('returns null if sample is null', function () {
		var prop = gjl.random.generateProperty(null);
		expect(prop).toBeNull();
	});
	it('returns a random string when a string is provided, keeping its length', function () {
		var prop = gjl.random.generateProperty('four');
		expect(typeof prop).toEqual('string');
		expect(prop.length).toEqual(4);
	});
	it('returns a random number in the same order of magnitude, if a number is provided', function () {
		var prop = gjl.random.generateProperty(12345.12531513132);
		expect(typeof prop).toEqual('number');
		expect(prop).not.toBeLessThan(10000);
		expect(prop).toBeLessThan(100000);
	});
});
