// Throw this anywhere to send a clean error response, e.g. throw new AppError(404, 'Post not found')
export default class AppError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}
