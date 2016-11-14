"use strict";
/*
 * ElasticQueryBuilder builds the JSON structure for an elasticSearch query.
 * @version 0.1
 * @author oscar09 {@link https://github.com/oscar09/ElasticQueryBuilder}
 * @license MIT
 */
(function()
{
	function ElasticQueryBuilder()
	{
		/* "new" is missing? then create a new object. This only works in frontend code.*/
		try
		{
			if(this === window)
			{
				return new ElasticQueryBuilder();
			}
		}catch(e)
		{
			console.log(e);
		}

		this.data = {};
		this._$elasticObjects = {};
	}

	/**
	 * Matches an empty string or a set of words.
	 * @param {string} query String to match.
	 * @param {string} onFields Query will be done on these fields. If omitted, then search is done on all fields.
	 * @param {string} operator Operator to be used between words, it can be AND or OR.
	 * @param {boolean} useMulti If TRUE multi_match is going to be used, by default query_string is used.
	 */
	ElasticQueryBuilder.prototype.match = function(query, onFields, operator, useMulti)
	{
		if(typeof query !== 'string')
		{
			throw 'Query must be a string';
		}

		if(operator && typeof operator !== 'string' && operator !== 'AND' && operator !== 'OR')
		{
			throw 'Operator must be AND or OR';
		}

		this.data.query = query || '';
		this.data.exact = false;

		/*clears out the match related fields*/
		delete this._$elasticObjects.match_all;
		delete this._$elasticObjects.match;
		delete this._$elasticObjects.match_pharse;

		if(!query)
		{
			this._$elasticObjects.match_all = {
				query: query
			};
		}else
		{
			this._$elasticObjects.match = {
				query: query,
				fields: onFields,
				operator: operator || 'OR',
				multi_match: useMulti || false
			};
		}
		return this;
	};

	/**
	 * Matches an exact phrase.
	 * @param {string} query String to match.
	 * @param {string} onFields Query will be done on these fields. If omitted, then search is done on all fields.
	 */
	ElasticQueryBuilder.prototype.matchExact = function(query, onFields)
	{
		if(!query || typeof query !== 'string'|| !query.trim())
		{
			throw 'Invalid query';
		}

		this.data.query = query;
		this.data.exact = true;
		/*clears out the match related fields*/
		delete this._$elasticObjects.match_all;
		delete this._$elasticObjects.match;
		delete this._$elasticObjects.match_pharse;

		this._$elasticObjects.match_pharse = {
			query: query,
			fields: onFields
		};
		return this;
	};

	/**
	 * Sort the results by the specified fields.
	 * @param {object} fields An object or an array of objects with the form: {propertyId: asc or desc}. Example: {country: asc}.
	 */
	ElasticQueryBuilder.prototype.sortBy = function(fields)
	{
		if(!fields)
		{
			throw 'Fields are required';
		}
		this.data.sort = fields;

		this._$elasticObjects.sort = fields;
		return this;
	};

	/** @todo */
	ElasticQueryBuilder.prototype.and = function()
	{
	};

	/** @todo */
	ElasticQueryBuilder.prototype.or = function()
	{
	};

	/** @todo */
	ElasticQueryBuilder.prototype.not = function()
	{
	};

	/**
	 * Records will be searched beginning from this record.
	 * @param {int} From Record index from where the search will be started.
	 */
	ElasticQueryBuilder.prototype.startFrom = function(from)
	{
		this.data.from = from || 0;
		this._$elasticObjects.from = from;
		return this;
	};

	/**
	 * Number of records to return.
	 * @param {int} size Number of records that are going to be fetched.
	 */
	ElasticQueryBuilder.prototype.size = function(size)
	{
		this.data.size = size || false;
		this._$elasticObjects.size = size || false;
		return this;
	};

	/**
	 * Columns that are going to be returned on the result. If false, all of them are returned.
	 * @param {string} columnNames Comma separated columns to be returned in the result.
	 */
	ElasticQueryBuilder.prototype.getColumns = function(columnNames)
	{
		this.data._source = columnNames || false;
		this._$elasticObjects._source = columnNames;
		return this;
	};

	/**
	 * Builds the elastic search query.
	 */
	ElasticQueryBuilder.prototype.query = function()
	{
		var _fields_as_array;
		var _query = {
			query: {}
		};
		//checks if we have a match_all query.
		if(this._$elasticObjects.match_all)
		{
			_query.query = {match_all: {}};
		}
		//checks if it is a match (any)
		if(this._$elasticObjects.match)
		{
			var _type_of_match = 'query_string';
			if(this._$elasticObjects.match.multi_match)
			{
				_type_of_match = 'multi_match';
			}

			_query.query[_type_of_match] = {
				query: this._$elasticObjects.match.query,
				default_operator: this._$elasticObjects.match.operator
			};

			//has any fields?
			if(this._$elasticObjects.match.fields)
			{
				_fields_as_array = this._$elasticObjects.match.fields;
				if(!Array.isArray(_fields_as_array))
				{
					_fields_as_array = [_fields_as_array];
				}
				_query.query[_type_of_match].fields = _fields_as_array;
			}
		}

		//checks if it is a match exact
		if(this._$elasticObjects.match_pharse)
		{

			_query.query.match_pharse = {
				query: this._$elasticObjects.match_pharse.query,
				default_operator: 'AND'
			};

			//has any fields?
			if(this._$elasticObjects.match_pharse.fields)
			{
				_fields_as_array = this._$elasticObjects.match_pharse.fields;
				if(!Array.isArray(_fields_as_array))
				{multi_match
					_fields_as_array = [_fields_as_array];
				}
				_query.query.multi_match.fields = _fields_as_array;
			}
		}

		//checks if sort
		if(this._$elasticObjects.sort)
		{
			var _sort_array = this._$elasticObjects.sort;
			if(!Array.isArray(_sort_array))
			{
				_sort_array = [_sort_array];
			}

			_query.sort = _sort_array;
		}

		//checks if from
		if(this._$elasticObjects.from)
		{
			_query.from = this._$elasticObjects.from;
		}

		//checks if size
		if(this._$elasticObjects.size)
		{
			_query.size = this._$elasticObjects.size;
		}

		return _query;
	};

	/**
	 * Clears out the search parameters.
	 */
	ElasticQueryBuilder.prototype.reset = function()
	{
		this.data = {};
		this._$elasticObjects = {};
		return this;
	};

	try
	{
		window.ElasticQueryBuilder = ElasticQueryBuilder;
	}catch(e){
		console.log('error', e);
	}

	try
	{
		module.exports = ElasticQueryBuilder;
	}catch(e)
	{
		console.log('error', e);
	}
})();