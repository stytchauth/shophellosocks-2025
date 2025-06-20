import { Box, TextField } from "@mui/material";
import React, { useState } from "react";

type Props = {
  onComplete: (code: string) => void;
  onBack: () => void;
  error?: string;
};

function OtpInput({ onComplete, onBack, error }: Props) {
  const [otpCode, setOtpCode] = useState("");

  const handleOtpChange = (value: string) => {
    // Only allow digits and limit to 6 characters
    const digits = value.replace(/\D/g, "").slice(0, 6);
    setOtpCode(digits);

    // Auto-submit when 6 digits are entered
    if (digits.length === 6) {
      onComplete(digits);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onBack();
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        fullWidth
        label="6-digit code"
        value={otpCode}
        onChange={(e) => handleOtpChange(e.target.value)}
        onKeyDown={handleKeyDown}
        error={!!error}
        helperText={error}
        inputProps={{
          maxLength: 6,
          style: { 
            textAlign: "center", 
            fontSize: "1.5rem",
            fontWeight: "bold",
            letterSpacing: "0.5rem"
          }
        }}
        sx={{
          "& .MuiInputBase-root": {
            height: "60px"
          }
        }}
      />
    </Box>
  );
}

export default OtpInput;