import { Button, Link, Typography } from "@mui/joy";
import { ArrowForward } from "@mui/icons-material";

import TwoSidedLayout from "@/component/TwoSidedLayout";

export default function Hero({
  img,
  overline = "The power to do more",
  headline = "A large headlinerer about our product features & services",
  subheader = "A descriptive secondary text placeholder. Use it to explain your business offer better.",
  lastElement = (
    <Typography>
      Already a member?{" "}
      <Link href="/login" sx={{ fontWeight: "lg" }}>
        Sign in
      </Link>
    </Typography>
  ),
  cta = "Get Started",
}) {
  return (
    <TwoSidedLayout img={img}>
      <Typography color="primary" sx={{ fontSize: "lg", fontWeight: "lg" }}>
        {overline}
      </Typography>
      <Typography
        level="h1"
        sx={{
          fontWeight: "xl",
          fontSize: "clamp(1.875rem, 1.3636rem + 2.1818vw, 3rem)",
        }}
      >
        {headline}
      </Typography>
      <Typography
        textColor="text.secondary"
        sx={{ fontSize: "lg", lineHeight: "lg" }}
      >
        {subheader}
      </Typography>
      <Button
        size="lg"
        href="/login"
        component="a"
        endDecorator={<ArrowForward fontSize="xl" />}
      >
        {cta}
      </Button>
      {lastElement}
      <Typography
        level="body-xs"
        variant="solid"
        color="primary"
        sx={{
          position: "absolute",
          top: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        The Agentic Repo
      </Typography>
    </TwoSidedLayout>
  );
}
