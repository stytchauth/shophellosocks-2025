import { Backdrop, Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import { StytchLogin } from "@stytch/nextjs";
import {
  StytchLoginConfig,
  OAuthProviders,
  OneTapPositions,
  Products,
  StyleConfig,
} from "@stytch/vanilla-js";
import { getDomainFromWindow } from "../lib/urlUtils";
import { Stack } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";

type Props = {
  open: boolean;
  onDismiss: () => void;
};

const sdkStyle: StyleConfig = {
  fontFamily: '"Helvetica New", Helvetica, sans-serif',
  primaryColor: "#000000",
  primaryTextColor: "#FFFFFF",
  hideHeaderText: true,
};

const sdkConfig: StytchLoginConfig = {
  products: [Products.oauth, Products.emailMagicLinks],
  emailMagicLinksOptions: {
    loginRedirectURL: getDomainFromWindow() + "/authenticate",
    loginExpirationMinutes: 30,
    signupRedirectURL: getDomainFromWindow() + "/authenticate",
    signupExpirationMinutes: 30,
    createUserAsPending: false,
  },
  oauthOptions: {
    providers: [
      { type: OAuthProviders.Google },
      { type: OAuthProviders.Facebook },
      { type: OAuthProviders.Apple },
    ],
    loginRedirectURL: getDomainFromWindow() + "/authenticate",
    signupRedirectURL: getDomainFromWindow() + "/authenticate",
  },
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
          <Box width={"32px"}></Box>
        </Stack>
        <Image src="/smile.png" alt="smile!" width={53} height={53} />
        <Box paddingX={8} mt={3}>
          <StytchLogin config={sdkConfig} styles={sdkStyle} />
        </Box>
      </Box>
    </Backdrop>
  );
}

export default LoginBackdrop;
