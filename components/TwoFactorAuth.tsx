"use client";

import { Box, Button, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import OtpInput from "./OtpInput";

interface TwoFactorAuthProps {
  user: any;
}

function maskPhoneNumber(phoneNumber: string): string {
  // Remove +1 prefix if present and format as (XXX) XXX-XXXX
  const cleaned = phoneNumber.replace(/^\+1/, '');
  if (cleaned.length === 10) {
    return `(***) ***-${cleaned.slice(-4)}`;
  }
  // Fallback for other formats
  return phoneNumber.replace(/\d(?=\d{4})/g, '*');
}

function TwoFactorAuth({ user }: TwoFactorAuthProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [smsSent, setSmsSent] = useState(false);
  
  // Get the user's phone number
  const phoneNumber = user.phone_numbers?.[0]?.phone_number || '';
  const maskedPhone = maskPhoneNumber(phoneNumber);

  // Automatically send SMS on component mount
  useEffect(() => {
    if (phoneNumber && !smsSent) {
      sendSms(false);
    }
  }, [phoneNumber, smsSent]);

  const sendSms = async (isResend = false) => {
    setOtpError("");
    
    if (isResend) {
      setIsResending(true);
    } else {
      setIsLoading(true);
    }
    
    try {
      const response = await fetch("/api/sms/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone_number: phoneNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        setSmsSent(true);
      } else {
        setOtpError(data.error_message || "Failed to send SMS OTP");
      }
    } catch (error) {
      console.error("Error sending SMS OTP:", error);
      setOtpError("Failed to send SMS OTP. Please try again.");
    } finally {
      if (isResend) {
        setIsResending(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  const handleResendSms = async () => {
    await sendSms(true);
  };

  const handleOtpComplete = async (code: string) => {
    setOtpError("");
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/sms/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success - redirect to cart
        router.push("/cart");
      } else {
        setOtpError(data.error_message || "Failed to verify SMS OTP");
      }
    } catch (error) {
      console.error("Error verifying SMS OTP:", error);
      setOtpError("Failed to verify SMS OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!phoneNumber) {
    return (
      <Box sx={{ textAlign: "center", padding: 4 }}>
        <Typography variant="body1" sx={{ color: "#5C727D", mb: 2 }}>
          No phone number found on your account. Please contact support.
        </Typography>
      </Box>
    );
  }

  if (!smsSent && isLoading) {
    return (
      <Box sx={{ textAlign: "center", padding: 4 }}>
        <Typography variant="body2" sx={{ color: "#5C727D", mb: 2 }}>
          Sending verification code to {maskedPhone}...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ color: "black", width: "100%", maxWidth: 400 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, textAlign: "center" }}>
        Enter verification code
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, textAlign: "center", color: "#5C727D" }}>
        We sent a 6-digit code to {maskedPhone}
      </Typography>
      
      <OtpInput onComplete={handleOtpComplete} error={otpError} />
      
      {isLoading && (
        <Typography variant="body2" sx={{ textAlign: "center", color: "gray", mt: 2 }}>
          Verifying...
        </Typography>
      )}
      
      {isResending && (
        <Typography variant="body2" sx={{ textAlign: "center", color: "gray", mt: 2 }}>
          Resending...
        </Typography>
      )}
      
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Button
          variant="text"
          onClick={handleResendSms}
          disabled={isLoading || isResending}
          sx={{ color: "gray" }}
        >
          {isResending ? "Resending..." : "Didn't get it? Resend"}
        </Button>
      </Box>
    </Box>
  );
}

export default TwoFactorAuth;