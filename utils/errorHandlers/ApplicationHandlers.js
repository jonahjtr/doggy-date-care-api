class ApplicationError extends Error {
  constructor(message, status) {
    super(message);
    this.name = this.constructor.name;
    this.status = status || 500;
  }
}

class NotFoundError extends ApplicationError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

class ValidationError extends ApplicationError {
  constructor(errors) {
    super("Validation failed", 400);
    this.errors = errors;
  }
}

module.exports = {
  ApplicationError,
  NotFoundError,
  ValidationError,
};
