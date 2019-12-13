'use strict';

const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const table = process.env.COLLECTION_TABLE;
const QueryBuilder = require('./query-builder.js');
const queryBuilder = new QueryBuilder(table);
const ErrorResponse = require('./error-response.js');
const SuccessResponse = require('./success-response.js');

module.exports.create = async event => {
  const body = JSON.parse(event.body);
  const query = queryBuilder.create(body);

  try {
    const result = await db.put(query).promise();
    return new SuccessResponse({id: query.Item.id});

  } catch (error) {
    return new ErrorResponse(error);

  }
}


module.exports.search = async event => {
  const body = JSON.parse(event.body);
  const query = queryBuilder.search(body);
  
  try {
    const result = await db.scan(query).promise();
    return new SuccessResponse(result);
  
  } catch (error) {
    return new ErrorResponse(error);
  
  }
};

module.exports.read = async event => {
  const query = queryBuilder.read(event.pathParameters.id);
  try {
    const result = await db.get(query).promise();
    if (!result.hasOwnProperty('Item')) {
      return new ErrorResponse('Not found', 404);

    }
    return new SuccessResponse(result);
  
  } catch (error) {
    return new ErrorResponse(error);
 
  }
};

module.exports.update = async event => {
  const body = JSON.parse(event.body);

  const query = queryBuilder.update(event.pathParameters.id, body);
  console.log(query);
  
  try {
    const result = await db.update(query).promise();
    return new SuccessResponse(result);

  } catch (error) {
    return new ErrorResponse(error);

  }
};

module.exports.delete = async event => {
  const query = queryBuilder.delete(event.pathParameters.id);
  
  try {
    const result = await db.delete(query).promise();
    return new SuccessResponse(result, 204);

  } catch (error) {
    return new ErrorResponse(error);

  }
};
