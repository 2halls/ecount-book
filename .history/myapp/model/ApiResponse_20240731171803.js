class ApiResponse {
  constructor(code, status, result, data) {
    this.code = code;
    this.status = status;
    this.result = result;
    this.data = data;
  }
}

export default ApiResponse;
