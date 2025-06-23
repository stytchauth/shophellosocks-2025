'use client';

import { Box, Button, Typography, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import OtpInput from './OtpInput';

function SmsEnrollment() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');

  const sendSmsOtp = async (isResend = false) => {
    setPhoneError('');
    setOtpError('');

    if (isResend) {
      setIsResending(true);
    } else {
      setIsLoading(true);
    }

    try {
      const response = await fetch('/api/sms/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone_number: phoneNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowOtpForm(true);
      } else {
        setPhoneError(data.error_message || 'Failed to send SMS OTP');
      }
    } catch (error) {
      console.error('Error sending SMS OTP:', error);
      setPhoneError('Failed to send SMS OTP. Please try again.');
    } finally {
      if (isResend) {
        setIsResending(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    await sendSmsOtp(false);
  };

  const handleResendSms = async () => {
    await sendSmsOtp(true);
  };

  const handleOtpComplete = async (code: string) => {
    setOtpError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/sms/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success - redirect to cart using Next.js router
        router.push('/cart');
      } else {
        setOtpError(data.error_message || 'Failed to verify SMS OTP');
      }
    } catch (error) {
      console.error('Error verifying SMS OTP:', error);
      setOtpError('Failed to verify SMS OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setPhoneNumber('');
    setShowOtpForm(false);
    setIsLoading(false);
    setIsResending(false);
    setPhoneError('');
    setOtpError('');
  };

  return (
    <Box sx={{ color: 'black', width: '100%', maxWidth: 400 }}>
      {!showOtpForm ? (
        <>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Enable SMS 2FA
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: '#5C727D' }}>
            Add your phone number to receive SMS codes for two-factor
            authentication
          </Typography>

          <form onSubmit={handlePhoneSubmit}>
            <TextField
              fullWidth
              type="tel"
              label="Phone number"
              placeholder="2345678901"
              value={phoneNumber}
              onChange={e => {
                // Only allow digits and format as user types
                const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                setPhoneNumber(digits);
              }}
              error={!!phoneError}
              helperText={phoneError || 'Enter 10-digit US phone number'}
              sx={{ mb: 2 }}
              required
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading || !phoneNumber}
              sx={{ py: 1.5 }}
            >
              {isLoading ? 'Sending...' : 'Send SMS Code'}
            </Button>
          </form>
        </>
      ) : (
        <Box>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Verify your phone number
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: '#5C727D' }}>
            We sent a 6-digit code to {phoneNumber}
          </Typography>
          <OtpInput
            onComplete={handleOtpComplete}
            onBack={resetForm}
            error={otpError}
          />
          {isLoading && (
            <Typography
              variant="body2"
              sx={{ textAlign: 'center', color: 'gray' }}
            >
              Verifying...
            </Typography>
          )}
          {isResending && (
            <Typography
              variant="body2"
              sx={{ textAlign: 'center', color: 'gray' }}
            >
              Resending...
            </Typography>
          )}
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button
              variant="text"
              onClick={resetForm}
              sx={{ color: 'gray', flex: 1 }}
            >
              Back to phone
            </Button>
            <Button
              variant="text"
              onClick={handleResendSms}
              disabled={isLoading || isResending}
              sx={{ color: 'gray', flex: 1 }}
            >
              {isResending ? 'Resending...' : "Didn't get it? Resend"}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default SmsEnrollment;
