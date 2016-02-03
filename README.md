# GeoJSON Lite

[![Build Status](https://travis-ci.org/GaborFarkas/geojson_lite.svg?branch=master)](https://travis-ci.org/GaborFarkas/geojson_lite)

GeoJSON Lite is a small GeoJSON validator, and random GeoJSON generator. That is, it can do two things: tell if a GeoJSON object is invalid, and generate random, valid GeoJSON objects. It was created for testing, and benchmarking purposes.

The library is published under the MIT license. Feel free to use it, or adapt it. Forks, and PRs are also welcome.

## Example

``` javascript
<script src="gaborfarkas.github.io/geojson_lite/v1.0.1/js/gjl.js"></script>
```

### gjl.RandomFactory

``` javascript
//Create a generator, which generates WGS84 polygons with 5 vertices, and no properties.
var generator = new gjl.RandomFactory({
    type: 'Polygon'
});

//Generate such a polygon.
var polygon = generator.generateGeometry();

//Generate a feature with such a polygon.
var polyFeat = generator.generateFeature();

//Generate a feature collection with 10 features. Each feature will have a polygon with 5 vertices.
var polyFeatCol = generator.generateFeatures(10);

//Grow the number of vertices to 10.
generator.setVertices(10);

//Generate a polygon with 10 vertices.
polygon = generator.generateGeometry();

//Add four properties with four different types.
var propertySample = {
    nulltype: null,
    booltype: true,
    stringtype: 'somestring',
    numtype: 50000
};
generator.setProperties(4, propertySample);

//Generate such a feature.
polyFeat = generator.generateFeature();
polyFeat.properties; //Object {nulltype: null, booltype: true, stringtype: "7wra8rydjg", numtype: 69972}
```

### gjl.validateGeoJSON

``` javascript
//Have a valid GeoJSON object.
var GeoJSON = {
    type: 'Feature',
    geometry: {
        type: 'Point',
        coordinates: [0,0]
    },
    properties: null,
    crs: {
        type: 'name',
        properties: {
            name: 'EPSG:4326'
        }
    },
    bbox: [-180,-90,180,90]
};

gjl.validateGeoJSON(GeoJSON); //true

//Make the GeoJSON invalid.
delete GeoJSON.properties;

gjl.validateGeoJSON(GeoJSON); //false

//Get more details about the error.
gjl.validateGeoJSON(GeoJSON, true) //TypeError: undefined must be null, or an object.
```

## API Documentation

You can reach the API Documentation [here](http://gaborfarkas.github.io/geojson_lite/v1.0.1/api).

## Compile

To compile the source code, first install the node dependencies of the package.

`npm install`

Next, you can compile the package with `compile.js`.

`node compile.js`

## Testing

GeoJSON Lite uses Jasmine as a testing framework. To run the tests, simply start testing in Node.

`npm test`

## NPM

The project is also available as an NPM package.

### Installation

`npm install geojson_lite`

### Usage

As this is a small project, which targets browsers, but still wants to harness the power of compiled JS, there are some naming conventions,
 which were necessarry for Closure Compiler to keep some of the references. One of them was:

``` javascript
window['gjl'] = gjl;
```

which isntantly throws a reference error in Node.js. To avoid this, you must do some patching around. You can either create an alias of `window` 
to `GLOBAL` before requiring the package.

``` javascript
GLOBAL.window = GLOBAL;

require(geojson_lite);
```

Alternatively, you can simply remove the upper mentioned mischievous line, and add the `gjl` namespace to the `GLOBAL` scope directly.

``` javascript
GLOBAL.gjl = {};
```

## Contribute

Contributions are welcome. My main concerns to fix are listend in the [TODO](TODO.md) list.

Guidelines:

- The GeoJSON constructors should be as lightweight as possible.
- If you need a functionality, which is currently not implemented, and you don't want to reinvent the wheel, feel free to contribute.

## Credits

- Inspiration and the idea for the main functionality taken from the Python [geojson](https://pypi.python.org/pypi/geojson/) package.
- Some of the naming conventions are taken from [OpenLayers 3](https://github.com/openlayers/ol3).
- The namespace `gjl` resembles to the [GeoJSON Utils for JavaScript](https://github.com/maxogden/geojson-js-utils) package's `gju` namespace. It is not intentional, the namespace `GeoJSON` was simply taken. It is a great package, though.
- For testing, the [jasmine-node](https://github.com/mhevery/jasmine-node) package is used.
- For compiling the code, Google's [Closure Compiler](https://github.com/google/closure-compiler) is used.
- For generating the API Documentation, [JSDoc 3](https://github.com/jsdoc3/jsdoc) is used.

