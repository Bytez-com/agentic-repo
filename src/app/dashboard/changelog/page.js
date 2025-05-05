"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import {
  Button,
  Snackbar,
  Stack,
  Typography,
  Box,
  AspectRatio,
} from "@mui/joy";
import { Add as AddIcon, Check as SuccessIcon } from "@mui/icons-material";

const Masonry = dynamic(
  () => import("masonic").then((module) => module.Masonry),
  { ssr: false }
);

export default function ChangeLog() {
  const [open, setOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [images, setImages] = useState([]);

  return (
    <Stack height="100%" spacing={2}>
      <Typography level="h1" pb={5}>
        Agentic Changelog
      </Typography>
      <Button
        size="lg"
        sx={{ maxWidth: 640 }}
        loading={running}
        startDecorator={<AddIcon />}
        onClick={async () => {
          try {
            setRunning(true);

            const res = await fetch("/api/changelog");
            const images = await res.json();

            setOpen(true);
            setImages(images);
          } finally {
            setRunning(false);
          }
        }}
      >
        Install Agentic ChangeLog
      </Button>
      <Snackbar
        open={open}
        size="lg"
        color="success"
        variant="solid"
        autoHideDuration={7e3}
        onClose={() => setOpen(false)}
        startDecorator={<SuccessIcon />}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        Changelog generated
      </Snackbar>
      <Masonry
        columnGutter={8}
        maxColumnCount={4}
        items={images}
        render={MasonryImage}
      />
    </Stack>
  );
}
const MasonryImage = ({ data: { url } }) => (
  <AspectRatio sx={{ borderRadius: "md" }}>
    <Box component="img" src={url} alt="Image candidate" />
  </AspectRatio>
);
