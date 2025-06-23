import { NextRequest, NextResponse } from "next/server";

/**
 * Wraps a route handler with standardized error handling
 * @param handler The route handler function to wrap
 * @param errorContext Optional context string for error logging
 * @returns Wrapped route handler with error handling
 */
export function withErrorHandling<T extends any[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>,
  errorContext?: string
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    try {
      return await handler(request, ...args);
    } catch (error: any) {
      const context = errorContext || 'Route handler';
      console.error(`${context} error:`, error);
      
      // Handle specific Stytch errors
      if (error.status_code) {
        return NextResponse.json(
          { error_message: error.error_message || `${context} failed` },
          { status: error.status_code }
        );
      }
      
      // Handle general errors
      return NextResponse.json(
        { error_message: `${context} failed` },
        { status: 500 }
      );
    }
  };
}