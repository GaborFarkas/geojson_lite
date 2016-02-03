GLOBAL.window = GLOBAL;

require('../src/gjl.js');

describe('gjl.utils.getStride', function () {
	it('returns the dimensions based on the first coordinate array', function () {
		var coords = [0,0,0,0];
		expect(gjl.utils.getStride(coords)).toEqual(4);
		coords = [[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[coords]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]];
		expect(gjl.utils.getStride(coords)).toEqual(4);
	});
});

describe('gjl.utils.getCoordinates', function () {
	it('returns the first found coordinates in a valid geometry', function () {
		var coords = [0,0,0,0];
		var testGeom = new gjl.geom.Point(coords);
		expect(gjl.utils.getCoordinates(testGeom)).toBe(coords);
	});
	it('returns the first found coordinates in a valid geometry collection', function () {
		var coords = [0,0,0,0];
		var testGeom = new gjl.geom.GeometryCollection([new gjl.geom.Point(coords)]);
		expect(gjl.utils.getCoordinates(testGeom)).toBe(coords);
	});
	it('returns the first found coordinates in a valid feature', function () {
		var coords = [0,0,0,0];
		var testFeat = new gjl.feat.Feature(new gjl.geom.Point(coords));
		expect(gjl.utils.getCoordinates(testFeat)).toBe(coords);
	});
	it('returns the first found coordinates in a valid feature collection', function () {
		var coords = [0,0,0,0];
		var testFeat = new gjl.feat.FeatureCollection([new gjl.feat.Feature(new gjl.geom.Point(coords))]);
		expect(gjl.utils.getCoordinates(testFeat)).toBe(coords);
	});
});

describe('gjl.utils.searchCRS', function () {
	it('returns the number of CRSs, and the lastly found CRS in a GeoJSON object', function () {
		var validCRS = {type: 'name', properties: {name: 'EPSG:4326'}};
		var testGeom = new gjl.geom.Point([0,0]);
		testGeom.crs = validCRS;
		var returnedObj = gjl.utils.searchCRS(testGeom);
		expect(returnedObj.num).toEqual(1);
		expect(returnedObj.crs).toBe(validCRS);
	});
	it('can handle any type of GeoJSON objects is a recursive manner', function () {
		var validCRS = {type: 'name', properties: {name: 'EPSG:4326'}};
		var testGeoJSON = {type: 'FeatureCollection', crs:validCRS, features: [
			{type: 'Feature', crs: validCRS, geometry: {type: 'GeometryCollection', crs: validCRS, geometries: [
				{type: 'Point', crs: validCRS, coordinates: [0,0]}
			]}}
		]};
		var returnedObj = gjl.utils.searchCRS(testGeoJSON);
		expect(returnedObj.num).toEqual(4);
		expect(returnedObj.crs).toBe(validCRS);
	});
	it('can delete the found CRS objects, if deleteMode is true', function () {
		var validCRS = {type: 'name', properties: {name: 'EPSG:4326'}};
		var testGeoJSON = {type: 'FeatureCollection', crs:validCRS, features: [
			{type: 'Feature', crs: validCRS, geometry: {type: 'GeometryCollection', crs: validCRS, geometries: [
				{type: 'Point', crs: validCRS, coordinates: [0,0]}
			]}}
		]};
		var returnedObj = gjl.utils.searchCRS(testGeoJSON, true);
		expect(returnedObj.num).toEqual(4);
		expect(returnedObj.crs).toBe(validCRS);
		expect(testGeoJSON.crs).toBeUndefined();
		expect(testGeoJSON.features[0].crs).toBeUndefined();
		expect(testGeoJSON.features[0].geometry.crs).toBeUndefined();
		expect(testGeoJSON.features[0].geometry.geometries[0].crs).toBeUndefined();
	});
});

describe('gjl.utils.migrateCRS', function () {
	it('migrates the found CRS object to the top', function () {
		var validCRS = {type: 'name', properties: {name: 'EPSG:4326'}};
		var testGeoJSON = {type: 'FeatureCollection', features: [
			{type: 'Feature', crs: validCRS, geometry: {type: 'GeometryCollection', crs: validCRS, geometries: [
				{type: 'Point', crs: validCRS, coordinates: [0,0]}
			]}}
		]};
		var success = gjl.utils.migrateCRS(testGeoJSON);
		expect(success).toBeTruthy();
		expect(testGeoJSON.crs).not.toBeUndefined();
		expect(testGeoJSON.features[0].crs).toBeUndefined();
		expect(testGeoJSON.features[0].geometry.crs).toBeUndefined();
		expect(testGeoJSON.features[0].geometry.geometries[0].crs).toBeUndefined();
	});
	it('returns false, if no CRS objects were found', function () {
		var testGeoJSON = {type: 'FeatureCollection', features: [
			{type: 'Feature', geometry: {type: 'GeometryCollection', geometries: [
				{type: 'Point', coordinates: [0,0]}
			]}}
		]};
		var success = gjl.utils.migrateCRS(testGeoJSON);
		expect(success).toBeFalsy();
	});
});
