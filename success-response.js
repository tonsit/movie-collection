class SuccessResponse {
  constructor(result, code = 200) {
    console.log(result);
    return {
      statusCode: code,
      body: JSON.stringify(result),
    };
  }
}

module.exports = SuccessResponse;