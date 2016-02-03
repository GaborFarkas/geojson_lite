GLOBAL.window = GLOBAL;

require('../src/gjl.js');

describe('gjl.error.throwError', function() {
	it('is a too big function throwing every kind of errors', function () {
		expect(function () {gjl.error.throwError({code: 0})}).toThrow(new TypeError('0 is an invalid error code.'));
		expect(function () {gjl.error.throwError({code: 1, part: 0})}).toThrow(new TypeError('0 is not an array.'));
		expect(function () {gjl.error.throwError({code: 2, part: 0})}).toThrow(new TypeError('0 is not a number.'));
		expect(function () {gjl.error.throwError({code: 3, part: 0})}).toThrow(new TypeError('0 must be an integer.'));
		expect(function () {gjl.error.throwError({code: 4, part: 0})}).toThrow(new TypeError('0 must be an integer, and greater than two.'));
		expect(function () {gjl.error.throwError({code: 5, part: 0})}).toThrow(new TypeError('0 is an invalid geometry type. For the random factory the supported types are Point, LineString, and Polygon.'));
		expect(function () {gjl.error.throwError({code: 6, part: 0})}).toThrow(new TypeError('Invalid GeoJSON: 0.'));
		expect(function () {gjl.error.throwError({code: 7, part: 0})}).toThrow(new TypeError('0 is an invalid feature type.'));
		expect(function () {gjl.error.throwError({code: 8, part: 0})}).toThrow(new TypeError('Array 0 has wrong number of members.'));
		expect(function () {gjl.error.throwError({code: 9, part: 0})}).toThrow(new TypeError('0 is not an object.'));
		expect(function () {gjl.error.throwError({code: 10, part: 0})}).toThrow(new TypeError('0 is not a primitive.'));
		expect(function () {gjl.error.throwError({code: 11, part: 0})}).toThrow(new TypeError('0 must be null, or an object.'));
		expect(function () {gjl.error.throwError({code: 12, part: 0})}).toThrow(new TypeError('Invalid coordinate array: 0. There must be at least two coordinates in a position, and four in a bounding box.'));
		expect(function () {gjl.error.throwError({code: 13, part: 0})}).toThrow(new TypeError('There are more than one CRS definitions in the GeoJSON.'));
		expect(function () {gjl.error.throwError({code: 14, part: 0})}).toThrow(new TypeError('CRS 0 must be on the top level.'));
		expect(function () {gjl.error.throwError({code: 15, part: 0})}).toThrow(new TypeError('Invalid CRS: 0.'));
		expect(function () {gjl.error.throwError({code: 16, part: 0})}).toThrow(new TypeError('0 is an invalid CRS type. Valid types are name, and link.'));
		expect(function () {gjl.error.throwError({code: 17, part: 0})}).toThrow(new TypeError('0 must be a dereferenceable URI.'));
		expect(function () {gjl.error.throwError({code: 18, part: 0})}).toThrow(new TypeError('0 must be a LinearRing (it must be closed).'));
		expect(function () {gjl.error.throwError({code: 19, part: 0})}).toThrow(new TypeError('Missing 0.'));
		expect(function () {gjl.error.throwError({code: 20, part: 0})}).toThrow(new TypeError('Sample of properties must contain members equal to number of properties.'));
	});
});
