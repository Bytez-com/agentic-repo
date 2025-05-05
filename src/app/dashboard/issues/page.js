"use client";
import { useEffect, useState } from "react";
import { Typography, Button, Stack, Snackbar } from "@mui/joy";
import {
  Add as AddIcon,
  Close as NotInstalledIcon,
  Check as SuccessIcon,
} from "@mui/icons-material";

import useSession from "@/component/Hooks/useSession";

export default function Issues() {
  const [running, setRunning] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, text: "" });
  const session = useSession();

  useEffect(() => {
    fetch("/api/issues").then(async (res) => {
      const { installed } = await res.json();

      setSnackbar({
        open: true,
        text: installed ? "Installed" : "Not installed",
      });
    });
  }, [session]);

  return (
    <Stack height="100%" spacing={2}>
      <Typography level="h1" pb={5}>
        Agent + Issues
      </Typography>
      <Button
        size="lg"
        sx={{ maxWidth: 640 }}
        loading={running}
        startDecorator={<AddIcon />}
        onClick={async () => {
          try {
            setRunning(true);

            await fetch("/api/issues", { method: "POST" });

            setSnackbar({ open: true, text: "Installed" });
          } finally {
            setRunning(false);
          }
        }}
      >
        Install into your issues
      </Button>
      <Snackbar
        open={snackbar.open}
        size="lg"
        variant="solid"
        autoHideDuration={7e3}
        onClose={() => setSnackbar({ open: false, text: "" })}
        startDecorator={
          snackbar.text.startsWith("Not") ? (
            <NotInstalledIcon />
          ) : (
            <SuccessIcon />
          )
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        color={snackbar.text.startsWith("Not") ? "neutral" : "success"}
      >
        {snackbar.text}
      </Snackbar>
    </Stack>
  );
}
