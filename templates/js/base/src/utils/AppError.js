// Throw this anywhere to send a clean error response, e.g. throw new AppError(404, 'Post not found')
export default class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}
