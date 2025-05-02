"use client";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Link,
  Stack,
  Typography,
  GlobalStyles,
} from "@mui/joy";
import { GitHub as GitHubIcon } from "@mui/icons-material";
import { getAuth, signInWithPopup, GithubAuthProvider } from "firebase/auth";

import { app } from "@/service/firebase";

export default function Login() {
  const router = useRouter();

  return (
    <>
      <GlobalStyles
        styles={{
          ":root": {
            "--Form-maxWidth": "800px",
            "--Transition-duration": "0.4s", // set to `none` to disable transition
          },
        }}
      />
      <Box
        sx={(theme) => ({
          position: "fixed",
          zIndex: 1,
          height: "100dvh",
          width: { xs: "100%", md: "50vw" },
          right: 0, // 👈 Pin to right now
          display: "flex",
          justifyContent: "flex-start",
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(255 255 255 / 0.2)",
          transition: "width var(--Transition-duration)",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          [theme.getColorSchemeSelector("dark")]: {
            backgroundColor: "rgba(19 19 24 / 0.4)",
          },
        })}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100dvh",
            width: "100%",
            px: 2,
          }}
        >
          <Box
            component="header"
            sx={{ py: 3, display: "flex", justifyContent: "space-between" }}
          >
            <Box sx={{ gap: 2, display: "flex", alignItems: "center" }}>
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
              <Typography level="title-lg">Turn Your Repo Agentic</Typography>
            </Box>
          </Box>
          <Box
            component="main"
            sx={{
              my: "auto",
              py: 2,
              pb: 5,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: 400,
              maxWidth: "100%",
              mx: "auto",
              borderRadius: "sm",
              "& form": {
                display: "flex",
                flexDirection: "column",
                gap: 2,
              },
              [`& .MuiFormLabel-asterisk`]: {
                visibility: "hidden",
              },
            }}
          >
            <Stack sx={{ gap: 4, mb: 2 }}>
              <Stack sx={{ gap: 1 }}>
                <Typography component="h1" level="h3">
                  Sign in
                </Typography>
                <Typography level="body-sm">
                  New to company?{" "}
                  <Link href="#replace-with-a-link" level="title-sm">
                    Sign up!
                  </Link>
                </Typography>
              </Stack>
              <Button
                variant="soft"
                color="neutral"
                fullWidth
                startDecorator={<GitHubIcon />}
                onClick={async () => {
                  const result = await signInWithPopup(
                    getAuth(app),
                    new GithubAuthProvider()
                  );
                  const session = JSON.stringify({
                    uid: result.user.uid,
                    accessToken:
                      GithubAuthProvider.credentialFromResult(result)
                        .accessToken,
                  });

                  document.cookie = "session=" + session;
                  sessionStorage.setItem("session", session);

                  router.push("/dashboard");
                }}
              >
                Continue with GitHub
              </Button>
            </Stack>
            <Divider
              sx={(theme) => ({
                [theme.getColorSchemeSelector("light")]: {
                  color: { xs: "#FFF", md: "text.tertiary" },
                },
              })}
            >
              or
            </Divider>
            <Stack sx={{ gap: 4, mt: 2 }}>
              <form onSubmit={(event) => event.preventDefault()}>
                <FormControl required>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" name="email" />
                </FormControl>
                <FormControl required>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" name="password" />
                </FormControl>
                <Stack sx={{ gap: 4, mt: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Checkbox size="sm" label="Remember me" name="persistent" />
                    <Link level="title-sm" href="#replace-with-a-link">
                      Forgot your password?
                    </Link>
                  </Box>
                  <Button type="submit" fullWidth>
                    Sign in
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Box>
          <Box component="footer" sx={{ py: 3 }}>
            <Typography level="body-xs" sx={{ textAlign: "center" }}>
              © OG Nerds {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={(theme) => ({
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0, // 👈 Now pinned to left
          height: "100%",
          width: { xs: "100%", md: "50vw" }, // match sign-in panel width
          backgroundColor: "background.level1",
          backgroundImage: "url(/2.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          transition:
            "background-image var(--Transition-duration), width var(--Transition-duration)",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          [theme.getColorSchemeSelector("dark")]: {
            backgroundImage: "url(/2.png)",
          },
        })}
      />
    </>
  );
}
