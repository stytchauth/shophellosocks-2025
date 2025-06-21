"use client";

import { Box, Typography, Button, Card, CardContent, Divider } from "@mui/material";
import { useState } from "react";

interface Order {
  order_id: string;
  sock_type: string;
  status: string;
}

interface OrderConfirmationProps {
  order: Order;
}

export default function OrderConfirmation({ order }: OrderConfirmationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedAction, setCompletedAction] = useState<string>("");

  const handleOrderAction = async (action: 'confirm' | 'deny') => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('/api/order/action', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          order_id: order.order_id,
          action 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsCompleted(true);
        setCompletedAction(action);
      } else {
        setError(data.error_message || `Failed to ${action} order`);
      }
    } catch (error) {
      console.error(`Error ${action}ing order:`, error);
      setError(`Failed to ${action} order. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Show completion message if order has been processed
  if (isCompleted) {
    return (
      <Box sx={{ textAlign: "center" }}>
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 2, 
            fontWeight: 600,
            color: completedAction === 'confirm' ? '#4CAF50' : '#FD4E43'
          }}
        >
          Order {completedAction === 'confirm' ? 'Confirmed' : 'Denied'}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 3,
            color: "#5C727D"
          }}
        >
          Your order has been successfully {completedAction}ed.
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            color: "#333"
          }}
        >
          You can now close this page.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Order Details Card */}
      <Card 
        sx={{ 
          mb: 3, 
          border: "1px solid #ddd",
          boxShadow: "none",
          borderRadius: 1
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Order Details
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Order ID
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {order.order_id}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Sock Type
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
              {order.sock_type}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Status
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 500,
                color: order.status === 'pending_confirmation' ? '#ff9800' : '#4caf50',
                textTransform: 'capitalize'
              }}
            >
              {order.status.replace('_', ' ')}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Typography 
          variant="body2" 
          sx={{ 
            color: "error.main", 
            mb: 2, 
            textAlign: "center",
            backgroundColor: "#ffebee",
            padding: 1,
            borderRadius: 1
          }}
        >
          {error}
        </Typography>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => handleOrderAction('deny')}
          disabled={isLoading}
          sx={{
            py: 1.5,
            borderColor: "#FD4E43",
            color: "#FD4E43",
            "&:hover": {
              borderColor: "#FD4E43",
              backgroundColor: "#FD4E43",
              color: "white"
            }
          }}
        >
          {isLoading ? "Processing..." : "Deny Order"}
        </Button>
        <Button
          variant="contained"
          fullWidth
          onClick={() => handleOrderAction('confirm')}
          disabled={isLoading}
          sx={{
            py: 1.5,
            backgroundColor: "#4CAF50",
            "&:hover": { backgroundColor: "#45a049" }
          }}
        >
          {isLoading ? "Processing..." : "Confirm Order"}
        </Button>
      </Box>
    </Box>
  );
}