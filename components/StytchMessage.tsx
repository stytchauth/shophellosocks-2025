import { Box, Fade, Link, Typography } from "@mui/material";
import React, { useState } from "react";

type Props = {
  delay: number;
  location: "top-l" | "top-r" | "btm-l" | "btm-r";
  children: JSX.Element;
};

function StytchMessage({ delay, location, children }: Props) {
  const [open, setOpen] = useState(false);

  setTimeout(() => {
    setOpen(true);
  }, delay);

  return (
    <Box
      display="flex"
      width="100%"
      sx={{
        position: "fixed",
        zIndex: 100,
        top: ["top-r", "top-l"].includes(location) ? 100 : undefined,
        bottom: ["btm-r", "btm-l"].includes(location) ? 100 : undefined,
      }}
      justifyContent={
        ["top-r", "bottom-r"].includes(location) ? "flex-end" : "flex-start"
      }
      paddingX={4}
    >
      <Fade in={open}>
        <Box
          paddingX={6}
          paddingY={3}
          sx={{
            backgroundColor: "white",

            //   top: 100,
            //   right: "5%",
            zIndex: 100,
            boxShadow:
              "0px 11px 15px -7px rgba(0, 0, 0, 0.2),  0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12)",
            borderRadius: "10px",
          }}
          maxWidth={"600px"}
        >
          <Typography mb={1} variant="h4" sx={{ color: "#19303D" }}>
            From Stytch
          </Typography>
          <>{children}</>
        </Box>
      </Fade>
    </Box>
  );
}

export default StytchMessage;
