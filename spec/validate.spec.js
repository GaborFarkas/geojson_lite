GLOBAL.window = GLOBAL;
var document = document || {};

require('../src/gjl.js');

describe('gjl.validate.Point', function () {
	it('Validates a single coordinate array', function () {
		var error = gjl.validate.Point([0,0,0,0]);
		expect(error.code).toEqual(0);
	});
	it('must only accept arrays with a length of at least two', function () {
		var input = {coordinates: [0,0]};
		var error = gjl.validate.Point(input);
		expect(error.code).toEqual(1);
		expect(error.part).toBe(input);
		input = null;
		input = [0];
		error = gjl.validate.Point(input);
		expect(error.code).toEqual(12);
		expect(error.part).toBe(input);
	});
	it('must only accept numbers', function () {
		var error = gjl.validate.Point([0, "0"]);
		expect(error.code).toEqual(2);
		expect(error.part).toEqual("0");
	});
});

describe('gjl.validate.MultiPoint', function () {
	it('Validates a two dimensional coordinate array', function () {
		var error = gjl.validate.MultiPoint([[0,0,0,0], [0,0,0,0]]);
		expect(error.code).toEqual(0);
	});
	it('must only accept arrays', function () {
		var input = {coordinates: [0,0]};
		var error = gjl.validate.MultiPoint(input);
		expect(error.code).toEqual(1);
		expect(error.part).toBe(input);
	});
	it('must validate linear rings, if linearRing is set to true', function () {
		var error = gjl.validate.MultiPoint([[0,0], [1,1], [2,2], [0,0]], true);
		expect(error.code).toEqual(0);
		var input = [[0,0], [1,1], [2,2]];
		error = gjl.validate.MultiPoint(input, true);
		expect(error.code).toEqual(18);
		expect(error.part).toBe(input);
	});
});

describe('gjl.validate.MultiLineString', function () {
	it('Validates a three dimensional coordinate array', function () {
		var error = gjl.validate.MultiLineString([[[0,0], [1,1], [2,2]]]);
		expect(error.code).toEqual(0);
	});
	it('must only accept arrays', function () {
		var input = {coordinates: [0,0]};
		var error = gjl.validate.MultiLineString(input);
		expect(error.code).toEqual(1);
		expect(error.part).toBe(input);
	});
});

describe('gjl.validate.Polygon', function () {
	it('must validate linear rings', function () {
		var error = gjl.validate.Polygon([[[0,0], [1,1], [2,2], [0,0]]]);
		expect(error.code).toEqual(0);
		var input = [[0,0], [1,1], [2,2]];
		error = gjl.validate.Polygon([input]);
		expect(error.code).toEqual(18);
		expect(error.part).toBe(input);
	});
});

describe('gjl.validate.MultiPolygon', function () {
	it('Validates a three dimensional linear ring array (four dimensional coordinate array with a condition)', function () {
		var error = gjl.validate.MultiPolygon([[[[0,0], [1,1], [2,2], [0,0]]]]);
		expect(error.code).toEqual(0);
	});
	it('must only accept arrays', function () {
		var input = {coordinates: [0,0]};
		var error = gjl.validate.MultiPolygon(input);
		expect(error.code).toEqual(1);
		expect(error.part).toBe(input);
	});
});

describe('gjl.validate.Geometry', function () {
	it('Validates a GeoJSON geometry object', function () {
		var testGeoJSON = {type: 'Point', coordinates: [0,0]};
		var error = gjl.validate.Geometry(testGeoJSON);
		expect(error.code).toEqual(0);
	});
	it('must only accept supported geometry types', function () {
		var testGeoJSON = {coordinates: [0,0]};
		var error = gjl.validate.Geometry(testGeoJSON);
		expect(error.code).toEqual(6);
		expect(error.part).toBe(testGeoJSON);
		testGeoJSON = {type: 'BadPoint', coordinates: [0,0]};
		error = gjl.validate.Geometry(testGeoJSON);
		expect(error.code).toEqual(5);
		expect(error.part).toEqual(testGeoJSON.type);
	});
	it('must not accept an object without a geometries or a coordinates array', function () {
		var testGeoJSON = {type: 'Point'};
		var error = gjl.validate.Geometry(testGeoJSON);
		expect(error.code).toEqual(6);
		expect(error.part).toBe(testGeoJSON);
	});
	it('must spot invalid CRS objects', function () {
		var invalidCRS = {type: "wrongName", properties: {wrongName: 'EPSG:WRONGCRS'}};
		var testGeoJSON = {type: 'Point', coordinates: [0,0], crs:invalidCRS};
		var error = gjl.validate.Geometry(testGeoJSON);
		expect(error.code).toEqual(16);
		expect(error.part).toEqual(invalidCRS.type);
	});
	it('must validate bbox arrays', function () {
		var invalidBbox = [0,0,0];
		var error = gjl.validate.Geometry({type: 'Point', coordinates: [0,0], bbox: invalidBbox});
		expect(error.code).toEqual(8);
		expect(error.part).toBe(invalidBbox);
	});
});

