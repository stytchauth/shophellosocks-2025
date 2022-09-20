import { Box, Fade, Link, Typography } from "@mui/material";
import React, { useState } from "react";

type Props = {
  delay: number;
  top?: string | number;
  left?: string | number;
  right?: string | number;
  bottom?: string | number;
  children: JSX.Element;
};

function StytchMessage({ delay, top, left, right, bottom, children }: Props) {
  const [open, setOpen] = useState(false);

  setTimeout(() => {
    setOpen(true);
  }, delay);

  return (
    <Fade in={open}>
      <Box
        paddingX={6}
        paddingY={3}
        sx={{
          backgroundColor: "white",
          position: "fixed",
          top,
          left,
          right,
          bottom,
          //   top: 100,
          //   right: "5%",
          zIndex: 10,
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
  );
}

export default StytchMessage;
