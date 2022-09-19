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
import { useStytch, useStytchUser } from "@stytch/nextjs";
import AnimatedButton from "./AnimatedButton";

type Props = {
  onLogin: () => void;
};

function Header({ onLogin }: Props) {
  const { user } = useStytchUser();
  const stytch = useStytch();
  const theme = useTheme();
  const showNav = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <Box
      paddingX={3}
      paddingY={2}
      display="flex"
      alignItems={"center"}
      justifyContent="space-between"
      sx={{ backgroundColor: "white", zIndex: 2 }}
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
        {user ? (
          <Button onClick={() => stytch.session.revoke()}>
            <Typography variant="h3">Log out</Typography>
          </Button>
        ) : (
          <AnimatedButton onClick={onLogin}>
            <Typography variant="h3">Log in</Typography>
          </AnimatedButton>
        )}

        <Box sx={{ borderLeft: "2px solid #5C727D" }} height="27px" />
        <SearchOutlinedIcon sx={{ fontSize: 32, color: "#000" }} />
        <Box sx={{ borderLeft: "2px solid #5C727D" }} height="27px" />
        <FavoriteBorderOutlinedIcon sx={{ fontSize: 32, color: "#000" }} />
        <Box sx={{ borderLeft: "2px solid #5C727D" }} height="27px" />
        {user ? (
          <AnimatedButton>
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
          </AnimatedButton>
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
