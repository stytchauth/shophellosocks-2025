"use client";

import { Box, Button, Typography, TextField, Divider } from "@mui/material";
import React, { useState } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleGoogleOAuth = () => {
    window.location.href = "/api/oauth-start";
  };

  const sendMagicLink = async () => {
    setEmailError("");
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/send-magic-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowConfirmation(true);
      } else {
        setEmailError(data.error_message || "Failed to send magic link");
      }
    } catch (error) {
      console.error("Error sending magic link:", error);
      setEmailError("Failed to send magic link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await sendMagicLink();
  };

  const resetForm = () => {
    setEmail("");
    setShowConfirmation(false);
    setIsLoading(false);
    setEmailError("");
  };

  return (
    <Box sx={{ color: "black", width: "100%", maxWidth: 400 }}>
      {!showConfirmation ? (
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
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Check your email
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: "gray" }}>
            We sent a magic link to {email}. Click the link in your email to continue.
          </Typography>
          <Button
            variant="text"
            onClick={resetForm}
            sx={{ color: "gray" }}
          >
            Back to email
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default LoginForm;