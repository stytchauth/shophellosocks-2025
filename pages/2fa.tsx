import { Box, Typography } from "@mui/material";
import type { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { withAuth, AuthenticatedPageProps } from "../lib/ssrAuth";
import TwoFactorAuth from "../components/TwoFactorAuth";

interface TwoFactorAuthProps extends AuthenticatedPageProps {}

const TwoFactorAuthPage: NextPage<TwoFactorAuthProps> = ({ user }) => {
  return (
    <Box
      minHeight={"100vh"}
      display="flex"
      flexDirection={"column"}
      sx={{ backgroundColor: "#FFD94A" }}
    >
      <Head>
        <title>Two-Factor Authentication - Hello Socks</title>
        <meta
          name="description"
          content="Complete two-factor authentication"
        />
      </Head>

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
            border: "3vw solid transparent",
            borderTop: 0,
            borderBottom: "5vw solid #C7F1FF",
            transform: "rotate(45deg)",
            position: "absolute",
            left: "8%",
            top: "20%",
          }}
        />
        <Box
          sx={{
            height: 0,
            width: 0,
            border: "4vw solid transparent",
            borderTop: 0,
            borderBottom: "8vw solid #FD4E43",
            transform: "rotate(-30deg)",
            position: "absolute",
            right: "12%",
            top: "15%",
          }}
        />
        <Box
          sx={{
            height: 0,
            width: 0,
            border: "2vw solid transparent",
            borderTop: 0,
            borderBottom: "4vw solid #C7F1FF",
            transform: "rotate(70deg)",
            position: "absolute",
            left: "18%",
            bottom: "25%",
          }}
        />
        <Box
          sx={{
            height: 0,
            width: 0,
            border: "5vw solid transparent",
            borderTop: 0,
            borderBottom: "9vw solid #FD4E43",
            transform: "rotate(15deg)",
            position: "absolute",
            right: "6%",
            bottom: "20%",
          }}
        />

        {/* 2FA Content */}
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
              Two-Factor Authentication
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
              We&apos;ll send a verification code to your registered phone number
            </Typography>
          </Box>

          <TwoFactorAuth user={user} />
        </Box>
      </Box>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps<TwoFactorAuthProps> = withAuth();

export default TwoFactorAuthPage;