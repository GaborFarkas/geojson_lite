(function gjl (global) {
	
	/** @namespace */
	var gjl = {};
	
	global['gjl'] = gjl;
	
	//Helper function for maintaining class inheritance. Adapted from goog.inherits, from Google's Closure Library.
	gjl.inherits = function (parent, child) {
		var Temp = function () {};
		Temp.prototype = parent.prototype;
		child.prototype = new Temp();
		child.prototype.constructor = child;
	};
	
	/**
	* Validates a GeoJSON object according to the {@link http://geojson.org/geojson-spec.html|GeoJSON Format Specification}.
	* 
	* @param {object} geojson GeoJSON object
	* @param {boolean} [detailed=false] A boolean value indicating the request for additional details about the nature of the error, if there are any. Note, that this will throw only the first error found.
	* @returns {boolean} The result of the validity check, if <code>detailed</code> is <code>false</code>.
	* @throws {Error} The first error found in the object, if <code>detailed</code> is <code>true</code>.
	*/
	gjl.validateGeoJSON = function (geojson, detailed) {
		if (geojson['type'] === 'Feature' || geojson['type'] === 'FeatureCollection') {
			return gjl.feat.Feature.prototype.isValid.call(geojson, detailed);
		} else {
			return gjl.geom.Geometry.prototype.isValid.call(geojson, detailed);
		}
	};
	gjl['validateGeoJSON'] = gjl.validateGeoJSON;
	
	/**
	* @classdesc
	* Base class for GeoJSON objects. Cannot be constructed directly.
	* 
	* @constructor
	*/
	gjl.Object = function () {};
	gjl.inherits(Object, gjl.Object);
	
	/**
	* Converts the GeoJSON object to string.
	* 
	* @returns {string} The stringified GeoJSON.
	*/
	gjl.Object.prototype.stringify = function () {
		return JSON.stringify(this);
	};
	gjl.Object.prototype['stringify'] = gjl.Object.prototype.stringify;
	
	/** @namespace */
	gjl.geom = {};
	gjl['geom'] = gjl.geom;
	
	/**
	* @classdesc
	* Base class for GeoJSON geometry objects. Cannot be constructed directly.
	* 
	* @constructor
	* @extends {gjl.Object}
	*/
	gjl.geom.Geometry = function () {};
	gjl.inherits(gjl.Object, gjl.geom.Geometry);
	
	/**
	* Validates the GeoJSON geometry.
	* 
	* @param {boolean} [detailed=false] A boolean value indicating the request for additional details about the nature of the error, if there are any. Note, that this will return only the first error found.
	* @returns {boolean} The result of the validity check, if <code>detailed</code> is <code>false</code>.
	* @throws {Error} The first error found in the object, if <code>detailed</code> is <code>true</code>.
	*/
	gjl.geom.Geometry.prototype.isValid = function (detailed) {
		var error = gjl.validate.Geometry(this);
		if (error.code === 0) {
			return true;
		}
		if (detailed) {
			gjl.error.throwError(error);
		}
		return false;
	};
	gjl.geom.Geometry.prototype['isValid'] = gjl.geom.Geometry.prototype.isValid;
	
	/**
	* @classdesc
	* Base class for creating GeoJSON Point objects providing an array of coordinates.
	* @example
	* var nullPoint = new gjl.geom.Point([0,0]);
	* 
	* @constructor
	* @extends {gjl.Object}
	* @extends {gjl.geom.Geometry}
	* @param {array} coords Array of coordinates.
	*/
	gjl.geom.Point = function (coords) {
		var error = gjl.validate.Point(coords);
		if (error.code > 0) {
			gjl.error.throwError(error);
		}
		error = null;
		this['coordinates'] = coords;
		this['type'] = 'Point';
	};
	gjl.inherits(gjl.geom.Geometry, gjl.geom.Point);
	gjl.geom['Point'] = gjl.geom.Point;
	
	/**
	* @classdesc
	* Base class for creating GeoJSON MultiPoint objects providing an array of arrays of coordinates.
	* @example
	* var somePoints = new gjl.geom.MultiPoint([[0,0], [1,1], [2,2]]);
	* 
	* @constructor
	* @extends {gjl.Object}
	* @extends {gjl.geom.Geometry}
	* @param {array} coords Array of arrays of coordinates.
	*/
	gjl.geom.MultiPoint = function (coords) {
		var error = gjl.validate.MultiPoint(coords);
		if (error.code > 0) {
			gjl.error.throwError(error);
		}
		error = null;
		this['coordinates'] = coords;
		this['type'] = 'MultiPoint';
	};
	gjl.inherits(gjl.geom.Geometry, gjl.geom.MultiPoint);
	gjl.geom['MultiPoint'] = gjl.geom.MultiPoint;
	
	/**
	* @classdesc
	* Base class for creating GeoJSON LineString objects providing an array of arrays of coordinates.
	* @example
	* var simpleLine = new gjl.geom.LineString([[0,0], [1,1], [2,2]]);
	* 
	* @constructor
	* @extends {gjl.Object}
	* @extends {gjl.geom.Geometry}
	* @param {array} coords Array of arrays of coordinates.
	*/
	gjl.geom.LineString = function (coords) {
		var error = gjl.validate.LineString(coords);
		if (error.code > 0) {
			gjl.error.throwError(error);
		}
		error = null;
		this['coordinates'] = coords;
		this['type'] = 'LineString';
	};
	gjl.inherits(gjl.geom.Geometry, gjl.geom.LineString);
	gjl.geom['LineString'] = gjl.geom.LineString;
	
	/**
	* @classdesc
	* Base class for creating GeoJSON MultiLineString objects providing an array of arrays of arrays of coordinates.
	* @example
	* var twoLines = new gjl.geom.MultiLineString([
	* 	[
	* 		[0,0], [1,1], [2,2]
	* 	], 
	* 	[
	* 		[3,3], [4,4], [5,5]
	* 	]
	* ]);
	* 
	* @constructor
	* @extends {gjl.Object}
	* @extends {gjl.geom.Geometry}
	* @param {array} coords Array of arrays of arrays of coordinates.
	*/
	gjl.geom.MultiLineString = function (coords) {
		var error = gjl.validate.MultiLineString(coords);
		if (error.code > 0) {
			gjl.error.throwError(error);
		}
		error = null;
		this['coordinates'] = coords;
		this['type'] = 'MultiLineString';
	};
	gjl.inherits(gjl.geom.Geometry, gjl.geom.MultiLineString);
	gjl.geom['MultiLineString'] = gjl.geom.MultiLineString;
	
	/**
	* @classdesc
	* Base class for creating GeoJSON Polygon objects providing an array of arrays of arrays of coordinates.
	* @example
	* var simplePolygon = new gjl.geom.Polygon([
	* 	[
	* 		[0,0], [0,5], [5,5], [5,0], [0,0] //The polygon itself
	* 	], 
	* 	[
	* 		[1,1], [1,2], [2,1], [1,1]	//A hole in the polygon
	* 	],
	* 	[
	* 		[4,2], [4,4], [2,2], [4,2]  //A bigger hole in the polygon
	* 	]
	* ]);
	* 
	* @constructor
	* @extends {gjl.Object}
	* @extends {gjl.geom.Geometry}
	* @param {array} coords Array of arrays of arrays of coordinates.
	*/
	gjl.geom.Polygon = function (coords) {
		var error = gjl.validate.Polygon(coords);
		if (error.code > 0) {
			gjl.error.throwError(error);
		}
		error = null;
		this['coordinates'] = coords;
		this['type'] = 'Polygon';
	};
	gjl.inherits(gjl.geom.Geometry, gjl.geom.Polygon);
	gjl.geom['Polygon'] = gjl.geom.Polygon;
	
	/**
	* @classdesc
	* Base class for creating GeoJSON MultiPolygon objects providing an array of arrays of arrays of arrays of coordinates.
	* @example
	* var twoPolygons = new gjl.geom.Polygon([
	* 	[ //The first polygon
	* 		[
	* 			[0,0], [0,5], [5,5], [5,0], [0,0] //The polygon itself
	* 		], 
	* 		[
	* 			[1,1], [1,2], [2,1], [1,1], //A hole in the polygon
	* 		],
	* 		[
	* 			[4,2], [4,4], [2,2], [4,2]  //A bigger hole in the polygon
	* 		]
	* 	],
	* 	[ //The second polygon
	* 		[
	* 			[5,0], [5,5], [10,5], [10,0], [5,0] //The polygon itself
	* 		],
	* 		[
	* 			[7,2], [7,3], [8,3], [8,2], [7,2] //A hole in the polygon
	* 		]
	* 	]
	* ]);
	* 
	* @constructor
	* @extends {gjl.Object}
	* @extends {gjl.geom.Geometry}
	* @param {array} coords Array of arrays of arrays of arrays of coordinates.
	*/
	gjl.geom.MultiPolygon = function (coords) {
		var error = gjl.validate.MultiPolygon(coords);
		if (error.code > 0) {
			gjl.error.throwError(error);
		}
		error = null;
		this['coordinates'] = coords;
		this['type'] = 'MultiPolygon';
	};
	gjl.inherits(gjl.geom.Geometry, gjl.geom.MultiPolygon);
	gjl.geom['MultiPolygon'] = gjl.geom.MultiPolygon;
	
	/**
	* @classdesc
	* Base class for creating GeoJSON GeometryCollection objects from an array of geometries. They can be {@link gjl.geom.Geometry} objects, or regular GeoJSON objects.
	* @example
	* var geomCol = new gjl.geom.GeometryCollection([
	* 	new gjl.geom.Point([0,0]),
	* 	{
	* 		type: "Point",
	* 		coordinates: [5,5]
	* 	}
	* ]);
	* 
	* @constructor
	* @extends {gjl.Object}
	* @extends {gjl.geom.Geometry}
	* @param {array} geoms Array of geometry objects.
	*/
	gjl.geom.GeometryCollection = function (geoms) {
		if (Object.prototype.toString.call(geoms) !== '[object Array]') {
			gjl.error.throwError({
				part: geoms,
				code: 1
			});
		}
		var error;
		this['geometries'] = [];
		for (var i=0;i<geoms.length;++i) {
			if (geoms[i] instanceof gjl.geom.Geometry) {
				geoms[i].isValid(true);
				this['geometries'].push(geoms[i]);
			} else {
				error = gjl.validate.Geometry(geoms[i]);
				if (error.code > 0) {
					gjl.error.throwError(error);
				} else {
					this['geometries'].push(geoms[i]);
				}
			}
		}
		error = null;
		this['type'] = 'GeometryCollection';
		gjl.utils.migrateCRS(this);
	};
	gjl.inherits(gjl.geom.Geometry, gjl.geom.GeometryCollection);
	gjl.geom['GeometryCollection'] = gjl.geom.GeometryCollection;
	
	/** @namespace */
	gjl.feat = {};
	gjl['feat'] = gjl.feat;
	
	/**
	* @classdesc
	* Base class for creating GeoJSON Feature objects.
	* @example
	* var feat = new gjl.feat.Feature(new gjl.geom.Point([0,0]), {id: 0, name: "myPoint"});
	* 
	* @constructor
	* @extends {gjl.Object}
	* @param {object|null} [geom=null] A geometry object.
	* @param {object|null} [props=null] A plain object containing feture properties.
	*/
	gjl.feat.Feature = function (geom, props) {
		var error = {code: 0};
		this['geometry'] = null;
		this['properties'] = null;
		if (geom instanceof gjl.geom.Geometry) {
			geom.isValid(true);
			this['geometry'] = geom;
		} else if (geom) {
			error = gjl.validate.Geometry(geom);
			if (error.code > 0) {
				gjl.error.throwError(error);
			}
			this['geometry'] = geom;
		}
		if (props) {
			error = gjl.validate.Properties(props);
			if (error.code > 0) {
				gjl.error.throwError(error);
			}
			this['properties'] = props;
		}
		error = null;
		this['type'] = 'Feature';
		gjl.utils.migrateCRS(this);
	};
	gjl.inherits(gjl.Object, gjl.feat.Feature);
	gjl.feat['Feature'] = gjl.feat.Feature;
	
	/**
	* Validates the GeoJSON feature.
	* 
	* @param {boolean} [detailed=false] A boolean value indicating the request for additional details about the nature of the error, if there are any. Note, that this will return only the first error found.
	* @returns {boolean} The result of the validity check, if <code>detailed</code> is <code>false</code>.
	* @throws {Error} The first error found in the object, if <code>detailed</code> is <code>true</code>.
	*/
	gjl.feat.Feature.prototype.isValid = function (detailed) {
		if (this['type'] !== 'Feature' && this['type'] !== 'FeatureCollection') {
			if (detailed) {
				gjl.error.throwError({
					part: this['type'],
					code: 7
				});
			}
			return false;
		}
		var error = gjl.validate[this['type']](this);
		if (error.code > 0) {
			if (detailed) {
				gjl.error.throwError(error);
			}
			return false;
		}
		return true;
	};
	gjl.feat.Feature.prototype['isValid'] = gjl.feat.Feature.prototype.isValid;
	
	/**
	* @classdesc
	* Base class for creating GeoJSON FeatureCollection objects from an array of features. They can be {@link gjl.feat.Feature} objects, or regular GeoJSON objects.
	* @example
	* var featCol = new gjl.feat.FeatureCollection([
	* 	new gjl.feat.Feature(new gjl.geom.Point([0,0]), {id: 0, name: "myPoint"}),
	* 	{
	* 		type: "Feature",
	* 		geometry: {
	* 			type: "Point",
	* 			coordinates: [5,5]
	* 		},
	* 		properties: {
	* 			id: 1,
	* 			name: "mySecondPoint"
	* 		}
	* 	}
	* ]);
	* 
	* @constructor
	* @extends {gjl.Object}
	* @extends {gjl.feat.Feature}
	* @param {array} feats Array of feature objects.
	*/
	gjl.feat.FeatureCollection = function (feats) {
		if (Object.prototype.toString.call(feats) !== '[object Array]') {
			gjl.error.throwError({
				part: feats,
				code: 1
			});
		}
		var error;
		this['features'] = [];
		for (var i=0;i<feats.length;++i) {
			if (feats[i] instanceof gjl.feat.Feature) {
				feats[i].isValid(true);
				this['features'].push(feats[i]);
			} else {
				error = gjl.validate.Feature(feats[i]);
				if (error.code > 0) {
					gjl.error.throwError(error);
				} else {
					this['features'].push(feats[i]);
				}
			}
		}
		error = null;
		this['type'] = 'FeatureCollection';
		gjl.utils.migrateCRS(this);
	};
	gjl.inherits(gjl.feat.Feature, gjl.feat.FeatureCollection);
	gjl.feat['FeatureCollection'] = gjl.feat.FeatureCollection;
	
	//Namespace for validation functions.
	gjl.validate = {};
	
	//Validates an array of coordinates. Does not compare to extent.
	gjl.validate.Point = function (point) {
		if (Object.prototype.toString.call(point) !== '[object Array]') {
			return {
				part: point,
				code: 1
			};
		}
		for (var i=0; i<point.length; ++i) {
			if (typeof point[i] !== 'number') {
				return {
					part: point[i],
					code: 2
				};
			}
			
		}
		if (point.length < 2) {
			return {
				part: point,
				code: 12
			};
		}
		return {
			code: 0
		};
	};
	gjl.validate['Point'] = gjl.validate.Point;
	
	//Validates an array of arrays of coordinates. Can validate LinearRings (loops) for polygons.
	gjl.validate.MultiPoint = function (coords, linearRing) {
		if (Object.prototype.toString.call(coords) !== '[object Array]') {
			return {
				part: coords,
				code: 1
			};
		}
		var error = {code: 0},
		i = 0;
		while (error.code === 0 && i < coords.length) {
			error = gjl.validate.Point(coords[i]);
			++i;
		}
		if (error.code > 0) return error;
		if (linearRing) {
			for (var i=0;i<coords[0].length;++i) {
				if (coords[0][i] !== coords[coords.length -1][i]) {
					error = {
						part: coords,
						code: 18
					};
				}
			}	
		}
		return error;
	};
	gjl.validate['MultiPoint'] = gjl.validate.MultiPoint;
	
	gjl.validate.LineString = gjl.validate.MultiPoint;
	gjl.validate['LineString'] = gjl.validate.LineString;
	
	//Validates an array of arrays of arrays of coordinates (3D).
	gjl.validate.MultiLineString = function (coords, linearRing) {
		if (Object.prototype.toString.call(coords) !== '[object Array]') {
			return {
				part: coords,
				code: 1
			};
		}
		var error = {code: 0},
		i = 0;
		while (error.code === 0 && i < coords.length) {
			error = gjl.validate.LineString(coords[i], linearRing);
			++i;
		}
		return error;
	};
	gjl.validate['MultiLineString'] = gjl.validate.MultiLineString;
	
	gjl.validate.Polygon = function (coords) {
		return gjl.validate.MultiLineString(coords, true);
	};
	gjl.validate['Polygon'] = gjl.validate.Polygon;
	
	//Validates an array of arrays of arrays of arrays of coordinates (4D).
	gjl.validate.MultiPolygon = function (coords) {
		if (Object.prototype.toString.call(coords) !== '[object Array]') {
			return {
				part: coords,
				code: 1
			};
		}
		var error = {code: 0},
		i = 0;
		while (error.code === 0 && i < coords.length) {
			error = gjl.validate.Polygon(coords[i]);
			++i;
		}
		return error;
	};
	gjl.validate['MultiPolygon'] = gjl.validate.MultiPolygon;
	
	//Validates a GeometryCollection with every geometry in it. Also validates bbox, and crs objects. Note, that this function only does type specific validation, every other steps are in gjl.Validation#validateGeometry.
	gjl.validate.GeometryCollection = function (geom) {
		if (Object.prototype.toString.call(geom['geometries']) !== '[object Array]') {
			return {
				part: geom['geometries'],
				code: 1
			};
		}
		var error = {code: 0};
		for (var i=0;i<geom['geometries'].length;++i) {
			error = gjl.validate.Geometry(geom['geometries'][i]);
			if (error.code > 0) {
				return error;
			}
		}
		if (geom['bbox']) {
			error = gjl.validate.Bbox(geom['bbox'], gjl.utils.getStride(gjl.utils.getCoordinates(geom)));
			if (error.code > 0) {
				return error;
			}
		}
		return error;
	};
	
	//Validates a GeoJSON geometry object. The validation supports bbox, and crs objects.
	gjl.validate.Geometry = function (geom) {
		var error = {code: 0};
		if (!geom['type'] && (!geom['geometries'] || !geom['coordinates'])) {
			return {
				part: geom,
				code: 6
			};
		}
		var CRS = gjl.utils.searchCRS(geom);
		error = gjl.validate.numCRS(geom, CRS);
		if (error.code > 0) {
			return error;
		}
		if (geom['type'] === 'GeometryCollection' && geom['geometries']) {
			return gjl.validate.GeometryCollection(geom);
		}
		if (geom['type'] !== 'Point' && geom['type'] !== 'MultiPoint' && geom['type'] !== 'LineString' && geom['type'] !== 'MultiLineString' && geom['type'] !== 'Polygon' && geom['type'] !== 'MultiPolygon') {
			return {
				part: geom['type'],
				code: 5
			};
		} else {
			if (geom['coordinates']) {
				error = gjl.validate[geom['type']](geom['coordinates']);
				if (error.code === 0 && geom['bbox']) {
					return gjl.validate.Bbox(geom['bbox'], gjl.utils.getStride(geom['coordinates']));
				}
				return error;
			} else {
				return {
					part: geom,
					code: 6
				};
			}
		}
	};
	
	//Validates a GeoJSON FeatureCollection object. Same considerations as in gjl.validate#GeometryCollection.
	gjl.validate.FeatureCollection = function (feat) {
		var error = {code: 0};
		if (feat['type'] !== 'FeatureCollection') {
			return {
				part: feat['type'],
				code: 7
			};
		}
		if (Object.prototype.toString.call(feat['features']) !== '[object Array]') {
			return {
				part: feat['features'],
				code: 1
			};
		}
		var CRS = gjl.utils.searchCRS(feat);
		error = gjl.validate.numCRS(feat, CRS);
		if (error.code > 0) {
			return error;
		}
		for (var i=0;i<feat['features'].length;++i) {
			error = gjl.validate.Feature(feat['features'][i]);
			if (error.code > 0) {
				return error;
			}
		}
		if (feat['bbox']) {
			error = gjl.validate.Bbox(feat['bbox'], gjl.utils.getStride(gjl.utils.getCoordinates(feat)));
			if (error.code > 0) {
				return error;
			}
		}
		return error;
	};
	gjl.validate['FeatureCollection'] = gjl.validate.FeatureCollection;
	
	//Validates a GeoJSON Feature object.
	gjl.validate.Feature = function (feat) {
		var error = {code: 0};
		if (feat['geometry'] !== null && Object.prototype.toString.call(feat['geometry']) !== '[object Object]') {
			return {
				part: feat['geometry'],
				code: 11
			}
		} else if (feat['geometry']) {
			error = gjl.validate.Geometry(feat['geometry']);
			if (error.code > 0) {
				return error;
			}
		}
		if (feat['properties'] !== null && Object.prototype.toString.call(feat['properties']) !== '[object Object]') {
			return {
				part: feat['properties'],
				code: 11
			}
		} else if (feat['properties']) {
			error = gjl.validate.Properties(feat['properties']);
			if (error.code > 0) {
				return error;
			}
		}
		var CRS = gjl.utils.searchCRS(feat);
		error = gjl.validate.numCRS(feat, CRS);
		if (error.code > 0) {
			return error;
		}
		if (feat['bbox']) {
			var stride = feat['geometry'] ? gjl.utils.getStride(gjl.utils.getCoordinates(feat['geometry'])) : 0;
			error = gjl.validate.Bbox(feat['bbox'], stride);
			if (error.code > 0) {
				return error;
			}
		}
		return error;
	};
	gjl.validate['Feature'] = gjl.validate.Feature;
	
	//Validates a properties object. It must be a plain object with primitive values. Futhermore, undefined, and ES6 primitives are considered invalid.
	gjl.validate.Properties = function (props) {
		if (Object.prototype.toString.call(props) !== '[object Object]') {
			return {
				part: props,
				code: 9
			};
		}
		for (var i in props) {
			var propType = typeof props[i];
			if (propType !== 'string' && propType !== 'number' && propType !== 'boolean' && props[i] !== null) {
				return {
					part: props[i],
					code: 10
				}
			}
		}
		return {code: 0};
	};
	
	//Validates a GeoJSON Bounding Box object. It must contain n*2 coordinates, where n is the number of dimensions in the geometry objects.
	gjl.validate.Bbox = function (bbox, stride) {
		var error = gjl.validate.Point(bbox);
		if (error.code === 0 && bbox.length !== stride * 2) {
			return {
				part: bbox,
				code: 8
			};
		}
		return error;
	};
	
	//Helper function for avoiding duplicated code blocks. Needs a GeoJSON object, and a returned object from gjl.utils.searchCRS as parameters.
	gjl.validate.numCRS = function (object, crs) {
		if (crs.num > 1) {
			return {
				code: 13
			};
		} else if (crs.num === 1 && !object['crs']) {
			return {
				part: crs.crs,
				code: 14
			};
		} else if (crs.num === 1 && object['crs']) {
			return gjl.validate.CRS(object['crs']);
		}
		return {code: 0};
	};
	
	//Validates a GeoJSON CRS object. It looks for named, or linked CRSs.
	gjl.validate.CRS = function (crs) {
		var error = {
			part: crs,
			code: 15
		}
		if (!crs['type']) {
			return error;
		}
		if (crs['type'] === 'name') {
			if (crs['properties'] && typeof crs['properties']['name'] === 'string') {
				return {code: 0};
			}
			return error;
		} else if (crs['type'] === 'link') {
			if (crs['properties'] && typeof crs['properties']['href'] === 'string') {
				//Who else knows better how a valid URL looks like, than the browser? Still, as it uses DOM it is not testable with jasmine-node :(. See hack in validate.spec.js.
				var linkTest = document.createElement('a');
				linkTest.href = crs['properties']['href'];
				if (linkTest.protocol && linkTest.host) {
					return {code: 0};
				} else {
					return {
						part: crs['properties']['href'],
						code: 17
					};
				}
			}
			return error;
		} else {
			return {
				part: crs['type'],
				code: 16
			};
		}
	};
	
	//Validates the options object provided to the gjl.RandomFactory constructor.
	gjl.validate.RandomFactoryOptions = function (options) {
		var error;
		if (options['vertices'] && (typeof options['vertices'] !== 'number' || options['vertices'] % 1 !== 0)) {
			return {
				part: options['vertices'],
				code: 3
			};
		}
		if (options['stride'] && (typeof options['stride'] !== 'number' || options['stride'] < 2 || options['stride'] % 1 !== 0)) {
			return {
				part: options['stride'],
				code: 4
			};
		}
		if (options['type'] && (options['type'] !== 'Point' && options['type'] !== 'LineString' && options['type'] !== 'Polygon')) {
			return {
				part: options['type'],
				code: 5
			};
		}
		if (options['numProp'] && options['propSample']) {
			if (typeof options['numProp'] !== 'number' || options['numProp'] % 1 !== 0) {
				return {
					part: options['numProp'],
					code: 3
				};
			}
			error = gjl.validate.Properties(options['propSample']);
			if (error.code > 0) {
				return error;
			}
			var numSample = 0;
			for (var i in options['propSample']) {
				numSample++;
			}
			if (numSample !== options['numProp']) {
				return {
					code: 20
				};
			}
		} else if (options['numProp']) {
			if (typeof options['numProp'] !== 'number' || options['numProp'] % 1 !== 0) {
				return {
					part: options['numProp'],
					code: 3
				};
			}
		} else if (options['propSample']) {
			return {
				part: 'number of properties',
				code: 19
			};
		}
		error = options['bbox'] ? gjl.validate.Bbox(options['bbox'], options['stride']) : {code: 0};
		return error;
	};
	
	//Namespace for the error related functions.
	gjl.error = {};
	
	//Function for throwing various errors. Candidate for splitting, and refactoring.
	gjl.error.throwError = function (errObj) {
		switch(errObj.code) {
			default:
				throw new TypeError(JSON.stringify(errObj.code) + ' is an invalid error code.');
				break;
			case 1:
				throw new TypeError(JSON.stringify(errObj.part) + ' is not an array.');
				break;
			case 2:
				throw new TypeError(JSON.stringify(errObj.part) + ' is not a number.');
				break;
			case 3:
				throw new TypeError(JSON.stringify(errObj.part) + ' must be an integer.');
				break;
			case 4:
				throw new TypeError(JSON.stringify(errObj.part) + ' must be an integer, and greater than two.');
				break;
			case 5:
				throw new TypeError(JSON.stringify(errObj.part) + ' is an invalid geometry type. For the random factory the supported types are Point, LineString, and Polygon.');
				break;
			case 6:
				throw new TypeError('Invalid GeoJSON: ' + JSON.stringify(errObj.part) + '.');
				break;
			case 7:
				throw new TypeError(JSON.stringify(errObj.part) + ' is an invalid feature type.');
				break;
			case 8:
				throw new RangeError('Array ' + JSON.stringify(errObj.part) + ' has wrong number of members.');
				break;
			case 9:
				throw new TypeError(JSON.stringify(errObj.part) + ' is not an object.');
				break;
			case 10:
				throw new TypeError(JSON.stringify(errObj.part) + ' is not a primitive.');
				break;
			case 11:
				throw new TypeError(JSON.stringify(errObj.part) + ' must be null, or an object.');
				break;
			case 12:
				throw new Error('Invalid coordinate array: ' + JSON.stringify(errObj.part) + '. There must be at least two coordinates in a position, and four in a bounding box.');
				break;
			case 13:
				throw new Error('There are more than one CRS definitions in the GeoJSON.');
				break;
			case 14:
				throw new Error('CRS ' + JSON.stringify(errObj.part) + ' must be on the top level.');
				break;
			case 15:
				throw new TypeError('Invalid CRS: ' + JSON.stringify(errObj.part) + '.');
				break;
			case 16:
				throw new TypeError(JSON.stringify(errObj.part) + ' is an invalid CRS type. Valid types are name, and link.');
				break;
			case 17:
				throw new SyntaxError(JSON.stringify(errObj.part) + ' must be a dereferenceable URI.');
				break;
			case 18:
				throw new SyntaxError(JSON.stringify(errObj.part) + ' must be a LinearRing (it must be closed).');
				break;
			case 19:
				throw new Error('Missing ' + JSON.stringify(errObj.part) + '.');
				break;
			case 20:
				throw new Error('Sample of properties must contain members equal to number of properties.');
				break;
		}
	};
	
	/**
	* @classdesc
	* GeoJSON Lite's random GeoJSON generator. After instantiation, you can create random geometries, features, and feature collections with the object's methods.
	* @example
	* var generator = new gjl.RandomFactory({
	* 	type: "Point",
	* 	stride: 3
	* });
	* var randomPoint = generator.generateGeometry();
	* var randomPointFeature = generator.generateFeature();
	* var tenRandomPointsInAFeatureCollection = generator.generateFeatures(10);
	* 
	* @constructor
	* @param {object} opt_options Object of parameters.
	* @param {string} [opt_options.type="Point"] Geometry type. Supported types are Point, Line, and Polygon.
	* @param {integer} [opt_options.vertices=5] Number of vertices (ignored for points).
	* @param {integer} [opt_options.stride=2] Number of dimensions.
	* @param {array} [opt_options.bbox=[-180,-90,180,90]] Bounding box of the geometries. Must contain <code>stride*2</code> numbers.
	* @param {integer} [opt_options.numProp=0] Number of properties to create features with.
	* @param {object|undefined} [opt_options.propSample=undefined] A sample of properties. Must be a plain object with <code>numProp</code> members.
	*/
	gjl.RandomFactory = function (opt_options) {
		var options = opt_options || {};
		options['type'] = options['type'] || 'Point';
		options['vertices'] = options['vertices'] || 5;
		options['stride'] = options['stride'] || 2;
		options['numProp'] = options['numProp'] || 0;
		var error = gjl.validate.RandomFactoryOptions(options);
		if (error.code > 0) {
			gjl.error.throwError(error);
		}
		options['bbox'] = options['bbox'] || gjl.random.generateBbox(options['stride']);
		options['propSample'] = options['propSample'] || gjl.random.generatePropSample(options['propNum']);
		error = gjl.validate.RandomFactoryOptions(options);
		if (error.code > 0) {
			gjl.error.throwError(error);
		}
		error = null;
		this.getOptions = function () {
			return options;
		};
		/**
		* Overrides the vertex number of the random geometries created by this factory.
		* 
		* @param {integer} numVertices Number of vertices to create geometries with from now on.
		*/
		this.setVertices = function (numVertices) {
			if (!numVertices && numVertices !== 0) return;
			var error = gjl.validate.RandomFactoryOptions({'vertices': numVertices});
			if (error.code > 0) {
				gjl.error.throwError(error);
			}
			options['vertices'] = numVertices;
		};
		this['setVertices'] = this.setVertices;
		/**
		* Overrides property related options in this factory.
		* 
		* @param {integer} numProp Number of properties.
		* @param {object|undefined} [propSample=undefined] A sample of properties.
		*/
		this.setProperties = function (numProp, propSample) {
			if (!numProp && numProp !== 0) return;
			var error = gjl.validate.RandomFactoryOptions({'numProp': numProp, 'propSample': propSample});
			if ((error.code === 20 && numProp) || numProp === 0) {
				propSample = gjl.random.generatePropSample(numProp);
			}
			if (error.code > 0 && error.code !== 20) {
				gjl.error.throwError(error);
			}
			options['numProp'] = numProp;
			options['propSample'] = propSample;
		}
		this['setProperties'] = this.setProperties;
	};
	gjl['RandomFactory'] = gjl.RandomFactory;
	
	/**
	* Generates a random geometry object based on the factory's options.
	* 
	* @returns {gjl.geom.Geometry} The random geometry object.
	*/
	gjl.RandomFactory.prototype.generateGeometry = function () {
		var options = this.getOptions();
		var depth = options['type'] === 'LineString' ? 1 : options['type'] === 'Polygon' ? 2 : null;
		var coords;
		if (options['type'] === 'Point') {
			coords = gjl.random.generateCoords(options['stride'], options['bbox']);
		} else {
			coords = gjl.random.generateArray(depth, options['vertices'], options['bbox']);
			if (depth === 2) {
				coords[0].push(coords[0][0]);
			}
		}
		return new gjl.geom[options['type']](coords);
	};
	gjl.RandomFactory.prototype['generateGeometry'] = gjl.RandomFactory.prototype.generateGeometry;
	
	/**
	* Generates a random feature object based on the factory's options.
	* 
	* @returns {gjl.feat.Feature} The random geometry object.
	*/
	gjl.RandomFactory.prototype.generateFeature = function () {
		var options = this.getOptions();
		var geom = this.generateGeometry();
		var props = null;
		if (options['numProp']) {
			props = gjl.random.generateProperties(options['propSample']);
		}
		return new gjl.feat.Feature(geom, props);
	};
	gjl.RandomFactory.prototype['generateFeature'] = gjl.RandomFactory.prototype.generateFeature;
	
	/**
	* Generates a random feature collection based on the factory's options.
	* 
	* @param {integer} numFeat The number of features to create.
	* @returns {gjl.feat.FeatureCollection} The random geometry object.
	*/
	gjl.RandomFactory.prototype.generateFeatures = function (numFeat) {
		var error = gjl.validate.RandomFactoryOptions({'vertices' : numFeat});
		if (error.code > 0) {
			gjl.error.throwError(error);
		}
		var featArr = [];
		for (var i=0;i<numFeat;++i) {
			featArr.push(this.generateFeature());
		}
		return new gjl.feat.FeatureCollection(featArr);
	};
	gjl.RandomFactory.prototype['generateFeatures'] = gjl.RandomFactory.prototype.generateFeatures;
	
	//Namespace for the random factory's helper functions.
	gjl.random = {};
	
	//Helper function for creating random coordinates within predefined bounds.
	gjl.random.generateCoords = function (stride, bbox) {
		var coords = [];
		coords.push(parseFloat((Math.random() * (bbox[stride] - bbox[0]) + bbox[0]).toFixed(6)));
		coords.push(parseFloat((Math.random() * (bbox[stride+1] - bbox[1]) + bbox[1]).toFixed(6)));
		for (var i=2;i<stride;++i) {
			coords.push(parseFloat((Math.random() * (bbox[stride+i] - bbox[i]) + bbox[i]).toFixed(6)));
		}
		return coords;
	};
	
	//Helper function for creating a bounding box with stride*2 members.
	gjl.random.generateBbox = function (stride) {
		var bbox = gjl.defaults.bbox.slice(0,2);
		for (var i=2;i<stride*2;++i) {
			if (i%stride < 2) {
				bbox.push(gjl.defaults.bbox[(i%stride)+2]);
			} else {
				bbox.push(gjl.defaults.zRange[Math.floor(i/stride)]);
			}
		}
		return bbox;
	};
	
	//Helper function for creating an array of random coordinates with various depths.
	gjl.random.generateArray = function (depth, numVertices, bbox) {
		var coords = [];
		var currDepth = 1;
		for (var i=0;i<numVertices;++i) {
			coords.push(gjl.random.generateCoords(bbox.length/2, bbox));
		}
		while (currDepth < depth) {
			coords = [coords];
			++currDepth;
		}
		return coords;
	};
	
	//Helper function for creating a property sample of arbitrary length based on some predefined values.
	gjl.random.generatePropSample = function (numProp) {
		var propSample = {};
		for (var i=0;i<numProp;++i) {
			propSample[Math.random().toString(36).substr(2,3)] = gjl.defaults.propSample[i%4];
		}
		propSample = Object.getOwnPropertyNames(propSample).length === 0 ? null : propSample;
		return propSample;
	};
	
	//Helper function for creating random properties based on a property sample.
	gjl.random.generateProperties = function (propSample) {
		var propObj = {};
		for (var i in propSample) {
			propObj[i] = gjl.random.generateProperty(propSample[i]);
		}
		return propObj;
	};
	
	//Helper function for creating a random property based on a sample
	gjl.random.generateProperty = function (sample) {
		var randomValue;
		if (sample === null) {
			randomValue = null;
		} else if (typeof sample === 'boolean') {
			randomValue = Math.round(Math.random()) === 0 ? false : true;
		} else if (typeof sample === 'string') {
			randomValue = Math.random().toString(36).substr(2, sample.length);
		} else if (typeof sample === 'number') {
			//Replace with Math.log10(sample) when migrating to ES2015.
			var exp = Math.floor(Math.log(sample) / Math.LN10);
			randomValue = Math.floor(Math.random() * (Math.pow(10, exp + 1) - Math.pow(10, exp)) + Math.pow(10, exp));
		}
		return randomValue;
	};
	
	//Namespace for default constants.
	gjl.defaults = {};
	
	gjl.defaults.bbox = [-180, -90, 180, 90];
	gjl.defaults.zRange = [-10994, 8848];
	gjl.defaults.propSample = ["abc", 123, true, null];
	
	//Namespace for utility functions.
	gjl.utils = {};
	
	//Utility function for getting the number of coordinate pairs (strides). Assumes a validated coordinate array.
	gjl.utils.getStride = function (coords) {
		if ((Object.prototype.toString.call(coords[0])) === '[object Array]') {
			return gjl.utils.getStride(coords[0]);
		} else {
			return coords.length;
		}
	};
	
	//Utility function for getting the first array of coordinates encountered. Assumes a validated GeoJSON geometry, feature, or feature collection.
	gjl.utils.getCoordinates = function (geojson) {
		if (geojson['type'] === 'GeometryCollection') {
			return gjl.utils.getCoordinates(geojson['geometries'][0]);
		} else if (geojson['type'] === 'Feature') {
			if (geojson['geometry']) {
				return gjl.utils.getCoordinates(geojson['geometry']);
			}
			return [];
		} else if (geojson['type'] === 'FeatureCollection') {
			for (var i=0;i<geojson['features'].length;++i) {
				var coordArr = gjl.utils.getCoordinates(geojson['features'][i]);
				if (coordArr.length > 0) break;
			}
			return coordArr;
		} else {
			return geojson['coordinates'];
		}
	};
	
	//Utility function for searching every crs member of a GeoJSON, and optionally deleting them. It returns the last crs member found. Candidate for refactoring, as it does too many recursions.
	gjl.utils.searchCRS = function (geojson, deleteMode) {
		var crsData = {num: 0};
		var tempData;
		if (geojson['crs']) {
			crsData.num++;
			crsData.crs = geojson['crs'];
			if (deleteMode) {
				delete geojson['crs'];
			}
		}
		if (geojson['type'] === 'GeometryCollection') {
			for (var i=0;i<geojson['geometries'].length;++i) {
				tempData = gjl.utils.searchCRS(geojson['geometries'][i], deleteMode);
				crsData.num += tempData.num;
				if (tempData.crs) crsData.crs = tempData.crs;
			}
		} else if (geojson['type'] === 'Feature' && geojson['geometry']) {
			tempData = gjl.utils.searchCRS(geojson['geometry'], deleteMode);
			crsData.num += tempData.num;
			if (tempData.crs) crsData.crs = tempData.crs;
		} else if(geojson['type'] === 'FeatureCollection') {
			for (var i=0;i<geojson['features'].length;++i) {
				tempData = gjl.utils.searchCRS(geojson['features'][i], deleteMode);
				crsData.num += tempData.num;
				if (tempData.crs) crsData.crs = tempData.crs;
			}
		}
		return crsData;
	};
	
	//Utility function for migrating a crs member on the top of the GeoJSON stack, if there is any.
	gjl.utils.migrateCRS = function (geojson) {
		var crs = gjl.utils.searchCRS(geojson, true);
		if (crs.num > 0) {
			geojson['crs'] = crs.crs;
			return true;
		}
		return false;
	};
})(window);
