import { Box, Typography, Button, Card, CardContent, Divider } from "@mui/material";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { requireAuth } from "../../lib/auth-server";
import { redirect } from "next/navigation";
import loadStytch from "../../lib/stytchClient";
import OrderConfirmation from "../../components/OrderConfirmation";

export const metadata: Metadata = {
  title: "Confirm Order - Hello Socks",
  description: "Confirm your sock order",
};

interface SearchParams {
  order_id?: string;
  action?: string;
}

export default async function ConfirmOrderPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { user } = await requireAuth();
  
  if (!searchParams.order_id || !searchParams.action) {
    redirect('/');
  }

  // Get the order from user's trusted metadata
  const stytchClient = loadStytch();
  const userData = await stytchClient.users.get({ user_id: user.user_id });
  const orders = userData.trusted_metadata?.orders || [];
  const order = orders.find((o: any) => o.order_id === searchParams.order_id);

  if (!order) {
    redirect('/');
  }

  return (
    <Box
      minHeight={"100vh"}
      display="flex"
      flexDirection={"column"}
      sx={{ backgroundColor: "#FFD94A" }}
    >
      {/* Header */}
      <Box
        paddingX={3}
        paddingY={2}
        display="flex"
        alignItems={"center"}
        justifyContent="space-between"
        sx={{
          backgroundColor: "white",
          borderBottom: "2px solid #000000",
        }}
      >
        <Link href="/">
          <Image src={"/logo.svg"} alt="logo" width={160} height={30} />
        </Link>
      </Box>

      {/* Main Content */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexGrow={1}
        paddingY={4}
        sx={{ position: "relative", overflowX: "hidden" }}
      >
        {/* Background decorative triangles */}
        <Box
          sx={{
            height: 0,
            width: 0,
            border: "4vw solid transparent",
            borderTop: 0,
            borderBottom: "7vw solid #C7F1FF",
            transform: "rotate(-20deg)",
            position: "absolute",
            left: "8%",
            top: "25%",
          }}
        />
        <Box
          sx={{
            height: 0,
            width: 0,
            border: "3vw solid transparent",
            borderTop: 0,
            borderBottom: "6vw solid #FD4E43",
            transform: "rotate(45deg)",
            position: "absolute",
            right: "12%",
            top: "20%",
          }}
        />
        <Box
          sx={{
            height: 0,
            width: 0,
            border: "2vw solid transparent",
            borderTop: 0,
            borderBottom: "5vw solid #C7F1FF",
            transform: "rotate(70deg)",
            position: "absolute",
            left: "15%",
            bottom: "25%",
          }}
        />
        <Box
          sx={{
            height: 0,
            width: 0,
            border: "5vw solid transparent",
            borderTop: 0,
            borderBottom: "10vw solid #FD4E43",
            transform: "rotate(15deg)",
            position: "absolute",
            right: "6%",
            bottom: "20%",
          }}
        />

        {/* Order Confirmation Content */}
        <Box
          sx={{
            backgroundColor: "white",
            border: "2px solid black",
            boxShadow: "0px 6px 0px #000",
            zIndex: 1,
            borderRadius: 0,
          }}
          paddingX={6}
          paddingY={4}
          maxWidth={600}
          width="100%"
          mx={3}
        >
          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <Image src="/icon.png" alt="sock" width={50} height={63} />
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: 32, 
                fontWeight: 600, 
                textAlign: "center",
                mt: 2,
                mb: 1
              }}
            >
              Confirm Your Order
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                textAlign: "center",
                color: "#5C727D",
                fontSize: 16,
                mb: 3
              }}
            >
              Please review and confirm your sock order details below
            </Typography>
          </Box>

          <OrderConfirmation order={order} />
        </Box>
      </Box>
    </Box>
  );
}