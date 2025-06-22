import { Box, Stack, Typography } from "@mui/material";
import { Metadata } from "next";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {requireAdaptiveMFA, requireAuth} from "../../lib/auth-server";
import ClientHeader from "../../components/ClientHeader";
import SiteFooter from "../../components/SiteFooter";
import ProductEntry from "../../components/ProductEntry";

export const metadata: Metadata = {
  title: "Cart - Hello Socks",
  description: "Your Hello Socks shopping cart",
};

export default async function Cart() {
  // Require authentication with 2FA
  const { user } = await requireAdaptiveMFA();

  return (
    <Box
      minHeight={"100vh"}
      display="flex"
      flexDirection={"column"}
      paddingTop={"76px"}
    >
      <ClientHeader useAuthedHeader={true} />
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
              >{`Email: ${user.emails?.[0]?.email || 'N/A'}`}</Typography>
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
}