describe('gjl.validate.GeometryCollection', function () {
	it('Validates a GeoJSON geometry collection object', function () {
		var testGeoJSON = {type: 'GeometryCollection', geometries: [{type: 'Point', coordinates: [0,0]}]};
		var error = gjl.validate.Geometry(testGeoJSON);
		expect(error.code).toEqual(0);
	});
	it('must check if the geometries property is an array', function () {
		var testGeoJSON = {type: 'GeometryCollection', geometries: {type: 'Point', coordinates: [0,0]}};
		var error = gjl.validate.Geometry(testGeoJSON);
		expect(error.code).toEqual(1);
		expect(error.part).toBe(testGeoJSON.geometries);
	});
	it('must validate bbox arrays', function () {
		var invalidBbox = [0,0,0];
		var error = gjl.validate.GeometryCollection({type: 'GeometryCollection', geometries: [{type: 'Point', coordinates: [0,0]}], bbox: invalidBbox});
		expect(error.code).toEqual(8);
		expect(error.part).toBe(invalidBbox);
	});
});

describe('gjl.validate.Feature', function () {
	it('Validates a GeoJSON feature object', function () {
		var testGeoJSON = {type: 'Feature', geometry: {type: 'Point', coordinates: [0,0]}, properties: null};
		var error = gjl.validate.Feature(testGeoJSON);
		expect(error.code).toEqual(0);
	});
	it('must accept both geometry, and properties paramters to be null', function () {
		var testGeoJSON = {type: 'Feature', geometry: null, properties: null};
		var error = gjl.validate.Feature(testGeoJSON);
		expect(error.code).toEqual(0);
	});
	it('must accept only objects as geometry, and properties parameters', function () {
		var testGeoJSON = {type: 'Feature', geometry: 2, properties: null};
		var error = gjl.validate.Feature(testGeoJSON);
		expect(error.code).toEqual(11);
		expect(error.part).toEqual(2);
		testGeoJSON = {type: 'Feature', geometry: null, properties: 2};
		error = gjl.validate.Feature(testGeoJSON);
		expect(error.code).toEqual(11);
		expect(error.part).toEqual(2);
	});
	it('must not accept invalid geometries', function () {
		var testGeoJSON = {type: 'Feature', geometry: {type: 'BadPoint', coordinates: [0,0]}, properties: null};
		var error = gjl.validate.Feature(testGeoJSON);
		expect(error.code).toEqual(5);
		expect(error.part).toEqual('BadPoint');
	});
	it('must not accept invalid properties', function () {
		var testPoint = new gjl.geom.Point([0,0]);
		var testGeoJSON = {type: 'Feature', geometry: null, properties: testPoint};
		var error = gjl.validate.Feature(testGeoJSON);
		expect(error.code).toEqual(10);
		expect(error.part).toBe(testPoint.coordinates);
	});
	it('must spot invalid CRS objects', function () {
		var invalidCRS = {type: "wrongName", properties: {wrongName: 'EPSG:WRONGCRS'}};
		var testGeoJSON = {type: 'Feature', geometry: null, properties: null, crs: invalidCRS};
		var error = gjl.validate.Feature(testGeoJSON);
		expect(error.code).toEqual(16);
		expect(error.part).toEqual(invalidCRS.type);
	});
	it('must validate bbox arrays', function () {
		var invalidBbox = [0,0,0];
		var error = gjl.validate.Feature({type: 'Feature', geometry: null, properties: null, bbox: invalidBbox});
		expect(error.code).toEqual(8);
		expect(error.part).toBe(invalidBbox);
	});
});

describe('gjl.validate.FeatureCollection', function () {
	it('Validates a GeoJSON feature collection object', function () {
		var testGeoJSON = {type: 'FeatureCollection', features: [{type: 'Feature', geometry: null, properties: null}]};
		var error = gjl.validate.FeatureCollection(testGeoJSON);
		expect(error.code).toEqual(0);
	});
	it('must check if the features property is an array', function () {
		var testGeoJSON = {type: 'FeatureCollection', features: {type: 'Feature', geometry: null, properties: null}};
		var error = gjl.validate.FeatureCollection(testGeoJSON);
		expect(error.code).toEqual(1);
		expect(error.part).toBe(testGeoJSON.features);
	});
	it('must spot invalid CRS objects', function () {
		var invalidCRS = {type: "wrongName", properties: {wrongName: 'EPSG:WRONGCRS'}};
		var testGeoJSON = {type: 'FeatureCollection', features: [{type: 'Feature', geometry: null, properties: null}], crs: invalidCRS};
		var error = gjl.validate.FeatureCollection(testGeoJSON);
		expect(error.code).toEqual(16);
		expect(error.part).toEqual(invalidCRS.type);
	});
	it('must validate bbox arrays', function () {
		var invalidBbox = [0,0,0];
		var error = gjl.validate.FeatureCollection({type: 'FeatureCollection', features: [{type: 'Feature', geometry: null, properties: null, bbox: invalidBbox}]});
		expect(error.code).toEqual(8);
		expect(error.part).toBe(invalidBbox);
	});
});

