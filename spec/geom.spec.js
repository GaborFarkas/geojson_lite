GLOBAL.window = GLOBAL;

require('../src/gjl.js');

describe('gjl.geom.Geometry', function () {
	it('Base class for GeoJSON geometries', function () {
		var testGeom = new gjl.geom.Geometry();
		expect(testGeom instanceof gjl.Object).toBeTruthy();
	});
	it('must be able to validate the contained GeoJSON geometry', function () {
		var testGeom = new gjl.geom.Geometry();
		testGeom.type = 'Point',
		testGeom.coordinates = [0,0];
		expect(testGeom.isValid()).toBeTruthy();
		expect(testGeom.isValid(true)).toBeTruthy();
		testGeom.type = 'BadPoint';
		expect(testGeom.isValid()).toBeFalsy();
		try {
			testGeom.isValid(true)
		} catch (e) {
			expect(e instanceof TypeError).toBeTruthy();
		}
	});
});

//From now on validation is checked only in the appropriate validate function.
describe('gjl.geom.Point', function () {
	it('Constructor for GeoJSON points', function () {
		var testGeom = new gjl.geom.Point([0,0]);
		expect(testGeom instanceof gjl.geom.Geometry).toBeTruthy();
		expect(testGeom.type).toEqual('Point');
		expect(testGeom.coordinates).toEqual([0,0]);
	});
	it('must send through the coordinates a validation process', function () {
		try {
			var testGeom = new gjl.geom.Point({coordinates: [0,0]});
		} catch (e) {
			expect(e instanceof TypeError).toBeTruthy();
		}
	});
});

describe('gjl.geom.MultiPoint', function () {
	it('Constructor for GeoJSON multipart points', function () {
		var testGeom = new gjl.geom.MultiPoint([[0,0], [1,1]]);
		expect(testGeom instanceof gjl.geom.Geometry).toBeTruthy();
		expect(testGeom.type).toEqual('MultiPoint');
		expect(testGeom.coordinates).toEqual([[0,0],[1,1]]);
	});
	it('must send through the coordinates a validation process', function () {
		try {
			var testGeom = new gjl.geom.Point({coordinates: [0,0]});
		} catch (e) {
			expect(e instanceof TypeError).toBeTruthy();
		}
	});
});

describe('gjl.geom.LineString', function () {
	it('Constructor for GeoJSON linestrings', function () {
		var testGeom = new gjl.geom.LineString([[0,0], [1,1]]);
		expect(testGeom instanceof gjl.geom.Geometry).toBeTruthy();
		expect(testGeom.type).toEqual('LineString');
		expect(testGeom.coordinates).toEqual([[0,0],[1,1]]);
	});
	it('must send through the coordinates a validation process', function () {
		try {
			var testGeom = new gjl.geom.Point({coordinates: [0,0]});
		} catch (e) {
			expect(e instanceof TypeError).toBeTruthy();
		}
	});
});

describe('gjl.geom.MultiLineString', function () {
	it('Constructor for GeoJSON multipart linestrings', function () {
		var testGeom = new gjl.geom.MultiLineString([[[0,0], [1,1]], [[2,2], [3,3]]]);
		expect(testGeom instanceof gjl.geom.Geometry).toBeTruthy();
		expect(testGeom.type).toEqual('MultiLineString');
		expect(testGeom.coordinates).toEqual([[[0,0], [1,1]], [[2,2], [3,3]]]);
	});
	it('must send through the coordinates a validation process', function () {
		try {
			var testGeom = new gjl.geom.Point({coordinates: [0,0]});
		} catch (e) {
			expect(e instanceof TypeError).toBeTruthy();
		}
	});
});

describe('gjl.geom.Polygon', function () {
	it('Constructor for GeoJSON polygons', function () {
		var testGeom = new gjl.geom.Polygon([[[0,0], [1,1], [2,2], [0,0]], [[0.1,0.1], [0.5,0.5], [0.7,0.7], [0.1,0.1]]]);
		expect(testGeom instanceof gjl.geom.Geometry).toBeTruthy();
		expect(testGeom.type).toEqual('Polygon');
		expect(testGeom.coordinates).toEqual([[[0,0], [1,1], [2,2], [0,0]], [[0.1,0.1], [0.5,0.5], [0.7,0.7], [0.1,0.1]]]);
	});
	it('must send through the coordinates a validation process', function () {
		try {
			var testGeom = new gjl.geom.Point({coordinates: [0,0]});
		} catch (e) {
			expect(e instanceof TypeError).toBeTruthy();
		}
	});
});

describe('gjl.geom.MultiPolygon', function () {
	it('Constructor for GeoJSON multipart polygons', function () {
		var testGeom = new gjl.geom.MultiPolygon([[[[0,0], [1,1], [2,2], [0,0]], [[0.1,0.1], [0.5,0.5], [0.7,0.7], [0.1,0.1]]],[[[5,5], [6,6], [7,7], [5,5]], [[5.1,5.1], [5.5,5.5], [5.7,5.7], [5.1,5.1]]]]);
		expect(testGeom instanceof gjl.geom.Geometry).toBeTruthy();
		expect(testGeom.type).toEqual('MultiPolygon');
		expect(testGeom.coordinates).toEqual([[[[0,0], [1,1], [2,2], [0,0]], [[0.1,0.1], [0.5,0.5], [0.7,0.7], [0.1,0.1]]],[[[5,5], [6,6], [7,7], [5,5]], [[5.1,5.1], [5.5,5.5], [5.7,5.7], [5.1,5.1]]]]);
	});
	it('must send through the coordinates a validation process', function () {
		try {
			var testGeom = new gjl.geom.Point({coordinates: [0,0]});
		} catch (e) {
			expect(e instanceof TypeError).toBeTruthy();
		}
	});
});

describe('gjl.geom.GeometryCollection', function () {
	it('Constructor for GeoJSON geometry collections', function () {
		var testGeom = new gjl.geom.GeometryCollection([new gjl.geom.Point([0,0])]);
		expect(testGeom instanceof gjl.geom.Geometry).toBeTruthy();
		expect(testGeom.type).toEqual('GeometryCollection');
		expect(Object.prototype.toString.call(testGeom.geometries)).toEqual('[object Array]');
	});
	it('must only accept arrays', function () {
		try {
			var testGeom = new gjl.geom.GeometryCollection(new gjl.geom.Point([0,0]));
		} catch (e) {
			expect(e instanceof TypeError).toBeTruthy();
		}
	});
	it('must accept plain GeoJSON objects', function () {
		var testGeoJSON = {type: 'Point', coordinates: [0,0]};
		var testGeom = new gjl.geom.GeometryCollection([testGeoJSON]);
		expect(testGeom.type).toEqual('GeometryCollection');
		expect(Object.prototype.toString.call(testGeom.geometries)).toEqual('[object Array]');
	});
	it('must send through the geometries a validation process', function () {
		try {
			var testGeom = new gjl.geom.GeometryCollection([{type: 'BadPoint', coordinates: [0,0]}]);
		} catch (e) {
			expect(e instanceof TypeError).toBeTruthy();
		}
	});
	it('must send through the geometries a CRS migration process', function () {
		var validCRS = {type: 'name', properties: {name: 'EPSG:4326'}};
		var geomOne = new gjl.geom.Point([0,0]);
		geomOne.crs = validCRS;
		var geomTwo = new gjl.geom.Point([1,1]);
		geomTwo.crs = validCRS;
		var testGeom = new gjl.geom.GeometryCollection([geomOne, geomTwo]);
		expect(testGeom.crs).not.toBeUndefined();
	});
});
