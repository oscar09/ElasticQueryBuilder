var assert = require("assert");
var elasticQB = require("../source/ElasticQueryBuilder");

var elasticObject;


describe("Match method",function(){
	before(function(done)
	{
		elasticObject = new elasticQB();
		done();
	});

	it('should return a valid match query',function(){
		var _expected_result = {
			query: {
				query_string:
				{
					query: 'test',
					default_operator: 'OR'
				}
			}
		};
		elasticObject.match('test');
		assert.equal(JSON.stringify(_expected_result), JSON.stringify(elasticObject.query()));
	});

	it('should return valid match query with one field and AND operator', function()
	{
		var _expected_result = {
			query: {
				query_string:
				{
					query: 'test',
					default_operator: 'AND',
					fields: ['name']
				}
			}
		};
		elasticObject.match('test', 'name', 'AND');
		assert.equal(JSON.stringify(_expected_result), JSON.stringify(elasticObject.query()));
	});

	it('should return valid match query with two fields (array)', function()
	{
		var _expected_result = {
			query: {
				query_string:
				{
					query: 'test',
					default_operator: 'OR',
					fields: ['name', 'age']
				}
			}
		};
		elasticObject.match('test', ['name', 'age']);
		assert.equal(JSON.stringify(_expected_result), JSON.stringify(elasticObject.query()));
	});

	it('should return valid multi_match query', function()
	{
		var _expected_result = {
			query: {
				multi_match:
				{
					query: 'test',
					default_operator: 'OR'
				}
			}
		};
		elasticObject.match('test', false, 'OR', true);
		assert.equal(JSON.stringify(_expected_result), JSON.stringify(elasticObject.query()));
	});
});

describe("MatchExact method",function(){
	before(function(done)
	{
		elasticObject = new elasticQB();
		done();
	});
	it('should return a valid match query no fields',function(){
		var _expected_result = {
			query: {
				match_pharse:
				{
					query: 'testExact',
					default_operator: 'AND'
				}
			}
		};
		elasticObject.matchExact('testExact');
		assert.equal(JSON.stringify(_expected_result), JSON.stringify(elasticObject.query()));
	});
});