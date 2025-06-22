import { Box, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "../../components/LoginForm";

export default function SignUp() {
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
        {/* Background decorative triangles - different positioning from login */}
        <Box
          sx={{
            height: 0,
            width: 0,
            border: "6vw solid transparent",
            borderTop: 0,
            borderBottom: "9vw solid #C7F1FF",
            transform: "rotate(-15deg)",
            position: "absolute",
            left: "5%",
            top: "10%",
          }}
        />
        <Box
          sx={{
            height: 0,
            width: 0,
            border: "4vw solid transparent",
            borderTop: 0,
            borderBottom: "7vw solid #FD4E43",
            transform: "rotate(45deg)",
            position: "absolute",
            right: "10%",
            top: "25%",
          }}
        />
        <Box
          sx={{
            height: 0,
            width: 0,
            border: "3vw solid transparent",
            borderTop: 0,
            borderBottom: "5vw solid #FD4E43",
            transform: "rotate(-45deg)",
            position: "absolute",
            left: "15%",
            bottom: "20%",
          }}
        />
        <Box
          sx={{
            height: 0,
            width: 0,
            border: "7vw solid transparent",
            borderTop: 0,
            borderBottom: "12vw solid #C7F1FF",
            transform: "rotate(25deg)",
            position: "absolute",
            right: "8%",
            bottom: "10%",
          }}
        />

        {/* Sign Up Form Container */}
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
              Join Hello Socks!
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                textAlign: "center",
                color: "#5C727D",
                fontSize: 16
              }}
            >
              Create your account and start shopping for the perfect socks
            </Typography>
          </Box>

          <LoginForm />

          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography variant="body2" sx={{ color: "#5C727D" }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color: "#000", fontWeight: 500 }}>
                Sign in here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}