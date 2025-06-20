import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import loadStytch from './stytchClient';

export interface AuthUser {
  user_id: string;
  emails: Array<{ email: string }>;
  phone_numbers: Array<{ phone_number: string }>;
}

export interface AuthResult {
  user: AuthUser;
  session: any;
}

export interface AuthOptions {
  requireTwoFactor?: boolean;
}

/**
 * Server-side authentication check for App Router
 * Use in server components and route handlers
 */
export async function getAuthUser(options?: AuthOptions): Promise<AuthResult | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('stytch_session')?.value;

    if (!sessionToken) {
      return null;
    }

    // Initialize Stytch client
    const stytchClient = loadStytch();

    // Authenticate the session
    const authResponse = await stytchClient.sessions.authenticate({
      session_token: sessionToken,
    });

    console.log(authResponse, authResponse.session.authentication_factors)

    // If 2FA is required, validate authentication factors
    if (options?.requireTwoFactor) {
      const factors = authResponse.session?.authentication_factors || [];
      
      // Check for primary authentication factor (email or OAuth)
      const hasPrimaryAuth = factors.some((factor: any) =>
        (factor.type === 'otp' && factor.delivery_method === 'email') ||
        (factor.type === 'oauth' && factor.delivery_method === 'oauth_google')
      );
      
      // Check for SMS authentication factor
      const hasSmsAuth = factors.some((factor: any) => 
        factor.type === 'otp' && factor.delivery_method === 'sms'
      );
      
      // If missing primary auth, redirect to login
      if (!hasPrimaryAuth) {
        redirect('/login');
      }
      
      // If missing SMS auth, redirect to appropriate page
      if (!hasSmsAuth) {
        const hasPhoneNumber = authResponse.user.phone_numbers && authResponse.user.phone_numbers.length > 0;
        redirect(hasPhoneNumber ? '/2fa' : '/enroll');
      }
    }

    return {
      user: authResponse.user,
      session: authResponse.session,
    };

  } catch (error: any) {
    console.log(error)
    // Don't log redirect errors - they are expected behavior
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error; // Re-throw redirect errors so they work properly
    }
    
    console.error('Server-side auth error:', error);
    return null;
  }
}

/**
 * Require authentication - redirects to login if not authenticated
 */
export async function requireAuth(options?: AuthOptions): Promise<AuthResult> {
  const authResult = await getAuthUser(options);
  
  if (!authResult) {
    redirect('/login');
  }
  
  return authResult;
}