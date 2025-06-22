"use client";

import { Box, Typography, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PageLayout from "../../../components/PageLayout";

export default function FraudFingerprintPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const processFraudCheck = async () => {
      try {
        // Get telemetry ID
        const telemetryId = await GetTelemetryID({
          publicToken: process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN!
        });

        // Build the redirect URL with all current search params plus telemetry_id
        const currentParams = new URLSearchParams(searchParams.toString());
        currentParams.set('telemetry_id', telemetryId);
        
        // Redirect to the backend stytch-callback with telemetry_id
        const redirectUrl = `/api/stytch-callback?${currentParams.toString()}`;
        window.location.href = redirectUrl;

      } catch (error) {
        console.error('Fraud fingerprint error:', error);
        // Redirect to login with error on failure
        router.push('/login?error=fraud_check_failed');
      }
    };

    processFraudCheck();
  }, [searchParams, router]);

  return (
    <PageLayout
      title="Verifying Security"
      subtitle="Please wait while we verify your request..."
      triangleVariant="variant1"
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          py: 4
        }}
      >
        <CircularProgress 
          size={60} 
          sx={{ 
            color: "#4CAF50" 
          }} 
        />
        <Typography 
          variant="body1" 
          sx={{ 
            textAlign: "center",
            color: "#5C727D",
            maxWidth: 400
          }}
        >
          We&#39;re performing a quick security check to ensure your account safety.
          This will only take a moment.
        </Typography>
      </Box>
    </PageLayout>
  );
}