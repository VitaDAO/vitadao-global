class AuthorizationError extends Error {
  constructor(message: string = "Not authorized.") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export class NotEnoughVitaError extends AuthorizationError {
  minVita: number;

  constructor(minVita: number, message: string = "Not enough VITA.") {
    super(message);
    this.name = "NotEnoughVita";
    this.minVita = minVita;
  }
}

export class NotAuthenticatedError extends AuthorizationError {
  constructor(message: string = "Not authenticated.") {
    super(message);
    this.name = "NotAuthenticated";
  }
}

export class NotFoundError extends Error {
  constructor(message: string = "Not found.") {
    super(message);
    this.name = "NotFoundError";
  }
}
