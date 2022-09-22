import { Box, Link, Stack, Typography } from "@mui/material";
import { NextPage } from "next";
import Header from "../components/Header";
import SiteFooter from "../components/SiteFooter";
import ProductEntry from "../components/ProductEntry";
import { useStytch, useStytchUser } from "@stytch/nextjs";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import StytchMessage from "../components/StytchMessage";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

enum TOKEN_AUTH_STATES {
  INIT,
  SUCCESS,
  FAILED_TO_AUTH,
  FOUND_USER,
}

const Cart: NextPage = () => {
  const { user, isInitialized } = useStytchUser();
  const [tokenAuth, setTokenAuth] = useState(TOKEN_AUTH_STATES.INIT);
  const stytch = useStytch();
  const router = useRouter();

  useEffect(() => {
    const authToken = async () => {
      if (router && stytch && isInitialized && !user) {
        if (!router.isReady) return;
        const token = router?.query?.token?.toString();
        if (token && tokenAuth === TOKEN_AUTH_STATES.INIT) {
          try {
            await stytch.magicLinks.authenticate(token, {
              session_duration_minutes: 60 * 24,
            });
            setTokenAuth(TOKEN_AUTH_STATES.SUCCESS);
          } catch (e) {
            console.error(e);
            setTokenAuth(TOKEN_AUTH_STATES.FAILED_TO_AUTH);
          }
        } else {
          console.error("Missing token in query parameters");
          setTokenAuth(TOKEN_AUTH_STATES.FAILED_TO_AUTH);
        }
      }
    };

    authToken();
  }, [router, stytch, isInitialized, user, tokenAuth]);

  if (!user && tokenAuth === TOKEN_AUTH_STATES.INIT) return null;
  else if (!user && tokenAuth === TOKEN_AUTH_STATES.FAILED_TO_AUTH)
    return (
      <Box
        minHeight={"100vh"}
        display="flex"
        flexDirection={"column"}
        justifyContent="center"
        alignItems={"center"}
        sx={{ backgroundColor: "rgba(255, 217, 74, 1)" }}
      >
        <Typography variant="h2">
          Something went wrong. The link you used may be expired, or already
          have been used.{" "}
          <Link color="inherit" href="/">
            Click here to start over
          </Link>
          .
        </Typography>
      </Box>
    );
  else
    return (
      <Box minHeight={"100vh"} display="flex" flexDirection={"column"}>
        <StytchMessage delay={1500} bottom={"1%"} left={"1%"}>
          <>
            <Typography mb={2} variant="body2">
              You are now logged back in via an{" "}
              <Link
                color="inherit"
                sx={{ fontWeight: 500 }}
                target="_blank"
                href="https://stytch.com/products/magic-links"
              >
                Embeddable Magic Link
              </Link>
              . Learn more through our{" "}
              <Link
                color="inherit"
                sx={{ fontWeight: 500 }}
                target="_blank"
                href="https://stytch.com/docs/magic-links"
              >
                docs
              </Link>
              .
            </Typography>
            <Typography variant="body2">
              <Link
                color="inherit"
                sx={{ fontWeight: 500 }}
                href="mailto:startups@stytch.com?subject=Contact Stytch via Hello Socks"
              >
                Contact us
              </Link>{" "}
              if you would like to talk to an auth export, or learn more about{" "}
              <Link
                color="inherit"
                sx={{ fontWeight: 500 }}
                target="_blank"
                href="https://stytch.com"
              >
                Stytch
              </Link>
              .
            </Typography>
          </>
        </StytchMessage>
        <Header
          onCartClick={() => {}}
          onLogin={() => {}}
          onLogout={async () => {
            await stytch.session.revoke();
            router.push("/");
          }}
          useAuthedHeader={true}
        />
        <Box
          display={"flex"}
          flexGrow={1}
          sx={{ backgroundColor: "rgba(255, 217, 74, 1)" }}
          padding={2}
          flexWrap="wrap"
        >
          <Stack flexGrow={1} gap={2} mb={2}>
            <Box
              sx={{ backgroundColor: "white", border: "2px solid #000000" }}
              padding={2}
            >
              <Box display={"flex"} alignItems="center" mb={1}>
                <CheckCircleOutlineIcon
                  sx={{ fontSize: "32px", color: "#179F97" }}
                />
                <Typography variant="h2" ml={1}>
                  Contact information
                </Typography>
              </Box>

              <Box display={"flex"} alignItems="center" mb={1}>
                <Box sx={{ width: "32px" }} />
                <Typography
                  ml={1}
                >{`Email: ${user?.emails[0].email}`}</Typography>
              </Box>
            </Box>
            <Box
              sx={{ backgroundColor: "white", border: "2px solid #000000" }}
              padding={2}
              display="flex"
              justifyContent={"space-between"}
              alignItems="center"
            >
              <Box display={"flex"} alignItems="center">
                <CheckCircleOutlineIcon
                  sx={{ fontSize: "32px", color: "#179F97" }}
                />
                <Typography variant="h2" ml={1}>
                  Shipping
                </Typography>
              </Box>
              <ArrowForwardIosIcon sx={{ fontSize: "32px" }} />
            </Box>
            <Box
              sx={{ backgroundColor: "white", border: "2px solid #000000" }}
              padding={2}
              display="flex"
              justifyContent={"space-between"}
              alignItems="center"
            >
              <Box display={"flex"} alignItems="center">
                <CheckCircleOutlineIcon
                  sx={{ fontSize: "32px", color: "#179F97" }}
                />
                <Typography variant="h2" ml={1}>
                  Payment method
                </Typography>
              </Box>
              <ArrowForwardIosIcon sx={{ fontSize: "32px" }} />
            </Box>
          </Stack>
          {/* Cart */}
          <Box
            sx={{ backgroundColor: "white", border: "2px solid #000000" }}
            padding={2}
            width={"100%"}
            maxWidth={"500px"}
            ml={2}
          >
            <Typography mb={2} variant="h2">
              Cart (2)
            </Typography>
            <Stack gap={2}>
              <ProductEntry
                name="Ada Socks"
                color="GREY"
                image="/cart/gray.png"
              />
              <ProductEntry
                name="Shelby Socks"
                color="PURPLE"
                image="/cart/pink.png"
              />
            </Stack>
            <Box
              display={"flex"}
              marginY={4}
              sx={{ borderBottom: "2px solid #e5e8eb" }}
            />
            <Stack>
              <Box display="flex" justifyContent={"space-between"}>
                <Typography variant="h4">Subtotal</Typography>
                <Typography variant="h4">$30.00</Typography>
              </Box>
              <Box display="flex" justifyContent={"space-between"}>
                <Typography variant="h4">Tax</Typography>
                <Typography variant="h4">$2.60</Typography>
              </Box>
              <Box display="flex" justifyContent={"space-between"}>
                <Typography variant="h4">Shipping</Typography>
                <Typography variant="h4">Free</Typography>
              </Box>

              <Box mt={2} display="flex" justifyContent={"space-between"}>
                <Typography variant="h3">Total</Typography>
                <Typography variant="h3">$32.60</Typography>
              </Box>
            </Stack>
            <Box mt={4} display={"flex"} justifyContent="center">
              <Box
                sx={{
                  border: "2px solid black",
                  backgroundColor: "#FFD94A",
                  boxShadow: "0px 3px 0px #000",
                }}
                paddingY={1}
                paddingX={2}
                width="230px"
              >
                <Typography
                  sx={{ fontSize: 18, lineHeight: "31.5px", fontWeight: 600 }}
                  textAlign="center"
                >
                  Place order
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <SiteFooter />
      </Box>
    );
};

export default Cart;
