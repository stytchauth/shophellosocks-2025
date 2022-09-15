import { Badge, Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Image from "next/image";
import { useStytch, useStytchUser } from "@stytch/nextjs";

type Props = {
  onLogin: () => void;
};
function Header({ onLogin }: Props) {
  const { user } = useStytchUser();
  const stytch = useStytch();
  return (
    <Box
      paddingX={3}
      paddingY={2}
      display="flex"
      alignItems={"center"}
      justifyContent="space-between"
      sx={{ backgroundColor: "white", zIndex: 2 }}
    >
      <Stack direction="row" gap={4}>
        <Image src={"/logo.svg"} alt="logo" width={160} height={30} />
        <Typography variant="h3">Socks</Typography>
        <Typography variant="h3">Kids</Typography>
        <Typography variant="h3">Gifts</Typography>
        <Typography variant="h3">Featured</Typography>
        <Typography variant="h3">Community</Typography>
      </Stack>
      <Stack gap={2} direction="row" alignItems={"center"}>
        {user ? (
          <Button onClick={() => stytch.session.revoke()}>
            <Typography variant="h3">Log out</Typography>
          </Button>
        ) : (
          <Button onClick={onLogin}>
            <Typography variant="h3">Log in</Typography>
          </Button>
        )}

        <Box sx={{ borderLeft: "2px solid #5C727D" }} height="27px" />
        <SearchOutlinedIcon sx={{ fontSize: 32, color: "#000" }} />
        <Box sx={{ borderLeft: "2px solid #5C727D" }} height="27px" />
        <FavoriteBorderOutlinedIcon sx={{ fontSize: 32, color: "#000" }} />
        <Box sx={{ borderLeft: "2px solid #5C727D" }} height="27px" />
        {user ? (
          <Button>
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
          </Button>
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
