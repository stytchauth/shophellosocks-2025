"use client";

import { ThemeProvider } from "@mui/material";
import { createStytchUIClient } from "@stytch/nextjs/ui";
import { StytchProvider } from "@stytch/nextjs";
import { theme } from "./theme";

const stytch = createStytchUIClient(
  process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN || ""
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <StytchProvider stytch={stytch}>
        {children}
      </StytchProvider>
    </ThemeProvider>
  );
}