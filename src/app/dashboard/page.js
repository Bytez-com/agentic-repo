"use client";
import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
} from "@mui/joy";
import { Check as CheckIcon } from "@mui/icons-material";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import Sidebar from "@/component/Sidebar";
import { firestore, onSnapshot, doc } from "@/service/firestore";

export default function Dashboard() {
  const [session, setSession] = useState();
  const [repo, setRepo] = useState("");

  useEffect(() => {
    return onAuthStateChanged(getAuth(), (session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (session) {
      return onSnapshot(doc(firestore, "users", session.uid), (doc) => {
        const userData = doc.data();

        setUser(userData);
        setRepo(userData?.repo);
      });
    }
  }, [session]);

  return session ? (
    <>
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
        <Sidebar user={session} />
        <Box
          component="main"
          className="MainContent"
          sx={{
            px: { xs: 2, md: 6 },
            pt: {
              xs: "calc(12px + var(--Header-height))",
              sm: "calc(12px + var(--Header-height))",
              md: 3,
            },
            pb: { xs: 2, sm: 2, md: 3 },
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            height: "100dvh",
            gap: 1,
          }}
        >
          <Card sx={{ maxWidth: 400 }}>
            <Typography level="h2" fontSize="lg" mb={1}>
              Install Github App
            </Typography>
            {repo ? (
              <CardContent>
                <Typography>Agent installed:</Typography>
                <Typography endDecorator={<CheckIcon />}>
                  <Typography
                    style={{ textDecoration: "underline", cursor: "pointer" }}
                    onClick={() => window.open(repo)}
                  >
                    {repo}
                  </Typography>
                </Typography>
              </CardContent>
            ) : (
              <>
                <CardContent>
                  <Typography>
                    To begin using the changelog and issues feature, you will
                    need to install the github app into your repo
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="solid"
                    color="primary"
                    onClick={() => {
                      const githubAppAuthUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/github_install_app?uid=${session.uid}`;
                      window.open(githubAppAuthUrl);
                    }}
                  >
                    Install
                  </Button>
                </CardActions>
              </>
            )}
          </Card>
        </Box>
      </Box>
    </>
  ) : null;
}
