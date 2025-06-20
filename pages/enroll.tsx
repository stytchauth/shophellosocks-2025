import { Box, Typography } from "@mui/material";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import SmsEnrollment from "../components/SmsEnrollment";

const Enroll: NextPage = () => {
  return (
    <Box
      minHeight={"100vh"}
      display="flex"
      flexDirection={"column"}
      sx={{ backgroundColor: "#FFD94A" }}
    >
      <Head>
        <title>Enroll - Hello Socks</title>
        <meta
          name="description"
          content="Enroll with Hello Socks"
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
            border: "5vw solid transparent",
            borderTop: 0,
            borderBottom: "8vw solid #C7F1FF",
            transform: "rotate(-25deg)",
            position: "absolute",
            left: "12%",
            top: "18%",
          }}
        />
        <Box
          sx={{
            height: 0,
            width: 0,
            border: "3vw solid transparent",
            borderTop: 0,
            borderBottom: "6vw solid #FD4E43",
            transform: "rotate(55deg)",
            position: "absolute",
            right: "18%",
            top: "15%",
          }}
        />
        <Box
          sx={{
            height: 0,
            width: 0,
            border: "4vw solid transparent",
            borderTop: 0,
            borderBottom: "7vw solid #C7F1FF",
            transform: "rotate(-10deg)",
            position: "absolute",
            left: "8%",
            bottom: "30%",
          }}
        />
        <Box
          sx={{
            height: 0,
            width: 0,
            border: "6vw solid transparent",
            borderTop: 0,
            borderBottom: "11vw solid #FD4E43",
            transform: "rotate(35deg)",
            position: "absolute",
            right: "12%",
            bottom: "20%",
          }}
        />

        {/* Placeholder Content */}
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
              Secure Your Account
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
              Add an extra layer of security with SMS two-factor authentication
            </Typography>
          </Box>

          <SmsEnrollment />
        </Box>
      </Box>
    </Box>
  );
};

export default Enroll;