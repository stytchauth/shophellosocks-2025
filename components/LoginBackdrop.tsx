import { Backdrop, Box, Button, Typography } from "@mui/material";
import React from "react";
import { Stack } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import LoginForm from "./LoginForm";

type Props = {
  open: boolean;
  onDismiss: () => void;
};

function LoginBackdrop({ open, onDismiss }: Props) {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <Box
        sx={{ backgroundColor: "white" }}
        display="flex"
        flexDirection={"column"}
        alignItems={"center"}
        paddingX={4}
        paddingY={4}
      >
        <Stack
          direction={"row"}
          justifyContent="space-between"
          display={"flex"}
          width="100%"
          mb={2}
          alignItems="center"
        >
          <Button onClick={onDismiss}>
            <CloseIcon sx={{ color: "black", fontSize: 32 }} />
          </Button>

          <Typography variant="h3">SIGN UP OR LOG IN</Typography>
          <Box width={"44px"}></Box>
        </Stack>
        <Image src="/icon.png" alt="sock" width={37} height={47} />
        <Box paddingX={8} mt={3}>
          <LoginForm />
        </Box>
      </Box>
    </Backdrop>
  );
}

export default LoginBackdrop;
