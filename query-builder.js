const uuid = require('uuid/v4');

class QueryBuilder {
  constructor(table) {
      this.table = table;
  }

  create(body) {
    return {
      TableName: this.table,
      Item: {
        id: uuid(),
        details: body
      }
    };
  }
      
  search(body) {
    return {
      TableName: this.table
    };
  }
      
  read(id) {
    return {
      TableName: this.table,
      Key: {
        id: id
      }
    };  
  }      
      
  update(id, body) {
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
      TableName: this.table,
      Key: {
        id: id
      },
      UpdateExpression: expression.slice(0, -1),
      ExpressionAttributeValues: values,
      ExpressionAttributeNames: names,
      ReturnValues: "UPDATED_NEW"
    };
  }

  delete(id) {
    return {
      TableName: this.table,
      Key: {
        id: id
      }
    };
  }
    
}

module.exports = QueryBuilder;