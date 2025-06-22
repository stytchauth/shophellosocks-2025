import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import loadStytch from './stytchClient';

export interface AuthenticatedPageProps {
  user: any;
}

export interface SSRAuthResult {
  props?: AuthenticatedPageProps;
  redirect?: {
    destination: string;
    permanent: boolean;
  };
}

export interface WithAuthOptions {
  requireAdaptiveMFA?: boolean;
}

/**
 * Validates Stytch session from cookies and returns user data for SSR pages
 * Redirects to /login if session is invalid
 */
export async function validateSession(
  context: GetServerSidePropsContext,
  options?: WithAuthOptions
): Promise<SSRAuthResult> {
  try {
    const sessionToken = context.req.cookies.stytch_session;
    console.log('sessionToken', sessionToken);
    
    if (!sessionToken) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    // Initialize Stytch client
    const stytchClient = loadStytch();

    // Authenticate the session
    const authResponse = await stytchClient.sessions.authenticate({
      session_token: sessionToken,
    });

    // If 2FA is required, validate authentication factors
    if (options?.requireAdaptiveMFA) {
      const factors = authResponse.session?.authentication_factors || [];
      
      // Check for primary authentication factor (email or OAuth)
      const hasPrimaryAuth = factors.some((factor: any) => 
        factor.type === 'email' || factor.type === 'oauth'
      );
      
      // Check for SMS authentication factor
      const hasSmsAuth = factors.some((factor: any) => 
        factor.type === 'sms'
      );
      
      // If missing either factor, redirect to appropriate page
      if (!hasPrimaryAuth) {
        return {
          redirect: {
            destination: '/login',
            permanent: false,
          },
        };
      }
      
      if (!hasSmsAuth) {
        // Check if user has a phone number for 2FA or needs enrollment
        const hasPhoneNumber = authResponse.user.phone_numbers && authResponse.user.phone_numbers.length > 0;
        return {
          redirect: {
            destination: hasPhoneNumber ? '/2fa' : '/enroll',
            permanent: false,
          },
        };
      }
    }

    return {
      props: {
        user: authResponse.user,
      },
    };

  } catch (error) {
    console.error('Session validation error:', error);
    
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
}

/**
 * Higher-order function that wraps getServerSideProps with session validation
 */
export function withAuth<P extends AuthenticatedPageProps = AuthenticatedPageProps>(
  options?: WithAuthOptions,
  getServerSidePropsFunc?: (
    context: GetServerSidePropsContext,
    user: any
  ) => Promise<GetServerSidePropsResult<P>>
) {
  return async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const authResult = await validateSession(context, options);
    
    if (authResult.redirect) {
      return authResult as GetServerSidePropsResult<P>;
    }
    
    if (!authResult.props) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      } as GetServerSidePropsResult<P>;
    }

    // If additional getServerSideProps logic is provided, execute it
    if (getServerSidePropsFunc) {
      return await getServerSidePropsFunc(context, authResult.props.user);
    }

    return {
      props: authResult.props as P,
    };
  };
}