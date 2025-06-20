// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import loadStytch from "../../../lib/stytchClient";

type Data = {
  message: string;
  user?: any;
};

type Error = {
  error_message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error_message: "Method not allowed" });
  }

  try {
    const { code } = req.body;

    // Get method_id from cookie
    const method_id = req.cookies.stytch_sms_method_id;

    if (!method_id) {
      return res.status(400).json({ error_message: "SMS method ID is required" });
    }

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error_message: "OTP code is required" });
    }

    // Validate code format (should be 6 digits)
    if (!/^\d{6}$/.test(code)) {
      return res.status(400).json({ error_message: "Invalid OTP code format" });
    }

    // Get session token from cookie
    const session_token = req.cookies.stytch_session;
    
    if (!session_token) {
      return res.status(401).json({ error_message: "Authentication required" });
    }

    // Initialize Stytch client
    const stytchClient = loadStytch();

    // Authenticate OTP
    const authResponse = await stytchClient.otps.authenticate({
      method_id,
      code,
      session_token,
    });

    // Clear the SMS method ID cookie after successful verification
    const clearCookie = [
      'stytch_sms_method_id=',
      'HttpOnly',
      'Secure',
      'SameSite=Strict',
      'Path=/',
      'Max-Age=0'
    ].join('; ');
    
    res.setHeader('Set-Cookie', clearCookie);

    // Return JSON response
    res.status(200).json({
      message: "SMS OTP verified successfully",
      user: authResponse.user
    });

  } catch (error: any) {
    console.error('Verify SMS OTP error:', error);
    
    // Handle specific Stytch errors
    if (error.status_code) {
      return res.status(error.status_code).json({ 
        error_message: error.error_message || "Failed to verify SMS OTP" 
      });
    }
    
    res.status(500).json({ error_message: "Failed to verify SMS OTP" });
  }
}