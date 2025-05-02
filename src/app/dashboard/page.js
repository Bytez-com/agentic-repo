"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Typography, Box, Input, Button, Stack } from "@mui/joy";
import { getAuth } from "firebase/auth";

import Sidebar from "@/component/Sidebar";
import { firestore, onSnapshot, doc, setDoc } from "@/service/firestore";

export default function Dashboard() {
  const [session, setSession] = useState();
  const [user, setUser] = useState();
  const [repo, setRepo] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const { currentUser } = getAuth();

    if (currentUser === null) {
      return router.replace("/");
    }

    setSession(currentUser);

    return onSnapshot(doc(firestore, "users", currentUser.uid), (doc) => {
      const userData = doc.data();

      setUser(userData);
      setRepo(userData?.repo);
    });
  }, [router]);

  return session ? (
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
        <Box
          sx={{
            display: "flex",
            mb: 1,
            gap: 1,
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "start", sm: "center" },
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <Typography level="h2" component="h1">
            Save your repo
          </Typography>
        </Box>
        <form
          onSubmit={async (event) => {
            try {
              event.preventDefault();
              const repo = new FormData(event.currentTarget).get("repo").trim();
              console.log({ repo });
              setRepo(repo);
              setSaving(true);

              // await setDoc(doc(firestore, "users", session.uid), { repo });

              await fetch("/api/agent");
            } catch (error) {
              console.error(error);
            } finally {
              setSaving(false);
            }
          }}
        >
          <Stack spacing={1} sx={{ maxWidth: 640 }}>
            <Input
              name="repo"
              value={repo}
              placeholder="https://github.com/org/repo"
              onChange={(event) => setRepo(event.target.value)}
            />
            <Button
              type="submit"
              loading={saving}
              disabled={repo === user?.repo}
            >
              Submit
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  ) : null;
}
