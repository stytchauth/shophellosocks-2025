import { Box, Button, Typography, TextField, Divider } from "@mui/material";
import React, { useState } from "react";
import OtpInput from "./OtpInput";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");

  const handleGoogleOAuth = () => {
    window.location.href = "/api/oauth-start";
  };

  const sendOtp = async (isResend = false) => {
    setEmailError("");
    setOtpError("");
    
    if (isResend) {
      setIsResending(true);
    } else {
      setIsLoading(true);
    }
    
    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowOtpForm(true);
      } else {
        setEmailError(data.error_message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setEmailError("Failed to send OTP. Please try again.");
    } finally {
      if (isResend) {
        setIsResending(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await sendOtp(false);
  };

  const handleResendOtp = async () => {
    await sendOtp(true);
  };

  const handleOtpComplete = async (code: string) => {
    setOtpError("");
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to enroll page on success
        window.location.href = "/enroll";
      } else {
        setOtpError(data.error_message || "Failed to verify OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setOtpError("Failed to verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setShowOtpForm(false);
    setIsLoading(false);
    setIsResending(false);
    setEmailError("");
    setOtpError("");
  };

  return (
    <Box sx={{ color: "black", width: "100%", maxWidth: 400 }}>
      {!showOtpForm ? (
        <>
          <Button
            variant="contained"
            fullWidth
            onClick={handleGoogleOAuth}
            sx={{
              mb: 3,
              py: 1.5,
              backgroundColor: "#4285f4",
              "&:hover": { backgroundColor: "#357ae8" },
            }}
          >
            Continue with Google
          </Button>

          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Divider sx={{ flex: 1 }} />
            <Typography variant="body2" sx={{ mx: 2, color: "gray" }}>
              OR
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Box>

          <form onSubmit={handleEmailSubmit}>
            <TextField
              fullWidth
              type="email"
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailError}
              helperText={emailError}
              sx={{ mb: 2 }}
              required
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading || !email}
              sx={{ py: 1.5 }}
            >
              {isLoading ? "Sending..." : "Continue with Email"}
            </Button>
          </form>
        </>
      ) : (
        <Box>
          <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
            Enter verification code
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, textAlign: "center", color: "gray" }}>
            We sent a 6-digit code to {email}
          </Typography>
          <OtpInput onComplete={handleOtpComplete} onBack={resetForm} error={otpError} />
          {isLoading && (
            <Typography variant="body2" sx={{ textAlign: "center", color: "gray" }}>
              Verifying...
            </Typography>
          )}
          {isResending && (
            <Typography variant="body2" sx={{ textAlign: "center", color: "gray" }}>
              Resending...
            </Typography>
          )}
          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
            <Button
              variant="text"
              onClick={resetForm}
              sx={{ color: "gray", flex: 1 }}
            >
              Back to email
            </Button>
            <Button
              variant="text"
              onClick={handleResendOtp}
              disabled={isLoading || isResending}
              sx={{ color: "gray", flex: 1 }}
            >
              {isResending ? "Resending..." : "Didn't get it? Resend"}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default LoginForm;