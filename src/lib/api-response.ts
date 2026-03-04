import { NextResponse } from 'next/server';
import type { ApiResponse, ApiError, PaginatedResponse } from '@/types';

export function successResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

export function errorResponse(
  code: string,
  message: string,
  status = 400,
  details?: Record<string, unknown>
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        details,
      },
    },
    { status }
  );
}

export function paginatedResponse<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number
): NextResponse<ApiResponse<PaginatedResponse<T>>> {
  return successResponse({
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}

// Common error responses
export const errors = {
  notFound: (resource: string) =>
    errorResponse('NOT_FOUND', `${resource} not found`, 404),

  unauthorized: () =>
    errorResponse('UNAUTHORIZED', 'Authentication required', 401),

  forbidden: () =>
    errorResponse('FORBIDDEN', 'Access denied', 403),

  badRequest: (message: string, details?: Record<string, unknown>) =>
    errorResponse('BAD_REQUEST', message, 400, details),

  validationError: (details: Record<string, unknown>) =>
    errorResponse('VALIDATION_ERROR', 'Validation failed', 400, details),

  internalError: (message = 'Internal server error') =>
    errorResponse('INTERNAL_ERROR', message, 500),

  serviceUnavailable: (service: string) =>
    errorResponse('SERVICE_UNAVAILABLE', `${service} is unavailable`, 503),
};
