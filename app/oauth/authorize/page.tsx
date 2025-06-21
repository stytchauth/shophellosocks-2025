import { Box, Typography } from "@mui/material";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {requireAuth} from "../../../lib/auth-server";
import {IdentityProvider} from "../../../components/IdentityProvider";

export const metadata: Metadata = {
  title: "Authorize - Hello Socks",
  description: "Authorize with Hello Socks",
};

export default async function OAuthAuthorizationPage() {
  await requireAuth();
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
            transform: "rotate(-15deg)",
            position: "absolute",
            left: "10%",
            top: "22%",
          }}
        />
        <Box
          sx={{
            height: 0,
            width: 0,
            border: "3vw solid transparent",
            borderTop: 0,
            borderBottom: "6vw solid #FD4E43",
            transform: "rotate(40deg)",
            position: "absolute",
            right: "15%",
            top: "18%",
          }}
        />
        <Box
          sx={{
            height: 0,
            width: 0,
            border: "2vw solid transparent",
            borderTop: 0,
            borderBottom: "5vw solid #C7F1FF",
            transform: "rotate(65deg)",
            position: "absolute",
            left: "12%",
            bottom: "28%",
          }}
        />
        <Box
          sx={{
            height: 0,
            width: 0,
            border: "5vw solid transparent",
            borderTop: 0,
            borderBottom: "10vw solid #FD4E43",
            transform: "rotate(20deg)",
            position: "absolute",
            right: "8%",
            bottom: "22%",
          }}
        />

        {/* Authorization Content */}
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
          maxWidth={500}
          width="100%"
          mx={3}
        >
          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <Image src="/icon.png" alt="sock" width={50} height={63} />
          </Box>

          <IdentityProvider />
        </Box>
      </Box>
    </Box>
  );
}
