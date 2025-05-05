"use client";
import { useEffect, useState } from "react";
import { Box, IconButton, Typography } from "@mui/joy";
import { useColorScheme } from "@mui/joy/styles";
import {
  Star,
  DarkModeRounded as DarkModeRoundedIcon,
  LightModeRounded as LightModeRoundedIcon,
} from "@mui/icons-material";

import Hero from "@/component/Hero";

export default function Home() {
  //
  return (
    <>
      <ColorSchemeToggle />
      <Box
        sx={{
          height: "100vh",
          overflowY: "scroll",
          scrollSnapType: "y mandatory",
          "& > div": {
            scrollSnapAlign: "start",
          },
        }}
      >
        <Hero
          overline="For high-output developers,"
          headline="Add the AI Sidekick to your repo in 60 seconds and start shipping more code—today"
          img="/1.png"
          subheader="We’re the only GitHub integration that fuses AI-generated changelogs and automated issue triage in a single, maintenance-free app — giving your team an operations multiplier that your competitors don’t have."
          cta="Add to your Repos"
          lastElement={
            <Box
              sx={(theme) => ({
                display: "flex",
                textAlign: "center",
                alignSelf: "stretch",
                columnGap: 4.5,
                "& > *": {
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap",
                  flex: 1,
                },
                [theme.breakpoints.up(834)]: {
                  textAlign: "left",
                  "& > *": {
                    flexDirection: "row",
                    gap: 1.5,
                    justifyContent: "initial",
                    flexWrap: "nowrap",
                    flex: "none",
                  },
                },
              })}
            >
              <div>
                <Typography
                  endDecorator={
                    <Star fontSize="xl4" sx={{ color: "warning.300" }} />
                  }
                  sx={{ fontSize: "xl4", fontWeight: "lg" }}
                >
                  4.9
                </Typography>
                <Typography textColor="text.secondary">
                  Over <b>5k</b> positive <br /> customer reviews.
                </Typography>
              </div>
              <div>
                <Typography sx={{ fontSize: "xl4", fontWeight: "lg" }}>
                  2M
                </Typography>
                <Typography textColor="text.secondary">
                  Repos <br /> Integrated
                </Typography>
              </div>
            </Box>
          }
        />
        <Hero
          overline="Agentic Issue Tracking"
          img="/3.png"
          headline="Issues answered & routed to the right IC, in < 60 seconds — every time."
          subheader="Our GitHub Agent greets the issue opener, analyzes their stack trace, and pings the exact contributor via git blame, turning triage into a background task."
          lastElement="Add the Issue-Triage Bot today—reclaim your focus and delight your users."
          cta="Add Agentic Issue Tracker"
        />
        <Hero
          overline="Agentic Changelog"
          img="/4.png"
          headline="Changelogs that write themselves — ship 3× faster"
          subheader="Every commit is summarized, grouped by feature, and formatted into markdown (or HTML) the moment you merge, so release notes are ready when you are."
          lastElement="Turn on Auto-Changelog and publish your next release before lunch."
          cta="Add Agentic Changelog"
        />
        <Hero
          overline="Between now and this Friday"
          aspect={1358}
          img="/bytez.png"
          headline="Get Free Inference"
          subheader="Email `team@bytez.com` with promo-code `AWS-GenAI`"
          lastElement="Every month we'll give you: 50M tokens; 120k images; 2.5k videos; and more, for free, every month ❤️"
          cta="Say hello 🖖"
        />
      </Box>
    </>
  );
}

function ColorSchemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { mode, setMode } = useColorScheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? (
    <IconButton
      data-screenshot="toggle-mode"
      size="lg"
      variant="soft"
      color="neutral"
      onClick={() => {
        if (mode === "light") {
          setMode("dark");
        } else {
          setMode("light");
        }
      }}
      sx={{
        position: "fixed",
        zIndex: 999,
        top: "1rem",
        right: "1rem",
        borderRadius: "50%",
        boxShadow: "sm",
      }}
    >
      {mode === "light" ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
    </IconButton>
  ) : null;
}
