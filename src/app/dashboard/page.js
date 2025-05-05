"use client";
import { useEffect, useState } from "react";
import { Typography, Box, Button, Stack, Select, Option } from "@mui/joy";

import useSession from "@/component/Hooks/useSession";
import { listen, set } from "@/service/firebase/firestore";

export default function Dashboard() {
  const [user, setUser] = useState();
  const [repo, setRepo] = useState("");
  const [repos, setRepos] = useState([]);
  const [saving, setSaving] = useState(false);
  const session = useSession();

  useEffect(() => {
    if (session) {
      fetch("/api/repos").then(async (res) => {
        const repos = await res.json();

        setRepos(repos);
      });

      return listen(`users/${session.uid}`, (doc) => {
        const userData = doc.data();

        setUser(userData);
        setRepo(userData?.repo);
      });
    }
  }, [session]);

  return session ? (
    <>
      <Box
        pb={5}
        sx={{
          display: "flex",
          gap: 1,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "start", sm: "center" },
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <Typography level="h1">Install Agentic Agent</Typography>
      </Box>
      <form
        onSubmit={async (event) => {
          try {
            event.preventDefault();
            const repo = new FormData(event.currentTarget).get("repo");

            setRepo(repo);
            setSaving(true);

            await set(`users/${session.uid}`, { repo });
          } catch (error) {
            console.error(error);
          } finally {
            setSaving(false);
          }
        }}
      >
        <Stack spacing={1} sx={{ maxWidth: 640 }}>
          <Typography level="h3">Select a repo</Typography>
          <Select
            name="repo"
            value={repo || ""}
            placeholder="Select a repo"
            onChange={(_, repoUrl) => setRepo(repoUrl)}
          >
            {repos.map((repoUrl) => (
              <Option key={repoUrl} value={repoUrl}>
                {repoUrl}
              </Option>
            ))}
          </Select>
          <Button type="submit" loading={saving} disabled={repo === user?.repo}>
            Install
          </Button>
        </Stack>
      </form>
    </>
  ) : null;
}
