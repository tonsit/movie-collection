class ErrorResponse {
  constructor(error, code = 400) {
    console.error(error);
    return {
      statusCode: code,
      body: 'Error with request',
    };
  }
}

module.exports = ErrorResponse;