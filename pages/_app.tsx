import "../styles/globals.css";
import { createTheme, ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";
import { createStytchUIClient } from "@stytch/nextjs/ui";
import { StytchProvider } from "@stytch/nextjs";

const theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: "'IBM Plex Sans', sans-serif;",
      textTransform: "none",
      color: "#0D0000",
    },
    h1: {
      fontSize: "40px",
      lineHeight: "60px",
      fontWeight: 600,
    },
    h2: {
      fontSize: "30px",
      lineHeight: "40px",
      fontWeight: 600,
    },
    h3: {
      fontSize: "24px",
      lineHeight: "30px",
      fontWeight: 500,
      color: "#000000",
    },
    h4: {
      fontSize: "20px",
      lineHeight: "30px",
      fontWeight: 500,
    },
    h5: {
      fontSize: "14px",
      lineHeight: "30px",
      fontWeight: 300,
    },
    caption: {
      fontSize: 16,
      lineHeight: "20px",
    },
    body1: {
      fontSize: "18px",
      lineHeight: "25px",
      fontWeight: 400,
      color: "#19303D",
    },
    body2: {
      fontSize: "14px",
      lineHeight: "20px",
      fontWeight: 400,
    },
  },
});

const stytch = createStytchUIClient(
  process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN || ""
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <StytchProvider stytch={stytch}>
        <Component {...pageProps} />
      </StytchProvider>
    </ThemeProvider>
  );
}

export default MyApp;
