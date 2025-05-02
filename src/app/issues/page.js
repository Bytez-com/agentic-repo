"use client";
import { Fragment, useEffect, useState } from "react";
import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
} from "@mui/joy";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import Sidebar from "@/component/Sidebar";
import { listen } from "@/service/firebase/firestore";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css"; // or another highlight.js theme

export default function Issues() {
  const [session, setSession] = useState();
  const [appInstalled, setAppInstalled] = useState(false);
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    return onAuthStateChanged(getAuth(), (session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (session) {
      return listen(`users/${session.uid}`, (doc) => {
        const userData = doc.data();

        setAppInstalled(!!userData?.repoData);
        setIssues(userData?.issues ?? []);
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
          {!appInstalled ? (
            <Card sx={{ maxWidth: 400 }}>
              <Typography level="h2" fontSize="lg" mb={1}>
                Install Github App
              </Typography>
              <CardContent>
                <Typography>
                  To begin using the changelog and issues feature, you will need
                  to install the github app into your repo
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
            </Card>
          ) : (
            <>
              {issues.length == 0 && (
                <Typography level="h2" fontSize="lg">
                  No repos yet!
                </Typography>
              )}
              {issues.map(({ url, title, body, response }) => {
                return (
                  <Fragment key={url}>
                    <Card width={300}>
                      <Typography level="h2" fontSize="lg" mb={1}>
                        Issue: {title}
                      </Typography>
                      <Typography
                        style={{
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                        onClick={() => window.open(url)}
                      >
                        {url}
                      </Typography>
                      <CardContent>
                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                          {body}
                        </ReactMarkdown>
                        <Card width={300}>
                          <Typography level="h2" fontSize="lg" mb={1}>
                            Agent Repo Bot
                          </Typography>

                          <CardContent>
                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                              {response}
                            </ReactMarkdown>
                          </CardContent>
                        </Card>
                      </CardContent>
                    </Card>
                  </Fragment>
                );
              })}
            </>
          )}
        </Box>
      </Box>
    </>
  ) : null;
}