describe('gjl.validate.Properties', function () {
	it('Validates a properties object', function () {
		var error = gjl.validate.Properties({id: 0, str: 'abc'});
		expect(error.code).toEqual(0);
	});
	it('must only accpet an object as properties', function () {
		var error = gjl.validate.Properties(2);
		expect(error.code).toEqual(9);
		expect(error.part).toBe(2);
	});
	it('must only accept primitives as values', function () {
		var badVal = {id: 0};
		var error = gjl.validate.Properties({id: 0, obj: badVal});
		expect(error.code).toEqual(10);
		expect(error.part).toBe(badVal);
	});
	it('must not accept the primitive undefined', function () {
		var error = gjl.validate.Properties({id: 0, wrongVal: undefined});
		expect(error.code).toEqual(10);
		expect(error.part).toBe(undefined);
	});
});

describe('gjl.validate.Bbox', function () {
	it('Validates a bounding box object', function () {
		var error = gjl.validate.Bbox([0,0,0,0], 2);
		expect(error.code).toEqual(0);
	});
	it('must only accept an array of numbers as a bounding box', function () {
		var error = gjl.validate.Bbox(0, 2);
		expect(error.code).toEqual(1);
		expect(error.part).toEqual(0);
		error = gjl.validate.Bbox([0,0,0,"0"], 2);
		expect(error.code).toEqual(2);
		expect(error.part).toEqual("0");
	});
	it('must check if number of members are n*2, where n is the number of dimensions, aka stride', function () {
		var badBbox = [0,0,0,0,0,0,0,0];
		var error = gjl.validate.Bbox(badBbox, 2);
		expect(error.code).toEqual(8);
		expect(error.part).toBe(badBbox);
	});
});

describe('gjl.validate.numCRS', function () {
	it('Validates the number of CRSs found in a GeoJSON object', function () {
		var testCRS = {type: 'name', properties: {name: 'EPSG:4326'}};
		var returnObj = {num: 1, crs: testCRS};
		var testGeoJSON = {type: 'Point', coordinates: [0,0], crs: testCRS};
		var error = gjl.validate.numCRS(testGeoJSON, returnObj);
		expect(error.code).toEqual(0);
	});
	it('must react, if there is more than one CRS definitions in a GeoJSON object', function () {
		var testCRS = {type: 'name', properties: {name: 'EPSG:4326'}};
		var returnObj = {num: 2, crs: testCRS};
		var testGeoJSON = {type: 'Point', coordinates: [0,0], crs: testCRS};
		var error = gjl.validate.numCRS(testGeoJSON, returnObj);
		expect(error.code).toEqual(13);
	});
	it('must react, when there is only one CRS, but it is not on the top of the stack', function () {
		var testCRS = {type: 'name', properties: {name: 'EPSG:4326'}};
		var returnObj = {num: 1, crs: testCRS};
		var testGeoJSON = {type: 'GeometryCollection', geometries: [{type: 'Point', coordinates: [0,0], crs: testCRS}]};
		var error = gjl.validate.numCRS(testGeoJSON, returnObj);
		expect(error.code).toEqual(14);
		expect(error.part).toBe(testCRS);
	});
	it('must send the CRS in a valid setup thorugh a CRS validation process', function () {
		var testCRS = {type: 'badName', properties: {name: 'EPSG:4326'}};
		var returnObj = {num: 1, crs: testCRS};
		var testGeoJSON = {type: 'Point', coordinates: [0,0], crs: testCRS};
		var error = gjl.validate.numCRS(testGeoJSON, returnObj);
		expect(error.code).toEqual(16);
		expect(error.part).toBe(testCRS.type);
	});
});

