"use client";
import Image from "next/image";
import { AspectRatio, Box, Container } from "@mui/joy";
import { typographyClasses } from "@mui/joy/Typography";

const TwoSidedLayout = ({ children, reversed, img, aspect = 600 }) => (
  <Container
    sx={[
      (theme) => ({
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        py: 10,
        gap: 4,
        [theme.breakpoints.up(834)]: {
          flexDirection: "row",
          gap: 6,
        },
        [theme.breakpoints.up(1199)]: {
          gap: 12,
        },
      }),
      reversed
        ? { flexDirection: "column-reverse" }
        : { flexDirection: "column" },
    ]}
  >
    <Box
      sx={(theme) => ({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
        maxWidth: "50ch",
        textAlign: "center",
        flexShrink: 999,
        [theme.breakpoints.up(834)]: {
          minWidth: 420,
          alignItems: "flex-start",
          textAlign: "initial",
        },
        [`& .${typographyClasses.root}`]: {
          textWrap: "balance",
        },
      })}
    >
      {children}
    </Box>
    <AspectRatio
      ratio={aspect / 588}
      variant="outlined"
      maxHeight={300}
      sx={(theme) => ({
        minWidth: 300,
        alignSelf: "stretch",
        [theme.breakpoints.up(834)]: {
          alignSelf: "initial",
          flexGrow: 1,
          "--AspectRatio-maxHeight": aspect === 600 ? "520px" : undefined,
          "--AspectRatio-minHeight": aspect === 600 ? "400px" : undefined,
        },
        borderRadius: "sm",
        bgcolor: aspect === 600 ? "background.level2" : "background.level3",
        flexBasis: "50%",
      })}
    >
      <Image fill src={img} alt="Image" />
    </AspectRatio>
  </Container>
);

export default TwoSidedLayout;
