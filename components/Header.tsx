import {
  Badge,
  Box,
  Button,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  styled,
} from "@mui/material";
import React from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Image from "next/image";
import Link from "next/link";
import { useStytch, useStytchUser } from "@stytch/nextjs";
import AnimatedButton from "./AnimatedButton";
import SideNavCart from "./SideNavCart";

type Props = {
  onLogin?: () => void;
  onLogout?: () => void;
  onCartClick?: () => void;
  disablePrimaryButton?: boolean;
  useAuthedHeader: boolean;
  animatePrimaryButton?: boolean;
};

function Header({
  animatePrimaryButton,
  useAuthedHeader,
  onCartClick,
  onLogin,
  onLogout,
  disablePrimaryButton,
}: Props) {
  const theme = useTheme();
  const showNav = useMediaQuery(theme.breakpoints.up("lg"));

  const showNavButtons = useMediaQuery(theme.breakpoints.up("sm"));
  return (
    <Box
      paddingX={3}
      paddingY={2}
      display="flex"
      alignItems={"center"}
      justifyContent="space-between"
      sx={{
        backgroundColor: "white",
        zIndex: 2,
        borderBottom: "2px solid #000000",
      }}
      position="fixed"
      top={0}
      zIndex={5}
      width="100%"
    >
      <Box display="flex">
        <Image src={"/logo.svg"} alt="logo" width={160} height={30} />
        {showNav && (
          <Stack direction="row" gap={4} ml={4}>
            <Typography variant="h3">Socks</Typography>
            <Typography variant="h3">Kids</Typography>
            <Typography variant="h3">Gifts</Typography>
            <Typography variant="h3">Featured</Typography>
            <Typography variant="h3">Community</Typography>
          </Stack>
        )}
      </Box>

      <Stack gap={2} direction="row" alignItems={"center"}>
        {useAuthedHeader ? (
          animatePrimaryButton ? (
            <AnimatedButton
              disabled={disablePrimaryButton}
              onClick={onLogout}
            >
              <Typography variant="h3" sx={{ whiteSpace: "nowrap" }}>
                Log out
              </Typography>
            </AnimatedButton>
          ) : (
            <Button
              disabled={disablePrimaryButton}
              onClick={onLogout}
            >
              <Typography variant="h3">
                Log out
              </Typography>
            </Button>
          )
        ) : (
          animatePrimaryButton ? (
            <Link href="/login" passHref>
              <AnimatedButton
                disabled={disablePrimaryButton}
              >
                <Typography variant="h3" sx={{ whiteSpace: "nowrap" }}>
                  Log in
                </Typography>
              </AnimatedButton>
            </Link>
          ) : (
            <Link href="/login" passHref>
              <Button
                disabled={disablePrimaryButton}
              >
                <Typography variant="h3">
                  Log in
                </Typography>
              </Button>
            </Link>
          )
        )}

        <Box sx={{ borderLeft: "2px solid #5C727D" }} height="27px" />
        {showNavButtons && (
          <>
            <SearchOutlinedIcon sx={{ fontSize: 32, color: "#000" }} />
            <Box sx={{ borderLeft: "2px solid #5C727D" }} height="27px" />
          </>
        )}
        {showNavButtons && (
          <>
            <FavoriteBorderOutlinedIcon sx={{ fontSize: 32, color: "#000" }} />
            <Box sx={{ borderLeft: "2px solid #5C727D" }} height="27px" />
          </>
        )}

        {useAuthedHeader ? (
          <Badge
            overlap="circular"
            badgeContent={2}
            color="error"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <ShoppingCartOutlinedIcon sx={{ fontSize: 32, color: "#000" }} />
          </Badge>
        ) : (
          <Button>
            <ShoppingCartOutlinedIcon sx={{ fontSize: 32, color: "#000" }} />
          </Button>
        )}
      </Stack>
    </Box>
  );
}

export default Header;