describe('gjl.validate.CRS', function () {
	it('Validates a single CRS object', function () {
		var testCRS = {type: 'name', properties: {name: 'EPSG:4326'}};
		var error = gjl.validate.CRS(testCRS);
		expect(error.code).toEqual(0);
	});
	it('must only accept name, and link types', function () {
		var testCRS = {type: 'badName', properties: {name: 'EPSG:4326'}};
		var error = gjl.validate.CRS(testCRS);
		expect(error.code).toEqual(16);
		expect(error.part).toBe(testCRS.type);
	});
	it('if it is a name, it must contain {name: "CRSname"} in its properties member', function () {
		var testCRS = {type: 'name', properties: {crsName: 'EPSG:4326'}};
		var error = gjl.validate.CRS(testCRS);
		expect(error.code).toEqual(15);
		expect(error.part).toBe(testCRS);
	});
	it('if it is a link, it must contain {href: "URL"} in its properties member', function () {
		var testCRS = {type: 'link', properties: {crsHref: 'http://somedomain.com'}};
		var error = gjl.validate.CRS(testCRS);
		expect(error.code).toEqual(15);
		expect(error.part).toBe(testCRS);
	});
	if (document.createElement) {
		it('if it is a link, its href property must contain a valid URI', function () {
			var testCRS = {type: 'link', properties: {crsHref: 'www.somedomain.com'}};
			var error = gjl.validate.CRS(testCRS);
			expect(error.code).toEqual(17);
			expect(error.part).toEqual(testCRS.properties.href);
		});
	}
});

describe('gjl.validate.RandomFactoryOptions', function () {
	it('Validates the options provided to the random generator', function () {
		var error = gjl.validate.RandomFactoryOptions({
			vertices: 5,
			stride: 3,
			type: 'LineString',
			numProp: 2,
			propSample: {str: 'abc', num: 123},
			bbox: [0,0,0,0,0,0]
		});
		expect(error.code).toEqual(0);
	});
	it('must only accept an integer as vertices', function () {
		var error = gjl.validate.RandomFactoryOptions({vertices: '5'});
		expect(error.code).toEqual(3);
		expect(error.part).toEqual('5');
		error = gjl.validate.RandomFactoryOptions({vertices: 5.1});
		expect(error.code).toEqual(3);
		expect(error.part).toEqual(5.1);
	});
	it('must only accept an integer greater than two as stride', function () {
		var error = gjl.validate.RandomFactoryOptions({stride: '3'});
		expect(error.code).toEqual(4);
		expect(error.part).toEqual('3');
		error = gjl.validate.RandomFactoryOptions({stride: 3.1});
		expect(error.code).toEqual(4);
		expect(error.part).toEqual(3.1);
		error = gjl.validate.RandomFactoryOptions({stride: 1});
		expect(error.code).toEqual(4);
		expect(error.part).toEqual(1);
	});
	it('must only accept Point, LineString, and Polygon types until more of them get supported', function () {
		var error = gjl.validate.RandomFactoryOptions({type: 'Point'});
		expect(error.code).toEqual(0);
		error = gjl.validate.RandomFactoryOptions({type: 'LineString'});
		expect(error.code).toEqual(0);
		error = gjl.validate.RandomFactoryOptions({type: 'Polygon'});
		expect(error.code).toEqual(0);
		error = gjl.validate.RandomFactoryOptions({type: 'Feature'});
		expect(error.code).toEqual(5);
		expect(error.part).toEqual('Feature');
	});
	it('must only accept a propSample with a numProp', function () {
		error = gjl.validate.RandomFactoryOptions({propSample: {id: 0}});
		expect(error.code).toEqual(19);
		expect(error.part).toEqual('number of properties');
	});
	it('must only accept an integer as numProp', function () {
		var error = gjl.validate.RandomFactoryOptions({numProp: '1', propSample: {id: 0}});
		expect(error.code).toEqual(3);
		expect(error.part).toEqual('1');
		error = gjl.validate.RandomFactoryOptions({numProp: 1.5, propSample: {id: 0}});
		expect(error.code).toEqual(3);
		expect(error.part).toEqual(1.5);
	});
	it('must only accept a valid properties object as propSample', function () {
		var badProp = ['id', 0];
		var error = gjl.validate.RandomFactoryOptions({numProp: 1, propSample: badProp});
		expect(error.code).toEqual(9);
		expect(error.part).toBe(badProp);
	});
	it('must accept a plain object of numProp members as propSample', function () {
		var badProp = {id: 0, srt: 'abc'};
		var error = gjl.validate.RandomFactoryOptions({numProp: 1, propSample: badProp});
		expect(error.code).toEqual(20);
	});
	it('must only accept a valid bbox (tested in gjl.validate.Bbox)', function () {
		var badBbox = [0,0,0,0];
		var error = gjl.validate.RandomFactoryOptions({stride: 3, bbox: badBbox});
		expect(error.code).toEqual(8);
		expect(error.part).toBe(badBbox);
	});
});
