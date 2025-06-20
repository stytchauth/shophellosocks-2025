// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import loadStytch from "../../../lib/stytchClient";

type Data = {
  message: string;
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
    const { phone_number } = req.body;

    if (!phone_number || typeof phone_number !== 'string') {
      return res.status(400).json({ error_message: "Phone number is required" });
    }

    // US phone number validation (10 digits, optional +1 prefix)
    const phoneRegex = /^(\+1)?[2-9]\d{2}[2-9]\d{2}\d{4}$/;
    if (!phoneRegex.test(phone_number)) {
      return res.status(400).json({ error_message: "Invalid phone number format. Use 10-digit US format (e.g., 2345678901)" });
    }

    // Ensure +1 prefix for Stytch
    const formattedPhone = phone_number.startsWith('+1') ? phone_number : `+1${phone_number}`;

    // Get session token from cookie
    const session_token = req.cookies.stytch_session;
    
    if (!session_token) {
      return res.status(401).json({ error_message: "Authentication required" });
    }

    // Initialize Stytch client
    const stytchClient = loadStytch();

    // Send OTP via SMS
    const otpResponse = await stytchClient.otps.sms.send({
      phone_number: formattedPhone,
      session_token,
      expiration_minutes: 10, // OTP expires in 10 minutes
    });

    const phoneId = (otpResponse as any).phone_id;

    if (!phoneId) {
      return res.status(500).json({ error_message: "Failed to get phone ID from Stytch" });
    }

    // Store phone_id in httpOnly cookie
    const cookieOptions = [
      `stytch_sms_method_id=${phoneId}`,
      'HttpOnly',
      'Secure',
      'SameSite=Strict',
      'Path=/',
      'Max-Age=600' // 10 minutes, same as OTP expiration
    ].join('; ');
    
    res.setHeader('Set-Cookie', cookieOptions);

    res.status(200).json({ 
      message: "SMS OTP sent successfully"
    });

  } catch (error: any) {
    console.error('Send SMS OTP error:', error);
    
    // Handle specific Stytch errors
    if (error.status_code) {
      return res.status(error.status_code).json({ 
        error_message: error.error_message || "Failed to send SMS OTP" 
      });
    }
    
    res.status(500).json({ error_message: "Failed to send SMS OTP" });
  }
}