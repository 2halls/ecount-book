class ApiResponse {
  constructor(status, result, data) {
    this.status = status;
    this.result = result;
    this.data = data;
  }
}

module.exports = ApiResponse;
