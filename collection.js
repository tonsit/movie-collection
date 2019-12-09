'use strict';

const uuid = require('uuid/v4');
const AWS = require('aws-sdk');

const db = new AWS.DynamoDB.DocumentClient();

const table = process.env.COLLECTION_TABLE;

module.exports.create = async event => {
  const body = JSON.parse(event.body);
  const movie = {
    title: body.title,
    year: body.year,
    format: body.format,
    length: body.length,
    year: body.year,
    rating: body.rating
  };
  const params = {
    TableName: table,
    Item: {
      id: uuid(),
      details: movie
    }
  }
  
  try {
    const result = await db.put(params).promise();
    return successResponse(params, result);
  
  } catch (error) {
    return errorResponse(error);

  }
};

module.exports.search = async event => {
  const body = JSON.parse(event.body);
  const params = {
    TableName: table,
  }
  
  try {
    const result = await db.scan(params).promise();
    return successResponse(params, result);
  
  } catch (error) {
    return errorResponse(error);
  
  }
};

module.exports.read = async event => {
  const body = JSON.parse(event.body);
  const params = {
    TableName: table,
    Key: {
      id: {
        S: body.id
      }
    }
  }
  
  try {
    const result = await db.query(params).promise();
    return successResponse(params, result);
  
  } catch (error) {
    return errorResponse(error);
  
  }
};

module.exports.update = async event => {
  const body = JSON.parse(event.body);
  const movie = {
    title: body.title
  };
  const params = {
    TableName: table,
    Item: {
      id: body.id,
      details: movie
    }
  }
  
  try {
    const result = await db.put(params).promise();
    return successResponse(params, result);

  } catch (error) {
    return errorResponse(error);

  }
};


module.exports.delete = async event => {
  const body = JSON.parse(event.body);

  const params = {
    TableName: table,
    Key: {
      id: {
        S: body.id
      }
    }
  }
  
  try {
    const result = await db.delete(params).promise();
    return successResponse(params, result, 204);

  } catch (error) {
    return errorResponse();

  }
};

function errorResponse(error, code = 400) {
  return {
    statusCode: code,
    error: error.stack
  };
}

function successResponse(params, result, code = 200) {
  return {
    statusCode: code,
    body: JSON.stringify(params, result),
  };
}




