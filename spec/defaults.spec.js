GLOBAL.window = GLOBAL;

require('../src/gjl.js');

describe('gjl.defaults.bbox', function () {
	it('is the default 2 dimensional WGS84 bounding box', function () {
		expect(gjl.defaults.bbox[0]).toEqual(-180);
		expect(gjl.defaults.bbox[1]).toEqual(-90);
		expect(gjl.defaults.bbox[2]).toEqual(180);
		expect(gjl.defaults.bbox[3]).toEqual(90);
	});
});

describe('gjl.defaults.zRange', function () {
	it('is the default range for any bounding box dimension greater than 2', function () {
		expect(gjl.defaults.zRange[0]).toEqual(-10994);
		expect(gjl.defaults.zRange[1]).toEqual(8848);
	});
});

describe('gjl.defaults.propSample', function () {
	it('is the default array for every valid property type', function () {
		expect(typeof gjl.defaults.propSample[0]).toEqual('string');
		expect(typeof gjl.defaults.propSample[1]).toEqual('number');
		expect(typeof gjl.defaults.propSample[2]).toEqual('boolean');
		expect(gjl.defaults.propSample[3]).toBeNull();
	});
});
