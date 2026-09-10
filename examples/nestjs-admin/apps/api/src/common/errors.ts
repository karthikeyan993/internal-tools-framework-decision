export class AppError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly statusCode: number,
    readonly fields?: Record<string, string>
  ) {
    super(message);
  }
}

export const forbidden = () => new AppError('FORBIDDEN', 'Reviewer permission is required for this action.', 403);
export const notFound = () => new AppError('NOT_FOUND', 'The access request was not found.', 404);
export const conflict = () => new AppError('CONFLICT', 'This request changed or was already reviewed. Refresh and try again.', 409);
