import { Box, Stack, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

function SiteFooter() {
  return (
    <Box
      sx={{
        zIndex: 2,

        position: "relative",
        borderTop: "2px solid #000000",
        backgroundColor: "black",
      }}
      paddingY={4}
      paddingX={2}
      display="flex"
      alignItems={"center"}
      justifyContent="space-between"
    >
      <Stack direction={"row"} gap={4}>
        <Typography variant="h4" sx={{ color: "white" }}>
          Company
        </Typography>
        <Typography variant="h4" sx={{ color: "white" }}>
          Help
        </Typography>
        <Typography variant="h4" sx={{ color: "white" }}>
          Find a store
        </Typography>
      </Stack>
      <Image src={"/socials.png"} alt="social" width={288} height={54} />
    </Box>
  );
}

export default SiteFooter;
