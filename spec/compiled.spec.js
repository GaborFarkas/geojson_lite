GLOBAL.window = GLOBAL;

require('../build/gjl.js');

describe('compiled gjl', function () {
	it('must have all the exported namespaces available', function () {
		expect(window.gjl).not.toBeUndefined();
		expect(window.gjl.validateGeoJSON).not.toBeUndefined();
		expect(window.gjl.geom).not.toBeUndefined();
		expect(window.gjl.geom.Point).not.toBeUndefined();
		var testGeom = new gjl.geom.Point([0,0]);
		expect(testGeom.stringify).not.toBeUndefined();
		expect(testGeom.isValid).not.toBeUndefined();
		expect(window.gjl.geom.MultiPoint).not.toBeUndefined();
		expect(window.gjl.geom.LineString).not.toBeUndefined();
		expect(window.gjl.geom.MultiLineString).not.toBeUndefined();
		expect(window.gjl.geom.Polygon).not.toBeUndefined();
		expect(window.gjl.geom.MultiPolygon).not.toBeUndefined();
		expect(window.gjl.geom.GeometryCollection).not.toBeUndefined();
		expect(window.gjl.feat).not.toBeUndefined();
		expect(window.gjl.feat.Feature).not.toBeUndefined();
		expect(window.gjl.feat.Feature.prototype.isValid).not.toBeUndefined();
		expect(window.gjl.feat.FeatureCollection).not.toBeUndefined();
		expect(window.gjl.RandomFactory).not.toBeUndefined();
		var testFactory = new gjl.RandomFactory();
		expect(testFactory.setVertices).not.toBeUndefined();
		expect(testFactory.setProperties).not.toBeUndefined();
		expect(testFactory.generateGeometry).not.toBeUndefined();
		expect(testFactory.generateFeature).not.toBeUndefined();
		expect(testFactory.generateFeatures).not.toBeUndefined();
		for (var i in window.gjl.geom) {
			expect(window.gjl.geom[i].prototype.stringify).not.toBeUndefined();
			expect(window.gjl.geom[i].prototype.isValid).not.toBeUndefined();
		}
		expect(window.gjl.feat.Feature.prototype.stringify).not.toBeUndefined();
		expect(window.gjl.feat.Feature.prototype.isValid).not.toBeUndefined();
		expect(window.gjl.feat.FeatureCollection.prototype.stringify).not.toBeUndefined();
		expect(window.gjl.feat.FeatureCollection.prototype.isValid).not.toBeUndefined();
	});
});
