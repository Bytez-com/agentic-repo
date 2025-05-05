"use client";
import { usePathname } from "next/navigation";
import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  GlobalStyles,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import { listItemButtonClasses } from "@mui/joy/ListItemButton";
import {
  PlayCircleFilledRounded as InstallIcon,
  ChangeHistoryRounded as ChangeLogIcon,
  AdjustRounded as IssuesIcon,
  CloseRounded as CloseRoundedIcon,
  LogoutRounded as LogoutRoundedIcon,
} from "@mui/icons-material";

import useSession from "@/component/Hooks/useSession";
import { getAuth, signOut } from "firebase/auth";

export default function Sidebar() {
  const pathname = usePathname();
  const session = useSession();
  const buttons = [
    ["install", InstallIcon, "/dashboard"],
    ["changelog", ChangeLogIcon, "/dashboard/changelog"],
    ["issues", IssuesIcon, "/dashboard/issues"],
  ];

  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: "fixed", md: "sticky" },
        transform: {
          xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
          md: "none",
        },
        transition: "transform 0.4s, width 0.4s",
        zIndex: 10000,
        height: "100dvh",
        width: "var(--Sidebar-width)",
        top: 0,
        p: 2,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ":root": {
            "--Sidebar-width": "220px",
            [theme.breakpoints.up("lg")]: {
              "--Sidebar-width": "240px",
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: "fixed",
          zIndex: 9998,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          opacity: "var(--SideNavigation-slideIn)",
          backgroundColor: "var(--joy-palette-background-backdrop)",
          transition: "opacity 0.4s",
          transform: {
            xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))",
            lg: "translateX(-100%)",
          },
        }}
      />
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <IconButton variant="soft" color="primary" size="sm">
          <Box
            sx={{
              maskImage:
                "url(https://mintlify.b-cdn.net/v6.6.0/regular/microchip-ai.svg)",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              backgroundColor: "black",
              width: 24,
              height: 24,
            }}
          />
        </IconButton>
        <Typography level="title-lg">Agentic Repo</Typography>
      </Box>
      <Box
        sx={{
          minHeight: 0,
          overflow: "hidden auto",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1,
            "--List-nestedInsetStart": "30px",
            "--ListItem-radius": (theme) => theme.vars.radius.sm,
          }}
        >
          {buttons.map(([label, Icon, href]) => (
            <ListItem key={href}>
              <ListItemButton
                component="a"
                href={href}
                selected={pathname === href}
              >
                <Icon />
                <ListItemContent>
                  <Typography level="title-md" textTransform="capitalize">
                    {label}
                  </Typography>
                </ListItemContent>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Card
          invertedColors
          variant="soft"
          color="warning"
          size="sm"
          sx={{ boxShadow: "none" }}
        >
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Typography level="title-sm">Unlock more features</Typography>
            <IconButton size="sm">
              <CloseRoundedIcon />
            </IconButton>
          </Stack>
          <Typography level="body-xs">
            Upgrade your plan to unlock every feature
          </Typography>
          <LinearProgress
            variant="outlined"
            value={80}
            determinate
            sx={{ my: 1 }}
          />
          <Button size="sm" variant="solid">
            Upgrade
          </Button>
        </Card>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Avatar variant="outlined" size="sm" src={session.photoURL} />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography level="title-sm">{session.displayName}</Typography>
          <Typography level="body-xs">{session.email}</Typography>
        </Box>
        <IconButton
          size="sm"
          variant="plain"
          color="neutral"
          component="a"
          href="/"
          onClick={() => signOut(getAuth())}
        >
          <LogoutRoundedIcon />
        </IconButton>
      </Box>
    </Sheet>
  );
}
