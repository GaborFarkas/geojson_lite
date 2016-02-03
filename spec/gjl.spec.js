GLOBAL.window = GLOBAL;

require('../src/gjl.js');

describe('gjl.inherits', function () {
	it('Maintains pseudoclassical inheritance between related classes.', function () {
		var NewObj = function () {this.x = 3};
		gjl.inherits(gjl.geom.Geometry, NewObj);
		var testObj = new NewObj();
		expect(testObj instanceof gjl.geom.Geometry).toEqual(true);
		expect(testObj instanceof gjl.Object).toEqual(true);
		expect(testObj instanceof gjl.geom.Point).toEqual(false);
		expect(testObj.x).toEqual(3);
		expect(testObj.stringify()).toEqual('{"x":3}');
	});
});

//The toThrow or toThrowError methods do not work here, as errors are thrown in a dedicated func.
describe('gjl.validateGeoJSON', function () {
	it('Validates a GeoJSON geometry', function () {
		var goodGeoJSON = {type: 'Point', coordinates: [0,0]};
		var badGeoJSON = {type: 'BadPoint', coordinates: [0,0]};
		expect(gjl.validateGeoJSON(goodGeoJSON)).toEqual(true);
		expect(gjl.validateGeoJSON(badGeoJSON)).toEqual(false);
		expect(gjl.validateGeoJSON(goodGeoJSON, true)).toEqual(true);
		try {
			gjl.validateGeoJSON(badGeoJSON, true)
		} catch(e) {
			expect(e instanceof TypeError).toEqual(true);
		}
	});
	it('Validates a GeoJSON feature', function () {
		var goodGeoJSON = {type: 'FeatureCollection', features: [{type: 'Feature', geometry: null, properties: null}]};
		var badGeoJSON = {type: 'FeatureCollection', features: [{type: 'Point', coordinates: [0,0]}]};
		expect(gjl.validateGeoJSON(goodGeoJSON)).toEqual(true);
		expect(gjl.validateGeoJSON(badGeoJSON)).toEqual(false);
		expect(gjl.validateGeoJSON(goodGeoJSON, true)).toEqual(true);
		try {
			gjl.validateGeoJSON(badGeoJSON, true)
		} catch(e) {
			expect(e instanceof TypeError).toEqual(true);
		}
	});
});

describe('gjl.Object', function () {
	it('Base class of gjl', function () {
		var object = new gjl.Object();
		object.x = 3;
		expect(object.stringify()).toEqual('{"x":3}');
	});
});

describe('gjl.RandomFactory', function () {
	it('Creates random geometries, features, and feature collections', function () {
		try {
			var generator = new gjl.RandomFactory();
		} catch (e) {
			expect(e).toBeUndefined();
		}
	});
	it('must validate parameters', function () {
		expect(function(){var generator = new gjl.RandomFactory({bbox: "0"})}).toThrow(new TypeError('"0" is not an array.'));
	});
	it('must propvide its parameters via a privileged method', function () {
		var initialOptions = {type: 'LineString', stride: 2, vertices: 3, bbox: [0,0,0,0], numProp: 0, propSample: null};
		var generator = new gjl.RandomFactory(initialOptions);
		var options = generator.getOptions();
		expect(options).toBe(initialOptions);
	});
	it('must have a privileged method to update vertex number', function () {
		var generator = new gjl.RandomFactory();
		generator.setVertices(10);
		expect(generator.getOptions().vertices).toEqual(10);
	});
	it('must validate input vertices', function () {
		var generator = new gjl.RandomFactory();
		expect(function () {generator.setVertices('10');}).toThrow(new TypeError('"10" must be an integer.'));
		expect(generator.getOptions().vertices).toEqual(5);
		generator.setVertices(null);
		expect(generator.getOptions().vertices).toEqual(5);
		generator.setVertices(0);
		expect(generator.getOptions().vertices).toEqual(0);
	});
	it('must have a privileged method to update property options', function () {
		var generator = new gjl.RandomFactory();
		var newSample = {id: 0, str: 'abc'};
		generator.setProperties(2, newSample);
		expect(generator.getOptions().numProp).toEqual(2);
		expect(generator.getOptions().propSample).toBe(newSample);
	});
	it('must validate input property options', function () {
		var generator = new gjl.RandomFactory();
		var newSample = {id: 0, str: 'abc'};
		var badSample = {bbox: [0,0,0,0]};
		expect(function () {generator.setProperties('10', newSample);}).toThrow(new TypeError('"10" must be an integer.'));
		expect(function () {generator.setProperties(10, badSample);}).toThrow(new TypeError(JSON.stringify(badSample.bbox) + ' is not a primitive.'));
		generator.setProperties(2, newSample);
		generator.setProperties(null);
		expect(generator.getOptions().numProp).toEqual(2);
		expect(generator.getOptions().propSample).toBe(newSample);
		generator.setProperties(0);
		expect(generator.getOptions().numProp).toEqual(0);
		expect(generator.getOptions().propSample).toBeNull();
	});
	it('must be able to generate valid geometries', function () {
		var generator = new gjl.RandomFactory();
		var testGeom = generator.generateGeometry();
		expect(testGeom.isValid()).toBeTruthy();
		generator = new gjl.RandomFactory({type: 'LineString'});
		testGeom = generator.generateGeometry();
		expect(testGeom.isValid()).toBeTruthy();
		generator = new gjl.RandomFactory({type: 'Polygon'});
		testGeom = generator.generateGeometry();
		expect(testGeom.isValid()).toBeTruthy();
	});
	it('must be able to generate valid features', function () {
		var generator = new gjl.RandomFactory();
		var testFeat = generator.generateFeature();
		expect(testFeat.isValid()).toBeTruthy();
	});
	it('must be able to generate valid feature collections', function () {
		var generator = new gjl.RandomFactory();
		var testFeat = generator.generateFeatures(10);
		expect(testFeat.isValid()).toBeTruthy();
		expect(testFeat.features.length).toEqual(10);
	});
});
