GLOBAL.window = GLOBAL;

require('../src/gjl.js');

describe('gjl.feat.Feature', function () {
	it('Constructor for GeoJSON features', function () {
		var testFeat = new gjl.feat.Feature(new gjl.geom.Point([0,0]), {id: 1});
		expect(testFeat instanceof gjl.Object).toBeTruthy();
		expect(testFeat.type).toEqual('Feature');
		expect(testFeat.properties).not.toBeUndefined();
		expect(testFeat.properties.id).toEqual(1);
		expect(testFeat.geometry).not.toBeUndefined();
	});
	it('must accept undefined values for both geometry, and properties parameter', function () {
		var testFeat = new gjl.feat.Feature();
		expect(testFeat.properties).toBeNull();
		expect(testFeat.geometry).toBeNull();
	});
	it('must send through the parameters a validation process', function () {
		try {
			var testFeat = new gjl.feat.Feature([new gjl.geom.Point([0,0])], {id: 1});
		} catch (e) {
			expect(e instanceof TypeError).toBeTruthy();
		}
		try {
			var testFeat = new gjl.feat.Feature(new gjl.geom.Point[0,0], 1);
		} catch (e) {
			expect(e instanceof TypeError).toBeTruthy();
		}
	});
	it('must migrate the CRS of the geometry to the constructed feature', function () {
		var validCRS = {type: 'name', properties: {name: 'EPSG:4326'}};
		var testGeom = new gjl.geom.Point([0,0]);
		testGeom.crs = validCRS;
		var testFeat = new gjl.feat.Feature(testGeom);
		expect(testFeat.crs).not.toBeUndefined();
		expect(testFeat.geometry.crs).toBeUndefined();
	});
	it('must be able to validate the contained GeoJSON feature', function () {
		var testFeat = new gjl.feat.Feature(new gjl.geom.Point([0,0]), {id: 1});
		expect(testFeat.isValid()).toBeTruthy();
		expect(testFeat.isValid(true)).toBeTruthy();
		testFeat.type = 'BadFeature';
		expect(testFeat.isValid()).toBeFalsy();
		try {
			testFeat.isValid(true)
		} catch (e) {
			expect(e instanceof TypeError).toBeTruthy();
		}
	});
});

describe('gjl.feat.FeatureCollection', function () {
	it('Constructor for GeoJSON feature collections', function () {
		var testFeat = new gjl.feat.FeatureCollection([new gjl.feat.Feature(new gjl.geom.Point([0,0]), {id: 1})]);
		expect(testFeat instanceof gjl.feat.Feature).toBeTruthy();
		expect(testFeat.type).toEqual('FeatureCollection');
		expect(Object.prototype.toString.call(testFeat.features)).toEqual('[object Array]');
	});
	it('must only accept arrays', function () {
		try {
			var testFeat = new gjl.feat.FeatureCollection(new gjl.feat.Feature(new gjl.geom.Point([0,0]), {id: 1}));
		} catch (e) {
			expect(e instanceof TypeError).toBeTruthy();
		}
	});
	it('must accept plain GeoJSON objects', function () {
		var testGeoJSON = {type: 'Feature', geometry: {type: 'Point', coordinates: [0,0]}, properties: null};
		var testFeat = new gjl.feat.FeatureCollection([testGeoJSON]);
		expect(testFeat.type).toEqual('FeatureCollection');
		expect(testFeat.features).not.toBeUndefined();
	});
	it('must send through the features a validation process', function () {
		try {
			var testGeoJSON = {type: 'Feature', geometry: {type: 'Point', coordinates: [0,0]}};
			var testFeat = new gjl.feat.FeatureCollection([testGeoJSON]);
		} catch (e) {
			expect(e instanceof TypeError).toBeTruthy();
		}
	});
	it('must send through the features a CRS migration process', function () {
		var validCRS = {type: 'name', properties: {name: 'EPSG:4326'}};
		var featOne = new gjl.feat.Feature(new gjl.geom.Point([0,0]), {id: 1});
		featOne.crs = validCRS;
		var featTwo = new gjl.feat.Feature(new gjl.geom.Point([1,1]), {id: 2});
		featTwo.crs = validCRS;
		var testFeat = new gjl.feat.FeatureCollection([featOne, featTwo]);
		expect(testFeat.crs).not.toBeUndefined();
		expect(testFeat.features[0].crs).toBeUndefined();
		expect(testFeat.features[1].crs).toBeUndefined();
	});
});
