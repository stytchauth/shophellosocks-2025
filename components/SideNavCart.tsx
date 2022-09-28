import { Box, Button, Stack, Typography, Slide } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import ProductEntry from "./ProductEntry";

type Props = {
  onDismiss: () => void;
};

function SideNavCart({ onDismiss }: Props) {
  const [open, setOpen] = useState(false);

  setTimeout(() => {
    setOpen(true);
  }, 750);

  return (
    <Slide in={open} direction="left" timeout={{ enter: 1200 }}>
      <Box
        sx={{
          position: "fixed",
          backgroundColor: "white",
          height: "100vh",
          borderTop: "2px solid #000000",
          borderLeft: "2px solid #000000",
          zIndex: 10,
          right: 0,
          top: 74,
          maxWidth: "475px",
          width: "100%",
        }}
      >
        <Stack
          direction={"row"}
          justifyContent="space-between"
          display={"flex"}
          alignItems="center"
          gap={2}
          mb={2}
          mt={1}
        >
          <Button onClick={() => {}}>
            <CloseIcon
              sx={{ color: "black", fontSize: 32 }}
              onClick={onDismiss}
            />
          </Button>

          <Typography variant="h3">SHOPPING CART</Typography>
          <Box width={"32px"}></Box>
        </Stack>
        <Box marginX={2}>
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
    </Slide>
  );
}

export default SideNavCart;
