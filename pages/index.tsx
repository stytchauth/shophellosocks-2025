import { Box, Button, Link, Stack, Typography } from "@mui/material";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import zIndex from "@mui/material/styles/zIndex";
import { display } from "@mui/system";
import { green } from "@mui/material/colors";

const Home: NextPage = () => {
  return (
    <Box minHeight={"100vh"} display="flex" flexDirection={"column"}>
      <Head>
        <title>Hello Socks</title>
        <meta
          name="description"
          content="An ecommerce demo application powered by Stytch"
        />
      </Head>
      <header>
        <Box
          sx={{
            display: "flex",
            backgroundColor: "#ECFFF5",
            width: "100%",
            padding: "8px 24px",
            justifyContent: "center",
            flexGrow: 1,
          }}
        >
          <Typography>
            Hello Socks is a demo application created by Stytch. You can learn
            more about Stytch{" "}
            <Link
              target="_blank"
              rel="noopener"
              href="https://stytch.com/"
              sx={{
                color: "#19303D",
                fontWeight: 500,
                textDecorationColor: "#19303D",
              }}
            >
              here
            </Link>{" "}
            {" or "}{" "}
            <Link
              href="mailto:startups@stytch.com?subject=Contact Stytch via Hello Socks"
              sx={{
                color: "#19303D",
                fontWeight: 500,
                textDecorationColor: "#19303D",
              }}
            >
              contact us
            </Link>{" "}
            if you would like to talk to an auth expert.
          </Typography>
        </Box>
        <Box
          padding={3}
          display="flex"
          alignItems={"center"}
          justifyContent="space-between"
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
            <Typography variant="h3">Log in</Typography>
            <Box sx={{ borderLeft: "2px solid #5C727D" }} height="27px" />
            <SearchOutlinedIcon sx={{ fontSize: 32 }} />
            <Box sx={{ borderLeft: "2px solid #5C727D" }} height="27px" />
            <FavoriteBorderOutlinedIcon sx={{ fontSize: 32 }} />
            <Box sx={{ borderLeft: "2px solid #5C727D" }} height="27px" />
            <ShoppingCartOutlinedIcon sx={{ fontSize: 32 }} />
          </Stack>
        </Box>
      </header>

      <Box
        sx={{
          width: "100%",
          backgroundColor: "#FFD94A",
          flexGrow: 1,
          minHeight: "650px",
          borderTop: "2px solid #000000",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          height={"80%"}
          sx={{ backgroundColor: "white", zIndex: 2 }}
          display="flex"
        >
          <Box>
            <Typography>JUST DROPPED</Typography>
            <Typography>The lightest socks you can stomp around in.</Typography>
            <Box>
              <Typography>Explore the collection</Typography>
            </Box>
          </Box>
          <Box>
            <Typography>JUST DROPPED</Typography>
            <Typography>The lightest socks you can stomp around in.</Typography>
            <Box>
              <Typography>Explore the collection</Typography>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            height: 0,
            width: 0,
            border: "5vw solid transparent",
            borderTop: 0,
            borderBottom: "8vw solid #C7F1FF",
            transform: "rotate(33deg)",
            position: "absolute",
            left: "5%",
            top: 10,
          }}
        />
        <Box
          sx={{
            height: 0,
            width: 0,
            border: "5vw solid transparent",
            borderTop: 0,
            borderBottom: "12vw solid #C7F1FF",
            transform: "rotate(33deg)",
            position: "absolute",
            right: "25%",
            bottom: "5%",
          }}
        />
        <Box
          sx={{
            height: 0,
            width: 0,
            border: "15vw solid transparent",
            borderTop: 0,
            borderBottom: "18vw solid #FD4E43",
            transform: "rotate(33deg)",
            position: "absolute",
            right: "-4%",
            top: 10,
          }}
        />
        <Box
          sx={{
            height: 0,
            width: 0,
            border: "3vw solid transparent",
            borderTop: 0,
            borderBottom: "4vw solid #FD4E43",
            transform: "rotate(65deg)",
            position: "absolute",
            left: "30%",
            bottom: "10%",
          }}
        />
        <Box
          sx={{
            height: 0,
            width: 0,
            border: "15vw solid transparent",
            borderTop: 0,
            borderBottom: "30vw solid #FD4E43",
            transform: "rotate(10deg)",
            position: "absolute",
            left: "-20%",
            bottom: "10%",
          }}
        />
      </Box>

      <Box
        sx={{
          zIndex: 1,
          // backgroundColor: "#fff",
          position: "relative",
          borderTop: "2px solid #000000",
          backgroundColor: "black",
        }}
        paddingY={4}
        paddingX={2}
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
      </Box>
    </Box>
  );
};

export default Home;
