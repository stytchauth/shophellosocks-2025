// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import loadStytch from "../../lib/stytchClient";

type Data = {
  message: string;
  method_id?: string;
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
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error_message: "Email is required" });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error_message: "Invalid email format" });
    }

    // Initialize Stytch client
    const stytchClient = loadStytch();

    // Send OTP via email
    const otpResponse = await stytchClient.otps.email.send({
      email,
      expiration_minutes: 10, // OTP expires in 10 minutes
    });

    const emailId = (otpResponse as any).email_id;

    if (!emailId) {
      return res.status(500).json({ error_message: "Failed to get email ID from Stytch" });
    }

    // Store email_id in httpOnly cookie
    const cookieOptions = [
      `stytch_method_id=${emailId}`,
      'HttpOnly',
      'Secure',
      'SameSite=Strict',
      'Path=/',
      'Max-Age=600' // 10 minutes, same as OTP expiration
    ].join('; ');
    
    res.setHeader('Set-Cookie', cookieOptions);

    res.status(200).json({ 
      message: "OTP sent successfully"
    });

  } catch (error: any) {
    console.error('Send OTP error:', error);
    
    // Handle specific Stytch errors
    if (error.status_code) {
      return res.status(error.status_code).json({ 
        error_message: error.error_message || "Failed to send OTP" 
      });
    }
    
    res.status(500).json({ error_message: "Failed to send OTP" });
  }
}