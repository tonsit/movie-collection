'use strict';

const uuid = require('uuid/v4');
const AWS = require('aws-sdk');

const db = new AWS.DynamoDB.DocumentClient();

const table = process.env.COLLECTION_TABLE;

module.exports.create = async event => {
  const body = JSON.parse(event.body);
  const movie = {
    title: body.title
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
    return {
      statusCode: 200,
      body: JSON.stringify(params, result),
    };

  } catch (error) {
    return {
      statusCode: 400,
      error: error.stack
    };

  }
};
