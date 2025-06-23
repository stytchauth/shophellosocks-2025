import { Box, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showIcon?: boolean;
}

const triangles = [
  {
    border: "5vw solid transparent",
    borderBottom: "8vw solid #C7F1FF",
    transform: "rotate(-25deg)",
    left: "12%",
    top: "18%",
  },
  {
    border: "3vw solid transparent", 
    borderBottom: "6vw solid #FD4E43",
    transform: "rotate(55deg)",
    right: "18%",
    top: "15%",
  },
  {
    border: "4vw solid transparent",
    borderBottom: "7vw solid #C7F1FF", 
    transform: "rotate(-10deg)",
    left: "8%",
    bottom: "30%",
  },
  {
    border: "6vw solid transparent",
    borderBottom: "11vw solid #FD4E43",
    transform: "rotate(35deg)",
    right: "12%",
    bottom: "20%",
  }
];

export default function PageLayout({ 
  children, 
  title, 
  subtitle, 
  showIcon = true
}: PageLayoutProps) {

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
        {triangles.map((triangle, index) => (
          <Box
            key={index}
            sx={{
              height: 0,
              width: 0,
              borderTop: 0,
              position: "absolute",
              ...triangle,
            }}
          />
        ))}

        {/* Content Container */}
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
          display="flex" flexDirection="column" alignItems="center"
        >
          {/* Header Section */}
          {(title || subtitle || showIcon) && (
            <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
              {showIcon && (
                <Image src="/icon.png" alt="sock" width={50} height={63} />
              )}
              {title && (
                <Typography 
                  variant="h2" 
                  sx={{ 
                    fontSize: 32, 
                    fontWeight: 600, 
                    textAlign: "center",
                    mt: showIcon ? 2 : 0,
                    mb: 1
                  }}
                >
                  {title}
                </Typography>
              )}
              {subtitle && (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    textAlign: "center",
                    color: "#5C727D",
                    fontSize: 16,
                    mb: 3
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
          )}

          {/* Page Content */}
          {children}
        </Box>
      </Box>
    </Box>
  );
}