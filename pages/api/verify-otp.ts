// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import loadStytch from "../../lib/stytchClient";
import { setSessionCookie } from "../../lib/sessionUtils";

type Data = {
  message: string;
  user?: any;
  redirect?: string;
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
    const method_id = req.cookies.stytch_method_id;

    if (!method_id) {
      return res.status(400).json({ error_message: "Method ID is required" });
    }

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error_message: "OTP code is required" });
    }

    // Validate code format (should be 6 digits)
    if (!/^\d{6}$/.test(code)) {
      return res.status(400).json({ error_message: "Invalid OTP code format" });
    }

    // Initialize Stytch client
    const stytchClient = loadStytch();

    // Authenticate OTP
    const authResponse = await stytchClient.otps.authenticate({
      method_id,
      session_duration_minutes: 120,
      code,
    });

    // Set session cookie using shared utility
    setSessionCookie(res, authResponse.session_token);

    // Check if user has a phone number for 2FA
    const hasPhoneNumber = authResponse.user.phone_numbers && authResponse.user.phone_numbers.length > 0;

    // Return JSON response with redirect information
    res.status(200).json({
      message: "OTP verified successfully",
      user: authResponse.user,
      redirect: hasPhoneNumber ? '/2fa' : '/enroll'
    });

  } catch (error: any) {
    console.error('Verify OTP error:', error);
    
    // Handle specific Stytch errors
    if (error.status_code) {
      return res.status(error.status_code).json({ 
        error_message: error.error_message || "Failed to verify OTP" 
      });
    }
    
    res.status(500).json({ error_message: "Failed to verify OTP" });
  }
}