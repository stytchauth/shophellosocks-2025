import { Box, Button, Link, Stack, Typography } from "@mui/material";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import LoginBackdrop from "../components/LoginBackdrop";
import { useState } from "react";
import Header from "../components/Header";
import SideNavCart from "../components/SideNavCart";
import Fade from "@mui/material/Fade";
import { useStytchUser } from "@stytch/nextjs";
import StytchMessage from "../components/StytchMessage";
import SiteFooter from "../components/SiteFooter";

const Home: NextPage = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { user } = useStytchUser();
  // Post user intentionally logging out to trigger an embeddable magic link email
  const [demoLogoutUX, showDemoLogoutUx] = useState(false);

  return (
    <Box minHeight={"100vh"} display="flex" flexDirection={"column"}>
      <Head>
        <title>Hello Socks</title>
        <meta
          name="description"
          content="An ecommerce demo application powered by Stytch"
        />
      </Head>
      <LoginBackdrop open={loginOpen} onDismiss={() => setLoginOpen(false)} />
      {!user && !demoLogoutUX && (
        <StytchMessage delay={1500} top={100} right="5%">
          <>
            <Typography mb={2} variant="body2">
              Hello socks is a demo application created by Stytch, demonstrating{" "}
              <Link
                color="inherit"
                sx={{ fontWeight: 500 }}
                href="https://stytch.com/products/email-magic-links"
                target="_blank"
              >
                Email Magic Links
              </Link>
              ,{" "}
              <Link
                color="inherit"
                sx={{ fontWeight: 500 }}
                target="_blank"
                href="https://stytch.com/products/oauth"
              >
                OAuth
              </Link>
              , and{" "}
              <Link
                color="inherit"
                sx={{ fontWeight: 500 }}
                target="_blank"
                href="https://stytch.com/products/magic-links"
              >
                Embeddable Magic Links
              </Link>
              .
            </Typography>
            <Typography variant="body2">
              {`Click the "Log in" button to see these in action.`}
            </Typography>
          </>
        </StytchMessage>
      )}
      {user && (
        <StytchMessage delay={1750} left={"1%"} top={100}>
          <>
            <Typography mb={2} variant="body2">
              Improve conversions up to 300%. By embedding tokens into your
              email, SMS, or other marketing campaign CTAs, users can jump back
              into your platform without having to re-authenticate. Learn more
              about{" "}
              <Link
                color="inherit"
                sx={{ fontWeight: 500 }}
                target="_blank"
                href="https://stytch.com/products/magic-links"
              >
                Embeddable Magic Links
              </Link>
              .
            </Typography>
            <Typography variant="body2">
              {`Click the “Log out” button to see this in action. You'll receive an embeddable magic link at `}
              <Typography
                component={"span"}
                variant="body2"
                sx={{ fontWeight: 500 }}
              >
                {`${user.emails[0].email}`}
              </Typography>
              <Typography component={"span"} variant="body2">
                .
              </Typography>
            </Typography>
          </>
        </StytchMessage>
      )}
      {!user && demoLogoutUX && (
        <StytchMessage delay={1750} left={"1%"} top={100}>
          <>
            <Typography mb={2} variant="body2">
              You are logged out!!!
              <Link
                color="inherit"
                sx={{ fontWeight: 500 }}
                target="_blank"
                href="https://stytch.com/products/magic-links"
              >
                Embeddable Magic Links
              </Link>
              .
            </Typography>
            <Typography variant="body2">
              {`Click the “Log out” button to see this in action. You'll receive an embeddable magic link at `}
              <Typography
                component={"span"}
                variant="body2"
                sx={{ fontWeight: 500 }}
              >
                d
              </Typography>
              <Typography component={"span"} variant="body2">
                .
              </Typography>
            </Typography>
          </>
        </StytchMessage>
      )}
      <Header
        onLogin={() => setLoginOpen(true)}
        onCartClick={() => setCartOpen(!cartOpen)}
        onLogout={async () => {
          await fetch("/api/send_magic_link", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          });
        }}
      />

      {user && <SideNavCart onDismiss={() => setCartOpen(false)} />}

      <Box
        sx={{
          width: "100%",
          backgroundColor: "#FFD94A",
          minHeight: "650px",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflowX: "hidden",
        }}
      >
        <Box
          sx={{ zIndex: 1 }}
          display="flex"
          alignItems={"center"}
          width="100%"
          maxWidth="1500px"
          justifyContent={"space-around"}
        >
          <Box width={350}>
            <Typography
              sx={{ fontSize: 22, lineHeight: "30px", fontWeight: 500 }}
            >
              JUST DROPPED
            </Typography>
            <Typography
              mt={2}
              sx={{ fontSize: 40, lineHeight: "50px", fontWeight: 600 }}
            >
              The lightest socks you can stomp around in.
            </Typography>
            <Box
              sx={{
                border: "2px solid black",
                backgroundColor: "white",
                boxShadow: "0px 3px 0px #000",
              }}
              paddingY={1}
              paddingX={2}
              width="fit-content"
            >
              <Typography
                sx={{ fontSize: 18, lineHeight: "31.5px", fontWeight: 600 }}
              >
                Explore the collection
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{ backgroundColor: "white", border: "2px solid black" }}
            padding={3}
          >
            <Image src={"/orange.png"} alt="socks" width={515} height={434} />
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
        sx={{ backgroundColor: "white", zIndex: 1 }}
        paddingY={4}
        paddingX={12}
        alignItems="center"
        display={"flex"}
        width="100%"
        flexDirection={"column"}
        flexGrow={1}
      >
        <Box maxWidth={"1500px"} width="100%">
          <Typography variant="h2">Hello Socks IRL</Typography>
          <Typography variant="h4">
            Tag @hellosocks to be featured here!
          </Typography>
          <Stack
            direction={"row"}
            mt={2}
            alignItems="center"
            justifyContent={"space-between"}
            gap={2}
            flexWrap="wrap"
          >
            <Image src={"/tennis.png"} alt="socks" width={275} height={275} />
            <Image src={"/golf.png"} alt="socks" width={275} height={275} />
            <Image src={"/rainbow.png"} alt="socks" width={275} height={275} />
            <Image src={"/camp.png"} alt="socks" width={275} height={275} />
            <ArrowForwardIosIcon sx={{ fontSize: 32 }} />
          </Stack>
        </Box>
      </Box>
      <SiteFooter />
    </Box>
  );
};

export default Home;
