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
  const query = {
    TableName: table,
    Item: {
      id: uuid(),
      details: movie
    },
    ReturnValues: 'ALL_OLD'
  }

  try {
    const result = await db.put(query).promise();
    return successResponse({id: query.Item.id});
  } catch (error) {
    return errorResponse(error);
  }
}


module.exports.search = async event => {
  const body = JSON.parse(event.body);
  const query = {
    TableName: table,
  }
  
  try {
    const result = await db.scan(query).promise();
    let results = [];
    result.Items.forEach((item) => results.push(item));
    return successResponse(results);
  
  } catch (error) {
    return errorResponse(error);
  
  }
};

module.exports.read = async event => {
  const query = {
    TableName: table,
    Key: {
      id: event.pathParameters.id
    }
  };
  try {
    const result = await db.get(query).promise();
    if (!result.hasOwnProperty('Item')) {
      return errorResponse('Not found', 404);
    }
    return successResponse(result);
  
  } catch (error) {
    return errorResponse(error);
 
  }
};

module.exports.update = async event => {
  const body = JSON.parse(event.body);

  const query = getUpdateQuery(event.pathParameters.id, body);
  console.log(query);
  
  try {
    const result = await db.update(query).promise();
    return successResponse(result);

  } catch (error) {
    return errorResponse(error);

  }
};


module.exports.delete = async event => {
  const query = {
    TableName: table,
    Key: {
      id: event.pathParameters.id
    }
  }
  
  try {
    const result = await db.delete(query).promise();
    return successResponse(result, 204);

  } catch (error) {
    return errorResponse(error);

  }
};

function errorResponse(error, code = 400) {
  console.error(error);
  return {
    statusCode: code,
    body: 'Error with request',
  };
}

function successResponse(result, code = 200) {
  console.log(result);
  return {
    statusCode: code,
    body: JSON.stringify(result),
  };
}

function getUpdateQuery(id, body) {
  let names = {
    '#d': 'details'
  };
  let values = {};
  let expression = 'set';
  Object.entries(body).forEach(([key, item]) => {
      expression += ` #d.#${key} = :${key},`;
      names[`#${key}`] = key;
      values[`:${key}`] = item;
  })
  return {
    TableName: table,
    Key: {
      id: id
    },
    UpdateExpression: expression.slice(0, -1),
    ExpressionAttributeValues: values,
    ExpressionAttributeNames: names,
    ReturnValues: "UPDATED_NEW"
  };
}
  
