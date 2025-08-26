class ApiResponse {
  static success(message, data = null) {
    const res = { success: true, message };
    if (data !== null) res.data = data;
    return res;
  }
  static error(message, data = null) {
    const res = { success: false, message };
    if (data !== null) res.data = data;
    return res;
  }
}
export default ApiResponse;