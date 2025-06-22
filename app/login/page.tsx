import { Box, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "../../components/LoginForm";

export default function Login() {
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
            borderBottom: "6vw solid #C7F1FF",
            transform: "rotate(33deg)",
            position: "absolute",
            left: "10%",
            top: "15%",
          }}
        />
        <Box
          sx={{
            height: 0,
            width: 0,
            border: "3vw solid transparent",
            borderTop: 0,
            borderBottom: "8vw solid #FD4E43",
            transform: "rotate(-20deg)",
            position: "absolute",
            right: "15%",
            top: "20%",
          }}
        />
        <Box
          sx={{
            height: 0,
            width: 0,
            border: "2vw solid transparent",
            borderTop: 0,
            borderBottom: "3vw solid #C7F1FF",
            transform: "rotate(65deg)",
            position: "absolute",
            left: "20%",
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
            transform: "rotate(10deg)",
            position: "absolute",
            right: "5%",
            bottom: "15%",
          }}
        />

        {/* Login Form Container */}
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
              Welcome Back!
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                textAlign: "center",
                color: "#5C727D",
                fontSize: 16
              }}
            >
              Sign in to your Hello Socks account
            </Typography>
          </Box>

          <LoginForm />

          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography variant="body2" sx={{ color: "#5C727D" }}>
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" style={{ color: "#000", fontWeight: 500 }}>
                Sign up here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}